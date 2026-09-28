<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Retur extends Model
{
    use HasFactory;

    protected $table = 'returs';

    protected $fillable = [
        'transaksi_id',
        'produk_id',
        'ukuran_id',
        'warna_id',
        'jumlah',
        'alasan',
        'keterangan',
        'tanggal_retur',
    ];

    protected $casts = [
        'tanggal_retur' => 'date',
        'jumlah' => 'integer',
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

    public function ukuran()
    {
        return $this->belongsTo(
            Ukuran::class,
            'ukuran_id'
        );
    }

    public function warna()
    {
        return $this->belongsTo(
            Warna::class,
            'warna_id'
        );
    }
}