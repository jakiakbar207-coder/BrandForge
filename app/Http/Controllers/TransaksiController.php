<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DetailTransaksi;
use App\Models\Stok;
use App\Models\Transaksi;
use App\Models\User;
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

    public function kasirIndex()
    {
        $transaksis = Transaksi::with([
            'user',
            'detailTransaksi.produk',
            'detailTransaksi.stok.ukuran',
            'detailTransaksi.stok.warna',
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

                    if (!$stok->produk) {
                        throw new \Exception(
                            'Produk pada stok tidak ditemukan.'
                        );
                    }

                    $jumlah = $item['jumlah'];

                    if ($stok->jumlah < $jumlah) {
                        throw new \Exception(
                            'Stok produk "' .
                            $stok->produk->nama_produk .
                            '" tidak mencukupi.'
                        );
                    }

                    $harga = (float) $stok->produk->harga;
                    $subtotal = $harga * $jumlah;

                    $totalHarga += $subtotal;

                    $detailItems[] = [
                        'stok_id' => $stok->id,
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

                    Stok::where('id', $item['stok_id'])
                        ->decrement(
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
}