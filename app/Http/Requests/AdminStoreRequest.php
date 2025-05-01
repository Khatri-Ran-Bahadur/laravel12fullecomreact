<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AdminStoreRequest extends FormRequest
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
            'name' => 'required|min:3|max:50',
            'email' => 'required|email|unique:users,email',
            'phone' => 'required',
            'avatar' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'password' => 'required|min:6|max:20',
            'password_confirmation' => 'required|same:password'
        ];
    }
}
