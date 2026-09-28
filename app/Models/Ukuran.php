<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ukuran extends Model
{
    protected $fillable = [
        'nama_ukuran',
    ];

    // Relasi ke Stok
    public function stoks()
    {
        return $this->hasMany(Stok::class);
    }
}