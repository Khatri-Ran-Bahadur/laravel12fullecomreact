<?php

namespace App\Services;

use App\Models\Product;
use App\Models\ProductVariation;

class ProductService
{

    public function mergeCartesianWithExisting($variationTypes, $existingData, $product): array
    {
        $defaultQuantity = $product->quantity;
        $defaultPrice = $product->price;
        $cartesianProduct = $this->cartesianProduct($variationTypes, $defaultQuantity, $defaultPrice);
        $mergedResult = [];

        foreach ($cartesianProduct as $product) {
            $optionIds = collect($product)
                ->filter(fn($value, $key) => str_starts_with($key, 'variation_type_'))
                ->map(fn($option) => $option['id'])
                ->values()
                ->toArray();

            $match = array_filter($existingData, function ($existingOption) use ($optionIds) {
                return $existingOption['variation_type_option_ids'] === $optionIds;
            });

            if (!empty($match)) {
                $existingEntry = reset($match);
                $product['id'] = $existingEntry['id'];
                $product['quantity'] = $existingEntry['quantity'];
                $product['price'] = $existingEntry['price'];
            } else {
                $product['quantity'] = $defaultQuantity;
                $product['price'] = $defaultPrice;
            }

            $mergedResult[] = $product;
        }
        return $mergedResult;
    }

    public function cartesianProduct($variationTypes, $defaultQuantity, $defaultPrice)
    {
        $result = [[]];

        foreach ($variationTypes as $index => $variationType) {
            $temp = [];
            foreach ($variationType->options as $option) {
                foreach ($result as $combination) {
                    $newCombination = $combination + [
                        'variation_type_' . ($variationType->id) => [
                            'id' => $option->id,
                            'name' => $option->name,
                            'label' => $variationType->name,
                        ]
                    ];
                    $temp[] = $newCombination;
                }
            }
            $result = $temp;
        }
        foreach ($result as &$combination) {
            if (count($combination) === count($variationTypes)) {
                $combination['quantity'] = $defaultQuantity;
                $combination['price'] = $defaultPrice;
            }
        }
        return $result;
    }

    public function mutateFormDataBeforeSave(array $data, $product): array
    {


        $formattedData = [];
        foreach ($data['variations'] as $option) {
            $variationTypeOptionIds = [];
            foreach ($product->variationTypes as $i => $variationType) {
                $variationTypeOptionIds[] = $option['variation_type_' . ($variationType->id)]['id'];
            }
            $quantity = $option['quantity'];
            $price = $option['price'];

            $formattedData[] = [
                'id' => $option['id'] ?? '',
                'variation_type_option_ids' => $variationTypeOptionIds,
                'quantity' => $quantity,
                'price' => $price,
            ];
        }
        $data['variations'] = $formattedData;
        return $data;
    }

    public function handleRecordUpdate(Product $record, array $data): Product
    {
        // Extract variations from data and unset from the main data array
        $variations = $data['variations'];
        unset($data['variations']);

        // Process each variation
        $variations = collect($variations)->map(function ($variation) use ($record) {
            $variationData = [
                'variation_type_option_ids' => json_encode($variation['variation_type_option_ids']),
                'quantity' => $variation['quantity'],
                'price' => $variation['price'],
            ];

            // If the variation has an ID, update it; if not, create a new one
            if (isset($variation['id']) && $variation['id'] !== null && $variation['id'] !== '') {
                // Update existing variation
                return array_merge($variationData, ['id' => $variation['id']]);
            } else {
                // Create new variation (no ID provided)
                return array_merge($variationData, ['product_id' => $record->id, 'created_at' => now()]);
            }
        })->toArray();


        // For existing variations, we can use `updateOrCreate` to update or create based on the ID
        foreach ($variations as $variation) {
            // If ID exists, we use updateOrCreate to update existing variations
            if ($pv = ProductVariation::where('product_id', $record->id)->where('variation_type_option_ids', json_encode($variation['variation_type_option_ids']))->first()) {
                $record->variations()->updateOrCreate(
                    ['id' => $pv->id],
                    $variation
                );
            } else {
                // If no ID, create a new variation record without the `id`
                $record->variations()->create($variation);
            }
        }

        // Return the updated product record
        return $record;
    }
}
