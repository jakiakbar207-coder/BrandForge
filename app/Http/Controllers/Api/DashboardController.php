<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Kategori;
use App\Models\Koleksi;
use App\Models\Produk;

class DashboardController extends Controller
{
    public function index()
    {
        $totalKategori = Kategori::count();
        $totalKoleksi = Koleksi::count();
        $totalProduk = Produk::count();

        $totalStok = Produk::withSum('stokData as stok_total', 'jumlah')
            ->get()
            ->sum('stok_total');

        return response()->json([
            'success' => true,
            'message' => 'Data dashboard berhasil diambil.',
            'data' => [
                'total_kategori' => $totalKategori,
                'total_koleksi' => $totalKoleksi,
                'total_produk' => $totalProduk,
                'total_stok' => (int) $totalStok,
            ],
        ], 200);
    }
}