<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('product_reviews', function (Blueprint $table) {
            $table->id();

            // 🔗 Liên kết tới bảng sản phẩm thật (ttmn_product)
            $table->foreignId('product_id')
                  ->constrained('ttmn_product') // ✅ phải trùng với model Product
                  ->onDelete('cascade');

            // 🔗 Liên kết tới bảng users (mặc định của Laravel)
            $table->foreignId('user_id')
                  ->constrained('ttmn_user')
                  ->onDelete('cascade');

            // ⭐ Điểm đánh giá: 1-5 sao
            $table->unsignedTinyInteger('rating')->default(5);

            // 💬 Nội dung nhận xét
            $table->text('comment')->nullable();

            // 🕒 Thời gian tạo và cập nhật
            $table->timestamps();

            // 🧠 Chống trùng lặp: 1 user chỉ đánh giá 1 lần / 1 sản phẩm
            $table->unique(['product_id', 'user_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_reviews');
    }
};
