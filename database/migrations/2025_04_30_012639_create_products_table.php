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

        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name', 2000);
            $table->string('slug', 2000);
            $table->longText('description')->nullable();
            $table->foreignId('category_id')->constrained()->cascadeOnDelete();
            $table->foreignId('brand_id')->nullable()->constrained()->cascadeOnDelete();
            $table->string('sku', 2000)->nullable();
            $table->string('barcode', 2000)->nullable();
            $table->decimal('price', 20, 2)->default(0);
            $table->string('status')->index();
            $table->string('quantity')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
