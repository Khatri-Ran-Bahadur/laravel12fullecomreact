<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class VariationStoreUpdateRequest extends FormRequest
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
            'variations' => 'required|array',
            'variations.*.quantity' => 'required|numeric|min:0',
            'variations.*.price' => 'required|numeric|min:0',
            'variations.*.variation_type_*' => 'required|array',
        ];
    }
}
