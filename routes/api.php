<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\KategoriController;
use App\Http\Controllers\Api\KoleksiController;
use App\Http\Controllers\Api\ProdukController;
use App\Http\Controllers\Api\UkuranController;
use App\Http\Controllers\Api\WarnaController;
use App\Http\Controllers\Api\StokController;
use App\Http\Controllers\Api\SupplierController;
use App\Http\Controllers\Api\PembelianController;
use App\Http\Controllers\Api\ReturController;
use App\Http\Controllers\Api\PengirimanController;
use App\Http\Controllers\Api\TransaksiController;
use App\Http\Controllers\Api\PelangganController;
use App\Http\Controllers\Api\WishlistController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\PembayaranController;
use App\Http\Controllers\Api\LaporanController;
use App\Http\Controllers\Api\BiayaOperasionalController;

Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {

    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/user', [AuthController::class, 'user']);

    Route::get('/dashboard', [DashboardController::class, 'index']);

    Route::get('/kategori', [KategoriController::class, 'index']);
    Route::post('/kategori', [KategoriController::class, 'store']);
    Route::get('/kategori/{id}', [KategoriController::class, 'show']);
    Route::put('/kategori/{id}', [KategoriController::class, 'update']);
    Route::delete('/kategori/{id}', [KategoriController::class, 'destroy']);

    Route::get('/koleksi', [KoleksiController::class, 'index']);
    Route::post('/koleksi', [KoleksiController::class, 'store']);
    Route::get('/koleksi/{id}', [KoleksiController::class, 'show']);
    Route::put('/koleksi/{id}', [KoleksiController::class, 'update']);
    Route::delete('/koleksi/{id}', [KoleksiController::class, 'destroy']);

    Route::get('/produk', [ProdukController::class, 'index']);
    Route::post('/produk', [ProdukController::class, 'store']);
    Route::get('/produk/{id}', [ProdukController::class, 'show']);
    Route::put('/produk/{id}', [ProdukController::class, 'update']);
    Route::delete('/produk/{id}', [ProdukController::class, 'destroy']);

    Route::get('/ukuran', [UkuranController::class, 'index']);
    Route::post('/ukuran', [UkuranController::class, 'store']);
    Route::get('/ukuran/{ukuran}', [UkuranController::class, 'show']);
    Route::put('/ukuran/{ukuran}', [UkuranController::class, 'update']);
    Route::delete('/ukuran/{ukuran}', [UkuranController::class, 'destroy']);

    Route::get('/warna', [WarnaController::class, 'index']);
    Route::post('/warna', [WarnaController::class, 'store']);
    Route::get('/warna/{warna}', [WarnaController::class, 'show']);
    Route::put('/warna/{warna}', [WarnaController::class, 'update']);
    Route::delete('/warna/{warna}', [WarnaController::class, 'destroy']);

    Route::get('/stok', [StokController::class, 'index']);
    Route::post('/stok', [StokController::class, 'store']);
    Route::get('/stok/{stok}', [StokController::class, 'show']);
    Route::put('/stok/{stok}', [StokController::class, 'update']);
    Route::delete('/stok/{stok}', [StokController::class, 'destroy']);

    Route::get('/supplier', [SupplierController::class, 'index']);
    Route::post('/supplier', [SupplierController::class, 'store']);
    Route::get('/supplier/{supplier}', [SupplierController::class, 'show']);
    Route::put('/supplier/{supplier}', [SupplierController::class, 'update']);
    Route::delete('/supplier/{supplier}', [SupplierController::class, 'destroy']);

    Route::get('/pembelian', [PembelianController::class, 'index']);
    Route::get('/pembelian/create', [PembelianController::class, 'create']);
    Route::post('/pembelian', [PembelianController::class, 'store']);
    Route::get('/pembelian/{pembelian}', [PembelianController::class, 'show']);
    Route::delete('/pembelian/{pembelian}', [PembelianController::class, 'destroy']);

    Route::get('/retur', [ReturController::class, 'index']);
    Route::get('/retur/create', [ReturController::class, 'create']);
    Route::post('/retur', [ReturController::class, 'store']);
    Route::get('/retur/{retur}', [ReturController::class, 'show']);
    Route::delete('/retur/{retur}', [ReturController::class, 'destroy']);

    Route::get('/pengiriman', [PengirimanController::class, 'index']);
    Route::get('/pengiriman/create', [PengirimanController::class, 'create']);
    Route::post('/pengiriman', [PengirimanController::class, 'store']);
    Route::get('/pengiriman/transaksi/{transaksiId}/tracking', [PengirimanController::class, 'tracking']);
    Route::get('/pengiriman/{id}', [PengirimanController::class, 'show']);
    Route::post('/pengiriman/{id}', [PengirimanController::class, 'update']);
    Route::put('/pengiriman/{id}/status', [PengirimanController::class, 'updateStatus']);
    Route::put('/pengiriman/{id}/resi', [PengirimanController::class, 'updateResi']);
    Route::delete('/pengiriman/{id}', [PengirimanController::class, 'destroy']);

    Route::get('/kasir', [TransaksiController::class, 'kasirDashboard']);
    Route::get('/kasir/transaksi', [TransaksiController::class, 'kasirCreate']);
    Route::post('/kasir/transaksi', [TransaksiController::class, 'kasirStore']);
    Route::get('/kasir/riwayat', [TransaksiController::class, 'kasirIndex']);
    Route::get('/kasir/detail/{id}', [TransaksiController::class, 'kasirShow']);
    Route::get('/kasir/struk/{id}', [TransaksiController::class, 'kasirStruk']);
    Route::put('/kasir/transaksi/{id}/verifikasi', [TransaksiController::class, 'kasirVerifikasi']);
    Route::put('/kasir/transaksi/{id}/selesai', [TransaksiController::class, 'kasirSelesai']);
    Route::delete('/kasir/transaksi/{id}', [TransaksiController::class, 'kasirDestroy']);
    Route::put('/kasir/pengiriman/{id}/resi', [TransaksiController::class, 'kasirUpdateResi']);
    Route::put('/kasir/pengiriman/{id}/status', [TransaksiController::class, 'kasirUpdateStatusKirim']);
    Route::get('/kasir/pengiriman/{id}/label', [TransaksiController::class, 'kasirPrintLabel']);
    Route::get('/kasir/transaksi/{id}/bukti', [TransaksiController::class, 'kasirBuktiPembayaran']);
    Route::get('/kasir/transaksi/{id}/produk', [TransaksiController::class, 'kasirBuktiProduk']);

    Route::get('/pelanggan', [PelangganController::class, 'dashboard']);
    Route::get('/pelanggan/dashboard-status', [PelangganController::class, 'status']);
    Route::get('/pelanggan/notifikasi', [PelangganController::class, 'notifikasi']);

    Route::get('/pelanggan/belanja', [ProdukController::class, 'pelangganBelanja']);
    Route::get('/pelanggan/detail/{id}', [ProdukController::class, 'pelangganDetail']);
    Route::post('/pelanggan/beli-sekarang/{id}', [PelangganController::class, 'beliSekarang']);

    Route::get('/wishlist', [WishlistController::class, 'index']);
    Route::post('/wishlist/{produk}', [WishlistController::class, 'store']);
    Route::delete('/wishlist/{produk}', [WishlistController::class, 'destroy']);

    Route::get('/pelanggan/keranjang', [PelangganController::class, 'keranjang']);
    Route::post('/pelanggan/keranjang/tambah/{id}', [PelangganController::class, 'tambahKeranjang']);
    Route::delete('/pelanggan/keranjang/{id}', [PelangganController::class, 'hapusKeranjang']);

    Route::get('/pelanggan/checkout', [PelangganController::class, 'checkout']);
    Route::post('/pelanggan/checkout', [PelangganController::class, 'prosesCheckout']);

    Route::get('/pelanggan/alamat/{id}', [PelangganController::class, 'alamat']);
    Route::post('/pelanggan/alamat/{id}', [PelangganController::class, 'simpanAlamat']);

    Route::get('/pembayaran/{id}', [PembayaranController::class, 'show']);
    Route::post('/pembayaran/{id}/upload', [PembayaranController::class, 'upload']);

    Route::get('/pelanggan/riwayat', [PelangganController::class, 'riwayat']);
    Route::get('/pelanggan/pesanan/{id}/tracking', [PengirimanController::class, 'tracking']);
    Route::delete('/pelanggan/transaksi/{id}', [PelangganController::class, 'destroyTransaksi']);
    Route::post('/pelanggan/upload-foto-produk/{id}', [PelangganController::class, 'uploadFotoProduk']);

    Route::get('/pelanggan/review/{detailTransaksi}', [ReviewController::class, 'create']);
    Route::post('/pelanggan/review/{detailTransaksi}', [ReviewController::class, 'store']);
    Route::delete('/pelanggan/review/{review}', [ReviewController::class, 'destroy']);

    Route::get('/laporan', [LaporanController::class, 'index']);
    Route::get('/laporan/pdf', [LaporanController::class, 'pdf']);
    Route::get('/laporan/excel', [LaporanController::class, 'excel']);

    Route::get('/biaya-operasional', [BiayaOperasionalController::class, 'index']);
    Route::get('/biaya-operasional/create', [BiayaOperasionalController::class, 'create']);
    Route::post('/biaya-operasional', [BiayaOperasionalController::class, 'store']);
    Route::get('/biaya-operasional/{biayaOperasional}', [BiayaOperasionalController::class, 'show']);
    Route::get('/biaya-operasional/{biayaOperasional}/edit', [BiayaOperasionalController::class, 'edit']);
    Route::put('/biaya-operasional/{biayaOperasional}', [BiayaOperasionalController::class, 'update']);
    Route::delete('/biaya-operasional/{biayaOperasional}', [BiayaOperasionalController::class, 'destroy']);
});