<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProductVariationTypeRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'variationTypes' => 'required|array|min:1',
            'variationTypes.*.name' => 'required|string|max:255',
            'variationTypes.*.type' => 'required|in:select,radio,image',
            'variationTypes.*.options' => 'required|array|min:1',
            'variationTypes.*.options.*.name' => 'required|string|max:255',
            'variationTypes.*.options.*.images' => 'required_if:variationTypes.*.type,image|array',
            'images.*.*.*' => 'required_if:variationTypes.*.type,image|image|mimes:jpeg,png,jpg|max:10240'
        ];
    }
}
