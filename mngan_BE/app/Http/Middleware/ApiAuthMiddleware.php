<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ApiAuthMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        if (!Auth::check()) {
            return response()->json([
                'success' => false,
                'message' => 'Token không hợp lệ hoặc người dùng chưa đăng nhập.',
            ], 401);
        }

        return $next($request);
    }
}
