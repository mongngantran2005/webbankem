<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    // 🔹 Chỉ rõ bảng thật
    protected $table = 'ttmn_order';

    protected $fillable = [
    'user_id',
    'name',
    'phone',
    'email',
    'address',
    'note',
    'status',
    'discount_id',     // mã giảm giá (nếu có)
    'discount_code',   // 🔹 mã (VD: GIAM10)
    'discount_value',  // 🔹 số tiền được giảm (VD: 10000)
    'total',           // 🔹 tổng tiền sau khi trừ giảm giá + cộng phí ship
];


    // ✅ 1 đơn hàng có nhiều chi tiết
    public function orderDetails()
    {
        return $this->hasMany(OrderDetail::class, 'order_id', 'id');
    }

    // ✅ 1 đơn hàng thuộc về 1 người dùng
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    // ✅ 1 đơn hàng có thể dùng 1 mã giảm giá
    public function discount()
    {
        return $this->belongsTo(Discount::class, 'discount_id', 'id');
    }
}
