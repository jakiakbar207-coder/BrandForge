<?php

    use Illuminate\Support\Facades\Route;
    use App\Http\Controllers\ShippingController;
    use App\Http\Controllers\ProfileController;
    use App\Http\Controllers\OwnerController;
    use App\Http\Controllers\AdminController;
    use App\Http\Controllers\KasirController;
    use App\Http\Controllers\PelangganController;
    use App\Http\Controllers\KategoriController;
    use App\Http\Controllers\ProdukController;
    use App\Http\Controllers\UkuranController;
    use App\Http\Controllers\WarnaController;
    use App\Http\Controllers\StokController;
    use App\Http\Controllers\SupplierController;
    use App\Http\Controllers\PembelianController;
    use App\Http\Controllers\ReturController;
    use App\Http\Controllers\LaporanController;
    use App\Http\Controllers\BiayaOperasionalController;
    use App\Http\Controllers\KoleksiController;
    use App\Http\Controllers\WishlistController;
    use App\Http\Controllers\ReviewController;

    // Halaman Awal

    Route::get('/', function () {
        return redirect('/login');
    });

    // Route untuk tes
    Route::get('/tes', function () {
        return 'Laravel OK';
    });

    // Login khusus setiap role
    Route::get('/login/{role}', function ($role) {
        if (!in_array($role, ['owner', 'admin', 'kasir', 'pelanggan'])) {
            abort(404);
        }

            return view('auth.login', compact('role'));
        })->middleware('guest');
    // Dashboard Setelah Login

    Route::get('/dashboard', function () {

        if (auth()->user()->role == 'owner') {
            return redirect()->route('owner.index');
        }

        if (auth()->user()->role == 'admin') {
            return redirect()->route('admin.index');
        }

        if (auth()->user()->role == 'kasir') {
            return redirect()->route('kasir.index');
        }

        // Pelanggan masuk ke Dashboard Belanja (Tahap 10)
        if (auth()->user()->role == 'pelanggan') {
            return redirect()->route('pelanggan.dashboardBelanja');
        }

    })->middleware(['auth', 'verified'])->name('dashboard');
    // Semua Route Login

    Route::middleware('auth')->group(function () {

        // Profile

        Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
        Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
        Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

        // NOTIFIKASI

        Route::get('/notifikasi', function () {

            $notifications = auth()->user()
                ->notifications()
                ->latest()
                ->get();

            return view('pelanggan.notifikasi', compact('notifications'));

        })->name('notifikasi.index');


        Route::post('/notifikasi/{id}/dibaca', function ($id) {

            $notification = auth()->user()
                ->notifications()
                ->where('id', $id)
                ->firstOrFail();

            $notification->markAsRead();

            return back();

        })->name('notifikasi.dibaca');


        Route::post('/notifikasi/dibaca-semua', function () {

            auth()->user()
                ->unreadNotifications
                ->markAsRead();

            return back();

        })->name('notifikasi.dibacaSemua');

        // OWNER

        Route::middleware('role:owner')->group(function () {

            Route::get('/owner', [OwnerController::class, 'index'])
                ->name('owner.index');

            Route::get('/owner/laporan', [LaporanController::class, 'index'])
                ->name('laporan.index');

            Route::get('/owner/laporan/pdf', [LaporanController::class, 'pdf'])
                ->name('laporan.pdf');

            Route::get('/owner/laporan/excel', [LaporanController::class, 'excel'])
                ->name('laporan.excel');

            Route::resource('/owner/biaya-operasional', BiayaOperasionalController::class
                    )->names('biaya-operasional');

        });

      // ADMIN

        Route::middleware('role:owner,admin')->group(function () {

            Route::get('/admin', [AdminController::class, 'index'])
                ->name('admin.index');

            // Kategori
            Route::resource('admin/kategori', KategoriController::class)
                ->names('kategori');

            // Produk
            Route::resource('admin/produk', ProdukController::class)
                ->names('produk');

            // Ukuran
            Route::resource('admin/ukuran', UkuranController::class)
                ->names('ukuran');

            // Warna
            Route::resource('admin/warna', WarnaController::class)
                ->names('warna');

            // Koleksi
            Route::resource('admin/koleksi', KoleksiController::class)
                ->names('koleksi');
                
            // Supplier
            Route::resource('admin/supplier', SupplierController::class)
                ->names('supplier');

            // Pembelian Stok
            Route::resource('admin/pembelian', PembelianController::class)
                ->names('pembelian');

            // Retur Barang
            Route::resource('admin/retur', ReturController::class)
                ->names('retur');

            // Manajemen Stok
            Route::resource('admin/stok', StokController::class)
                ->names('stok');


            // PENGIRIMAN ADMIN

            Route::get('/admin/pengiriman', [ShippingController::class, 'index'])
                ->name('admin.pengiriman.index');

            Route::get('/admin/pengiriman/{id}/edit', [ShippingController::class, 'edit'])
                ->name('admin.pengiriman.edit');

            Route::post('/admin/pengiriman/store', [ShippingController::class, 'store'])
                ->name('admin.pengiriman.store');

            Route::put('/admin/pengiriman/{id}/status', [ShippingController::class, 'updateStatus'])
                ->name('admin.pengiriman.status');

            Route::put('/admin/pengiriman/{id}/resi', [ShippingController::class, 'updateResi'])
                ->name('admin.pengiriman.resi');

            Route::get('/admin/pengiriman/{id}/label', [ShippingController::class, 'printLabel'])
                ->name('admin.pengiriman.label');

        });

        // KASIR

        Route::middleware('role:owner,kasir')->group(function () {

            Route::get('/kasir', [KasirController::class, 'index'])
                ->name('kasir.index');

            Route::get('/kasir/transaksi', [KasirController::class, 'transaksi'])
                ->name('kasir.transaksi');

            Route::post('/kasir/transaksi', [KasirController::class, 'store'])
                ->name('kasir.store');

            Route::get('/kasir/riwayat', [KasirController::class, 'riwayat'])
                ->name('kasir.riwayat');

            Route::get('/kasir/detail/{id}', [KasirController::class, 'show'])
                ->name('kasir.detail');

            Route::get('/kasir/struk/{id}', [KasirController::class, 'struk'])
                ->name('kasir.struk');

            Route::put('/kasir/transaksi/{id}/verifikasi', [KasirController::class, 'verifikasi'])
                ->name('kasir.verifikasi');

            Route::put('/kasir/transaksi/{id}/selesai', [KasirController::class, 'selesai'])
                ->name('kasir.selesai');

            Route::delete('/kasir/transaksi/{id}', [KasirController::class, 'destroy'])
                ->name('kasir.destroy');

            Route::put('/kasir/pengiriman/{id}/resi', [ KasirController::class,'updateResi'   ])
               ->name('kasir.pengiriman.resi');

            Route::put('/kasir/pengiriman/{id}/status', [  KasirController::class,'updateStatusKirim'  ])
               ->name('kasir.pengiriman.status');

            Route::get('/kasir/pengiriman/{id}/label',[KasirController::class, 'printLabel'])
               ->name('kasir.pengiriman.label');

            Route::get('/kasir/transaksi/{id}/bukti', [KasirController::class, 'buktiPembayaran'])
            ->name('kasir.buktiPembayaran');

            Route::get('/kasir/transaksi/{id}/produk', [KasirController::class, 'buktiProduk'])
            ->name('kasir.buktiProduk');
        });


        });

        // PELANGGAN

        Route::middleware('role:owner,pelanggan')->group(function () {

            // Dashboard Belanja
            Route::get('/pelanggan', [PelangganController::class, 'dashboardBelanja'])
                ->name('pelanggan.dashboardBelanja');

            // Daftar Produk
            Route::get('/pelanggan/belanja', [PelangganController::class, 'belanja'])
                ->name('pelanggan.belanja');

            // Detail Produk
            Route::get('/pelanggan/detail/{id}', [PelangganController::class, 'detailProduk'])
                ->name('pelanggan.detailProduk');

            // WISHLIST
            Route::get('/pelanggan/wishlist', [WishlistController::class, 'index'])
                ->name('pelanggan.wishlist');

            Route::post('/pelanggan/wishlist/{produk}', [WishlistController::class, 'store'])
                ->name('pelanggan.wishlist.store');

            Route::delete('/pelanggan/wishlist/{produk}', [WishlistController::class, 'destroy'])
                ->name('pelanggan.wishlist.destroy');

            // Beli Sekarang
            Route::post('/pelanggan/beli-sekarang/{id}', [PelangganController::class, 'beliSekarang'])
                ->name('pelanggan.beliSekarang');

            // Keranjang
            Route::get('/pelanggan/keranjang', [PelangganController::class, 'keranjang'])
                ->name('pelanggan.keranjang');

            // Tambah ke Keranjang
            Route::post('/pelanggan/keranjang/tambah/{id}', [PelangganController::class, 'tambahKeranjang'])
                ->name('pelanggan.tambahKeranjang');

            // Hapus produk dari kerajang
            Route::delete('/pelanggan/keranjang/{id}', [PelangganController::class, 'destroy'])
                ->name('keranjang.destroy');

            // Checkout dari Keranjang
            Route::get('/pelanggan/checkout', [PelangganController::class, 'checkout'])
                ->name('pelanggan.checkout');

            // Proses Checkout
            Route::post('/pelanggan/checkout', [PelangganController::class, 'prosesCheckout'])
                ->name('pelanggan.prosesCheckout');

            // Alamat
            Route::get('/pelanggan/alamat/{id}', [PelangganController::class, 'alamat'])
                ->name('pelanggan.alamat');

            Route::post('/pelanggan/alamat/{id}', [PelangganController::class, 'simpanAlamat'])
                ->name('pelanggan.simpanAlamat');
            
            // Pembayaran
                Route::get('/pelanggan/pembayaran/{id}', [PelangganController::class, 'pembayaran'])
                    ->name('pelanggan.pembayaran');

            // Upload Bukti
            Route::post('/pelanggan/upload/{id}', [PelangganController::class, 'upload'])
                ->name('pelanggan.upload');

            // Dashboard Status Pesanan
            Route::get('/pelanggan/dashboard-status', [PelangganController::class, 'index'])
                ->name('pelanggan.index');

             // NOTIFIKASI
            Route::get('/pelanggan/notifikasi', function () {
                $notifications = auth()->user()->notifications;

                return view('pelanggan.notifikasi', compact('notifications'));
            })->name('pelanggan.notifikasi');

            //Riwayat
            Route::get('/pelanggan/riwayat', [PelangganController::class, 'riwayat'])
                ->name('pelanggan.riwayat');

            // Tracking Pengiriman
           Route::get('/pelanggan/pesanan/{id}/tracking', [ShippingController::class,'tracking'])
                 ->name('pelanggan.tracking');

            Route::delete('/pelanggan/transaksi/{id}', [PelangganController::class, 'destroyTransaksi'])
                  ->name('pelanggan.destroyTransaksi');

            // Upload Foto Produk Setelah Barang Diterima
            Route::post('/pelanggan/upload-foto-produk/{id}', [PelangganController::class,'uploadFotoProduk'])
                ->name('pelanggan.uploadFotoProduk');
             // REVIEW PRODUK
            Route::get(
                '/pelanggan/review/{detailTransaksi}',
                [ReviewController::class, 'create']
            )->name('pelanggan.review.create');

            Route::post(
                '/pelanggan/review/{detailTransaksi}',
                [ReviewController::class, 'store']
            )->name('pelanggan.review.store');

            Route::delete(
                '/pelanggan/review/{review}',
                [ReviewController::class, 'destroy']
            )->name('pelanggan.review.destroy');

        });

    require __DIR__.'/auth.php';