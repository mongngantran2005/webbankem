<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Discount;

class DiscountController extends Controller
{
    // 🟢 Lấy tất cả mã giảm giá (cho admin)
    public function index()
    {
        $discounts = Discount::orderBy('created_at', 'desc')->get();
        return response()->json(['success' => true, 'data' => $discounts]);
    }

    // 🟢 Tạo mã giảm giá
    public function store(Request $request)
    {
        $request->validate([
            'code' => 'required|unique:discounts,code',
            'type' => 'required|in:percent,fixed',
            'value' => 'required|numeric|min:1',
        ]);

        $discount = Discount::create($request->all());
        return response()->json(['success' => true, 'data' => $discount]);
    }

    // 🟢 Cập nhật mã giảm giá
    public function update(Request $request, $id)
    {
        $discount = Discount::findOrFail($id);
        $discount->update($request->all());
        return response()->json(['success' => true, 'data' => $discount]);
    }

    // 🟢 Xóa mã giảm giá
    public function destroy($id)
    {
        $discount = Discount::findOrFail($id);
        $discount->delete();
        return response()->json(['success' => true]);
    }

    // 🟢 Lấy danh sách mã đang hoạt động (hiển thị trên Home)
    public function active()
    {
        $now = now();
        $discounts = Discount::where('status', 1)
            ->where(function ($q) use ($now) {
                $q->whereNull('start_date')->orWhere('start_date', '<=', $now);
            })
            ->where(function ($q) use ($now) {
                $q->whereNull('end_date')->orWhere('end_date', '>=', $now);
            })
            ->get();

        return response()->json(['success' => true, 'data' => $discounts]);
    }

    // 🟢 Kiểm tra khi người dùng nhập mã giảm giá
    public function apply(Request $request)
    {
        $discount = Discount::where('code', $request->code)->first();

        if (!$discount) {
            return response()->json(['success' => false, 'message' => 'Mã giảm giá không tồn tại']);
        }

        if (!$discount->isValid()) {
            return response()->json(['success' => false, 'message' => 'Mã đã hết hạn hoặc vượt giới hạn sử dụng']);
        }

        return response()->json(['success' => true, 'data' => $discount]);
    }
}
