<?php

use App\Http\Middleware\AdminCheckMiddleware;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\BrandController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\ProductImageController;
use App\Http\Controllers\Admin\ProductVariationTypeController;
use App\Http\Controllers\Admin\ProductVariationController;

Route::middleware(['auth', AdminCheckMiddleware::class])->group(function () {
    Route::prefix('admin')->name('admin.')->group(function () {



        Route::group(['prefix' => 'products', 'as' => 'products.'], function () {
            Route::controller(ProductImageController::class)->group(function () {
                Route::group(['prefix' => 'images', 'as' => 'images.'], function () {
                    Route::get('/{produt}', 'index')->name('index');
                    Route::post('/{product}/store', 'store')->name('store');
                    Route::delete('/delete/{id}', 'destroy')->name('destroy');
                });
            });

            Route::controller(ProductVariationTypeController::class)->group(function () {
                Route::group(['prefix' => 'variation-types', 'as' => 'variation-types.'], function () {
                    Route::get('/{produt}', 'index')->name('index');
                    Route::post('/{product}/store', 'store')->name('store');
                    Route::delete('/delete/{variationType}', 'destroy')->name('destroy');
                });
            });

            Route::controller(ProductVariationController::class)->group(function () {
                Route::group(['prefix' => 'variations', 'as' => 'variations.'], function () {
                    Route::get('/{produt}', 'index')->name('index');
                    Route::post('/{product}/store', 'store')->name('store');
                });
            });
        });

        Route::resources([
            'users' => UserController::class,
            'admins' => AdminController::class,
            'categories' => CategoryController::class,
            'brands' => BrandController::class,
            'products' => ProductController::class,
        ]);
    });
});
