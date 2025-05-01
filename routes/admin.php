<?php

use App\Http\Middleware\AdminCheckMiddleware;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\BrandController;
use App\Http\Controllers\Admin\ProductController;

Route::middleware(['auth', AdminCheckMiddleware::class])->group(function () {
    Route::prefix('admin')->name('admin.')->group(function () {

        Route::controller(ProductController::class)->group(function () {
            Route::group(['prefix' => 'products', 'as' => 'products.'], function () {
                // other additional routes
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
