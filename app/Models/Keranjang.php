<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Keranjang extends Model
{
    use HasFactory;

    protected $table = 'keranjangs';

   protected $fillable = [
        'user_id',
        'produk_id',
        'ukuran_id',
        'warna_id',
        'jumlah',
    ];

    // Relasi ke User
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Relasi ke Produk
    public function produk()
    {
        return $this->belongsTo(Produk::class);
    }

    // Relasi ke Ukuran
    public function ukuran()
    {
        return $this->belongsTo(Ukuran::class);
    }

    // Relasi ke Warna
    public function warna()
    {
        return $this->belongsTo(Warna::class);
    }
}