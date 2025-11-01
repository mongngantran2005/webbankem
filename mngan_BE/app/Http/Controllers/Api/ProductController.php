<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    // ====================== 🟢 HÀM CHUẨN HÓA ĐƯỜNG DẪN ẢNH ======================
    private function formatThumbnail($thumbnail)
    {
        if (!$thumbnail) {
            return url('images/placeholder.jpg');
        }

        // Nếu thumbnail đã là URL đầy đủ (có http / https)
        if (Str::startsWith($thumbnail, ['http://', 'https://'])) {
            return $thumbnail;
        }

        // Chuẩn hóa: chỉ lấy tên file, bỏ dấu // hoặc thư mục thừa
        $fileName = basename(trim($thumbnail, '/'));

        return url('uploads/products/' . $fileName);
    }

    // ====================== 🟢 LẤY TẤT CẢ SẢN PHẨM ======================
    public function index()
    {
        $products = Product::with(['brand', 'category'])
            ->whereNull('deleted_at')
            ->get()
            ->map(function ($product) {
                $product->thumbnail = $this->formatThumbnail($product->thumbnail);
                return $product;
            });

        return response()->json([
            'success' => true,
            'data' => $products,
        ]);
    }

    // ====================== 🟢 PHÂN TRANG SẢN PHẨM ======================
    public function all(Request $request)
    {
        $perPage = $request->get('per_page', 5);

        $products = Product::with(['brand', 'category'])
            ->whereNull('deleted_at')
            ->paginate($perPage);

        $products->getCollection()->transform(function ($product) {
            $product->thumbnail = $this->formatThumbnail($product->thumbnail);
            return $product;
        });

        return response()->json([
            'success' => true,
            'data' => $products->items(),
            'pagination' => [
                'total' => $products->total(),
                'per_page' => $products->perPage(),
                'current_page' => $products->currentPage(),
                'last_page' => $products->lastPage(),
            ],
        ]);
    }

    // ====================== 🟢 LẤY CHI TIẾT SẢN PHẨM ======================
    public function show($id)
    {
        $product = Product::find($id);

        if (!$product || $product->deleted_at) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy sản phẩm',
            ], 404);
        }

        $product->thumbnail = $this->formatThumbnail($product->thumbnail);

        return response()->json([
            'success' => true,
            'data' => $product,
        ]);
    }

    // ====================== 🟢 THÊM SẢN PHẨM ======================
    public function store(Request $request)
    {
        $request->merge([
            'status' => filter_var($request->status, FILTER_VALIDATE_BOOLEAN),
        ]);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:ttmn_product,slug',
            'price_root' => 'required|numeric|min:0',
            'price_sale' => 'nullable|numeric|min:0',
            'description' => 'nullable|string',
            'detail' => 'nullable|string',
            'thumbnail' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'category_id' => 'required|exists:ttmn_category,id',
            'brand_id' => 'required|exists:ttmn_brand,id',
            'qty' => 'required|integer|min:0',
            'status' => 'required|boolean',
        ]);

        $validated['slug'] = $validated['slug'] ?? Str::slug($validated['name']);

        // ✅ Upload ảnh
        if ($request->hasFile('thumbnail')) {
            $file = $request->file('thumbnail');
            $filename = time() . '_' . $file->getClientOriginalName();
            $file->move(public_path('uploads/products'), $filename);
            $validated['thumbnail'] = 'uploads/products/' . $filename;
        }

        $validated['created_by'] = 1;

        $product = Product::create($validated);
        $product->thumbnail = $this->formatThumbnail($product->thumbnail);

        return response()->json([
            'success' => true,
            'message' => 'Thêm sản phẩm thành công',
            'data' => $product,
        ], 201);
    }

    // ====================== 🟢 CẬP NHẬT SẢN PHẨM ======================
    public function update(Request $request, $id)
    {
        $product = Product::find($id);

        if (!$product || $product->deleted_at) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy sản phẩm',
            ], 404);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'slug' => 'sometimes|string|max:255|unique:ttmn_product,slug,' . $id,
            'price_root' => 'sometimes|numeric|min:0',
            'price_sale' => 'sometimes|numeric|min:0',
            'description' => 'nullable|string',
            'detail' => 'nullable|string',
            'thumbnail' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'brand_id' => 'sometimes|integer',
            'category_id' => 'sometimes|integer',
            'qty' => 'sometimes|integer|min:0',
            'status' => 'sometimes|boolean',
        ]);

        // ✅ Cập nhật ảnh mới (nếu có)
        if ($request->hasFile('thumbnail')) {
            // Xóa ảnh cũ nếu tồn tại
            if ($product->thumbnail && file_exists(public_path($product->thumbnail))) {
                unlink(public_path($product->thumbnail));
            }

            $file = $request->file('thumbnail');
            $filename = time() . '_' . $file->getClientOriginalName();
            $file->move(public_path('uploads/products'), $filename);
            $validated['thumbnail'] = 'uploads/products/' . $filename;
        }

        $product->update($validated);
        $product->thumbnail = $this->formatThumbnail($product->thumbnail);

        return response()->json([
            'success' => true,
            'message' => 'Cập nhật sản phẩm thành công',
            'data' => $product,
        ]);
    }

    // ====================== 🟢 CẬP NHẬT TRẠNG THÁI ======================
    public function status($id)
    {
        $product = Product::withTrashed()->find($id);

        if (!$product) {
            return response()->json(['success' => false, 'message' => 'Không tìm thấy sản phẩm'], 404);
        }

        $product->status = $product->status == 1 ? 0 : 1;
        $product->save();

        return response()->json([
            'success' => true,
            'message' => 'Cập nhật trạng thái thành công',
            'status' => $product->status,
        ]);
    }

    // ====================== 🟢 XÓA MỀM ======================
    public function destroy($id)
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json(['success' => false, 'message' => 'Không tìm thấy sản phẩm'], 404);
        }

        $product->delete();

        return response()->json(['success' => true, 'message' => 'Xóa sản phẩm thành công']);
    }

    // ====================== 🟢 DANH SÁCH ĐÃ XÓA ======================
    public function trash()
    {
        $products = Product::onlyTrashed()
            ->with(['category:id,name', 'brand:id,name'])
            ->orderBy('id', 'desc')
            ->paginate(5);

        return response()->json([
            'success' => true,
            'data' => $products->items(),
            'pagination' => [
                'current_page' => $products->currentPage(),
                'last_page' => $products->lastPage(),
                'total' => $products->total(),
            ],
        ]);
    }

    // ====================== 🟢 KHÔI PHỤC ======================
    public function restore($id)
    {
        $product = Product::withTrashed()->find($id);

        if (!$product) {
            return response()->json(['success' => false, 'message' => 'Không tìm thấy sản phẩm'], 404);
        }

        $product->restore();

        return response()->json([
            'success' => true,
            'message' => 'Khôi phục sản phẩm thành công',
            'data' => $product,
        ]);
    }

    // ====================== 🟢 XÓA VĨNH VIỄN ======================
    public function forceDelete($id)
    {
        $product = Product::withTrashed()->find($id);

        if (!$product) {
            return response()->json(['success' => false, 'message' => 'Không tìm thấy sản phẩm'], 404);
        }

        if ($product->thumbnail && file_exists(public_path($product->thumbnail))) {
            unlink(public_path($product->thumbnail));
        }

        $product->forceDelete();

        return response()->json(['success' => true, 'message' => 'Đã xóa vĩnh viễn sản phẩm']);
    }

    // ====================== 🟢 LẤY THEO DANH MỤC ======================
    public function getByCategory($categoryId)
    {
        $products = Product::with(['brand:id,name', 'category:id,name'])
            ->where('category_id', $categoryId)
            ->whereNull('deleted_at')
            ->get()
            ->map(function ($product) {
                $product->thumbnail = $this->formatThumbnail($product->thumbnail);
                return $product;
            });

        return response()->json(['success' => true, 'data' => $products]);
    }

    // ====================== 🟢 TÌM KIẾM ======================
    public function search($keyword)
    {
        $products = Product::where('name', 'LIKE', "%$keyword%")
            ->whereNull('deleted_at')
            ->get()
            ->map(function ($product) {
                $product->thumbnail = $this->formatThumbnail($product->thumbnail);
                return $product;
            });

        return response()->json(['success' => true, 'data' => $products]);
    }

    // ====================== 🟢 SẢN PHẨM GIẢM GIÁ ======================
    public function sale()
    {
        $products = Product::whereColumn('price_sale', '<', 'price_root')
            ->whereNotNull('price_sale')
            ->where('price_sale', '>', 0)
            ->where('status', 1)
            ->whereNull('deleted_at')
            ->orderBy('updated_at', 'desc')
            ->take(8)
            ->get()
            ->map(function ($product) {
                $product->thumbnail = $this->formatThumbnail($product->thumbnail);
                return $product;
            });

        return response()->json(['success' => true, 'data' => $products]);
    }

    // ====================== 🟢 SẢN PHẨM MỚI ======================
    public function new()
    {
        $products = Product::where('status', 1)
            ->whereNull('deleted_at')
            ->orderBy('created_at', 'desc')
            ->take(8)
            ->get()
            ->map(function ($product) {
                $product->thumbnail = $this->formatThumbnail($product->thumbnail);
                return $product;
            });

        return response()->json(['success' => true, 'data' => $products]);
    }

    // ====================== 🟢 CẬP NHẬT TỒN KHO ======================
    public function updateStock(Request $request, $id)
    {
        try {
            $product = Product::find($id);
            if (!$product) {
                return response()->json(['success' => false, 'message' => 'Không tìm thấy sản phẩm.'], 404);
            }

            $request->validate(['stock' => 'required|numeric|min:0']);
            $product->qty = $request->input('stock');
            $product->save();

            return response()->json([
                'success' => true,
                'message' => 'Cập nhật tồn kho thành công.',
                'data' => [
                    'id' => $product->id,
                    'name' => $product->name,
                    'qty' => $product->qty,
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Đã xảy ra lỗi khi cập nhật tồn kho.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
