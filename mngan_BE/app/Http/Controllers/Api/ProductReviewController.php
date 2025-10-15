<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ProductReview;
use App\Models\Product;
use App\Models\OrderDetail;
use App\Models\ProductReviewImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProductReviewController extends Controller
{
    /**
     * ✅ Lấy danh sách đánh giá của 1 sản phẩm
     */
    public function index($productId)
    {
        $product = Product::find($productId);

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Sản phẩm không tồn tại.',
            ], 404);
        }

        $reviews = ProductReview::with(['user:id,name', 'images'])
    ->where('product_id', $productId)
    ->orderByDesc('created_at')
    ->get();


        return response()->json([
            'success' => true,
            'reviews' => $reviews,
        ]);
    }

    /**
     * ✅ Gửi đánh giá mới cho sản phẩm
     */


    public function store(Request $request, $productId)
{
    $product = Product::find($productId);

    if (!$product) {
        return response()->json([
            'success' => false,
            'message' => 'Sản phẩm không tồn tại.',
        ], 404);
    }

    $request->validate([
        'rating'  => 'required|integer|min:1|max:5',
        'comment' => 'nullable|string|max:1000',
        'user_id' => 'nullable|integer',
    ]);

    $userId = $request->user_id ?? Auth::id();

    if (!$userId) {
        return response()->json([
            'success' => false,
            'message' => 'Không xác định được người dùng.',
        ], 401);
    }

    // ✅ Lấy đơn hàng hoàn thành chứa sản phẩm này
    $orderDetail = OrderDetail::where('product_id', $productId)
        ->whereHas('order', function ($query) use ($userId) {
            $query->where('user_id', $userId)
                  ->where('status', 3); // 3 = Hoàn thành
        })
        ->latest('id')
        ->first();

    if (!$orderDetail || !$orderDetail->order_id) {
    return response()->json([
        'success' => false,
        'message' => 'Bạn chỉ có thể đánh giá sản phẩm sau khi đơn hàng đã hoàn thành.',
    ], 403);
}


    // ✅ Kiểm tra xem user đã đánh giá sản phẩm này trong đơn hàng này chưa
    $existing = ProductReview::where('product_id', $productId)
        ->where('user_id', $userId)
        ->where('order_id', $orderDetail->order_id)
        ->first();

    if ($existing) {
        return response()->json([
            'success' => false,
            'message' => 'Bạn đã đánh giá sản phẩm này trong đơn hàng này rồi!',
        ], 400);
    }

    // ✅ Tạo mới đánh giá
    $review = ProductReview::create([
        'product_id' => $productId,
        'user_id'    => $userId,
        'order_id'   => $orderDetail->order_id,
        'rating'     => $request->rating,
        'comment'    => $request->comment,
    ]);

    return response()->json([
        'success' => true,
        'message' => 'Đánh giá thành công!',
        'review'  => $review->load('user:id,name'),
    ], 201);
}

public function uploadImages(Request $request, $reviewId)
{
    $review = ProductReview::find($reviewId);

    if (!$review) {
        return response()->json(['success' => false, 'message' => 'Không tìm thấy đánh giá.'], 404);
    }

    $existingCount = $review->images()->count();

    $request->validate([
        'images' => 'required|array|min:1|max:5',
        'images.*' => 'image|mimes:jpg,jpeg,png|max:2048',
    ]);

    if ($existingCount + count($request->file('images', [])) > 5) {
        return response()->json([
            'success' => false,
            'message' => 'Mỗi đánh giá chỉ được tải lên tối đa 5 ảnh!',
        ], 400);
    }

    $uploadedImages = [];

    foreach ($request->file('images') as $file) {
        $fileName = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
        $file->move(public_path('uploads/reviews'), $fileName);

        $image = $review->images()->create([
            'image' => 'uploads/reviews/' . $fileName,
        ]);

        $uploadedImages[] = $image;
    }

    return response()->json([
        'success' => true,
        'message' => 'Tải ảnh thành công!',
        'images' => $uploadedImages,
    ]);
}


}
