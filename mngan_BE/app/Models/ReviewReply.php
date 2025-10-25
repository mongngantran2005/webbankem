<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ReviewReply extends Model
{
    use HasFactory;

    protected $table = 'review_replies';

    protected $fillable = [
        'review_id',
        'user_id',
        'content',
        'status',
    ];

    public function review()
    {
        return $this->belongsTo(ProductReview::class, 'review_id', 'id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }
}
