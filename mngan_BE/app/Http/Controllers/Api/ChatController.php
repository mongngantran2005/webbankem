<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;
use Illuminate\Support\Facades\Cache;
use OpenAI\Laravel\Facades\OpenAI;
use OpenAI\Exceptions\RateLimitException;

class ChatController extends Controller
{
    public function chat(Request $request)
    {
        $question = trim($request->input('message', ''));

        if (empty($question)) {
            return response()->json([
                'reply' => 'Vui lòng nhập câu hỏi về sản phẩm kem nhé 🍦',
            ]);
        }

        // ✅ Cache câu trả lời trong 5 phút để giảm gọi API
        $cacheKey = 'chat_reply_' . md5($question);
        if (Cache::has($cacheKey)) {
            return response()->json([
                'reply' => Cache::get($cacheKey),
            ]);
        }

        // ✅ Lấy dữ liệu sản phẩm từ DB
        $products = Product::where('status', 1)
            ->select('name', 'price_root', 'price_sale', 'description')
            ->take(10)
            ->get();

        // ✅ Ghép context gửi cho AI
        $context = "Dưới đây là danh sách sản phẩm kem trong cửa hàng:\n";
        foreach ($products as $p) {
            $context .= "- {$p->name}: giá gốc {$p->price_root} VND, giá khuyến mãi {$p->price_sale} VND. Mô tả: {$p->description}\n";
        }

        try {
            // ✅ Gọi API OpenAI
            $result = OpenAI::chat()->create([
                'model' => 'gpt-4o-mini',
                'messages' => [
                    [
                        'role' => 'system',
                        'content' => 'Bạn là nhân viên tư vấn bán kem chuyên nghiệp. Hãy trả lời ngắn gọn, thân thiện và dễ hiểu.',
                    ],
                    ['role' => 'user', 'content' => $context],
                    ['role' => 'user', 'content' => "Khách hỏi: $question"],
                ],
            ]);

            $reply = $result->choices[0]->message->content ?? 'Xin lỗi, tôi chưa rõ ý bạn.';

            // ✅ Lưu cache kết quả
            Cache::put($cacheKey, $reply, now()->addMinutes(5));

            return response()->json(['reply' => $reply]);
        } 
        catch (RateLimitException $e) {
            return response()->json([
                'reply' => '⏳ Hệ thống đang quá tải, vui lòng thử lại sau 1 phút nhé 🍧',
            ], 429);
        } 
        catch (\Exception $e) {
            \Log::error('Chat Error: ' . $e->getMessage());
            return response()->json([
                'reply' => '⚠️ Xin lỗi, hệ thống đang bận. Vui lòng thử lại sau ít phút.',
            ], 500);
        }
    }
}
