<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Brand;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage; // 👈 THÊM DÒNG NÀY
use Illuminate\Support\Str; // 👈 THÊM DÒNG NÀY
use Illuminate\Support\Facades\Auth; // 👈 THÊM DÒNG NÀY


class CategoryController extends Controller
{
    // ==================== USER ROUTES ====================
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


    public function show($id)
{
    $category = Category::find($id);

    if (!$category) {
        return response()->json([
            'success' => false,
            'message' => 'Không tìm thấy danh mục'
        ], 404);
    }

    // ✅ Thêm đoạn này để có URL đầy đủ
    $category->image = $category->image
        ? url('storage/' . $category->image)
        : url('images/placeholder.jpg');

    return response()->json([
        'success' => true,
        'data' => $category
    ]);
}


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
    public function adminIndex()
    {
        try {
            // Lấy TẤT CẢ categories, không phân biệt status
            $categories = Category::with('parent')
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $categories,
                'count' => $categories->count()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi lấy danh sách danh mục: ' . $e->getMessage()
            ], 500);
        }
    }

    public function getAllForDropdown()
    {
        try {
            $categories = Category::where('status', 1)
                ->orderBy('sort_order', 'asc')
                ->get(['id', 'name']);

            return response()->json([
                'success' => true,
                'data' => $categories
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi lấy danh sách danh mục'
            ], 500);
        }
    }

    public function trash()
    {
        try {
            $categories = Category::onlyTrashed()
                ->with('parent')
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $categories
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi lấy danh sách danh mục đã xóa'
            ], 500);
        }
    }


public function store(Request $request)
{
    \Log::info('📥 Nhận yêu cầu tạo danh mục:', $request->all());

    $validator = Validator::make($request->all(), [
        'name'        => 'required|string|max:255',
        'parent_id'   => [
            'nullable',
            'integer',
            function ($attribute, $value, $fail) {
                if (!is_null($value) && $value != 0) {
                    if (!\App\Models\Category::where('id', $value)->exists()) {
                        $fail('Danh mục cha không tồn tại.');
                    }
                }
            },
        ],
        'description' => 'nullable|string',
        'sort_order'  => 'nullable|integer',
        'status'      => 'required|boolean',
        'image'       => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:4096',
    ]);

    if ($validator->fails()) {
        return response()->json([
            'success' => false,
            'message' => 'Dữ liệu không hợp lệ.',
            'errors'  => $validator->errors(),
        ], 422);
    }

    try {
        $categoryData = [
            'name'        => $request->name,
            'slug'        => Str::slug($request->name),
            'description' => $request->description ?? '',
            'status'      => $request->status ?? 1,
            'parent_id'   => $request->parent_id ?? 0,
            'sort_order'  => $request->sort_order ?? 0,
            'created_by'  => Auth::id() ?? 1,
        ];

        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $filename = time() . '_' . Str::slug(pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME))
                        . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('images/category', $filename, 'public');
            $categoryData['image'] = $path;
        }

        $category = Category::create($categoryData);

        // ✅ Thêm URL đầy đủ để frontend hiển thị được ảnh
        $category->image = $category->image
            ? url('storage/' . $category->image)
            : url('images/placeholder.jpg');

        return response()->json([
            'success' => true,
            'data'    => $category,
            'message' => 'Thêm danh mục thành công!',
        ], 201);
    } catch (\Exception $e) {
        \Log::error('❌ Lỗi khi tạo danh mục:', ['error' => $e->getMessage()]);
        return response()->json([
            'success' => false,
            'message' => 'Đã xảy ra lỗi: ' . $e->getMessage(),
        ], 500);
    }
}


    
    public function destroy($id)
    {
        try {
            $category = Category::find($id);
            
            if (!$category) {
                return response()->json([
                    'success' => false,
                    'message' => 'Không tìm thấy danh mục'
                ], 404);
            }

            // Kiểm tra nếu category có sản phẩm
            if ($category->products()->exists()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Không thể xóa danh mục vì có sản phẩm đang sử dụng'
                ], 400);
            }

            // Kiểm tra nếu category có danh mục con
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

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi xóa danh mục: ' . $e->getMessage()
            ], 500);
        }
    }

    public function status($id)
{
    try {
        $category = Category::find($id);
        
        if (!$category) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy danh mục'
            ], 404);
        }

        $category->update([
            'status' => $category->status == 1 ? 0 : 1,
            'updated_by' => 1,
        ]);

        return response()->json([
            'success' => true,
            'data' => $category,
            'message' => 'Cập nhật trạng thái thành công'
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Lỗi khi cập nhật trạng thái: ' . $e->getMessage()
        ], 500);
    }
}


    public function restore($id)
    {
        try {
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
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi khôi phục danh mục: ' . $e->getMessage()
            ], 500);
        }
    }

    public function forceDestroy($id)
    {
        try {
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
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi xóa vĩnh viễn danh mục: ' . $e->getMessage()
            ], 500);
        }
    }
     public function update(Request $request, $id)
{
    $category = Category::find($id);

    if (!$category) {
        return response()->json([
            'success' => false,
            'message' => 'Không tìm thấy danh mục',
        ], 404);
    }

    $validator = Validator::make($request->all(), [
        'name'        => 'required|string|max:255',
        'parent_id'   => 'nullable|integer|exists:categories,id',
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
        $updateData = [
            'name'        => $request->name,
            'slug'        => Str::slug($request->name),
            'description' => $request->description,
            'parent_id'   => $request->parent_id ?? 0,
            'sort_order'  => $request->sort_order ?? 0,
            'status'      => $request->status,
            'updated_by'  => Auth::id() ?? 1,
        ];

        if ($request->hasFile('image')) {
            if ($category->image && Storage::disk('public')->exists($category->image)) {
                Storage::disk('public')->delete($category->image);
            }

            $file = $request->file('image');
            $filename = time() . '_' . Str::slug(pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME))
                        . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('images/category', $filename, 'public');
            $updateData['image'] = $path;
        }

        $category->update($updateData);

        // ✅ Thêm URL đầy đủ để frontend load ảnh đúng
        $category->image = $category->image
            ? url('storage/' . $category->image)
            : url('images/placeholder.jpg');

        return response()->json([
            'success' => true,
            'data'    => $category,
            'message' => 'Cập nhật danh mục thành công',
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Lỗi khi cập nhật danh mục: ' . $e->getMessage(),
        ], 500);
    }
}


}