<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\UserDiscount;
use App\Models\Discount;

class UserDiscountController extends Controller
{
    // 🟢 Lưu mã giảm giá vào tài khoản người dùng
    public function store(Request $request)
    {
        $user = $request->user();
        $discountId = $request->discount_id;

        if (!$discountId) {
            return response()->json(['success' => false, 'message' => 'Thiếu mã giảm giá.'], 400);
        }

        $discount = Discount::find($discountId);

        if (!$discount) {
            return response()->json(['success' => false, 'message' => 'Mã giảm giá không tồn tại.'], 404);
        }

        // 🔸 Kiểm tra xem người dùng đã lưu mã này chưa
        $exists = UserDiscount::where('user_id', $user->id)
            ->where('discount_id', $discountId)
            ->exists();

        if ($exists) {
            return response()->json(['success' => false, 'message' => 'Bạn đã lưu mã này rồi.']);
        }

        // 🔹 Lưu mã giảm giá vào bảng user_discounts
        UserDiscount::create([
            'user_id' => $user->id,
            'discount_id' => $discountId,
            'is_used' => false,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Lưu mã giảm giá thành công!',
        ]);
    }

    // 🟡 Lấy danh sách mã giảm giá mà người dùng đã lưu
    public function index(Request $request)
    {
        $user = $request->user();

        $discounts = UserDiscount::where('user_id', $user->id)
            ->with('discount')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $discounts,
        ]);
    }

public function getUserDiscounts($userId)
{
    $discounts = UserDiscount::where('user_id', $userId)
        ->where('is_used', 0)
        ->whereHas('discount') // chỉ lấy nếu có discount hợp lệ
        ->with('discount')
        ->get();

    return response()->json(['data' => $discounts]);
}


}
