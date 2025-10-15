<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\OrderDetail;
use App\Models\Product;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class OrderController extends Controller
{
    /**
     * ✅ Admin lấy toàn bộ đơn hàng
     */
    public function all()
    {
        try {
            $orders = Order::with(['orderDetails.product', 'user'])
                ->orderBy('id', 'desc')
                ->get()
                ->map(function ($order) {
                    return [
                        'id'           => $order->id,
                        'status'       => $order->status,
                        'created_at'   => $order->created_at,
                        'phone'        => $order->phone,
                        'address'      => $order->address,
                        'note'         => $order->note,
                        'user'         => $order->user,
                        'order_details'=> $order->orderDetails,
                    ];
                });

            return response()->json([
                'success' => true,
                'message' => 'Lấy danh sách tất cả đơn hàng thành công!',
                'orders'  => $orders,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi lấy đơn hàng: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * ✅ Người dùng đặt hàng (có đăng nhập)
     */
    public function store(Request $request)
    {
        $user = auth('sanctum')->user();

        if (!$user) {
            return response()->json(['success' => false, 'message' => 'Bạn cần đăng nhập.'], 401);
        }

        $validated = $request->validate([
            'name'    => 'required|string',
            'phone'   => 'required|string',
            'email'   => 'nullable|email',
            'address' => 'required|string',
            'note'    => 'nullable|string',
            'cart'    => 'required|array|min:1',
        ]);

        try {
            DB::beginTransaction();

            $order = Order::create([
                'user_id' => $user->id,
                'name'    => $validated['name'],
                'phone'   => $validated['phone'],
                'email'   => $validated['email'] ?? null,
                'address' => $validated['address'],
                'note'    => $validated['note'] ?? null,
                'status'  => 'pending',
            ]);

            foreach ($validated['cart'] as $item) {
                OrderDetail::create([
                    'order_id'   => $order->id,
                    'product_id' => $item['id'],
                    'qty'        => $item['qty'],
                    'price'      => $item['price_sale'] ?? $item['price_root'],
                ]);
            }

            DB::commit();

            return response()->json([
                'success'  => true,
                'message'  => 'Đặt hàng thành công!',
                'order_id' => $order->id,
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Lỗi: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * ✅ Người dùng lấy danh sách đơn hàng của chính mình
     */
    public function index()
    {
        $user = auth('sanctum')->user();

        if (!$user) {
            return response()->json(['success' => false, 'message' => 'Bạn cần đăng nhập.'], 401);
        }

        $orders = Order::with('orderDetails.product')
            ->where('user_id', $user->id)
            ->orderBy('id', 'desc')
            ->get();

        return response()->json(['success' => true, 'orders' => $orders]);
    }

    /**
     * ✅ Checkout cho khách hoặc user không login
     */
    public function checkout(Request $request)
    {
        try {
            if (
                !$request->user_id ||
                !$request->items ||
                !is_array($request->items) ||
                count($request->items) == 0
            ) {
                return response()->json([
                    'success' => false,
                    'message' => 'Thiếu dữ liệu đơn hàng hoặc giỏ hàng trống!',
                ], 400);
            }

            $user = User::find($request->user_id);
            $invalidItems = [];

            foreach ($request->items as $item) {
                $product = Product::find($item['id']);

                if (!$product) {
                    $invalidItems[] = ['id' => $item['id'], 'name' => 'Sản phẩm không tồn tại'];
                    continue;
                }

                if ($item['qty'] > $product->qty) {
                    $invalidItems[] = [
                        'id' => $product->id,
                        'name' => $product->name,
                        'stock' => $product->qty,
                        'requested' => $item['qty'],
                    ];
                }
            }

            if (count($invalidItems) > 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'Một số sản phẩm vượt quá số lượng tồn kho!',
                    'invalid_items' => $invalidItems,
                ], 400);
            }

            $order = Order::create([
                'user_id' => $request->user_id,
                'name'    => $user->name ?? $request->name ?? 'Khách hàng',
                'email'   => $user->email ?? $request->email ?? '',
                'address' => $request->address,
                'phone'   => $request->phone,
                'note'    => $request->note ?? '',
                'status'  => 0,
            ]);

            foreach ($request->items as $item) {
                $product = Product::find($item['id']);
                $product->qty -= $item['qty'];
                $product->save();

                OrderDetail::create([
                    'order_id'   => $order->id,
                    'product_id' => $item['id'],
                    'price_buy'  => $item['price_sale'] ?? $item['price_root'] ?? 0,
                    'amount'     => ($item['price_sale'] ?? $item['price_root'] ?? 0) * ($item['qty'] ?? 1),
                    'qty'        => $item['qty'] ?? 1,
                ]);
            }

            return response()->json([
                'success'  => true,
                'message'  => 'Đặt hàng thành công!',
                'order_id' => $order->id,
            ], 201);
        } catch (\Exception $e) {
            Log::error("Checkout Error: " . $e->getMessage(), [
                'file'  => $e->getFile(),
                'line'  => $e->getLine(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Lỗi hệ thống: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * ✅ Hiển thị chi tiết đơn hàng theo ID
     */
    public function show($id)
    {
        try {
            $order = Order::with(['orderDetails.product', 'user'])->find($id);

            if (!$order) {
                return response()->json([
                    'success' => false,
                    'message' => 'Không tìm thấy đơn hàng.',
                ], 404);
            }

            foreach ($order->orderDetails as $detail) {
                if ($detail->product) {
                    $detail->product->image_url = $detail->product->image
                        ? asset('uploads/products/' . $detail->product->image)
                        : asset('images/placeholder.jpg');
                }
            }

            return response()->json(['success' => true, 'order' => $order]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi lấy chi tiết đơn hàng: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * ✅ Admin xem đơn hàng của 1 user cụ thể
     */
    public function getOrdersByUser($userId)
    {
        try {
            $user = User::find($userId);
            if (!$user) {
                return response()->json(['success' => false, 'message' => 'Không tìm thấy người dùng.'], 404);
            }

            $orders = Order::with('orderDetails.product')
                ->where('user_id', $userId)
                ->orderBy('id', 'desc')
                ->get();

            foreach ($orders as $order) {
                $order->total = $order->orderDetails->sum('amount');
            }

            return response()->json([
                'success' => true,
                'user'    => $user,
                'orders'  => $orders,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi: ' . $e->getMessage(),
            ], 500);
        }
    }
   // Cập nhật trạng thái đơn hàng 
public function updateStatus(Request $request, $id)
{
    $order = Order::find($id);
    if (!$order) {
        return response()->json(['success' => false, 'message' => 'Không tìm thấy đơn hàng.']);
    }

    $status = (int) $request->input('status');

    // ✅ Cho phép 5 trạng thái
    $validStatuses = [0, 1, 2, 3, 4];

    if (!in_array($status, $validStatuses)) {
        return response()->json(['success' => false, 'message' => 'Trạng thái không hợp lệ.']);
    }

    $order->status = $status;
    $order->save();

    return response()->json(['success' => true, 'message' => 'Cập nhật trạng thái thành công!']);
}



 public function getCompletedOrders($userId)
    {
        $orders = Order::where('user_id', $userId)
            ->where('status', 3) // 3 = Hoàn thành
            ->with('orderDetails.product:id,name') // nếu muốn trả kèm sản phẩm
            ->orderByDesc('id')
            ->get();

        if ($orders->isEmpty()) {
            return response()->json([
                'success' => true,
                'orders' => [],
                'message' => 'Người dùng chưa có đơn hàng hoàn thành nào.'
            ]);
        }

        return response()->json([
            'success' => true,
            'orders' => $orders
        ]);
    }

    public function monthlyRevenue()
{
    $data = DB::table('ttmn_order')
        ->join('ttmn_orderdetail', 'ttmn_order.id', '=', 'ttmn_orderdetail.order_id')
        ->select(
            DB::raw('MONTH(ttmn_order.created_at) as month'),
            DB::raw('SUM(ttmn_orderdetail.amount) as total_revenue')
        )
        ->whereYear('ttmn_order.created_at', date('Y'))
        ->groupBy(DB::raw('MONTH(ttmn_order.created_at)'))
        ->orderBy(DB::raw('MONTH(ttmn_order.created_at)'))
        ->get();

    return response()->json([
        'success' => true,
        'data' => $data
    ]);
}

}
