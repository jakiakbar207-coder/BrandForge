<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Warna extends Model
{
    protected $fillable = [
        'nama_warna',
    ];

    // Relasi ke Stok
    public function stoks()
    {
        return $this->hasMany(Stok::class);
    }
}