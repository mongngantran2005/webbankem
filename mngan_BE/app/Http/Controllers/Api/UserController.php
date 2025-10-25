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

    // Nếu có avatar -> trả về URL đầy đủ
    if ($user->avatar) {
        // Xóa prefix "public/" hoặc "storage/" nếu có
        $cleanPath = str_replace(['public/', 'storage/'], '', $user->avatar);
        $user->avatar = asset('storage/' . $cleanPath);
    }

    return response()->json([
        'success' => true,
        'user' => $user,
    ]);
}

public function updateProfile(Request $request)
{
    $user = $request->user();

    // 🟢 Validate dữ liệu
    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'username' => 'nullable|string|max:100|unique:ttmn_user,username,' . $user->id,
        'birthday' => 'nullable|date',
        'gender' => 'nullable|in:Nam,Nữ,Khác',
        'phone' => 'nullable|string|max:20',
        'address' => 'nullable|string|max:255',
        'password' => 'nullable|string|min:6',
        'avatar' => 'nullable|file|mimes:jpg,jpeg,png|max:2048',
    ]);

    // 🟡 Xử lý avatar
    if ($request->hasFile('avatar')) {
        // Xóa avatar cũ nếu có (tránh đầy bộ nhớ)
        if ($user->avatar && file_exists(storage_path('app/public/' . $user->avatar))) {
            @unlink(storage_path('app/public/' . $user->avatar));
        }

        // Lưu avatar mới
        $path = $request->file('avatar')->store('avatars', 'public');
        $validated['avatar'] = str_replace('public/', '', $path);
    }

    // 🟡 Nếu có password mới thì mã hóa
    if (!empty($validated['password'])) {
        $validated['password'] = bcrypt($validated['password']);
    } else {
        unset($validated['password']);
    }

    // 🟢 Cập nhật user
    $user->update($validated);

    // 🟢 Đảm bảo phản hồi có URL đầy đủ của avatar
    $user->avatar = $user->avatar
        ? asset('storage/' . str_replace(['public/', 'storage/'], '', $user->avatar))
        : null;

    return response()->json([
        'success' => true,
        'message' => '✅ Cập nhật hồ sơ thành công!',
        'user' => $user,
    ]);
}

    // Change Password
public function changePassword(Request $request)
{
    $user = auth()->user();

    // 🔸 Kiểm tra user có đăng nhập chưa
    if (!$user) {
        return response()->json([
            'success' => false,
            'message' => 'Người dùng chưa đăng nhập!',
        ], 401);
    }

    // 🔸 Validate đầu vào
    $validator = \Validator::make($request->all(), [
        'current_password' => 'required',
        'new_password' => 'required|min:6|confirmed',
    ]);

    if ($validator->fails()) {
        return response()->json([
            'success' => false,
            'errors' => $validator->errors(),
        ], 422);
    }

    // 🔸 Kiểm tra mật khẩu cũ
    if (!\Hash::check($request->current_password, $user->password)) {
        return response()->json([
            'success' => false,
            'message' => 'Mật khẩu cũ không chính xác!',
        ], 400);
    }

    // 🔸 Cập nhật mật khẩu mới
    $user->password = \Hash::make($request->new_password);
    $user->save();

    return response()->json([
        'success' => true,
        'message' => 'Đổi mật khẩu thành công!',
    ]);
}

}
