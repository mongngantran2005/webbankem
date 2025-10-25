<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ReviewReply;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ProductReviewReplyController extends Controller
{
    /**
     * ✅ Admin trả lời một đánh giá
     */
    public function store(Request $request, $review_id)
    {
        try {
            // ✅ Xác thực dữ liệu đầu vào
            $request->validate([
                'user_id' => 'required|exists:ttmn_user,id',
                'content' => 'required|string|max:1000',
            ]);

            // ✅ Tạo phản hồi mới
            $reply = ReviewReply::create([
                'review_id' => $review_id,
                'user_id'   => $request->user_id,
                'content'   => $request->content,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Trả lời đánh giá thành công!',
                'reply'   => $reply,
            ]);
        } catch (\Exception $e) {
            Log::error('❌ Lỗi khi trả lời đánh giá: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Đã xảy ra lỗi khi trả lời đánh giá.',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }
}
