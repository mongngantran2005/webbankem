<?php

namespace Database\Seeders; // 👈 thêm dòng này nếu chưa có

use Illuminate\Database\Seeder; // 👈 thêm dòng này
use Illuminate\Support\Facades\Log;
use App\Models\Product; // 👈 thêm để gọi model Product

class ProductTestSeeder extends Seeder
{
    public function run(): void
    {
        $start = microtime(true);

        Product::factory(1000)->create();

        $time = round(microtime(true) - $start, 2);
        Log::info("✅ Đã tạo 1000 sản phẩm test trong {$time} giây.");
    }
}
