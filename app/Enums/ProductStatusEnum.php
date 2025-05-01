<?php

namespace App\Enums;

enum ProductStatusEnum: string
{
    case Draft = 'draft';
    case Published = 'published';

    public static function lables(): array
    {
        return [
            self::Draft->value => __('Draft'),
            self::Published->value => __('Published'),
        ];
    }

    public static function colors(): array
    {
        return [
            self::Draft->value => 'bg-gray-100 text-gray-800',
            self::Published->value => 'bg-green-100 text-green-800',
        ];
    }
}
