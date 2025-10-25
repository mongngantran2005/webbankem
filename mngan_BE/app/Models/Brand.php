<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Brand extends Model
{
    use HasFactory;

    protected $table = 'ttmn_brand';

    protected $fillable = [
        'name',
        'slug',
        'image',
        'sort_order',
        'description',
        'status',
    ];
    // ✅ Brand.php
public function products()
{
    return $this->hasMany(Product::class, 'brand_id');
}

}
