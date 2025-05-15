<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class VariationType extends Model
{
    public $timestamps = false;
    protected $guarded = [];
    public function options(): HasMany
    {
        return $this->hasMany(VariationTypeOption::class, 'variation_type_id');
    }
}
