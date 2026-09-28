<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ReviewFoto extends Model
{
    use HasFactory;

    protected $table = 'review_fotos';

    protected $fillable = [
        'review_id',
        'foto',
    ];

    public function review()
    {
        return $this->belongsTo(Review::class, 'review_id');
    }
}