<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Discount extends Model
{
    use HasFactory;

    // ✅ Nếu bạn đang dùng bảng mặc định 'discounts' thì KHÔNG cần khai báo.
    // Nếu bạn dùng tên khác, ví dụ 'ttmn_discount', thì thêm dòng này:
    // protected $table = 'ttmn_discount';

    protected $fillable = [
        'code',              // Mã giảm giá (VD: SALE10)
        'type',              // Loại giảm: percent hoặc fixed
        'value',             // Giá trị giảm
        'min_order_amount',  // Giá trị tối thiểu của đơn để được dùng
        'max_discount',      // Giảm tối đa (nếu có)
        'start_date',        // Ngày bắt đầu hiệu lực
        'end_date',          // Ngày hết hạn
        'usage_limit',       // Giới hạn số lần sử dụng
        'used_count',        // Đã sử dụng bao nhiêu lần
        'status',            // 1 = hoạt động, 0 = ngừng
    ];

    protected $casts = [
        'start_date' => 'datetime',
        'end_date' => 'datetime',
    ];

    /**
     * ✅ Kiểm tra xem mã giảm giá còn hợp lệ hay không
     */
    public function isValid()
    {
        $now = now();

        return $this->status == 1 &&
            ($this->start_date == null || $this->start_date <= $now) &&
            ($this->end_date == null || $this->end_date >= $now) &&
            ($this->usage_limit == null || $this->used_count < $this->usage_limit);
    }

    /**
     * ✅ Tính số tiền giảm thực tế cho một đơn hàng
     * @param float $orderTotal tổng tiền đơn hàng
     * @return float số tiền được giảm
     */
    public function calculateDiscountAmount($orderTotal)
    {
        // Nếu đơn hàng chưa đạt mức tối thiểu → không được áp dụng
        if ($this->min_order_amount && $orderTotal < $this->min_order_amount) {
            return 0;
        }

        $discountAmount = 0;

        if ($this->type === 'percent') {
            $discountAmount = ($this->value / 100) * $orderTotal;
        } elseif ($this->type === 'fixed') {
            $discountAmount = $this->value;
        }

        // Giới hạn giảm tối đa (nếu có)
        if ($this->max_discount && $discountAmount > $this->max_discount) {
            $discountAmount = $this->max_discount;
        }

        return round($discountAmount, 2);
    }

    /**
     * ✅ Mối quan hệ: một mã giảm giá có thể áp dụng cho nhiều đơn hàng
     */
    public function orders()
    {
        return $this->hasMany(Order::class, 'discount_id', 'id');
    }

    public function userDiscounts()
    {
        return $this->hasMany(UserDiscount::class, 'discount_id');
    }

}
