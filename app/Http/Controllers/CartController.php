<?php

namespace App\Http\Controllers;

use App\Services\CartService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Product;

class CartController extends Controller
{
    public function index(CartService $cartService)
    {

        return Inertia::render(
            'Ecommerce/Cart',
            [
                'cartItems' => $cartService->getCartItems(),
            ]
        );
    }

    public function store(Request $request, Product $product, CartService $cartService)
    {
        $request->mergeIfMissing((['quantity' => 1]));

        $data = $request->validate([
            'option_ids' => ['nullable', 'array'],
            'quantity' => ['nullable', 'integer', 'min:1'],
        ]);
        $cartService->addItemCart($product, $data['quantity'], $data['option_ids']);

        return back()->with('success', 'Item added to cart successfully.');
    }

    public function update(Request $request, Product $product, CartService $cartService)
    {
        $request->validate([
            'quantity' => ['integer', 'min:1']
        ]);

        $optionIds = $request->input('option_ids') ?: [];
        $quantity = $request->input('quantity');
        $cartService->updateItemQuantity($product->id, $quantity, $optionIds);

        return back()->with('success', 'Item quantity updated successfully.');
    }

    public function destroy(Request $request, Product $product, CartService $cartService)
    {
        $optionIds = $request->input('option_ids') ?: [];
        $cartService->removeItemFromCart($product->id, $optionIds);

        return back()->with('success', 'Item removed from cart successfully.');
    }
    public function checkoutForm(CartService $cartService)
    {
        $cartItems = $cartService->getCartItems();

        return Inertia::render('Ecommerce/Checkout', [
            'cartItems' => $cartItems,
            'totalQuantity' => $cartService->getTotalQuantity(),
            'totalPrice' => $cartService->getTotalPrice(),
            'subtotal' => $cartService->getSubTotal(),
            'shipping' => 0,
            'tax' => 0,
        ]);
    }
    // Show payment form
    public function paymentForm(CartService $cartService)
    {
        // You may want to pass billing/shipping info from session or request
        return Inertia::render('Ecommerce/Payment', [
            'cartItems' => $cartService->getCartItems(),
            'totalPrice' => $cartService->getTotalPrice(),
            'totalQuantity' => $cartService->getTotalQuantity(),
            'totalPrice' => $cartService->getTotalPrice(),
            'subtotal' => $cartService->getSubTotal(),
            'shipping' => 0,
            'tax' => 0,
            // 'billing' => ...,
            // 'shipping' => ...,
        ]);
    }
}
