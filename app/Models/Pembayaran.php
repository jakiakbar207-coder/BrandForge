<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pembayaran extends Model
{
    use HasFactory;

    protected $table = 'pembayarans';

    protected $fillable = [
        'transaksi_id',
        'bukti',
        'status',
    ];

    public function transaksi()
    {
        return $this->belongsTo(Transaksi::class);
    }
}