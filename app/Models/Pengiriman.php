<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pengiriman extends Model
{
    use HasFactory;

    protected $table = 'pengiriman';

    protected $fillable = [
        'transaksi_id',
        'kurir',
        'layanan',
        'ongkir',
        'nomor_resi',
        'status',
        'catatan',
        'foto_produk',
    ];

    protected $casts = [
        'transaksi_id' => 'integer',
        'ongkir' => 'integer',
    ];

    public function transaksi()
    {
        return $this->belongsTo(
            Transaksi::class,
            'transaksi_id'
        );
    }
}