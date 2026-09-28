<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Stok extends Model
{
    use HasFactory;

    protected $table = 'stoks';

    protected $fillable = [
        'produk_id',
        'ukuran_id',
        'warna_id',
        'jumlah',
    ];

    protected $casts = [
        'produk_id' => 'integer',
        'ukuran_id' => 'integer',
        'warna_id' => 'integer',
        'jumlah' => 'integer',
    ];

    public function produk()
    {
        return $this->belongsTo(Produk::class, 'produk_id');
    }

    public function ukuran()
    {
        return $this->belongsTo(Ukuran::class, 'ukuran_id');
    }

    public function warna()
    {
        return $this->belongsTo(Warna::class, 'warna_id');
    }
}