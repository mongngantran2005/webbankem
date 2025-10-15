<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductReviewImage extends Model
{
    use HasFactory;

    protected $fillable = ['review_id', 'image'];

    public function review()
    {
        return $this->belongsTo(ProductReview::class, 'review_id');
    }
}
