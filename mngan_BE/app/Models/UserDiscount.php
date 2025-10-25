<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserDiscount extends Model
{
    use HasFactory;

    protected $table = 'user_discounts';

    protected $fillable = [
        'user_id',
        'discount_id',
        'is_used',
    ];

    // 🔹 Mối quan hệ tới người dùng
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    // 🔹 Mối quan hệ tới mã giảm giá
    public function discount()
    {
        return $this->belongsTo(Discount::class, 'discount_id');
    }
}
