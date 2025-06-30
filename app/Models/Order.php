<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Order extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $casts = [
        'subtotal' => 'decimal:2',
        'tax_amount' => 'decimal:2',
        'shipping_amount' => 'decimal:2',
        'discount_amount' => 'decimal:2',
        'total_price' => 'decimal:2',
        'estimated_delivery' => 'date',
        'shipped_at' => 'date',
        'delivered_at' => 'date',
    ];

    /**
     * Get the user that owns the order.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the order items for the order.
     */
    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    /**
     * Generate a unique order number.
     */
    public static function generateOrderNumber(): string
    {
        $prefix = 'ORD';
        $date = now()->format('Ymd');
        $random = strtoupper(substr(uniqid(), -6));

        return "{$prefix}{$date}{$random}";
    }

    /**
     * Get the full billing name.
     */
    public function getBillingFullNameAttribute(): string
    {
        return "{$this->billing_first_name} {$this->billing_last_name}";
    }

    /**
     * Get the full shipping name.
     */
    public function getShippingFullNameAttribute(): string
    {
        if ($this->shipping_first_name && $this->shipping_last_name) {
            return "{$this->shipping_first_name} {$this->shipping_last_name}";
        }
        return $this->billing_full_name;
    }

    /**
     * Check if shipping address is same as billing.
     */
    public function isShippingSameAsBilling(): bool
    {
        return $this->shipping_first_name === $this->billing_first_name &&
            $this->shipping_last_name === $this->billing_last_name &&
            $this->shipping_address === $this->billing_address &&
            $this->shipping_city === $this->billing_city &&
            $this->shipping_state === $this->billing_state &&
            $this->shipping_zip === $this->billing_zip &&
            $this->shipping_country === $this->billing_country;
    }
}
