<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('ttmn_order', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('name')->nullable();
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->string('address')->nullable();
            $table->text('note')->nullable();
            $table->decimal('total', 10, 2)->default(0);
            $table->unsignedTinyInteger('status')->default(0); // 0 = pending, 1 = completed, etc.
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('ttmn_order');
    }
};
