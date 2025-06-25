<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            // Order Information
            $table->string('order_number')->unique()->index();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();

            // Payment Information
            $table->string('payment_method')->default('card'); // card, paypal, apple-pay, cod
            $table->string('payment_status')->default('pending');
            $table->string('stripe_session_id')->nullable();
            $table->string('stripe_payment_intent_id')->nullable();

            // Order Status
            $table->string('status')->default('pending');

            // Pricing
            $table->decimal('subtotal', 20, 2)->default(0);
            $table->decimal('tax_amount', 20, 2)->default(0);
            $table->decimal('shipping_amount', 20, 2)->default(0);
            $table->decimal('discount_amount', 20, 2)->default(0);
            $table->decimal('total_price', 20, 2)->default(0);

            // Billing Information
            $table->string('billing_first_name');
            $table->string('billing_last_name');
            $table->string('billing_email');
            $table->string('billing_phone')->nullable();
            $table->text('billing_address');
            $table->string('billing_city');
            $table->string('billing_state');
            $table->string('billing_zip');
            $table->string('billing_country');

            // Shipping Information
            $table->string('shipping_first_name')->nullable();
            $table->string('shipping_last_name')->nullable();
            $table->text('shipping_address')->nullable();
            $table->string('shipping_city')->nullable();
            $table->string('shipping_state')->nullable();
            $table->string('shipping_zip')->nullable();
            $table->string('shipping_country')->nullable();

            // Shipping Details
            $table->string('shipping_method')->default('standard');
            $table->string('tracking_number')->nullable();
            $table->date('estimated_delivery')->nullable();
            $table->date('shipped_at')->nullable();
            $table->date('delivered_at')->nullable();

            // Order Notes
            $table->text('customer_notes')->nullable();
            $table->text('admin_notes')->nullable();

            // Timestamps
            $table->timestamps();

            // Indexes
            $table->index(['user_id', 'status']);
            $table->index(['order_number']);
            $table->index(['payment_status']);
            $table->index(['created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
