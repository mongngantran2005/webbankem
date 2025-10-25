<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Brand;
use Illuminate\Support\Facades\Validator;

class BrandController extends Controller
{
    // 🔹 Lấy tất cả thương hiệu
    public function index()
    {
        $brands = Brand::all();
        return response()->json([
            'success' => true,
            'data' => $brands
        ]);
    }

    // 🔹 Lấy dropdown (id + name)
    public function getDropdown()
    {
        $brands = Brand::select('id', 'name')->get();
        return response()->json([
            'success' => true,
            'data' => $brands
        ]);
    }

    // 🔹 Tạo thương hiệu mới
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:brands,name',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $brand = Brand::create(['name' => $request->name]);

        return response()->json([
            'success' => true,
            'message' => 'Thêm thương hiệu thành công',
            'data' => $brand
        ]);
    }

    // 🔹 Cập nhật thương hiệu
    public function update(Request $request, $id)
    {
        $brand = Brand::find($id);

        if (!$brand) {
            return response()->json(['success' => false, 'message' => 'Không tìm thấy thương hiệu'], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:brands,name,' . $id,
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $brand->update(['name' => $request->name]);

        return response()->json(['success' => true, 'message' => 'Cập nhật thương hiệu thành công']);
    }

    // 🔹 Xóa mềm
    public function destroy($id)
    {
        $brand = Brand::find($id);

        if (!$brand) {
            return response()->json(['success' => false, 'message' => 'Không tìm thấy thương hiệu'], 404);
        }

        $brand->delete();
        return response()->json(['success' => true, 'message' => 'Đã xóa thương hiệu vào thùng rác']);
    }

    // 🔹 Khôi phục thương hiệu
    public function restore($id)
    {
        $brand = Brand::withTrashed()->find($id);

        if (!$brand) {
            return response()->json(['success' => false, 'message' => 'Không tìm thấy thương hiệu để khôi phục'], 404);
        }

        $brand->restore();
        return response()->json(['success' => true, 'message' => 'Khôi phục thương hiệu thành công']);
    }

    // 🔹 Xóa vĩnh viễn
    public function forceDelete($id)
    {
        $brand = Brand::withTrashed()->find($id);

        if (!$brand) {
            return response()->json(['success' => false, 'message' => 'Không tìm thấy thương hiệu'], 404);
        }

        $brand->forceDelete();
        return response()->json(['success' => true, 'message' => 'Đã xóa vĩnh viễn thương hiệu']);
    }    

}
