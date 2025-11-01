<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Rap2hpoutre\FastExcel\FastExcel;
use App\Models\Product;
use App\Models\Category;
use App\Models\Brand;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\File;

class ImportController extends Controller
{
    public function importProducts(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,xls,csv',
        ]);

        $file = $request->file('file');

        try {
            // 🧩 Kiểm tra file hợp lệ
            if (!$file->isValid()) {
                return response()->json([
                    'message' => '❌ File upload không hợp lệ.',
                    'error' => $file->getErrorMessage(),
                ], 400);
            }

            // 📥 Đọc dữ liệu Excel
            $rows = (new FastExcel)->import($file);
            if (count($rows) === 0) {
                return response()->json([
                    'message' => '⚠️ File Excel trống hoặc không có dữ liệu hợp lệ.',
                ], 400);
            }

            // 📂 Đảm bảo thư mục ảnh tồn tại
            $publicImagePath = public_path('uploads/products/');
            if (!File::exists($publicImagePath)) {
                File::makeDirectory($publicImagePath, 0777, true, true);
            }

            // 📦 Lấy danh sách file ảnh hiện có trong thư mục
            $allImages = collect(File::files($publicImagePath))
                ->map(fn($f) => $f->getFilename());

            $count = 0;

            foreach ($rows as $row) {
                $name = $row['Tên sản phẩm'] ?? null;
                if (!$name) continue;

                $slug = $row['Slug'] ?? Str::slug($name);

                // 🔄 Tránh trùng slug
                if (Product::where('slug', $slug)->exists()) {
                    $slug .= '-' . time();
                }

                // 🖼️ Xử lý ảnh
                $thumbnail = $this->handleThumbnail(
                    $row['Hình ảnh'] ?? null,
                    $publicImagePath,
                    $allImages
                );

                // ✅ Lưu sản phẩm
                Product::updateOrCreate(
                    ['slug' => $slug],
                    [
                        'name' => $name,
                        'slug' => $slug,
                        'category_id' => $this->getCategoryId($row['Danh mục'] ?? null) ?? 1,
                        'brand_id' => $this->getBrandId($row['Thương hiệu'] ?? null) ?? 1,
                        'price_root' => $row['Giá gốc'] ?? 0,
                        'price_sale' => $row['Giá bán'] ?? 0,
                        'qty' => $row['Số lượng'] ?? 0,
                        'thumbnail' => $thumbnail,
                        'detail' => $row['Chi tiết'] ?? $name,
                        'description' => $row['Mô tả'] ?? $name,
                        'status' => $row['Trạng thái'] ?? 1,
                        'created_by' => 1,
                    ]
                );

                $count++;
            }

            return response()->json([
                'message' => "✅ Import thành công {$count} sản phẩm!",
                'count' => $count,
            ]);
        } catch (\Exception $e) {
            Log::error('❌ Lỗi khi import sản phẩm', [
                'message' => $e->getMessage(),
                'line' => $e->getLine(),
                'file' => $e->getFile(),
            ]);

            return response()->json([
                'message' => '❌ Lỗi khi import sản phẩm!',
                'error' => $e->getMessage(),
                'line' => $e->getLine(),
                'file' => $e->getFile(),
            ], 500);
        }
    }

    /**
     * 🖼️ Xử lý ảnh từ Excel (tên, URL, hoặc đường dẫn máy tính)
     */
    private function handleThumbnail($value, $publicImagePath, $allImages)
    {
        if (!$value) return 'uploads/products/default.jpg';

        $value = trim($value);

        // ✅ 1. Nếu là URL online → giữ nguyên
        if (Str::startsWith($value, ['http://', 'https://'])) {
            return $value;
        }

        // ✅ 2. Nếu là đường dẫn local (VD: E:\importImage\kemque.jpg)
        if (Str::contains($value, [':\\', '/'])) {
            $filename = basename($value);
            $destination = $publicImagePath . $filename;

            try {
                if (!File::exists($destination) && File::exists($value)) {
                    File::copy($value, $destination);
                }
            } catch (\Exception $e) {
                Log::warning("⚠️ Không thể copy ảnh từ đường dẫn local: {$value}");
            }

            return 'uploads/products/' . $filename;
        }

        // ✅ 3. Nếu chỉ là tên file (VD: kemque-dau.jpg)
        $found = $allImages->first(fn($img) => Str::contains($img, pathinfo($value, PATHINFO_FILENAME)));
        if ($found) {
            return 'uploads/products/' . $found;
        }

        // ✅ 4. Nếu không tìm thấy, trả về ảnh mặc định
        return 'uploads/products/default.jpg';
    }

    /**
     * 🔍 Tìm ID danh mục theo tên
     */
    private function getCategoryId($categoryName)
    {
        if (!$categoryName) return null;
        return Category::where('name', $categoryName)->value('id') ?? null;
    }

    /**
     * 🔍 Tìm ID thương hiệu theo tên
     */
    private function getBrandId($brandName)
    {
        if (!$brandName) return null;
        return Brand::where('name', $brandName)->value('id') ?? null;
    }
}
