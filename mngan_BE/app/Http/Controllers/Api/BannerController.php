<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Banner;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class BannerController extends Controller
{
    /**
     * ✅ [ADMIN] Lấy tất cả banner
     */
    public function indexAll()
    {
        $banners = Banner::orderBy('created_at', 'desc')->get();

        return response()->json([
            'success' => true,
            'data' => $banners
        ]);
    }

    /**
     * ✅ [FRONTEND] Lấy banner slideshow đang hoạt động
     */
    public function index()
{
    $now = now()->timezone('Asia/Ho_Chi_Minh'); // 🔹 đảm bảo dùng giờ Việt Nam

    $banners = Banner::where('status', 1)
        ->where('position', 'slideshow')
        ->where(function ($q) use ($now) {
            $q->whereNull('start_date')
              ->orWhere('start_date', '<=', $now->addHours(1)); // 🔹 nới nhẹ 1 tiếng để tránh lệch múi giờ
        })
        ->where(function ($q) use ($now) {
            $q->whereNull('end_date')
              ->orWhere('end_date', '>=', $now->subHours(1)); // 🔹 nới nhẹ 1 tiếng cho an toàn
        })
        ->orderBy('sort_order', 'asc')
        ->get();

    return response()->json([
        'success' => true,
        'data' => $banners
    ]);
}

    /**
     * ✅ [FRONTEND] Lấy banner popup đang hoạt động
     */
    public function getPopup()
{
    $now = now();

    // 🟢 1. Thử lấy banner đang diễn ra
    $banner = Banner::where('position', 'popup')
        ->where('status', 1)
        ->where(function ($q) use ($now) {
            $q->whereNull('start_date')->orWhere('start_date', '<=', $now);
        })
        ->where(function ($q) use ($now) {
            $q->whereNull('end_date')->orWhere('end_date', '>=', $now);
        })
        ->orderBy('start_date', 'asc')
        ->first();

    // 🟡 2. Nếu hôm nay chưa có banner nào đang diễn ra → lấy banner sắp tới
    if (!$banner) {
        $banner = Banner::where('position', 'popup')
            ->where('status', 1)
            ->where('start_date', '>', $now)
            ->orderBy('start_date', 'asc')
            ->first();
    }

    if (!$banner) {
        return response()->json(['message' => 'Không có banner popup hoạt động'], 404);
    }

    return response()->json([
        'success' => true,
        'data' => $banner
    ]);
}


    /**
     * ✅ [ADMIN] Thêm mới banner
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name'        => 'required|string|max:255',
            'image'       => 'required|file|mimes:jpg,jpeg,png,webp|max:2048',
            'link'        => 'nullable|string|max:500',
            'position'    => 'required|in:slideshow,popup',
            'sort_order'  => 'nullable|integer|min:0',
            'description' => 'nullable|string',
            'start_date'  => 'nullable|date',
            'end_date'    => 'nullable|date|after_or_equal:start_date',
            'status'      => 'required|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // ✅ Lưu ảnh
            $path = null;
            if ($request->hasFile('image')) {
                $file = $request->file('image');
                $filename = uniqid() . '.' . $file->getClientOriginalExtension();
                $path = $file->storeAs('uploads/banners', $filename, 'public');
            }

            // ✅ Tạo banner
            $banner = Banner::create([
                'name'        => $request->name,
                'image'       => $path,
                'link'        => $request->link,
                'position'    => $request->position,
                'sort_order'  => $request->sort_order ?? 0,
                'description' => $request->description,
                'start_date'  => $request->start_date,
                'end_date'    => $request->end_date,
                'status'      => $request->status,
                'created_by'  => 1, // 👈 Nếu chưa có Auth
            ]);

            return response()->json([
                'success' => true,
                'message' => '✅ Thêm banner thành công',
                'banner'  => $banner,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi lưu banner: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * ✅ [ADMIN] Cập nhật banner
     */
    public function update(Request $request, $id)
    {
        $banner = Banner::find($id);
        if (!$banner) {
            return response()->json(['message' => 'Không tìm thấy banner'], 404);
        }

        $validator = Validator::make($request->all(), [
            'name'        => 'sometimes|required|string|max:255',
            'image'       => 'nullable|file|mimes:jpg,jpeg,png,webp|max:2048',
            'link'        => 'nullable|string|max:500',
            'position'    => 'sometimes|required|in:slideshow,popup',
            'sort_order'  => 'nullable|integer|min:0',
            'description' => 'nullable|string',
            'start_date'  => 'nullable|date',
            'end_date'    => 'nullable|date|after_or_equal:start_date',
            'status'      => 'required|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            // ✅ Nếu có ảnh mới
            if ($request->hasFile('image')) {
                if ($banner->image && Storage::disk('public')->exists($banner->image)) {
                    Storage::disk('public')->delete($banner->image);
                }
                $newPath = $request->file('image')->store('uploads/banners', 'public');
                $banner->image = $newPath;
            }

            $banner->update($request->except('image'));

            return response()->json([
                'success' => true,
                'message' => '✅ Cập nhật banner thành công',
                'data'    => $banner
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi cập nhật: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * ✅ [ADMIN] Xóa banner
     */
    public function destroy($id)
    {
        $banner = Banner::find($id);
        if (!$banner) {
            return response()->json(['message' => 'Không tìm thấy banner'], 404);
        }

        // ✅ Xóa ảnh cũ
        if ($banner->image && Storage::disk('public')->exists($banner->image)) {
            Storage::disk('public')->delete($banner->image);
        }

        $banner->delete();

        return response()->json([
            'success' => true,
            'message' => '✅ Xóa banner thành công'
        ]);
    }
}
