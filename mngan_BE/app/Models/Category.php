<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    protected $table = 'ttmn_category';
    protected $fillable = [
        'name', 
        'slug', 
        'parent_id', 
        'status',
        'sort_order', // 👈 THÊM DÒNG NÀY
        'description',
        'image',
        'created_by',
        'updated_by'
    ];

    // Danh mục con
    public function children()
    {
        return $this->hasMany(Category::class, 'parent_id', 'id');
    }

    // Danh mục cha
    public function parent()
    {
        return $this->belongsTo(Category::class, 'parent_id');
    }

    // Relationship với products
    public function products()
    {
        return $this->hasMany(Product::class, 'category_id');
    }
}