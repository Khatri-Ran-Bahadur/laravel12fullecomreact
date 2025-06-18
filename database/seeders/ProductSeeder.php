<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\ProductVariation;
use App\Models\VariationType;
use App\Models\VariationTypeOption;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $products = \App\Models\Product::factory(50)->create();

        foreach ($products->take(20) as $product) {
            // Create Color variation type
            $colorType = VariationType::create([
                'product_id' => $product->id,
                'name' => 'Colors',
                'type' => 'select'
            ]);

            // Create Size variation type
            $sizeType = VariationType::create([
                'product_id' => $product->id,
                'name' => 'Size',
                'type' => 'select'
            ]);

            // Create Color options
            $redOption = VariationTypeOption::create([
                'variation_type_id' => $colorType->id,
                'name' => 'Red'
            ]);

            $blackOption = VariationTypeOption::create([
                'variation_type_id' => $colorType->id,
                'name' => 'Black'
            ]);

            // Create Size options
            $smallOption = VariationTypeOption::create([
                'variation_type_id' => $sizeType->id,
                'name' => 'Small'
            ]);

            $largeOption = VariationTypeOption::create([
                'variation_type_id' => $sizeType->id,
                'name' => 'Large'
            ]);

            // Create variations (combinations)
            $variations = [
                [
                    'product_id' => $product->id,
                    'variation_type_option_ids' => json_encode([$redOption->id, $smallOption->id]),
                    'quantity' => 100,
                    'price' => 200.00
                ],
                [
                    'product_id' => $product->id,
                    'variation_type_option_ids' => json_encode([$blackOption->id, $smallOption->id]),
                    'quantity' => 100,
                    'price' => 200.00
                ],
                [
                    'product_id' => $product->id,
                    'variation_type_option_ids' => json_encode([$redOption->id, $largeOption->id]),
                    'quantity' => 200,
                    'price' => 300.00
                ],
                [
                    'product_id' => $product->id,
                    'variation_type_option_ids' => json_encode([$blackOption->id, $largeOption->id]),
                    'quantity' => 300,
                    'price' => 300.00
                ]
            ];

            foreach ($variations as $variation) {
                ProductVariation::create($variation);
            }
        }
    }
}
