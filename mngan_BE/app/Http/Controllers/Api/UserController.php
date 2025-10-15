<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * 🧾 Lấy danh sách tất cả người dùng (chỉ admin)
     */
    public function index()
    {
        try {
            // Nếu bạn muốn lọc chỉ khách hàng:
            // $users = User::where('roles', 'customer')->orderBy('id', 'desc')->get();

            $users = User::orderBy('id', 'desc')->get();

            return response()->json([
                'success' => true,
                'message' => 'Lấy danh sách người dùng thành công!',
                'users' => $users,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi hệ thống: ' . $e->getMessage(),
            ], 500);
        }
    }

    //Profile
    public function profile(Request $request)
{
    $user = $request->user();
    return response()->json(['success' => true, 'user' => $user]);
}

public function updateProfile(Request $request)
{
    $user = $request->user();

    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'phone' => 'nullable|string|max:20',
        'address' => 'nullable|string|max:255',
    ]);

    $user->update($validated);

    return response()->json(['success' => true, 'message' => 'Cập nhật thành công', 'user' => $user]);
}

}
