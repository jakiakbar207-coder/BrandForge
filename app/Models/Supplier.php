<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Supplier extends Model
{
    use HasFactory;

    protected $table = 'suppliers';

    protected $fillable = [
        'nama_supplier',
        'kontak',
        'email',
        'alamat',
    ];

    public function pembelians()
    {
        return $this->hasMany(Pembelian::class);
    }
}