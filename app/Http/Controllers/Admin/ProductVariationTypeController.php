<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProductVariationTypeRequest;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use App\Models\VariationType;
use App\Models\VariationTypeOption;

class ProductVariationTypeController extends Controller
{
    public function index(Request $request, $id)
    {
        $product = Product::findOrFail($id);
        $variationTypes = $product->variationTypes()->with('options')->get();
        $variationTypesLists = $variationTypes->map(function ($variationType) {
            return [
                'id' => $variationType->id,
                'name' => $variationType->name,
                'type' => $variationType->type,
                'options' => $variationType->options->map(function ($option) {
                    return [
                        'id' => $option->id,
                        'name' => $option->name,
                        'images' => $option->getMedia('images')->map(function ($image) {
                            return [
                                'id' => $image->id,
                                'url' => $image->getUrl()
                            ];
                        })->toArray(),
                    ];
                }),
            ];
        });
        return Inertia::render('Admin/Products/VariationTypes/Index', [
            'variationTypesLists' => $variationTypesLists,
            'product' => $product,
        ]);
    }

    public function store(ProductVariationTypeRequest $request, $product)
    {
        $product = Product::findOrFail($product);

        try {
            $newVariationIds = [];
            $variationTypeOptions = [];
            DB::beginTransaction();
            foreach ($request->variationTypes as $vtIndex => $variationTypeData) {

                // Create or update variation type
                $variationType = isset($variationTypeData['id'])
                    ? VariationType::find($variationTypeData['id'])
                    : null;

                if ($variationType) {
                    $variationType->update([
                        'name' => $variationTypeData['name'],
                        'type' => $variationTypeData['type'],
                    ]);
                } else {
                    $variationType = VariationType::create([
                        'name' => $variationTypeData['name'],
                        'type' => $variationTypeData['type'],
                        'product_id' => $product->id,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }
                $newVariationIds[] = $variationType->id;



                // Process options
                foreach ($variationTypeData['options'] ?? [] as $opIndex => $optionData) {
                    $option = isset($optionData['id'])
                        ? VariationTypeOption::find($optionData['id'])
                        : null;

                    if ($option) {
                        $option->update(['name' => $optionData['name']]);
                    } else {
                        $option = VariationTypeOption::create([
                            'name' => $optionData['name'],
                            'variation_type_id' => $variationType->id,
                            'created_at' => now(),
                            'updated_at' => now(),
                        ]);
                    }

                    $variationTypeOptions[] = $option->id;

                    if ($variationTypeData['type'] === 'image' && request()->hasFile("variationTypes.$vtIndex.options.$opIndex.images")) {
                        $option->clearMediaCollection('images');
                        foreach (request()->file("variationTypes.$vtIndex.options.$opIndex.images") as $image) {
                            $option->addMedia($image)
                                ->toMediaCollection('images');
                        }
                    }
                }
            }



            DB::commit();
            if (count($newVariationIds) > 0) {
                VariationType::whereNotIn('id', $newVariationIds)->delete();
            }
            if (count($variationTypeOptions) > 0) {
                VariationTypeOption::whereNotIn('id', $variationTypeOptions)->delete();
            }
            return redirect()
                ->back()
                ->with('success', 'Variation types and options saved successfully.');
        } catch (\Exception $e) {
            \Log::error('Failed to save variation types: ' . $e->getMessage());
            DB::rollBack();
            return redirect()
                ->back()
                ->with('error', 'Failed to save variation types: ' . $e->getMessage());
        }
    }

    public function destroy(Request $request, $variationTypeId)
    {
        $variationType = VariationType::findOrFail($variationTypeId);

        try {
            DB::transaction(function () use ($variationType) {
                // Delete associated options and their images
                foreach ($variationType->options as $option) {
                    $option->clearMediaCollection('images');
                    $option->delete();
                }

                // Delete the variation type
                $variationType->delete();
            });

            return redirect()
                ->back()
                ->with('success', 'Variation type deleted successfully.');
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->with('error', 'Failed to delete variation type: ' . $e->getMessage());
        }
    }
}
