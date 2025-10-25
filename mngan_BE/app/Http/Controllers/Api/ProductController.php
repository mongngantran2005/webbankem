<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    // Lấy tất cả sản phẩm
    public function index()
{
    $products = Product::with(['brand', 'category'])
        ->whereNull('deleted_at')
        ->get()
        ->map(function ($product) {
            $product->thumbnail = $product->thumbnail
                ? url('uploads/products/' . $product->thumbnail)
                : url('images/placeholder.jpg');
            return $product;
        });

    return response()->json([
        'success' => true,
        'data'    => $products
    ]);
}


public function all(Request $request)
{
    $perPage = $request->get('per_page', 5); // mặc định 10 sản phẩm / trang

    $products = Product::with(['brand', 'category'])
        ->whereNull('deleted_at')
        ->paginate($perPage);

    return response()->json([
        'success' => true,
        'data'    => $products->items(),
        'pagination' => [
            'total'        => $products->total(),
            'per_page'     => $products->perPage(),
            'current_page' => $products->currentPage(),
            'last_page'    => $products->lastPage(),
        ],
    ]);
}


    // Lấy chi tiết sản phẩm theo ID
    public function show($id)
    {
        $product = Product::find($id);

        if (!$product || $product->deleted_at) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy sản phẩm'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data'    => $product
        ]);
    }

    public function store(Request $request)
{
    // Ép kiểu status về boolean
    $request->merge([
        'status' => filter_var($request->status, FILTER_VALIDATE_BOOLEAN),
    ]);

    $validated = $request->validate([
        'name'        => 'required|string|max:255',
        'slug'        => 'required|string|max:255|unique:ttmn_product,slug',
        'price_root'  => 'required|numeric|min:0',
        'price_sale'  => 'nullable|numeric|min:0',
        'description' => 'nullable|string',
        'detail'      => 'nullable|string',
        'thumbnail'   => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        'category_id' => 'required|exists:ttmn_category,id',
        'brand_id'    => 'required|exists:ttmn_brand,id',
        'qty'         => 'required|integer|min:0',
        'status'      => 'required|boolean',
    ]);

    // ✅ Tự tạo slug nếu chưa có
    $validated['slug'] = $validated['slug'] ?? \Str::slug($validated['name']);

    // ✅ Upload ảnh
    if ($request->hasFile('thumbnail')) {
        $file = $request->file('thumbnail');
        $filename = time() . '_' . $file->getClientOriginalName();
        $file->move(public_path('uploads/products'), $filename);
        $validated['thumbnail'] = $filename;
    }

    // ✅ Gán người tạo mặc định
    $validated['created_by'] = 1; // hoặc auth()->id() nếu có đăng nhập admin

    $product = Product::create($validated);

    return response()->json([
        'success' => true,
        'message' => 'Thêm sản phẩm thành công',
        'data'    => $product
    ], 201);
}

    // Cập nhật sản phẩm
    public function update(Request $request, $id)
    {
        $product = Product::find($id);

        if (!$product || $product->deleted_at) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy sản phẩm'
            ], 404);
        }

        $validated = $request->validate([
            'name'        => 'sometimes|string|max:255',
            'slug'        => 'sometimes|string|max:255|unique:ttmn_product,slug,' . $id,
            'price_root'  => 'sometimes|numeric|min:0',
            'price_sale'  => 'sometimes|numeric|min:0',
            'description' => 'nullable|string',
            'detail'      => 'nullable|string',
            'thumbnail'   => 'nullable|string',
            'brand_id'    => 'sometimes|integer',
            'category_id' => 'sometimes|integer',
            'qty'         => 'sometimes|integer|min:0',
            'status'      => 'sometimes|boolean'
        ]);

        $product->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Cập nhật sản phẩm thành công',
            'data'    => $product
        ]);
    }

// 🟢 Cập nhật trạng thái hiển thị sản phẩm
public function status($id)
{
    $product = Product::withTrashed()->find($id);

    if (!$product) {
        return response()->json([
            'success' => false,
            'message' => 'Không tìm thấy sản phẩm',
        ], 404);
    }

    // Đảo trạng thái 1 ↔ 0
    $product->status = $product->status == 1 ? 0 : 1;
    $product->save();

    return response()->json([
        'success' => true,
        'message' => 'Cập nhật trạng thái thành công',
        'status' => $product->status,
    ]);
}


    // Xóa mềm sản phẩm
    public function destroy($id)
{
    $product = Product::find($id);

    if (!$product) {
        return response()->json([
            'success' => false,
            'message' => 'Không tìm thấy sản phẩm'
        ], 404);
    }

    $product->delete();

    return response()->json([
        'success' => true,
        'message' => 'Xóa sản phẩm thành công'
    ]);
}

