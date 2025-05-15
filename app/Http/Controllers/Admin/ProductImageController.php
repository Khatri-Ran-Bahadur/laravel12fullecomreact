<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Product;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class ProductImageController extends Controller
{
    public function index(Request $request, $id)
    {
        $product = Product::findOrFail($id);
        $images = [];

        $product->getMedia('images')->each(function ($media) use (&$images) {
            $images[] = [
                'id' => $media->id,
                'url' => $media->getUrl(),
            ];
        });



        return Inertia::render('Admin/Products/Images/Index', [
            'images' => $images,
            'product' => $product,
        ]);
    }

    public function store(Request $request, Product $product)
    {
        $request->validate([
            'images' => 'required|array',
            'images.*' => 'image|max:2048',
        ]);

        foreach ($request->file('images', []) as $image) {
            $product->addMedia($image)
                ->toMediaCollection('images');
        }

        return redirect()->back()
            ->with('success', 'Images uploaded successfully.');
    }

    public function destroy(Request $request, $imageId)
    {
        $media = Media::findOrFail($imageId);
        $media->delete();
        return redirect()->back()
            ->with('success', 'Image deleted successfully.');
    }
}
