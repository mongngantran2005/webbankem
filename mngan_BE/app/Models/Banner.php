<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Banner extends Model
{
    use HasFactory;

    protected $table = 'ttmn_banner'; // tên bảng trong database

    protected $fillable = [
        'name', 'image', 'link', 'sort_order', 'position', 'description',
        'start_date', 'end_date', 'status', 'created_by', 'updated_by'
    ];
}
