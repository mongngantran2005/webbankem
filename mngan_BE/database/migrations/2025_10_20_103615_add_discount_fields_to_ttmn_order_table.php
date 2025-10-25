<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('ttmn_order', function (Blueprint $table) {
            $table->string('discount_code')->nullable()->after('note');
            $table->decimal('discount_value', 10, 2)->default(0)->after('discount_code');
            $table->decimal('total', 12, 2)->default(0)->after('discount_value');
        });
    }

    public function down(): void
    {
        Schema::table('ttmn_order', function (Blueprint $table) {
            $table->dropColumn(['discount_code', 'discount_value', 'total']);
        });
    }
};
