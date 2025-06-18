<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductListResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'price' => $this->getPriceForFirstOptions(),
            'quantity' => $this->quantity,
            'image' => $this->getFirstImageUrl('images', 'small'),
            'isDiscount' => false,
            'discount' => 0
        ];
    }
}
