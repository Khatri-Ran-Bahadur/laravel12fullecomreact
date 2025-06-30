<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Response;
use Inertia\Inertia;
use App\Models\Order;
use Illuminate\Http\RedirectResponse;
use App\Http\Resources\OrderResource;
use Illuminate\Support\Facades\Log;

class OrderController extends Controller
{
    public function index(Request $request): Response
    {
        $perPage = $request->input('perPage', 10);
        $search = $request->input('search', '');
        $sort = $request->input('sort', 'created_at');
        $direction = $request->input('direction', 'desc');
        $status = $request->input('status', '');
        $paymentStatus = $request->input('payment_status', '');

        $query = Order::with(['user', 'orderItems.product'])
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('order_number', 'like', '%' . $search . '%')
                        ->orWhere('billing_first_name', 'like', '%' . $search . '%')
                        ->orWhere('billing_last_name', 'like', '%' . $search . '%')
                        ->orWhere('billing_email', 'like', '%' . $search . '%')
                        ->orWhereHas('user', function ($userQuery) use ($search) {
                            $userQuery->where('name', 'like', '%' . $search . '%')
                                ->orWhere('email', 'like', '%' . $search . '%');
                        });
                });
            })
            ->when($status, function ($query, $status) {
                $query->where('status', $status);
            })
            ->when($paymentStatus, function ($query, $paymentStatus) {
                $query->where('payment_status', $paymentStatus);
            });

        if ($direction === 'desc') {
            $query->orderBy($sort, 'desc');
        } else {
            $query->orderBy($sort, 'asc');
        }

        $orders = $query->paginate($perPage)->withQueryString();

        // Transform the data for the frontend
        $orders->getCollection()->transform(function ($order) {
            return [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'customer_name' => $order->billing_full_name,
                'customer_email' => $order->billing_email,
                'total_price' => $order->total_price,
                'status' => $order->status,
                'payment_status' => $order->payment_status,
                'payment_method' => $order->payment_method,
                'created_at' => $order->created_at->format('Y-m-d H:i:s'),
                'items_count' => $order->orderItems->count(),
            ];
        });

        return Inertia::render('Admin/Orders/Index', [
            'orders' => $orders,
            'filters' => [
                'search' => $search,
                'sort' => $sort,
                'direction' => $direction,
                'perPage' => $perPage,
                'status' => $status,
                'payment_status' => $paymentStatus,
                'page' => $request->input('page', 1),
            ],
            'statuses' => [
                'pending' => 'Pending',
                'confirmed' => 'Confirmed',
                'preparing' => 'Preparing',
                'ready_for_pickup' => 'Ready for Pickup',
                'out_for_delivery' => 'Out for Delivery',
                'delivered' => 'Delivered',
                'completed' => 'Completed',
                'cancelled' => 'Cancelled',
            ],
            'paymentStatuses' => [
                'pending' => 'Pending',
                'paid' => 'Paid',
                'failed' => 'Failed',
                'refunded' => 'Refunded',
            ],
            'can' => [
                'create' => false,
                'edit' => true,
                'delete' => false
            ]
        ]);
    }

    public function show(Order $order): Response
    {
        $order->load(['user', 'orderItems.product.brand', 'orderItems.product.category']);

        return Inertia::render('Admin/Orders/Show', [
            'order' => new OrderResource($order)
        ]);
    }

    public function update(Request $request, Order $order): RedirectResponse
    {
        $request->validate([
            'status' => 'required|string|in:pending,confirmed,preparing,ready_for_pickup,out_for_delivery,delivered,completed,cancelled',
            'payment_status' => 'nullable|string|in:pending,paid,failed,refunded',
            'tracking_number' => 'nullable|string|max:255',
            'admin_notes' => 'nullable|string|max:1000',
        ]);

        try {
            $oldStatus = $order->status;
            $newStatus = $request->status;

            // Update order
            $order->update([
                'status' => $newStatus,
                'payment_status' => $request->payment_status ?? $order->payment_status,
                'tracking_number' => $request->tracking_number ?? $order->tracking_number,
                'admin_notes' => $request->admin_notes ?? $order->admin_notes,
            ]);

            // Update timestamps based on status
            if ($newStatus === 'delivered' && $oldStatus !== 'delivered') {
                $order->update(['delivered_at' => now()]);
            } elseif ($newStatus === 'out_for_delivery' && $oldStatus !== 'out_for_delivery') {
                $order->update(['shipped_at' => now()]);
            }

            // Handle inventory updates for cancelled orders
            if ($newStatus === 'cancelled' && $oldStatus !== 'cancelled') {
                foreach ($order->orderItems as $item) {
                    if ($item->product) {
                        // For now, we'll just log this. You might want to implement
                        // more sophisticated inventory management
                        Log::info("Order cancelled - product {$item->product->name} quantity {$item->quantity} should be returned to inventory");
                    }
                }
            }

            return redirect()->back()->with('success', 'Order updated successfully');
        } catch (\Exception $e) {
            Log::error('Order update failed: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Failed to update order. Please try again.');
        }
    }

    public function destroy(Order $order): RedirectResponse
    {
        try {
            $order->delete();
            return redirect()->route('admin.orders.index')->with('success', 'Order deleted successfully');
        } catch (\Exception $e) {
            Log::error('Order deletion failed: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Failed to delete order. Please try again.');
        }
    }
}
