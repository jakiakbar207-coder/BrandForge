<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Transaksi;
use App\Models\DetailTransaksi;
use App\Models\User;
use App\Models\BiayaOperasional;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Barryvdh\DomPDF\Facade\Pdf;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\Export;

class LaporanController extends Controller
{
    public function index()
    {
        $transaksi = Transaksi::with('user')
            ->latest()
            ->get();

        $totalPendapatan = $transaksi->sum('total_harga');

        $pendapatanHarian = Transaksi::whereDate(
            'tanggal_transaksi',
            Carbon::today()
        )->sum('total_harga');

        $pendapatanBulanan = Transaksi::whereMonth(
            'tanggal_transaksi',
            Carbon::now()->month
        )
        ->whereYear(
            'tanggal_transaksi',
            Carbon::now()->year
        )
        ->sum('total_harga');

        $pendapatanTahunan = Transaksi::whereYear(
            'tanggal_transaksi',
            Carbon::now()->year
        )->sum('total_harga');

        $jumlahOrder = Transaksi::count();

        $produkTerjual = DetailTransaksi::sum('jumlah');

        $jumlahPelanggan = User::where(
            'role',
            'pelanggan'
        )->count();

        $penjualan = DetailTransaksi::sum('subtotal');

        $modalProduk = DetailTransaksi::join(
            'produks',
            'detail_transaksis.produk_id',
            '=',
            'produks.id'
        )->sum(DB::raw(
            'detail_transaksis.jumlah * produks.modal_produk'
        ));

        $biayaOperasional = BiayaOperasional::sum('nominal');

        $labaBersih =
            $penjualan -
            $modalProduk -
            $biayaOperasional;

        return response()->json([
            'transaksi' => $transaksi,
            'totalPendapatan' => $totalPendapatan,
            'pendapatanHarian' => $pendapatanHarian,
            'pendapatanBulanan' => $pendapatanBulanan,
            'pendapatanTahunan' => $pendapatanTahunan,
            'jumlahOrder' => $jumlahOrder,
            'produkTerjual' => $produkTerjual,
            'jumlahPelanggan' => $jumlahPelanggan,
            'penjualan' => $penjualan,
            'modalProduk' => $modalProduk,
            'biayaOperasional' => $biayaOperasional,
            'labaBersih' => $labaBersih,
        ]);
    }

    public function pdf()
    {
        $transaksi = Transaksi::with('user')
            ->latest()
            ->get();

        $totalPendapatan = $transaksi->sum('total_harga');

        $jumlahOrder = Transaksi::count();

        $produkTerjual = DetailTransaksi::sum('jumlah');

        $jumlahPelanggan = User::where(
            'role',
            'pelanggan'
        )->count();

        $penjualan = DetailTransaksi::sum('subtotal');

        $modalProduk = DetailTransaksi::join(
            'produks',
            'detail_transaksis.produk_id',
            '=',
            'produks.id'
        )->sum(DB::raw(
            'detail_transaksis.jumlah * produks.modal_produk'
        ));

        $biayaOperasional = BiayaOperasional::sum('nominal');

        $labaBersih =
            $penjualan -
            $modalProduk -
            $biayaOperasional;

        $pdf = Pdf::loadView(
            'laporan.pdf',
            compact(
                'transaksi',
                'totalPendapatan',
                'jumlahOrder',
                'produkTerjual',
                'jumlahPelanggan',
                'penjualan',
                'modalProduk',
                'biayaOperasional',
                'labaBersih'
            )
        );

        return $pdf->download(
            'laporan-transaksi.pdf'
        );
    }

    public function excel()
    {
        return Excel::download(
            new Export(),
            'laporan_penjualan.xlsx'
        );
    }
}