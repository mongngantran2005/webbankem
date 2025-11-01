<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Brand;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;

class CategoryController extends Controller
{
    // ==================== USER ROUTES ====================

    /** ✅ Danh sách danh mục (người dùng) */
    public function index()
    {
        $categories = Category::with(['parent', 'children'])
            ->where('status', 1)
            ->orderBy('sort_order', 'ASC')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $categories
        ]);
    }

    /** ✅ Chi tiết danh mục */
    public function show($id)
    {
        $category = Category::find($id);

        if (!$category) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy danh mục'
            ], 404);
        }

        $category->image = $category->image
            ? url('storage/' . $category->image)
            : url('images/placeholder.jpg');

        return response()->json([
            'success' => true,
            'data' => $category
        ]);
    }

    /** ✅ Lấy danh sách thương hiệu theo danh mục */
    public function getBrandsByCategory($id)
    {
        $brands = Brand::whereHas('products', function ($q) use ($id) {
            $q->where('category_id', $id);
        })->get();

        return response()->json([
            'success' => true,
            'data' => $brands
        ]);
    }

    // ==================== ADMIN ROUTES ====================

    /** ✅ Danh sách tất cả danh mục */
public function adminIndex()
{
    $categories = Category::with('parent')
        ->orderBy('created_at', 'desc')
        ->get();

    // ✅ Thêm đoạn này để xử lý đường dẫn ảnh đầy đủ
    $categories->transform(function ($item) {
        $item->image = $item->image
            ? url('storage/' . $item->image)
            : url('images/placeholder.jpg');
        return $item;
    });

    return response()->json([
        'success' => true,
        'data' => $categories,
        'count' => $categories->count(),
    ]);
}



    /** ✅ Dành cho dropdown chọn danh mục cha */
    public function getAllForDropdown()
    {
        $categories = Category::where('status', 1)
            ->orderBy('sort_order', 'asc')
            ->get(['id', 'name']);

        return response()->json([
            'success' => true,
            'data' => $categories
        ]);
    }

    /** ✅ Danh mục đã xóa mềm */
    public function trash()
    {
        $categories = Category::onlyTrashed()
            ->with('parent')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $categories
        ]);
    }

    /** ✅ Tạo mới danh mục */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
    'name'        => 'required|string|max:255',
    'parent_id'   => 'nullable|integer|exists:ttmn_category,id',
    'description' => 'nullable|string',
    'sort_order'  => 'nullable|integer',
    'status'      => 'required|boolean',
    'image'       => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:4096',
]);


        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors'  => $validator->errors(),
            ], 422);
        }

        try {
            $data = [
                'name'        => $request->name,
                'slug'        => Str::slug($request->name),
                'description' => $request->description ?? '',
                'parent_id'   => $request->parent_id ?? 0,
                'sort_order'  => $request->sort_order ?? 0,
                'status'      => $request->status ?? 1,
                'created_by'  => Auth::id() ?? 1,
            ];

            if ($request->hasFile('image')) {
                $file = $request->file('image');
                $filename = time() . '_' . Str::slug(pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME))
                            . '.' . $file->getClientOriginalExtension();
                $path = $file->storeAs('images/category', $filename, 'public');
                $data['image'] = $path;
            }

            $category = Category::create($data);
            $category->image = $category->image
                ? url('storage/' . $category->image)
                : url('images/placeholder.jpg');

            return response()->json([
                'success' => true,
                'data'    => $category,
                'message' => 'Thêm danh mục thành công!',
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi tạo danh mục: ' . $e->getMessage(),
            ], 500);
        }
    }
