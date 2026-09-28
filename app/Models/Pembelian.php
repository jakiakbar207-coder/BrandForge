<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pembelian extends Model
{
    use HasFactory;

    protected $table = 'pembelians';

    protected $fillable = [
        'supplier_id',
        'tanggal_pembelian',
        'total_harga',
        'keterangan',
    ];

    protected $casts = [
        'tanggal_pembelian' => 'date',
        'total_harga' => 'decimal:2',
    ];

    // Relasi ke Supplier
    public function supplier()
    {
        return $this->belongsTo(Supplier::class);
    }

    // Relasi ke detail pembelian
    public function details()
    {
        return $this->hasMany(PembelianDetail::class);
    }
}