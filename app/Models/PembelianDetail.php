<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PembelianDetail extends Model
{
    use HasFactory;

    protected $table = 'pembelian_details';

    protected $fillable = [
        'pembelian_id',
        'produk_id',
        'jumlah',
        'harga_modal',
        'subtotal',
    ];

    protected $casts = [
        'jumlah' => 'integer',
        'harga_modal' => 'decimal:2',
        'subtotal' => 'decimal:2',
    ];

    // Relasi ke pembelian
    public function pembelian()
    {
        return $this->belongsTo(Pembelian::class);
    }

    // Relasi ke produk
    public function produk()
    {
        return $this->belongsTo(Produk::class);
    }
}