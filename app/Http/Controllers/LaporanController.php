<?php

    namespace App\Http\Controllers;

    use App\Models\Transaksi;
    use Barryvdh\DomPDF\Facade\Pdf;
    use App\Exports\Export;
    use Maatwebsite\Excel\Facades\Excel;
    use App\Models\DetailTransaksi;
    use App\Models\User;
    use Carbon\Carbon;
    use App\Models\BiayaOperasional;
    use Illuminate\Support\Facades\DB;
    class LaporanController extends Controller
    {
        public function index()
    {
        $transaksi = Transaksi::with('user')->latest()->get();

        $totalPendapatan = $transaksi->sum('total_harga');

        $pendapatanHarian = Transaksi::whereDate('tanggal_transaksi', Carbon::today())
            ->sum('total_harga');

        $pendapatanBulanan = Transaksi::whereMonth('tanggal_transaksi', Carbon::now()->month)
            ->whereYear('tanggal_transaksi', Carbon::now()->year)
            ->sum('total_harga');

        $pendapatanTahunan = Transaksi::whereYear('tanggal_transaksi', Carbon::now()->year)
            ->sum('total_harga');

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

            return view('laporan.index', compact(

                'transaksi',

                'totalPendapatan',
                'pendapatanHarian',
                'pendapatanBulanan',
                'pendapatanTahunan',

                'jumlahOrder',
                'produkTerjual',
                'jumlahPelanggan',

                'penjualan',
                'modalProduk',
                'biayaOperasional',
                'labaBersih'
            ));
    }

       public function pdf()
        {
            $transaksi = Transaksi::with('user')->latest()->get();

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

            $pdf = Pdf::loadView('laporan.pdf', compact(
                'transaksi',
                'totalPendapatan',
                'jumlahOrder',
                'produkTerjual',
                'jumlahPelanggan',
                'penjualan',
                'modalProduk',
                'biayaOperasional',
                'labaBersih'
            ));

            return $pdf->download('laporan-transaksi.pdf');
        }
       public function excel()
        {
            return Excel::download(
                new Export(),
                'laporan_penjualan.xlsx'
            );
        }   
 }