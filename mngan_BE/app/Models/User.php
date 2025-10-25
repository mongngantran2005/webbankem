<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens; // <--- BỔ SUNG: Bắt buộc cho Sanctum

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    // BỔ SUNG: Thêm HasApiTokens vào danh sách use
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * Tên bảng trong cơ sở dữ liệu.
     * Dựa trên cấu trúc CSDL của bạn (có bảng tmn_user).
     *
     * @var string
     */
    protected $table = 'ttmn_user'; // <--- BỔ SUNG: Chỉ định tên bảng

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
    'name',
    'username',
    'email',
    'password',
    'phone',
    'address',
    'birthday',
    'gender',
    'avatar',
];


    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
    public function userDiscounts()
{
    return $this->hasMany(UserDiscount::class, 'user_id');
}

}