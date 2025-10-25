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
        Schema::create('review_replies', function (Blueprint $table) {
            $table->id();
            
            // Khóa ngoại đến bảng product_reviews (mỗi phản hồi thuộc 1 đánh giá)
            $table->unsignedBigInteger('review_id');
            $table->foreign('review_id')->references('id')->on('product_reviews')->onDelete('cascade');

            // Khóa ngoại đến bảng ttmn_user (người trả lời — admin hoặc user)
            $table->unsignedBigInteger('user_id');
            $table->foreign('user_id')->references('id')->on('ttmn_user')->onDelete('cascade');

            // Nội dung phản hồi
            $table->text('content');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('review_replies');
    }
};
