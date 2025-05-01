<?php

namespace App\Helpers;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Drivers\Gd\Driver;
use Intervention\Image\ImageManager;

class ImageUploader
{
    public static function uploadImage(UploadedFile $image, string $folder, int $maxWidth = 1200): string
    {
        try {
            $filename = uniqid() . '_' . time() . '.webp';
            $folder = trim($folder, '/');
            $storagePath = "uploads/{$folder}/{$filename}";

            $manager = new ImageManager(new Driver());
            $image = $manager->read($image);

            if ($image->width() > $maxWidth) {
                $image->scaleDown(width: $maxWidth);
            }

            $webQuality = 75;
            $encodedImage = $image->toWebp($webQuality);

            Storage::disk('public')->put($storagePath, $encodedImage->toString());
            $publicPath = str_replace('public/', '/storage/', $storagePath);

            return $publicPath;
        } catch (\Exception $e) {
            report($e);
            return '';
        }
    }

    public static function deleteImage($path): bool
    {
        try {
            if ($path) {
                if (!Storage::disk('public')->exists($path)) {
                    return false;
                }
                Storage::disk('public')->delete($path);
            }

            return true;
        } catch (\Exception $e) {
            report($e);
            return false;
        }
    }
}