public function update(Request $request, $id)
{
    // ✅ Tìm danh mục theo ID
    $category = Category::find($id);

    if (!$category) {
        return response()->json([
            'success' => false,
            'message' => 'Không tìm thấy danh mục!',
        ], 404);
    }

    // ✅ Ép kiểu status về 0 hoặc 1
    $status = in_array($request->status, [1, '1', true, 'true'], true) ? 1 : 0;

    // ✅ Gom dữ liệu trước khi validate
    $data = $request->all();
    $data['status'] = $status;

    // ✅ Validate dữ liệu đầu vào
    $validator = Validator::make($data, [
        'name'        => 'required|string|max:255',
        'slug'        => 'nullable|string|max:255',
'parent_id'   => 'nullable|integer|min:0',
        'description' => 'nullable|string',
        'sort_order'  => 'nullable|integer',
        'status'      => 'required|in:0,1',
        'image'       => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:4096',
    ]);

    if ($validator->fails()) {
        return response()->json([
            'success' => false,
            'errors'  => $validator->errors(),
        ], 422);
    }

    try {
        // ✅ Chuẩn bị dữ liệu cập nhật
        $updateData = [
            'name'        => $data['name'],
            'slug'        => Str::slug($data['slug'] ?? $data['name']),
            'description' => $data['description'] ?? '',
            'parent_id'   => $data['parent_id'] ?? 0,
            'sort_order'  => $data['sort_order'] ?? 0,
            'status'      => $data['status'],
            'updated_by'  => Auth::id() ?? 1,
        ];

        // ✅ Nếu có ảnh mới, lưu và xóa ảnh cũ
        if ($request->hasFile('image')) {
            // Xóa ảnh cũ nếu tồn tại
            if ($category->image && Storage::disk('public')->exists($category->image)) {
                Storage::disk('public')->delete($category->image);
            }

            $file = $request->file('image');
            $filename = time() . '_' . Str::slug(pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME))
                        . '.' . $file->getClientOriginalExtension();

            $path = $file->storeAs('images/category', $filename, 'public');
            $updateData['image'] = $path;
        }

        // ✅ Cập nhật dữ liệu
        $category->update($updateData);

        // ✅ Trả về đường dẫn ảnh đầy đủ
        $category->image = $category->image
            ? url('storage/' . $category->image)
            : url('images/placeholder.jpg');

        return response()->json([
            'success' => true,
            'data'    => $category,
            'message' => '✅ Cập nhật danh mục thành công!',
        ], 200);

    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => '❌ Lỗi khi cập nhật danh mục: ' . $e->getMessage(),
        ], 500);
    }
}
  
    /** ✅ Cập nhật trạng thái (bật/tắt) */
    public function status($id)
    {
        $category = Category::find($id);

        if (!$category) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy danh mục',
            ], 404);
        }

        $category->update([
            'status' => $category->status == 1 ? 0 : 1,
            'updated_by' => Auth::id() ?? 1,
        ]);

        return response()->json([
            'success' => true,
            'data' => $category,
            'message' => 'Cập nhật trạng thái thành công',
        ]);
    }

    /** ✅ Xóa mềm danh mục */
    public function destroy($id)
    {
        $category = Category::find($id);

        if (!$category) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy danh mục'
            ], 404);
        }

        if ($category->products()->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'Không thể xóa danh mục vì có sản phẩm đang sử dụng'
            ], 400);
        }

        if ($category->children()->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'Không thể xóa danh mục vì có danh mục con'
            ], 400);
        }

        $category->delete();

        return response()->json([
            'success' => true,
            'message' => 'Xóa danh mục thành công'
        ]);
    }

    /** ✅ Khôi phục danh mục đã xóa */
    public function restore($id)
    {
        $category = Category::onlyTrashed()->find($id);

        if (!$category) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy danh mục'
            ], 404);
        }

        $category->restore();

        return response()->json([
            'success' => true,
            'message' => 'Khôi phục danh mục thành công'
        ]);
    }

    /** ✅ Xóa vĩnh viễn danh mục */
    public function forceDestroy($id)
    {
        $category = Category::onlyTrashed()->find($id);

        if (!$category) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy danh mục'
            ], 404);
        }

        $category->forceDelete();

        return response()->json([
            'success' => true,
            'message' => 'Xóa vĩnh viễn danh mục thành công'
        ]);
    }
}
