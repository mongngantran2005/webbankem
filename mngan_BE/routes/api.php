<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BrandController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\ProductReviewController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\DiscountController;
use App\Http\Controllers\Api\UserDiscountController;
use App\Http\Controllers\Api\ProductReviewReplyController;
use Illuminate\Http\Request;

Route::post('/checkout', [OrderController::class, 'checkout']);

/*
|--------------------------------------------------------------------------
| AUTH ROUTES
|--------------------------------------------------------------------------
| Đăng ký, đăng nhập, đăng xuất, lấy danh sách user
*/
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/users', [AuthController::class, 'index']);

/*
|--------------------------------------------------------------------------
| PRODUCT ROUTES
|--------------------------------------------------------------------------
| API quản lý sản phẩm
*/

Route::prefix('products')->group(function () {
    // =============== USER ROUTES ===============
    Route::get('/', [ProductController::class, 'index']);
    Route::get('/{id}', [ProductController::class, 'show']);
    Route::get('/category/{id}', [ProductController::class, 'getByCategory']);
    Route::get('/search/{keyword}', [ProductController::class, 'search']);
    Route::get('/sale', [ProductController::class, 'sale']);
    Route::get('/new', [ProductController::class, 'new']);

    // =============== ADMIN ROUTES ===============
    Route::prefix('admin')->group(function () {
        Route::get('/all', [ProductController::class, 'all']);
        Route::get('/trash', [ProductController::class, 'trash']);
        Route::get('/dropdown', [ProductController::class, 'dropdown']);
        Route::post('/', [ProductController::class, 'store']);
        Route::put('/{id}', [ProductController::class, 'update']);
        Route::patch('/{id}/status', [ProductController::class, 'status']);
        Route::delete('/{id}', [ProductController::class, 'destroy']);
        Route::patch('/{id}/restore', [ProductController::class, 'restore']);
        Route::delete('/{id}/force', [ProductController::class, 'forceDelete']); // ✅ CHỈ DÒNG NÀY
    });
});



/*
|--------------------------------------------------------------------------
| CATEGORY ROUTES
|--------------------------------------------------------------------------
| API danh mục + thương hiệu theo danh mục
*/

Route::prefix('categories')->group(function () {
    // ==================== USER ROUTES ====================
    Route::get('/', [CategoryController::class, 'index']);
    Route::get('/{id}', [CategoryController::class, 'show']);
    Route::get('/{id}/brands', [CategoryController::class, 'getBrandsByCategory']);

    // ==================== ADMIN ROUTES ====================
    Route::prefix('admin')->group(function () {
        Route::get('/all', [CategoryController::class, 'adminIndex']);
        Route::get('/dropdown', [CategoryController::class, 'getAllForDropdown']);
        Route::get('/trash', [CategoryController::class, 'trash']);
        Route::post('/', [CategoryController::class, 'store']);
        Route::put('/{id}', [CategoryController::class, 'update']);
        Route::delete('/{id}', [CategoryController::class, 'destroy']);
        Route::patch('/{id}/status', [CategoryController::class, 'status']); // ✅ toggle status
        Route::patch('/{id}/restore', [CategoryController::class, 'restore']);
        Route::delete('/{id}/force', [CategoryController::class, 'forceDestroy']);
    });
});
/*
|--------------------------------------------------------------------------
| BRAND ROUTES
|--------------------------------------------------------------------------
| API thương hiệu
*/
Route::prefix('brands')->group(function () {
    // ==================== USER ROUTES ====================
    Route::get('/', [BrandController::class, 'index']);                // Danh sách thương hiệu
    Route::get('/{id}', [BrandController::class, 'show']);             // Chi tiết thương hiệu
    Route::get('/category/{id}', [BrandController::class, 'getByCategory']); // ✅ Lấy thương hiệu theo danh mục

    // ==================== ADMIN ROUTES ====================
    Route::prefix('admin')->group(function () {
        Route::get('/all', [BrandController::class, 'adminIndex']);    // Toàn bộ brand kể cả ẩn
        Route::get('/dropdown', [BrandController::class, 'dropdown']); // Dành cho select box khi thêm sản phẩm
        Route::get('/trash', [BrandController::class, 'trash']);       // Thương hiệu trong thùng rác
        Route::post('/', [BrandController::class, 'store']);           // Tạo mới
        Route::put('/{id}', [BrandController::class, 'update']);       // Cập nhật
        Route::patch('/{id}/status', [BrandController::class, 'status']); // Ẩn / Hiện
        Route::delete('/{id}', [BrandController::class, 'destroy']);   // Xóa mềm
        Route::patch('/{id}/restore', [BrandController::class, 'restore']); // Khôi phục
        Route::delete('/{id}/force', [BrandController::class, 'forceDelete']); // Xóa vĩnh viễn
    });
});


