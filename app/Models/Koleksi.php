<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Koleksi extends Model
{
    use HasFactory;

    protected $table = 'koleksis';
    protected $primarykey = 'id';
    public $timestamps = false;

    protected $fillable = [
        'nama_koleksi',
        'deskripsi',
    ];

    //Satu koleksi memiliki banyak produk.
    public function produks()
    {
        return $this->hasMany(Produk::class);
    }
}