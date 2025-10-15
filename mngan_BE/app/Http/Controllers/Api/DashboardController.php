<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use App\Models\Order;

class DashboardController extends Controller
{
    /**
     * 📊 Lấy doanh thu theo tháng trong năm hiện tại
     */
    public function monthlyRevenue()
    {
        $data = DB::table('ttmn_order')
            ->join('ttmn_orderdetail', 'ttmn_order.id', '=', 'ttmn_orderdetail.order_id')
            ->select(
                DB::raw('MONTH(ttmn_order.created_at) as month'),
                DB::raw('SUM(ttmn_orderdetail.amount) as total_revenue')
            )
            ->where('ttmn_order.status', 3)
            ->whereYear('ttmn_order.created_at', date('Y'))
            ->groupBy(DB::raw('MONTH(ttmn_order.created_at)'))
            ->orderBy(DB::raw('MONTH(ttmn_order.created_at)'))
            ->get();

        return response()->json([
            'success' => true,
            'data' => $data
        ]);
    }

    /**
     * 📈 Lấy dữ liệu tổng quan cho 3 ô thống kê
     */
    public function summary()
    {
        // ✅ Tổng doanh thu (chỉ tính đơn hoàn thành)
        $totalRevenue = DB::table('ttmn_orderdetail')
            ->join('ttmn_order', 'ttmn_order.id', '=', 'ttmn_orderdetail.order_id')
            ->where('ttmn_order.status', 3)
            ->sum('ttmn_orderdetail.amount');

        // ✅ Tổng khách hàng
        $totalCustomers = User::count();

        // ✅ Doanh thu trung bình trên mỗi đơn hàng (dựa theo amount)
        $avgRevenue = DB::table('ttmn_orderdetail')
            ->join('ttmn_order', 'ttmn_order.id', '=', 'ttmn_orderdetail.order_id')
            ->where('ttmn_order.status', 3)
            ->avg('ttmn_orderdetail.amount');

        // ✅ Tính % tăng trưởng so với tháng trước
        $currentMonthRevenue = DB::table('ttmn_orderdetail')
            ->join('ttmn_order', 'ttmn_order.id', '=', 'ttmn_orderdetail.order_id')
            ->where('ttmn_order.status', 3)
            ->whereMonth('ttmn_order.created_at', now()->month)
            ->sum('ttmn_orderdetail.amount');

        $lastMonthRevenue = DB::table('ttmn_orderdetail')
            ->join('ttmn_order', 'ttmn_order.id', '=', 'ttmn_orderdetail.order_id')
            ->where('ttmn_order.status', 3)
            ->whereMonth('ttmn_order.created_at', now()->subMonth()->month)
            ->sum('ttmn_orderdetail.amount');

        $percentChange = $lastMonthRevenue > 0
            ? (($currentMonthRevenue - $lastMonthRevenue) / $lastMonthRevenue) * 100
            : 0;

        return response()->json([
            'success' => true,
            'data' => [
                'totalRevenue' => $totalRevenue,
                'totalCustomers' => $totalCustomers,
                'avgRevenue' => round($avgRevenue, 2),
                'percentChange' => round($percentChange, 2),
            ]
        ]);
    }
}
