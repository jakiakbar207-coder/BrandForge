<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Transaksi;
use App\Models\Pembayaran;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PembayaranController extends Controller
{
    public function show($id)
    {
        $transaksi = Transaksi::where(
            'user_id',
            Auth::id()
        )
        ->with([
            'detailTransaksi.produk.kategori',
            'detailTransaksi.produk.koleksi',
            'pembayaran',
        ])
        ->findOrFail($id);

        $hargaProduk = 0;

        foreach ($transaksi->detailTransaksi as $detail) {
            $hargaProduk +=
                $detail->harga *
                $detail->jumlah;
        }

        $ongkir = $transaksi->ongkir;

        $totalPembayaran =
            $hargaProduk +
            $ongkir;

        return response()->json([
            'transaksi' => $transaksi,
            'harga_produk' => $hargaProduk,
            'ongkir' => $ongkir,
            'total_pembayaran' => $totalPembayaran,
        ]);
    }

    public function upload(
        Request $request,
        $id
    ) {
        $request->validate([
            'bukti' =>
                'required|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        $transaksi = Transaksi::where(
            'user_id',
            Auth::id()
        )
        ->findOrFail($id);

        $namaFile =
            time() . '.' .
            $request->bukti->extension();

        $request->bukti->move(
            public_path('bukti'),
            $namaFile
        );

        $pembayaran = Pembayaran::create([
            'transaksi_id' => $id,
            'bukti' => $namaFile,
            'status' => 'Menunggu Verifikasi',
        ]);

        $transaksi->update([
            'bayar' => $transaksi->total_harga,
            'kembalian' => 0,
            'status' => 'Menunggu Verifikasi',
        ]);

        $transaksi->load([
            'pembayaran',
        ]);

        return response()->json([
            'message' =>
                'Bukti pembayaran berhasil diupload.',
            'data' => [
                'transaksi' => $transaksi,
                'pembayaran' => $pembayaran,
            ],
        ], 201);
    }
}