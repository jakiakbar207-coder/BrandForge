<?php

namespace App\Http\Controllers;

use App\Models\Stok;

class AdminController extends Controller
{
    public function index()
    {
        // Ambil stok yang jumlahnya <= 5
        $stokMenipis = Stok::with(['produk', 'ukuran', 'warna'])
            ->where('jumlah', '<=', 5)
            ->orderBy('jumlah', 'asc')
            ->get();

        // Jumlah notifikasi stok menipis
        $jumlahStokMenipis = $stokMenipis->count();

        return view('admin.index', compact(
            'stokMenipis',
            'jumlahStokMenipis'
        ));
    }
}