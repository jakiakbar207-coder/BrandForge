<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BiayaOperasional extends Model
{
    use HasFactory;

    protected $table = 'biaya_operasionals';

    protected $fillable = [
        'nama_biaya',
        'nominal',
        'tanggal',
        'keterangan',
    ];

    protected $casts = [
        'nominal' => 'decimal:2',
        'tanggal' => 'date',
    ];
}