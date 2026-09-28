<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Keranjang;
use App\Models\Produk;
use App\Models\Transaksi;
use App\Models\DetailTransaksi;
use App\Models\Stok;
use App\Models\Pengiriman;
use App\Models\Notification;
use App\Models\Wishlist;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class PelangganController extends Controller
{
    public function dashboard()
    {
        $userId = Auth::id();

        $jumlahKeranjang = Keranjang::where(
            'user_id',
            $userId
        )->count();

        $totalProduk = Produk::count();

        $totalPesanan = Transaksi::where(
            'user_id',
            $userId
        )->count();

        $pesananSelesai = Transaksi::where(
            'user_id',
            $userId
        )
            ->where('status', 'Selesai')
            ->count();

        $jumlahWishlist = Wishlist::where(
            'user_id',
            $userId
        )->count();

        $produkTerbaru = Produk::with([
            'kategori',
            'koleksi',
            'stokData.warna',
            'stokData.ukuran',
            'fotos',
        ])
            ->whereHas('stokData', function ($query) {
                $query->where('jumlah', '>', 0);
            })
            ->latest()
            ->take(8)
            ->get();

        $produkTerlaris = Produk::with([
            'kategori',
            'koleksi',
            'stokData.warna',
            'stokData.ukuran',
            'fotos',
        ])
            ->withSum(
                'detailTransaksi',
                'jumlah'
            )
            ->whereHas('stokData', function ($query) {
                $query->where('jumlah', '>', 0);
            })
            ->orderByDesc(
                'detail_transaksi_sum_jumlah'
            )
            ->take(4)
            ->get();

        $produkRekomendasi = Produk::with([
            'kategori',
            'koleksi',
            'stokData.warna',
            'stokData.ukuran',
            'fotos',
        ])
            ->withSum(
                'detailTransaksi',
                'jumlah'
            )
            ->whereHas('stokData', function ($query) {
                $query->where('jumlah', '>', 0);
            })
            ->latest()
            ->take(4)
            ->get();

        return response()->json([
            'message' => 'Dashboard pelanggan berhasil diambil.',
            'data' => [
                'jumlah_keranjang' => $jumlahKeranjang,
                'total_produk' => $totalProduk,
                'total_pesanan' => $totalPesanan,
                'pesanan_selesai' => $pesananSelesai,
                'jumlah_wishlist' => $jumlahWishlist,
                'produk_terbaru' => $produkTerbaru,
                'produk_terlaris' => $produkTerlaris,
                'produk_rekomendasi' => $produkRekomendasi,
            ],
        ]);
    }

    public function status()
    {
        $userId = Auth::id();

        $total = Transaksi::where(
            'user_id',
            $userId
        )->count();

        $belumBayar = Transaksi::where(
            'user_id',
            $userId
        )
            ->where(
                'status',
                'Belum Bayar'
            )
            ->count();

        $menungguVerifikasi = Transaksi::where(
            'user_id',
            $userId
        )
            ->where(
                'status',
                'Menunggu Verifikasi'
            )
            ->count();

        $diproses = Transaksi::where(
            'user_id',
            $userId
        )
            ->where(
                'status',
                'Diproses'
            )
            ->count();

        $dikirim = Transaksi::where(
            'user_id',
            $userId
        )
            ->whereHas('pengiriman', function ($query) {
                $query->where(
                    'status',
                    'dikirim'
                );
            })
            ->count();

        $selesai = Transaksi::where(
            'user_id',
            $userId
        )
            ->where(
                'status',
                'Selesai'
            )
            ->count();

        return response()->json([
            'message' => 'Status pesanan berhasil diambil.',
            'data' => [
                'total' => $total,
                'belum_bayar' => $belumBayar,
                'menunggu_verifikasi' => $menungguVerifikasi,
                'diproses' => $diproses,
                'dikirim' => $dikirim,
                'selesai' => $selesai,
            ],
        ]);
    }

    public function beliSekarang(
        Request $request,
        $id
    ) {
        $validated = $request->validate([
            'warna_id' => 'required|exists:warna,id_warna',
            'ukuran_id' => 'required|exists:ukuran,id_ukuran',
            'jumlah' => 'required|integer|min:1',
        ]);

        try {
            $transaksi = DB::transaction(
                function () use (
                    $validated,
                    $id
                ) {
                    $produk = Produk::findOrFail($id);

                    $stok = Stok::where(
                        'produk_id',
                        $produk->id_produk
                    )
                        ->where(
                            'warna_id',
                            $validated['warna_id']
                        )
                        ->where(
                            'ukuran_id',
                            $validated['ukuran_id']
                        )
                        ->where(
                            'jumlah',
                            '>',
                            0
                        )
                        ->lockForUpdate()
                        ->first();

                    if (!$stok) {
                        throw new \Exception(
                            'Stok produk dengan ukuran dan warna yang dipilih tidak tersedia.'
                        );
                    }

                    if (
                        $validated['jumlah'] >
                        $stok->jumlah
                    ) {
                        throw new \Exception(
                            'Jumlah melebihi stok yang tersedia.'
                        );
                    }

                    $harga = (float) $produk->harga;

                    $subtotal =
                        $harga *
                        $validated['jumlah'];

                    $ongkir = 10000;

                    $total =
                        $subtotal +
                        $ongkir;

                    $kodeTransaksi =
                        'TRX-' .
                        now()->format('YmdHis') .
                        '-' .
                        strtoupper(
                            substr(
                                uniqid(),
                                -4
                            )
                        );

                    $transaksi = Transaksi::create([
                        'user_id' => Auth::id(),
                        'kode_transaksi' => $kodeTransaksi,
                        'tanggal_transaksi' => now(),
                        'total_harga' => $total,
                        'bayar' => 0,
                        'kembalian' => 0,
                        'ongkir' => $ongkir,
                        'status' => 'Belum Bayar',
                    ]);

                    DetailTransaksi::create([
                        'transaksi_id' => $transaksi->id,
                        'stok_id' => $stok->id,
                        'produk_id' => $produk->id_produk,
                        'jumlah' => $validated['jumlah'],
                        'harga' => $harga,
                        'subtotal' => $subtotal,
                    ]);

                    $stok->decrement(
                        'jumlah',
                        $validated['jumlah']
                    );

                    Pengiriman::create([
                        'transaksi_id' => $transaksi->id,
                        'kurir' => null,
                        'layanan' => null,
                        'ongkir' => $ongkir,
                        'nomor_resi' => null,
                        'status' => 'menunggu',
                    ]);

                    return $transaksi;
                }
            );

            $transaksi->load([
                'detailTransaksi.produk',
                'detailTransaksi.stok.ukuran',
                'detailTransaksi.stok.warna',
                'pengiriman',
            ]);

            return response()->json([
                'message' => 'Produk berhasil dibeli.',
                'data' => $transaksi,
            ], 201);
        } catch (\Throwable $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    public function keranjang()
    {
        $keranjang = Keranjang::with([
            'produk.kategori',
            'produk.koleksi',
            'ukuran',
            'warna',
        ])
            ->where(
                'user_id',
                Auth::id()
            )
            ->latest()
            ->get();

        $total = $keranjang->sum(
            function ($item) {
                return
                    (float) $item->produk->harga *
                    (int) $item->jumlah;
            }
        );

        return response()->json([
            'message' => 'Keranjang berhasil diambil.',
            'data' => $keranjang,
            'total' => $total,
        ]);
    }

    public function tambahKeranjang(
        Request $request,
        $id
    ) {
        $validated = $request->validate([
            'warna_id' => 'required|exists:warna,id_warna',
            'ukuran_id' => 'required|exists:ukuran,id_ukuran',
            'jumlah' => 'required|integer|min:1',
        ]);

        $stok = Stok::where(
            'produk_id',
            $id
        )
            ->where(
                'warna_id',
                $validated['warna_id']
            )
            ->where(
                'ukuran_id',
                $validated['ukuran_id']
            )
            ->where(
                'jumlah',
                '>',
                0
            )
            ->lockForUpdate()
            ->first();

        if (!$stok) {
            return response()->json([
                'message' => 'Stok produk tidak tersedia.',
            ], 422);
        }

        if (
            $validated['jumlah'] >
            $stok->jumlah
        ) {
            return response()->json([
                'message' => 'Jumlah melebihi stok yang tersedia.',
            ], 422);
        }

        $keranjang = Keranjang::where(
            'user_id',
            Auth::id()
        )
            ->where(
                'produk_id',
                $id
            )
            ->where(
                'warna_id',
                $validated['warna_id']
            )
            ->where(
                'ukuran_id',
                $validated['ukuran_id']
            )
            ->first();

        if ($keranjang) {
            $jumlahBaru =
                $keranjang->jumlah +
                $validated['jumlah'];

            if (
                $jumlahBaru >
                $stok->jumlah
            ) {
                return response()->json([
                    'message' => 'Jumlah keranjang melebihi stok yang tersedia.',
                ], 422);
            }

            $keranjang->update([
                'jumlah' => $jumlahBaru,
            ]);
        } else {
            $keranjang = Keranjang::create([
                'user_id' => Auth::id(),
                'produk_id' => $id,
                'warna_id' => $validated['warna_id'],
                'ukuran_id' => $validated['ukuran_id'],
                'jumlah' => $validated['jumlah'],
            ]);
        }

        $keranjang->load([
            'produk',
            'warna',
            'ukuran',
        ]);

        return response()->json([
            'message' => 'Produk berhasil ditambahkan ke keranjang.',
            'data' => $keranjang,
        ], 201);
    }

    public function hapusKeranjang($id)
    {
        $keranjang = Keranjang::where(
            'user_id',
            Auth::id()
        )->findOrFail($id);

        $keranjang->delete();

        return response()->json([
            'message' => 'Produk berhasil dihapus dari keranjang.',
        ]);
    }

    public function checkout()
    {
        $keranjang = Keranjang::with([
            'produk.kategori',
            'produk.koleksi',
            'ukuran',
            'warna',
        ])
            ->where(
                'user_id',
                Auth::id()
            )
            ->get();

        if ($keranjang->isEmpty()) {
            return response()->json([
                'message' => 'Keranjang masih kosong.',
            ], 422);
        }

        $hargaProduk = $keranjang->sum(
            function ($item) {
                return
                    (float) $item->produk->harga *
                    (int) $item->jumlah;
            }
        );

        $ongkir = 10000;

        return response()->json([
            'message' => 'Data checkout berhasil diambil.',
            'data' => [
                'keranjang' => $keranjang,
                'harga_produk' => $hargaProduk,
                'ongkir' => $ongkir,
                'total' => $hargaProduk + $ongkir,
            ],
        ]);
    }

    public function prosesCheckout(
        Request $request
    ) {
        $userId = Auth::id();

        try {
            $transaksi = DB::transaction(
                function () use ($userId) {
                    $keranjang = Keranjang::with([
                        'produk',
                        'warna',
                        'ukuran',
                    ])
                        ->where(
                            'user_id',
                            $userId
                        )
                        ->get();

                    if ($keranjang->isEmpty()) {
                        throw new \Exception(
                            'Keranjang masih kosong.'
                        );
                    }

                    $hargaProduk = 0;
                    $detailItems = [];

                    foreach ($keranjang as $item) {
                        $stok = Stok::where(
                            'produk_id',
                            $item->produk_id
                        )
                            ->where(
                                'warna_id',
                                $item->warna_id
                            )
                            ->where(
                                'ukuran_id',
                                $item->ukuran_id
                            )
                            ->lockForUpdate()
                            ->first();

                        if (!$stok) {
                            throw new \Exception(
                                'Stok produk tidak ditemukan.'
                            );
                        }

                        if (
                            $stok->jumlah <
                            $item->jumlah
                        ) {
                            throw new \Exception(
                                'Stok produk "' .
                                $item->produk->nama_produk .
                                '" tidak mencukupi.'
                            );
                        }

                        $harga = (float) $item->produk->harga;

                        $subtotal =
                            $harga *
                            $item->jumlah;

                        $hargaProduk += $subtotal;

                        $detailItems[] = [
                            'stok_id' => $stok->id,
                            'produk_id' => $item->produk_id,
                            'jumlah' => $item->jumlah,
                            'harga' => $harga,
                            'subtotal' => $subtotal,
                        ];
                    }

                    $ongkir = 10000;

                    $total =
                        $hargaProduk +
                        $ongkir;

                    $kodeTransaksi =
                        'TRX-' .
                        now()->format('YmdHis') .
                        '-' .
                        strtoupper(
                            substr(
                                uniqid(),
                                -4
                            )
                        );

                    $transaksi = Transaksi::create([
                        'user_id' => $userId,
                        'kode_transaksi' => $kodeTransaksi,
                        'tanggal_transaksi' => now(),
                        'total_harga' => $total,
                        'bayar' => 0,
                        'kembalian' => 0,
                        'ongkir' => $ongkir,
                        'status' => 'Belum Bayar',
                    ]);

                    foreach ($detailItems as $item) {
                        DetailTransaksi::create([
                            'transaksi_id' => $transaksi->id,
                            'stok_id' => $item['stok_id'],
                            'produk_id' => $item['produk_id'],
                            'jumlah' => $item['jumlah'],
                            'harga' => $item['harga'],
                            'subtotal' => $item['subtotal'],
                        ]);

                        Stok::where(
                            'id',
                            $item['stok_id']
                        )->decrement(
                            'jumlah',
                            $item['jumlah']
                        );
                    }

                    Pengiriman::create([
                        'transaksi_id' => $transaksi->id,
                        'kurir' => null,
                        'layanan' => null,
                        'ongkir' => $ongkir,
                        'nomor_resi' => null,
                        'status' => 'menunggu',
                    ]);

                    Keranjang::where(
                        'user_id',
                        $userId
                    )->delete();

                    return $transaksi;
                }
            );

            $transaksi->load([
                'detailTransaksi.produk',
                'detailTransaksi.stok.ukuran',
                'detailTransaksi.stok.warna',
                'pengiriman',
            ]);

            return response()->json([
                'message' => 'Checkout berhasil dibuat.',
                'data' => $transaksi,
            ], 201);
        } catch (\Throwable $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    public function alamat($id)
    {
        $transaksi = Transaksi::where(
            'user_id',
            Auth::id()
        )
            ->with('pengiriman')
            ->findOrFail($id);

        return response()->json([
            'message' => 'Data alamat berhasil diambil.',
            'data' => $transaksi,
        ]);
    }

    public function simpanAlamat(
        Request $request,
        $id
    ) {
        $transaksi = Transaksi::where(
            'user_id',
            Auth::id()
        )->findOrFail($id);

        $validated = $request->validate([
            'nama_penerima' => 'required|string|max:255',
            'alamat' => 'required|string',
            'no_hp' => 'required|string|max:30',
            'kurir' => 'required|string|max:100',
            'layanan' => 'required|string|max:100',
        ]);

        $ongkir = 10000;

        $transaksi->update([
            'nama_penerima' => $validated['nama_penerima'],
            'alamat' => $validated['alamat'],
            'no_hp' => $validated['no_hp'],
            'ongkir' => $ongkir,
            'total_harga' =>
                $transaksi->total_harga -
                (float) $transaksi->ongkir +
                $ongkir,
        ]);

        $pengiriman = Pengiriman::updateOrCreate(
            [
                'transaksi_id' => $transaksi->id,
            ],
            [
                'kurir' => $validated['kurir'],
                'layanan' => $validated['layanan'],
                'ongkir' => $ongkir,
                'nomor_resi' => null,
                'status' => 'menunggu',
            ]
        );

        $transaksi->load('pengiriman');

        return response()->json([
            'message' => 'Alamat pengiriman berhasil disimpan.',
            'data' => [
                'transaksi' => $transaksi,
                'pengiriman' => $pengiriman,
            ],
        ]);
    }

    public function riwayat()
    {
        $transaksis = Transaksi::where(
            'user_id',
            Auth::id()
        )
            ->with([
                'pengiriman',
                'pembayaran',
                'detailTransaksi.produk.kategori',
                'detailTransaksi.produk.koleksi',
                'detailTransaksi.stok.ukuran',
                'detailTransaksi.stok.warna',
            ])
            ->latest()
            ->get();

        return response()->json([
            'message' => 'Riwayat transaksi berhasil diambil.',
            'data' => $transaksis,
        ]);
    }

    public function destroyTransaksi($id)
    {
        $transaksi = Transaksi::where(
            'user_id',
            Auth::id()
        )->findOrFail($id);

        try {
            DB::transaction(
                function () use ($transaksi) {
                    $transaksi->load(
                        'detailTransaksi'
                    );

                    foreach (
                        $transaksi->detailTransaksi as $detail
                    ) {
                        $stok = Stok::lockForUpdate()
                            ->find($detail->stok_id);

                        if ($stok) {
                            $stok->increment(
                                'jumlah',
                                $detail->jumlah
                            );
                        }
                    }

                    $transaksi
                        ->detailTransaksi()
                        ->delete();

                    if ($transaksi->pembayaran) {
                        $transaksi
                            ->pembayaran()
                            ->delete();
                    }

                    if ($transaksi->pengiriman) {
                        $transaksi
                            ->pengiriman()
                            ->delete();
                    }

                    $transaksi->delete();
                }
            );

            return response()->json([
                'message' => 'Transaksi berhasil dibatalkan.',
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    public function uploadFotoProduk(
        Request $request,
        $id
    ) {
        $transaksi = Transaksi::where(
            'user_id',
            Auth::id()
        )
            ->with('pengiriman')
            ->findOrFail($id);

        $request->validate([
            'foto_produk' =>
                'required|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        $folder = public_path('foto_produk');

        if (!is_dir($folder)) {
            mkdir(
                $folder,
                0755,
                true
            );
        }

        $namaFile =
            time() .
            '.' .
            $request->foto_produk->extension();

        $request->foto_produk->move(
            $folder,
            $namaFile
        );

        if ($transaksi->pengiriman) {
            $transaksi
                ->pengiriman
                ->update([
                    'foto_produk' => $namaFile,
                ]);
        }

        $transaksi->load('pengiriman');

        return response()->json([
            'message' => 'Foto produk berhasil diupload.',
            'data' => $transaksi,
        ]);
    }

    public function notifikasi()
    {
        $notifikasi = Notification::where(
            'user_id',
            Auth::id()
        )
            ->latest()
            ->get();

        return response()->json([
            'message' => 'Notifikasi berhasil diambil.',
            'data' => $notifikasi,
        ]);
    }
}