<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Product;

class ProductImageController extends Controller
{
    public function index(Request $request, $id)
    {
        $product = Product::findOrFail($id);
        $images = [];

        return Inertia::render('Admin/Products/Images/Index', [
            'images' => $images,
            'product' => $product,
        ]);
    }

    public function store(Request $request, $product)
    {
        // Logic to store product images
    }

    public function destroy(Request $request, $product, $imageId)
    {
        // Logic to delete product image
    }
}
