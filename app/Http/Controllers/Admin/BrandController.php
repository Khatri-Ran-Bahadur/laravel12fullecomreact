<?php

namespace App\Http\Controllers\Admin;

use App\Helpers\ImageUploader;
use App\Http\Controllers\Controller;
use App\Http\Requests\BrandStoreUpdateRequest;
use App\Http\Requests\CtaegoryStoreUpdateRequest;
use Illuminate\Http\Request;
use Inertia\Response;
use App\Models\Brand;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;

class BrandController extends Controller
{
    public function index(Request $request): Response
    {
        $perPage = $request->input('perPage', 10);
        $search = $request->input('search', '');
        $sort = $request->input('sort', 'id');
        $direction = $request->input('direction', 'asc');

        $brands = Brand::select('id', 'name', 'slug', 'image')
            ->when($search, function ($query, $search) {
                $query->where('name', 'like', '%' . $search . '%');
            })
            ->orderBy($sort, $direction)
            ->paginate($perPage)->withQueryString();

        $brands->getCollection()->transform(function ($brand) {
            $brand->image = asset('storage/' . $brand->image);
            return $brand;
        });

        return Inertia::render('Admin/Brands/Index', [
            'brands' => $brands,
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
        return Inertia::render('Admin/Brands/Create');
    }

    public function store(BrandStoreUpdateRequest $request): RedirectResponse
    {
        $data = $request->only('name');
        if ($request->hasFile('image')) {
            $data['image'] = ImageUploader::uploadImage($request->file('image'), 'brands');
        }

        Brand::create($data);
        return redirect()->route('admin.brands.index')->with('success', 'Brand created successfully.');
    }

    public function edit($id): Response
    {
        $brand = Brand::findOrFail($id);
        $brand->image = asset('storage/' . $brand->image);
        return Inertia::render('Admin/Brands/Edit', [
            'brand' => $brand,
        ]);
    }

    public function update(BrandStoreUpdateRequest $request, Brand $brand): RedirectResponse
    {
        // $brand = Brand::findOrFail($id);
        $data = $request->only('name');

        if ($request->hasFile('image')) {
            ImageUploader::deleteImage($brand->image);
            $data['image'] = ImageUploader::uploadImage($request->file('image'), 'brands');
        }

        $brand->update($data);
        return redirect()->route('admin.brands.index')->with('success', 'Brand updated successfully.');
    }

    public function destroy($id): RedirectResponse
    {
        $brand = Brand::findOrFail($id);
        ImageUploader::deleteImage($brand->image);
        $brand->delete();
        return redirect()->route('admin.brands.index')->with('success', 'Brand deleted successfully.');
    }
}
