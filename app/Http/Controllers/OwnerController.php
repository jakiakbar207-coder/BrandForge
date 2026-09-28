<?php

namespace App\Http\Controllers;

use App\Models\Transaksi;

class OwnerController extends Controller
{
    // Dashboard Owner
    public function index()
    {
        $totalTransaksi = Transaksi::count();

        $menungguVerifikasi = Transaksi::where(
            'status',
            'Menunggu Verifikasi'
        )->count();

        $diproses = Transaksi::where(
            'status',
            'Diproses'
        )->count();

        $selesai = Transaksi::where(
            'status',
            'Selesai'
        )->count();

        return view('owner.index', compact(
            'totalTransaksi',
            'menungguVerifikasi',
            'diproses',
            'selesai'
        ));
    }
}