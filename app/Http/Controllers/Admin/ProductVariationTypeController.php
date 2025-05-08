<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductVariationTypeController extends Controller
{
    public function index(Request $request, $id)
    {
        $product = Product::findOrFail($id);
        $variationTypes = [];
        return Inertia::render('Admin/Products/VariationTypes/Index', [
            'variationTypes' => $variationTypes,
            'product' => $product,
        ]);
    }

    public function store(Request $request, $product)
    {
        // Logic to store product variation type
    }

    public function destroy(Request $request, $product, $variationTypeId)
    {
        // Logic to delete product variation type
    }
}
