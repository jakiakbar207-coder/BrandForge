<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Transaksi;
use App\Models\DetailTransaksi;
use App\Models\Stok;
use App\Models\User;
use App\Models\Pengiriman;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class TransaksiController extends Controller
{
    public function index()
    {
        $transaksis = Transaksi::with([
            'user',
            'detailTransaksi.produk',
            'detailTransaksi.stok.ukuran',
            'detailTransaksi.stok.warna',
            'pembayaran',
            'pengiriman',
        ])
            ->latest()
            ->get();

        return response()->json($transaksis);
    }

    public function create()
    {
        $users = User::orderBy('name')->get();

        $stoks = Stok::with([
            'produk',
            'ukuran',
            'warna',
        ])
            ->where('jumlah', '>', 0)
            ->get();

        return response()->json([
            'users' => $users,
            'stoks' => $stoks,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'kode_transaksi' => 'required|string|max:255|unique:transaksis,kode_transaksi',
            'tanggal_transaksi' => 'required|date',
            'total_harga' => 'required|numeric|min:0',
            'bayar' => 'required|numeric|min:0',
        ]);

        if ($validated['bayar'] < $validated['total_harga']) {
            return response()->json([
                'message' => 'Uang pembayaran kurang.',
            ], 422);
        }

        $validated['kembalian'] =
            $validated['bayar'] - $validated['total_harga'];

        $transaksi = Transaksi::create($validated);

        $transaksi->load('user');

        return response()->json([
            'message' => 'Transaksi berhasil disimpan.',
            'data' => $transaksi,
        ], 201);
    }

    public function show($id)
    {
        $transaksi = Transaksi::with([
            'user',
            'detailTransaksi.produk',
            'detailTransaksi.stok.ukuran',
            'detailTransaksi.stok.warna',
            'pembayaran',
            'pengiriman',
            'reviews',
        ])->findOrFail($id);

        return response()->json($transaksi);
    }

    public function update(Request $request, $id)
    {
        $transaksi = Transaksi::findOrFail($id);

        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'kode_transaksi' => 'required|string|max:255|unique:transaksis,kode_transaksi,' . $transaksi->id,
            'tanggal_transaksi' => 'required|date',
            'total_harga' => 'required|numeric|min:0',
            'bayar' => 'required|numeric|min:0',
        ]);

        if ($validated['bayar'] < $validated['total_harga']) {
            return response()->json([
                'message' => 'Uang pembayaran kurang.',
            ], 422);
        }

        $validated['kembalian'] =
            $validated['bayar'] - $validated['total_harga'];

        $transaksi->update($validated);

        $transaksi->load('user');

        return response()->json([
            'message' => 'Transaksi berhasil diperbarui.',
            'data' => $transaksi,
        ]);
    }

    public function destroy($id)
    {
        $transaksi = Transaksi::findOrFail($id);

        $transaksi->delete();

        return response()->json([
            'message' => 'Transaksi berhasil dihapus.',
        ]);
    }

    public function kasirDashboard()
    {
        $menungguVerifikasi = Transaksi::where(
            'status',
            'Menunggu Verifikasi'
        )->count();

        $sedangDiproses = Transaksi::where(
            'status',
            'Diproses'
        )->count();

        $transaksiSelesai = Transaksi::where(
            'status',
            'Selesai'
        )->count();

        return response()->json([
            'menunggu_verifikasi' => $menungguVerifikasi,
            'sedang_diproses' => $sedangDiproses,
            'transaksi_selesai' => $transaksiSelesai,
        ]);
    }

    public function kasirIndex()
    {
        $transaksis = Transaksi::with([
            'user',
            'detailTransaksi.produk',
            'detailTransaksi.stok.ukuran',
            'detailTransaksi.stok.warna',
            'pembayaran',
            'pengiriman',
        ])
            ->latest()
            ->get();

        return response()->json($transaksis);
    }

    public function kasirCreate()
    {
        $stoks = Stok::with([
            'produk',
            'ukuran',
            'warna',
        ])
            ->where('jumlah', '>', 0)
            ->get();

        return response()->json([
            'stoks' => $stoks,
        ]);
    }

    public function kasirStore(Request $request)
    {
        $validated = $request->validate([
            'items' => 'required|array|min:1',
            'items.*.stok_id' => 'required|exists:stoks,id',
            'items.*.jumlah' => 'required|integer|min:1',
            'bayar' => 'required|numeric|min:0',
        ]);

        $user = Auth::user();

        if (!$user) {
            return response()->json([
                'message' => 'User belum terautentikasi.',
            ], 401);
        }

        try {
            $transaksi = DB::transaction(function () use (
                $validated,
                $user
            ) {
                $totalHarga = 0;
                $detailItems = [];

                foreach ($validated['items'] as $item) {
                    $stok = Stok::with([
                        'produk',
                        'ukuran',
                        'warna',
                    ])
                        ->lockForUpdate()
                        ->findOrFail($item['stok_id']);

                    $jumlah = $item['jumlah'];

                    if ($stok->jumlah < $jumlah) {
                        throw new \Exception(
                            'Stok produk "' .
                            ($stok->produk->nama_produk ?? '-') .
                            '" tidak mencukupi.'
                        );
                    }

                    if (!$stok->produk) {
                        throw new \Exception(
                            'Produk pada stok tidak ditemukan.'
                        );
                    }

                    $harga = (float) $stok->produk->harga;
                    $subtotal = $harga * $jumlah;

                    $totalHarga += $subtotal;

                    $detailItems[] = [
                        'stok' => $stok,
                        'produk_id' => $stok->produk_id,
                        'jumlah' => $jumlah,
                        'harga' => $harga,
                        'subtotal' => $subtotal,
                    ];
                }

                $bayar = (float) $validated['bayar'];

                if ($bayar < $totalHarga) {
                    throw new \Exception(
                        'Uang pembayaran kurang. Total transaksi Rp ' .
                        number_format(
                            $totalHarga,
                            0,
                            ',',
                            '.'
                        ) .
                        '.'
                    );
                }

                $kodeTransaksi =
                    'TRX-' .
                    now()->format('YmdHis') .
                    '-' .
                    strtoupper(
                        substr(uniqid(), -4)
                    );

                $transaksi = Transaksi::create([
                    'user_id' => $user->id,
                    'kode_transaksi' => $kodeTransaksi,
                    'tanggal_transaksi' => now(),
                    'total_harga' => $totalHarga,
                    'bayar' => $bayar,
                    'kembalian' => $bayar - $totalHarga,
                    'status' => 'Diproses',
                ]);

                foreach ($detailItems as $item) {
                    DetailTransaksi::create([
                        'transaksi_id' => $transaksi->id,
                        'stok_id' => $item['stok']->id,
                        'produk_id' => $item['produk_id'],
                        'jumlah' => $item['jumlah'],
                        'harga' => $item['harga'],
                        'subtotal' => $item['subtotal'],
                    ]);

                    $item['stok']->decrement(
                        'jumlah',
                        $item['jumlah']
                    );
                }

                return $transaksi;
            });

            $transaksi->load([
                'user',
                'detailTransaksi.produk',
                'detailTransaksi.stok.ukuran',
                'detailTransaksi.stok.warna',
            ]);

            return response()->json([
                'message' => 'Transaksi Kasir berhasil disimpan.',
                'data' => $transaksi,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    public function kasirShow($id)
    {
        $transaksi = Transaksi::with([
            'user',
            'detailTransaksi.produk',
            'detailTransaksi.stok.ukuran',
            'detailTransaksi.stok.warna',
            'pembayaran',
            'pengiriman',
        ])->findOrFail($id);

        return response()->json($transaksi);
    }

    public function kasirVerifikasi($id)
    {
        $transaksi = Transaksi::findOrFail($id);

        $transaksi->update([
            'bayar' => $transaksi->total_harga,
            'kembalian' => 0,
            'status' => 'Diproses',
        ]);

        if ($transaksi->pembayaran) {
            $transaksi->pembayaran->update([
                'status' => 'Terverifikasi',
            ]);
        }

        $transaksi->load([
            'user',
            'pembayaran',
            'pengiriman',
            'detailTransaksi.produk',
            'detailTransaksi.stok.ukuran',
            'detailTransaksi.stok.warna',
        ]);

        return response()->json([
            'message' => 'Pembayaran berhasil diverifikasi.',
            'data' => $transaksi,
        ]);
    }

    public function kasirSelesai($id)
    {
        $transaksi = Transaksi::findOrFail($id);

        $transaksi->update([
            'bayar' => $transaksi->total_harga,
            'kembalian' => 0,
            'status' => 'Selesai',
        ]);

        $transaksi->load([
            'user',
            'pembayaran',
            'pengiriman',
            'detailTransaksi.produk',
            'detailTransaksi.stok.ukuran',
            'detailTransaksi.stok.warna',
        ]);

        return response()->json([
            'message' => 'Transaksi berhasil diselesaikan.',
            'data' => $transaksi,
        ]);
    }

    public function kasirDestroy($id)
    {
        $transaksi = Transaksi::with(
            'detailTransaksi'
        )->findOrFail($id);

        try {
            DB::transaction(function () use ($transaksi) {
                foreach ($transaksi->detailTransaksi as $detail) {
                    $stok = Stok::lockForUpdate()
                        ->find($detail->stok_id);

                    if ($stok) {
                        $stok->increment(
                            'jumlah',
                            $detail->jumlah
                        );
                    }
                }

                $transaksi->delete();
            });

            return response()->json([
                'message' => 'Transaksi Kasir berhasil dihapus.',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    public function kasirUpdateResi(Request $request, $id)
    {
        $validated = $request->validate([
            'nomor_resi' => 'required|string|max:255',
        ]);

        $transaksi = Transaksi::with('pengiriman')
            ->findOrFail($id);

        if (!$transaksi->pengiriman) {
            return response()->json([
                'message' => 'Data pengiriman tidak ditemukan.',
            ], 404);
        }

        $transaksi->pengiriman->update([
            'nomor_resi' => $validated['nomor_resi'],
            'status' => 'dikirim',
        ]);

        $transaksi->load('pengiriman');

        return response()->json([
            'message' => 'Nomor resi berhasil diperbarui.',
            'data' => $transaksi,
        ]);
    }

    public function kasirUpdateStatusKirim(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => 'required|in:menunggu,diproses,dikemas,dikirim,selesai',
        ]);

        $transaksi = Transaksi::with('pengiriman')
            ->findOrFail($id);

        if (!$transaksi->pengiriman) {
            return response()->json([
                'message' => 'Data pengiriman tidak ditemukan.',
            ], 404);
        }

        $transaksi->pengiriman->update([
            'status' => $validated['status'],
        ]);

        $transaksi->load('pengiriman');

        return response()->json([
            'message' => 'Status pengiriman berhasil diperbarui.',
            'data' => $transaksi,
        ]);
    }

    public function kasirPrintLabel($id)
    {
        $transaksi = Transaksi::with([
            'user',
            'pengiriman',
            'detailTransaksi.produk',
            'detailTransaksi.stok.ukuran',
            'detailTransaksi.stok.warna',
        ])->findOrFail($id);

        return response()->json([
            'message' => 'Data label pengiriman berhasil diambil.',
            'data' => $transaksi,
        ]);
    }

    public function kasirBuktiPembayaran($id)
    {
        $transaksi = Transaksi::with([
            'user',
            'pembayaran',
            'detailTransaksi.produk',
            'detailTransaksi.stok.ukuran',
            'detailTransaksi.stok.warna',
        ])->findOrFail($id);

        return response()->json([
            'message' => 'Data bukti pembayaran berhasil diambil.',
            'data' => $transaksi,
        ]);
    }

    public function kasirBuktiProduk($id)
    {
        $transaksi = Transaksi::with([
            'user',
            'detailTransaksi.produk',
            'detailTransaksi.stok.ukuran',
            'detailTransaksi.stok.warna',
        ])->findOrFail($id);

        return response()->json([
            'message' => 'Data bukti produk berhasil diambil.',
            'data' => $transaksi,
        ]);
    }

    public function kasirStruk($id)
    {
        $transaksi = Transaksi::with([
            'user',
            'pembayaran',
            'pengiriman',
            'detailTransaksi.produk',
            'detailTransaksi.stok.ukuran',
            'detailTransaksi.stok.warna',
        ])->findOrFail($id);

        return response()->json([
            'message' => 'Data struk berhasil diambil.',
            'data' => $transaksi,
        ]);
    }
}