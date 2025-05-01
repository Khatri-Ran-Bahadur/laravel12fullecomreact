<?php

namespace App\Http\Controllers\Admin;

use App\Helpers\ImageUploader;
use App\Http\Controllers\Controller;
use App\Http\Requests\ProductStoreRequest;
use App\Http\Requests\ProductStoreUpdateRequest;
use Illuminate\Http\Request;
use Inertia\Response;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index(Request $request): Response
    {
        $perPage = $request->input('perPage', 10);
        $search = $request->input('search', '');
        $sort = $request->input('sort', 'id');
        $direction = $request->input('direction', 'asc');

        $products = Product::select('id', 'name', 'slug')
            ->when($search, function ($query, $search) {
                $query->where('name', 'like', '%' . $search . '%');
            })
            ->orderBy($sort, $direction)
            ->paginate($perPage)->withQueryString();

        $products->getCollection()->transform(function ($product) {
            $product->image = asset('storage/' . $product->image);
            return $product;
        });

        return Inertia::render('Admin/Products/Index', [
            'products' => $products,
            'filters' => [
                'search' => $search,
                'sort' => $sort,
                'direction' => $direction,
                'perPage' => $perPage,
                'page' => $request->input('page', 1),
            ],
            'can' => [
                'create' => true,
                'edit' => true,
                'delete' => true
            ]
        ]);
    }

    public function create(Request $request): Response
    {
        return Inertia::render('Admin/Products/Create');
    }

    public function store(ProductStoreRequest $request): RedirectResponse
    {
        $data = $request->only('name');
        if ($request->hasFile('image')) {
            $data['image'] = ImageUploader::uploadImage($request->file('image'), 'products');
        }

        Product::create($data);
        return redirect()->route('admin.products.index')->with('success', 'Product created successfully.');
    }

    public function edit($id): Response
    {
        $product = Product::findOrFail($id);
        $product->image = asset('storage/' . $product->image);
        return Inertia::render('Admin/Products/Edit', [
            'product' => $product,
        ]);
    }

    public function update(ProductStoreUpdateRequest $request, Product $product): RedirectResponse
    {
        // $product = Product::findOrFail($id);
        $data = $request->only('name');

        if ($request->hasFile('image')) {
            ImageUploader::deleteImage($product->image);
            $data['image'] = ImageUploader::uploadImage($request->file('image'), 'products');
        }

        $product->update($data);
        return redirect()->route('admin.products.index')->with('success', 'Product updated successfully.');
    }

    public function destroy($id): RedirectResponse
    {
        $product = Product::findOrFail($id);
        ImageUploader::deleteImage($product->image);
        $product->delete();
        return redirect()->route('admin.products.index')->with('success', 'Product deleted successfully.');
    }
}
