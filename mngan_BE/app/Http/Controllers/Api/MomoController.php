<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;

class MomoController extends Controller
{
    public function paymentMoMo(Request $request)
{
    $endpoint = "https://test-payment.momo.vn/v2/gateway/api/create";

    $partnerCode = "MOMOBKUN20180529";
    $accessKey   = "klm05TvNBzhg7h7j";
    $secretKey   = "at67qH6mk8w5Y1nAyMoYKMWACiEi2bsa";

    // 🔥 đảm bảo orderId luôn có hậu tố ngẫu nhiên
    $orderId     = $request->orderId ?? ('ORDER_' . time());
    $orderInfo   = $request->orderInfo ?? "Thanh toán đơn hàng";
    $amount      = $request->amount;
    $redirectUrl = $request->redirectUrl ?? "http://localhost:5173/payment-result";
    $ipnUrl      = "http://127.0.0.1:8000/api/payment/momo/ipn";

    $requestId = time() . rand(1000,9999);
    $requestType = "captureWallet";
    $extraData = "";

    $rawHash = "accessKey=".$accessKey."&amount=".$amount."&extraData=".$extraData
        ."&ipnUrl=".$ipnUrl."&orderId=".$orderId."&orderInfo=".$orderInfo
        ."&partnerCode=".$partnerCode."&redirectUrl=".$redirectUrl
        ."&requestId=".$requestId."&requestType=".$requestType;

    $signature = hash_hmac("sha256", $rawHash, $secretKey);

    $data = [
        "partnerCode" => $partnerCode,
        "partnerName" => "MoMo Test",
        "storeId" => "MomoDemo",
        "requestId" => $requestId,
        "amount" => $amount,
        "orderId" => $orderId,
        "orderInfo" => $orderInfo,
        "redirectUrl" => $redirectUrl,
        "ipnUrl" => $ipnUrl,
        "lang" => "vi",
        "extraData" => $extraData,
        "requestType" => $requestType,
        "signature" => $signature
    ];

    Log::info('MoMo request data:', $data);

    $ch = curl_init($endpoint);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ["Content-Type: application/json"]);
    $result = curl_exec($ch);
    curl_close($ch);

    $jsonResult = json_decode($result, true);
    Log::info('MoMo response:', $jsonResult);

    return response()->json($jsonResult);
}




    public function notify(Request $request)
    {
        // Callback từ MoMo gửi về sau khi thanh toán
        \Log::info('MoMo notify:', $request->all());
        return response()->json(['message' => 'OK'], 200);
    }
}
