<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('discounts', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique(); // Mã giảm giá (VD: SALE20)
            $table->enum('type', ['percent', 'fixed']); // Loại: phần trăm hoặc số tiền cố định
            $table->decimal('value', 10, 2); // Giá trị giảm
            $table->decimal('min_order_amount', 10, 2)->nullable(); // Đơn tối thiểu để dùng
            $table->decimal('max_discount', 10, 2)->nullable(); // Giảm tối đa (nếu có)
            $table->dateTime('start_date')->nullable(); // Ngày bắt đầu hiệu lực
            $table->dateTime('end_date')->nullable(); // Ngày hết hạn
            $table->integer('usage_limit')->nullable(); // Giới hạn số lần dùng
            $table->integer('used_count')->default(0); // Đã dùng bao nhiêu lần
            $table->boolean('status')->default(1); // 1 = hoạt động, 0 = ngừng
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('discounts');
    }
};
