<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    public static $wrap = false;

    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'order_number' => $this->order_number,
            'user_id' => $this->user_id,
            'payment_method' => $this->payment_method,
            'payment_status' => $this->payment_status,
            'stripe_session_id' => $this->stripe_session_id,
            'stripe_payment_intent_id' => $this->stripe_payment_intent_id,
            'status' => $this->status,
            'subtotal' => $this->subtotal,
            'tax_amount' => $this->tax_amount,
            'shipping_amount' => $this->shipping_amount,
            'discount_amount' => $this->discount_amount,
            'total_price' => $this->total_price,
            'billing_first_name' => $this->billing_first_name,
            'billing_last_name' => $this->billing_last_name,
            'billing_email' => $this->billing_email,
            'billing_phone' => $this->billing_phone,
            'billing_address' => $this->billing_address,
            'billing_city' => $this->billing_city,
            'billing_state' => $this->billing_state,
            'billing_zip' => $this->billing_zip,
            'billing_country' => $this->billing_country,
            'shipping_first_name' => $this->shipping_first_name,
            'shipping_last_name' => $this->shipping_last_name,
            'shipping_address' => $this->shipping_address,
            'shipping_city' => $this->shipping_city,
            'shipping_state' => $this->shipping_state,
            'shipping_zip' => $this->shipping_zip,
            'shipping_country' => $this->shipping_country,
            'shipping_method' => $this->shipping_method,
            'tracking_number' => $this->tracking_number,
            'estimated_delivery' => $this->estimated_delivery,
            'shipped_at' => $this->shipped_at,
            'delivered_at' => $this->delivered_at,
            'customer_notes' => $this->customer_notes,
            'admin_notes' => $this->admin_notes,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,

            // Computed attributes
            'billing_full_name' => $this->billing_full_name,
            'shipping_full_name' => $this->shipping_full_name,
            'is_shipping_same_as_billing' => $this->isShippingSameAsBilling(),

            // Relationships
            'user' => [
                'id' => $this->user->id,
                'name' => $this->user->name,
                'email' => $this->user->email,
                'phone' => $this->user->phone,
            ],
            'order_items' => $this->orderItems->map(function ($item) {
                return [
                    'id' => $item->id,
                    'product_id' => $item->product_id,
                    'product_name' => $item->product_name,
                    'product_sku' => $item->product_sku,
                    'product_description' => $item->product_description,
                    'product_image' => $item->product_image,
                    'unit_price' => $item->unit_price,
                    'total_price' => $item->total_price,
                    'quantity' => $item->quantity,
                    'variation_type_option_ids' => $item->variation_type_option_ids,
                    'variation_data' => $item->variation_data,
                    'notes' => $item->notes,
                    'created_at' => $item->created_at,
                    'updated_at' => $item->updated_at,

                    // Product relationship (if available)
                    'product' => $item->product ? [
                        'id' => $item->product->id,
                        'name' => $item->product->name,
                        'slug' => $item->product->slug,
                        'sku' => $item->product->sku,
                        'image' => $item->product->getFirstMediaUrl('images'),
                        'brand' => $item->product->brand ? [
                            'id' => $item->product->brand->id,
                            'name' => $item->product->brand->name,
                        ] : null,
                        'category' => $item->product->category ? [
                            'id' => $item->product->category->id,
                            'name' => $item->product->category->name,
                        ] : null,
                    ] : null,
                ];
            }),
        ];
    }
}
