<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ttmn_orderdetail', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('ttmn_order')->onDelete('cascade'); // ✅ liên kết đúng bảng
            $table->foreignId('product_id')->constrained('products')->onDelete('cascade');
            $table->integer('qty')->default(1); // ✅ đồng nhất với model
            $table->decimal('price', 10, 2)->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ttmn_order_detail');
    }
};
