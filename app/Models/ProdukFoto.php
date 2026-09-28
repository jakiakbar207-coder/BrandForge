<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProdukFoto extends Model
{
    protected $table = 'produk_fotos';

    protected $fillable = [
        'produk_id',
        'foto',
    ];

    public function produk()
    {
        return $this->belongsTo(Produk::class, 'produk_id');
    }
}