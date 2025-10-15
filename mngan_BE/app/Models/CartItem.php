<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CartItem extends Model
{
    use HasFactory;

    // Nếu bảng trong DB của bạn là `cart_items`, giữ nguyên; nếu là `ttmn_cart_items`, sửa lại ở đây:
    protected $table = 'cart_items'; 

    protected $fillable = [
        'user_id',
        'product_id',
        'quantity',
    ];

    protected $with = ['product'];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id', 'id');
    }

    // Lấy giá sản phẩm (ưu tiên giá sale nếu có)
    public function getPriceAttribute()
    {
        return $this->product->price_sale ?? $this->product->price_root ?? 0;
    }

    // Tổng tiền của item = giá × số lượng
    public function getTotalAttribute()
    {
        return $this->price * $this->quantity;
    }
}
