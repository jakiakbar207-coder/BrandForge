<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Pembelian;
use App\Models\PembelianDetail;
use App\Models\Supplier;
use App\Models\Produk;
use App\Models\Ukuran;
use App\Models\Warna;
use App\Models\Stok;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PembelianController extends Controller
{
    public function index()
    {
        $pembelians = Pembelian::with('supplier')
            ->latest()
            ->get();

        return response()->json($pembelians, 200);
    }

    public function create()
    {
        $suppliers = Supplier::orderBy('nama_supplier')->get();
        $produks = Produk::orderBy('nama_produk')->get();
        $ukurans = Ukuran::orderBy('nama_ukuran')->get();
        $warnas = Warna::orderBy('nama_warna')->get();

        return response()->json([
            'suppliers' => $suppliers,
            'produks' => $produks,
            'ukurans' => $ukurans,
            'warnas' => $warnas,
        ], 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'supplier_id' => 'required|exists:suppliers,id',
            'tanggal_pembelian' => 'required|date',
            'catatan' => 'nullable|string',

            'produk_id' => 'required|array|min:1',
            'produk_id.*' => 'required|exists:produks,id',

            'ukuran_id' => 'nullable|array',
            'ukuran_id.*' => 'nullable|exists:ukurans,id',

            'warna_id' => 'nullable|array',
            'warna_id.*' => 'nullable|exists:warnas,id',

            'jumlah' => 'required|array|min:1',
            'jumlah.*' => 'required|integer|min:1',

            'harga_modal' => 'required|array|min:1',
            'harga_modal.*' => 'required|numeric|min:0',
        ]);

        $pembelian = DB::transaction(function () use ($validated) {
            $totalHarga = 0;

            foreach ($validated['produk_id'] as $index => $produkId) {
                $jumlah = $validated['jumlah'][$index];
                $hargaModal = $validated['harga_modal'][$index];

                $totalHarga += $jumlah * $hargaModal;
            }

            $pembelian = Pembelian::create([
                'supplier_id' => $validated['supplier_id'],
                'tanggal_pembelian' => $validated['tanggal_pembelian'],
                'total_harga' => $totalHarga,
                'keterangan' => $validated['catatan'] ?? null,
            ]);

            foreach ($validated['produk_id'] as $index => $produkId) {
                $ukuranId = $validated['ukuran_id'][$index] ?? null;
                $warnaId = $validated['warna_id'][$index] ?? null;
                $jumlah = $validated['jumlah'][$index];
                $hargaModal = $validated['harga_modal'][$index];

                PembelianDetail::create([
                    'pembelian_id' => $pembelian->id,
                    'produk_id' => $produkId,
                    'ukuran_id' => $ukuranId,
                    'warna_id' => $warnaId,
                    'jumlah' => $jumlah,
                    'harga_modal' => $hargaModal,
                    'subtotal' => $jumlah * $hargaModal,
                ]);

                $stok = Stok::where('produk_id', $produkId)
                    ->where('ukuran_id', $ukuranId)
                    ->where('warna_id', $warnaId)
                    ->first();

                if ($stok) {
                    $stok->increment('jumlah', $jumlah);
                } else {
                    Stok::create([
                        'produk_id' => $produkId,
                        'ukuran_id' => $ukuranId,
                        'warna_id' => $warnaId,
                        'jumlah' => $jumlah,
                    ]);
                }
            }

            return $pembelian;
        });

        $pembelian->load([
            'supplier',
            'details.produk',
            'details.ukuran',
            'details.warna',
        ]);

        return response()->json([
            'message' => 'Pembelian berhasil disimpan dan stok berhasil ditambahkan.',
            'data' => $pembelian,
        ], 201);
    }

    public function show(Pembelian $pembelian)
    {
        $pembelian->load([
            'supplier',
            'details.produk',
            'details.ukuran',
            'details.warna',
        ]);

        return response()->json($pembelian, 200);
    }

    public function update(Request $request, Pembelian $pembelian)
    {
        $validated = $request->validate([
            'supplier_id' => 'required|exists:suppliers,id',
            'tanggal_pembelian' => 'required|date',
            'catatan' => 'nullable|string',

            'produk_id' => 'required|array|min:1',
            'produk_id.*' => 'required|exists:produks,id',

            'ukuran_id' => 'nullable|array',
            'ukuran_id.*' => 'nullable|exists:ukurans,id',

            'warna_id' => 'nullable|array',
            'warna_id.*' => 'nullable|exists:warnas,id',

            'jumlah' => 'required|array|min:1',
            'jumlah.*' => 'required|integer|min:1',

            'harga_modal' => 'required|array|min:1',
            'harga_modal.*' => 'required|numeric|min:0',
        ]);

        DB::transaction(function () use ($validated, $pembelian) {

            $pembelian->load('details');

            /*
             * Kembalikan stok seperti sebelum pembelian lama dibuat.
             */
            foreach ($pembelian->details as $detail) {
                $stok = Stok::where('produk_id', $detail->produk_id)
                    ->where('ukuran_id', $detail->ukuran_id)
                    ->where('warna_id', $detail->warna_id)
                    ->first();

                if ($stok) {
                    $stok->decrement('jumlah', $detail->jumlah);

                    if ($stok->jumlah < 0) {
                        $stok->update([
                            'jumlah' => 0,
                        ]);
                    }
                }
            }

            /*
             * Hapus detail pembelian lama.
             */
            $pembelian->details()->delete();

            /*
             * Hitung ulang total pembelian.
             */
            $totalHarga = 0;

            foreach ($validated['produk_id'] as $index => $produkId) {
                $jumlah = $validated['jumlah'][$index];
                $hargaModal = $validated['harga_modal'][$index];

                $totalHarga += $jumlah * $hargaModal;
            }

            /*
             * Update data utama pembelian.
             */
            $pembelian->update([
                'supplier_id' => $validated['supplier_id'],
                'tanggal_pembelian' => $validated['tanggal_pembelian'],
                'total_harga' => $totalHarga,
                'keterangan' => $validated['catatan'] ?? null,
            ]);

            /*
             * Buat ulang detail dan tambahkan stok baru.
             */
            foreach ($validated['produk_id'] as $index => $produkId) {
                $ukuranId = $validated['ukuran_id'][$index] ?? null;
                $warnaId = $validated['warna_id'][$index] ?? null;
                $jumlah = $validated['jumlah'][$index];
                $hargaModal = $validated['harga_modal'][$index];

                PembelianDetail::create([
                    'pembelian_id' => $pembelian->id,
                    'produk_id' => $produkId,
                    'ukuran_id' => $ukuranId,
                    'warna_id' => $warnaId,
                    'jumlah' => $jumlah,
                    'harga_modal' => $hargaModal,
                    'subtotal' => $jumlah * $hargaModal,
                ]);

                $stok = Stok::where('produk_id', $produkId)
                    ->where('ukuran_id', $ukuranId)
                    ->where('warna_id', $warnaId)
                    ->first();

                if ($stok) {
                    $stok->increment('jumlah', $jumlah);
                } else {
                    Stok::create([
                        'produk_id' => $produkId,
                        'ukuran_id' => $ukuranId,
                        'warna_id' => $warnaId,
                        'jumlah' => $jumlah,
                    ]);
                }
            }
        });

        $pembelian->load([
            'supplier',
            'details.produk',
            'details.ukuran',
            'details.warna',
        ]);

        return response()->json([
            'message' => 'Pembelian berhasil diperbarui dan stok berhasil disesuaikan.',
            'data' => $pembelian,
        ], 200);
    }

    public function destroy(Pembelian $pembelian)
    {
        DB::transaction(function () use ($pembelian) {
            $pembelian->load('details');

            foreach ($pembelian->details as $detail) {
                $stok = Stok::where('produk_id', $detail->produk_id)
                    ->where('ukuran_id', $detail->ukuran_id)
                    ->where('warna_id', $detail->warna_id)
                    ->first();

                if ($stok) {
                    $stok->decrement('jumlah', $detail->jumlah);

                    if ($stok->jumlah < 0) {
                        $stok->update([
                            'jumlah' => 0,
                        ]);
                    }
                }
            }

            $pembelian->details()->delete();
            $pembelian->delete();
        });

        return response()->json([
            'message' => 'Pembelian berhasil dihapus.',
        ], 200);
    }
}