/*
|--------------------------------------------------------------------------
| CART ROUTES (Yêu cầu đăng nhập Sanctum)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {
    Route::prefix('cart')->group(function () {
        Route::get('/', [CartController::class, 'index']);            // Xem giỏ hàng
        Route::post('/add', [CartController::class, 'store']);        // Thêm vào giỏ
        Route::put('/update/{id}', [CartController::class, 'update']); // Cập nhật sản phẩm trong giỏ
        Route::delete('/remove/{id}', [CartController::class, 'destroy']); // Xóa sản phẩm khỏi giỏ
        Route::delete('/clear', [CartController::class, 'clear']);    // Xóa toàn bộ giỏ
        Route::get('/count', [CartController::class, 'getCount']);    // Lấy tổng số lượng sản phẩm trong giỏ
    });

    Route::post('/logout', [AuthController::class, 'logout']);        // Đăng xuất
});


// ✅ Tất cả thao tác với đơn hàng đều yêu cầu đăng nhập
// Route::middleware('auth:sanctum')->group(function () {
//     // 🧾 Tạo đơn hàng
//     Route::post('/orders', [OrderController::class, 'store']);
//     Route::get('/orders', [OrderController::class, 'index']);
//     Route::get('/orders/user/{userId}', [OrderController::class, 'getOrdersByUser']);
//     Route::get('/orders/{id}/details', [OrderController::class, 'details']);
//});

Route::get('/orders', [OrderController::class, 'index']);
Route::get('/orders/user/{userId}', [OrderController::class, 'getOrdersByUser']);
Route::get('/orders/{id}/details', [OrderController::class, 'details']);
Route::post('/orders', [OrderController::class, 'store']);
Route::get('/orders/{id}', [OrderController::class, 'show']);
Route::put('/orders/{id}/status', [OrderController::class, 'updateStatus']);



// Order
Route::prefix('orders/admin')->group(function () {
    Route::get('/all', [OrderController::class, 'all']); // ✅ Lấy toàn bộ đơn hàng
});


// ✅ Route danh sách người dùng (cho admin)

    Route::get('/users', [UserController::class, 'index']);

// User

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user/profile', [UserController::class, 'profile']);
    Route::post('/user/profile/update', [UserController::class, 'updateProfile']);
    Route::post('/user/change-password', [UserController::class, 'changePassword']);

     // 🎟️ API lưu mã giảm giá của người dùng
    Route::post('/user/discounts', [UserDiscountController::class, 'store']);
    Route::get('/user/discounts', [UserDiscountController::class, 'index']);
    Route::get('/discounts/user/{userId}', [UserDiscountController::class, 'getUserDiscounts']);

});


//Product ADMIN
Route::put('/products/{id}/update-stock', [ProductController::class, 'updateStock']);


//Profile
// Route::middleware('auth:sanctum')->get('/user/profile', function (Request $request) {
//     return response()->json([
//         'success' => true,
//         'data' => $request->user(),
//     ]);
// });

//Product Review
Route::get('/products/{id}/reviews', [ProductReviewController::class, 'index']);
Route::post('/products/{id}/reviews', [ProductReviewController::class, 'store']);
Route::get('/reviews/admin/all', [ProductReviewController::class, 'all']);
Route::get('/reviews/average', [ProductReviewController::class, 'averageRatings']);
Route::get('/orders/user/{userId}/completed', [OrderController::class, 'getCompletedOrders']);
Route::post('/reviews/{reviewId}/images', [ProductReviewController::class, 'uploadImages']);

// Dashboard
Route::get('/admin/statistics/summary', [DashboardController::class, 'summary']);
Route::get('/admin/statistics/monthly-revenue', [DashboardController::class, 'monthlyRevenue']);

// Discounts
Route::get('/discounts', [DiscountController::class, 'index']);
Route::post('/discounts', [DiscountController::class, 'store']);
Route::put('/discounts/{id}', [DiscountController::class, 'update']);
Route::delete('/discounts/{id}', [DiscountController::class, 'destroy']);
Route::get('/discounts/active', [DiscountController::class, 'active']);
Route::post('/discounts/apply', [DiscountController::class, 'apply']);
//Product ReviewReply
Route::post('/reviews/{review_id}/reply', [ProductReviewReplyController::class, 'store']);

