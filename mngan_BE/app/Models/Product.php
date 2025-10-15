<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'ttmn_product'; // nếu bảng của bạn tên ttmn_product
    protected $fillable = [
        'name', 'slug', 'price_root', 'price_sale', 'description',
        'detail', 'thumbnail', 'brand_id', 'category_id', 'qty', 'created_by','status'
    ];

    public function brand()
    {
        return $this->belongsTo(Brand::class, 'brand_id', 'id');
    }

    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id', 'id');
    }
    public function reviews()
    {
        return $this->hasMany(ProductReview::class);
    }

}
