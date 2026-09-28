<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    use HasFactory;

    protected $table = 'reviews';

    protected $fillable = [
        'user_id',
        'produk_id',
        'transaksi_id',
        'detail_transaksi_id',
        'rating',
        'review',
    ];

    protected $casts = [
        'rating' => 'integer',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function produk()
    {
        return $this->belongsTo(Produk::class, 'produk_id');
    }

    public function transaksi()
    {
        return $this->belongsTo(Transaksi::class, 'transaksi_id');
    }

    public function detailTransaksi()
    {
        return $this->belongsTo(
            DetailTransaksi::class,
            'detail_transaksi_id'
        );
    }

    public function fotos()
    {
        return $this->hasMany(ReviewFoto::class, 'review_id');
    }
}