// Lấy danh sách sản phẩm đã xóa mềm (có quan hệ danh mục & thương hiệu)
public function trash()
{
    $products = Product::onlyTrashed()
        ->with(['category:id,name', 'brand:id,name'])
        ->orderBy('id', 'desc')
        ->paginate(5); // nếu muốn có phân trang

    return response()->json([
        'success' => true,
        'data' => $products->items(),
        'pagination' => [
            'current_page' => $products->currentPage(),
            'last_page' => $products->lastPage(),
            'total' => $products->total(),
        ]
    ]);
}

    // Khôi phục sản phẩm đã xóa mềm
    public function restore($id)
    {
        $product = Product::withTrashed()->find($id);

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy sản phẩm'
            ], 404);
        }

        $product->restore();

        return response()->json([
            'success' => true,
            'message' => 'Khôi phục sản phẩm thành công',
            'data'    => $product
        ]);
    }

// Xóa vĩnh viễn sản phẩm (chỉ áp dụng với soft delete)
public function forceDelete($id)
{
    $product = Product::withTrashed()->find($id);

    if (!$product) {
        return response()->json([
            'success' => false,
            'message' => 'Không tìm thấy sản phẩm'
        ], 404);
    }

    // Xóa file ảnh (nếu có)
    if ($product->image && file_exists(public_path('images/products/' . $product->image))) {
        unlink(public_path('images/products/' . $product->image));
    }

    $product->forceDelete();

    return response()->json([
        'success' => true,
        'message' => 'Đã xóa vĩnh viễn sản phẩm'
    ]);
}


    // ✅ Lấy sản phẩm theo category_id
    public function getByCategory($categoryId)
{
    $products = Product::with(['brand:id,name', 'category:id,name'])
        ->where('category_id', $categoryId)
        ->whereNull('deleted_at')
        ->get()
        ->map(function ($product) {
            $product->thumbnail = $product->thumbnail
                ? url('uploads/products/' . ltrim($product->thumbnail, '/'))
                : url('images/placeholder.jpg');
            return $product;
        });

    return response()->json([
        'success' => true,
        'data'    => $products
    ]);
}

    // Search Sản Phẩm
    public function search($keyword)
    {
    $products = Product::where('name', 'LIKE', "%$keyword%")
        ->whereNull('deleted_at')
        ->get();

    return response()->json([
        'success' => true,
        'data' => $products
        ]);
    }

     // ✅ Sản phẩm giảm giá
    // ✅ Sản phẩm giảm giá
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
                $product->thumbnail = $product->thumbnail
                    ? url('uploads/products/' . ltrim($product->thumbnail, '/'))
                    : url('images/placeholder.jpg');
                return $product;
            });

        return response()->json([
            'success' => true,
            'data' => $products,
        ]);
    }

    // ✅ Sản phẩm mới
    public function new()
    {
        $products = Product::where('status', 1)
            ->whereNull('deleted_at')
            ->orderBy('created_at', 'desc')
            ->take(8)
            ->get()
            ->map(function ($product) {
                $product->thumbnail = $product->thumbnail
                    ? url('uploads/products/' . ltrim($product->thumbnail, '/'))
                    : url('images/placeholder.jpg');
                return $product;
            });

        return response()->json([
            'success' => true,
            'data' => $products,
        ]);
    }

    // Cập nhật tồn kho // ADMIN
    public function updateStock(Request $request, $id)
{
    try {
        // 🔍 1. Kiểm tra sản phẩm có tồn tại không
        $product = Product::find($id);
        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy sản phẩm.'
            ], 404);
        }

        // ✅ 2. Validate đầu vào
        $request->validate([
            'stock' => 'required|numeric|min:0',
        ], [
            'stock.required' => 'Vui lòng nhập số lượng.',
            'stock.numeric' => 'Số lượng phải là số.',
            'stock.min' => 'Số lượng không được âm.',
        ]);

        // 🧮 3. Cập nhật tồn kho
        $product->qty = $request->input('stock');
        $product->save();

        // 🚀 4. Trả về kết quả thành công
        return response()->json([
            'success' => true,
            'message' => 'Cập nhật tồn kho thành công.',
            'data' => [
                'id' => $product->id,
                'name' => $product->name,
                'qty' => $product->qty,
            ],
        ], 200);

    } catch (\Exception $e) {
        // ⚠️ 5. Xử lý lỗi bất ngờ
        return response()->json([
            'success' => false,
            'message' => 'Đã xảy ra lỗi khi cập nhật tồn kho.',
            'error' => $e->getMessage(),
        ], 500);
    }
}





}