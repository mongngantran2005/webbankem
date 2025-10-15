<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CartController extends Controller
{
    // Lấy toàn bộ giỏ hàng
    public function index()
    {
        try {
            $cartItems = CartItem::with(['product' => function($query) {
                $query->select('id', 'name', 'thumbnail', 'price_root', 'price_sale', 'qty', 'brand_id')
                      ->with('brand:id,name');
            }])
            ->where('user_id', Auth::id())
            ->get();

            return response()->json([
                'success' => true,
                'data' => $cartItems,
                'message' => 'Lấy giỏ hàng thành công'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi server: ' . $e->getMessage()
            ], 500);
        }
    }

    // Thêm sản phẩm vào giỏ hàng
    public function store(Request $request)
    {
        try {
            $request->validate([
                'product_id' => 'required|exists:products,id',
                'quantity' => 'required|integer|min:1|max:10'
            ]);

            $product = Product::findOrFail($request->product_id);

            // Kiểm tra tồn kho
            if ($product->qty < $request->quantity) {
                return response()->json([
                    'success' => false,
                    'message' => 'Số lượng sản phẩm trong kho không đủ. Chỉ còn ' . $product->qty . ' sản phẩm'
                ], 400);
            }

            // Kiểm tra đã có trong giỏ hàng chưa
            $existingCartItem = CartItem::where('user_id', Auth::id())
                ->where('product_id', $request->product_id)
                ->first();

            if ($existingCartItem) {
                $newQuantity = $existingCartItem->quantity + $request->quantity;
                
                // Kiểm tra tồn kho với số lượng mới
                if ($product->qty < $newQuantity) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Số lượng vượt quá tồn kho. Tối đa: ' . ($product->qty - $existingCartItem->quantity)
                    ], 400);
                }

                $existingCartItem->update([
                    'quantity' => $newQuantity
                ]);

                $cartItem = $existingCartItem;
            } else {
                $cartItem = CartItem::create([
                    'user_id' => Auth::id(),
                    'product_id' => $request->product_id,
                    'quantity' => $request->quantity
                ]);
            }

            $cartItem->load(['product' => function($query) {
                $query->select('id', 'name', 'thumbnail', 'price_root', 'price_sale', 'qty', 'brand_id')
                      ->with('brand:id,name');
            }]);

            return response()->json([
                'success' => true,
                'data' => $cartItem,
                'message' => 'Đã thêm vào giỏ hàng'
            ], 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Dữ liệu không hợp lệ',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi server: ' . $e->getMessage()
            ], 500);
        }
    }

    // Cập nhật số lượng
    public function update(Request $request, $id)
    {
        try {
            $request->validate([
                'quantity' => 'required|integer|min:1|max:10'
            ]);

            $cartItem = CartItem::where('user_id', Auth::id())
                ->where('id', $id)
                ->firstOrFail();

            $product = $cartItem->product;

            // Kiểm tra tồn kho
            if ($product->qty < $request->quantity) {
                return response()->json([
                    'success' => false,
                    'message' => 'Số lượng sản phẩm trong kho không đủ. Chỉ còn ' . $product->qty . ' sản phẩm'
                ], 400);
            }

            $cartItem->update([
                'quantity' => $request->quantity
            ]);

            $cartItem->load(['product' => function($query) {
                $query->select('id', 'name', 'thumbnail', 'price_root', 'price_sale', 'qty', 'brand_id')
                      ->with('brand:id,name');
            }]);

            return response()->json([
                'success' => true,
                'data' => $cartItem,
                'message' => 'Đã cập nhật số lượng'
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Dữ liệu không hợp lệ',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi server: ' . $e->getMessage()
            ], 500);
        }
    }

    // Xóa sản phẩm khỏi giỏ hàng
    public function destroy($id)
    {
        try {
            $cartItem = CartItem::where('user_id', Auth::id())
                ->where('id', $id)
                ->firstOrFail();

            $cartItem->delete();

            return response()->json([
                'success' => true,
                'message' => 'Đã xóa sản phẩm khỏi giỏ hàng'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi server: ' . $e->getMessage()
            ], 500);
        }
    }

    // Xóa toàn bộ giỏ hàng
    public function clear()
    {
        try {
            CartItem::where('user_id', Auth::id())->delete();

            return response()->json([
                'success' => true,
                'message' => 'Đã xóa toàn bộ giỏ hàng'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi server: ' . $e->getMessage()
            ], 500);
        }
    }

    // Lấy tổng số lượng sản phẩm trong giỏ
    public function getCount()
    {
        try {
            $count = CartItem::where('user_id', Auth::id())->sum('quantity');

            return response()->json([
                'success' => true,
                'data' => $count,
                'message' => 'Lấy số lượng giỏ hàng thành công'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi server: ' . $e->getMessage()
            ], 500);
        }
    }
}