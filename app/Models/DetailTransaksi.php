<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DetailTransaksi extends Model
{
    use HasFactory;

    protected $fillable = [
        'transaksi_id',
        'stok_id',
        'produk_id',
        'jumlah',
        'harga',
        'subtotal',
    ];

    public function transaksi()
    {
        return $this->belongsTo(
            Transaksi::class,
            'transaksi_id'
        );
    }

    public function produk()
    {
        return $this->belongsTo(
            Produk::class,
            'produk_id'
        );
    }

    public function stok()
    {
        return $this->belongsTo(
            Stok::class,
            'stok_id'
        );
    }

    public function reviews()
    {
        return $this->hasMany(
            Review::class,
            'detail_transaksi_id'
        );
    }
}