<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Retur;
use App\Models\Produk;
use App\Models\Stok;
use App\Models\Ukuran;
use App\Models\Warna;
use App\Models\Transaksi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReturController extends Controller
{
    public function index()
    {
        $returs = Retur::with([
            'produk',
            'transaksi',
            'ukuran',
            'warna'
        ])
        ->latest()
        ->get();

        return response()->json($returs);
    }

    public function create()
    {
        $produks = Produk::orderBy('nama_produk')->get();

        $transaksis = Transaksi::orderBy(
            'created_at',
            'desc'
        )->get();

        $ukurans = Ukuran::orderBy('nama_ukuran')->get();

        $warnas = Warna::orderBy('nama_warna')->get();

        return response()->json([
            'produks' => $produks,
            'transaksis' => $transaksis,
            'ukurans' => $ukurans,
            'warnas' => $warnas,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'transaksi_id' => 'required|exists:transaksis,id',
            'produk_id' => 'required|exists:produks,id',
            'ukuran_id' => 'nullable|exists:ukurans,id',
            'warna_id' => 'nullable|exists:warnas,id',
            'jumlah' => 'required|integer|min:1',
            'alasan' => 'required|string|max:255',
            'keterangan' => 'nullable|string',
            'tanggal_retur' => 'required|date',
        ]);

        $retur = DB::transaction(function () use ($validated) {
            $query = Stok::where(
                'produk_id',
                $validated['produk_id']
            );

            if (!empty($validated['ukuran_id'])) {
                $query->where(
                    'ukuran_id',
                    $validated['ukuran_id']
                );
            } else {
                $query->whereNull('ukuran_id');
            }

            if (!empty($validated['warna_id'])) {
                $query->where(
                    'warna_id',
                    $validated['warna_id']
                );
            } else {
                $query->whereNull('warna_id');
            }

            $stok = $query->lockForUpdate()->first();

            if ($stok) {
                $stok->increment(
                    'jumlah',
                    $validated['jumlah']
                );
            } else {
                Stok::create([
                    'produk_id' => $validated['produk_id'],
                    'ukuran_id' => $validated['ukuran_id'] ?? null,
                    'warna_id' => $validated['warna_id'] ?? null,
                    'jumlah' => $validated['jumlah'],
                ]);
            }

            return Retur::create([
                'transaksi_id' => $validated['transaksi_id'],
                'produk_id' => $validated['produk_id'],
                'ukuran_id' => $validated['ukuran_id'] ?? null,
                'warna_id' => $validated['warna_id'] ?? null,
                'jumlah' => $validated['jumlah'],
                'alasan' => $validated['alasan'],
                'keterangan' => $validated['keterangan'] ?? null,
                'tanggal_retur' => $validated['tanggal_retur'],
            ]);
        });

        $retur->load([
            'produk',
            'transaksi',
            'ukuran',
            'warna'
        ]);

        return response()->json([
            'message' => 'Retur berhasil disimpan dan stok telah dikembalikan.',
            'data' => $retur,
        ], 201);
    }

    public function show(Retur $retur)
    {
        $retur->load([
            'produk',
            'transaksi',
            'ukuran',
            'warna'
        ]);

        return response()->json($retur);
    }

    public function update(Request $request, Retur $retur)
    {
        $validated = $request->validate([
            'transaksi_id' => 'required|exists:transaksis,id',
            'produk_id' => 'required|exists:produks,id',
            'ukuran_id' => 'nullable|exists:ukurans,id',
            'warna_id' => 'nullable|exists:warnas,id',
            'jumlah' => 'required|integer|min:1',
            'alasan' => 'required|string|max:255',
            'keterangan' => 'nullable|string',
            'tanggal_retur' => 'required|date',
        ]);

        DB::transaction(function () use ($validated, $retur) {

            $queryStokLama = Stok::where(
                'produk_id',
                $retur->produk_id
            );

            if ($retur->ukuran_id) {
                $queryStokLama->where(
                    'ukuran_id',
                    $retur->ukuran_id
                );
            } else {
                $queryStokLama->whereNull('ukuran_id');
            }

            if ($retur->warna_id) {
                $queryStokLama->where(
                    'warna_id',
                    $retur->warna_id
                );
            } else {
                $queryStokLama->whereNull('warna_id');
            }

            $stokLama = $queryStokLama
                ->lockForUpdate()
                ->first();

            if ($stokLama) {
                $stokLama->decrement(
                    'jumlah',
                    $retur->jumlah
                );

                if ($stokLama->jumlah < 0) {
                    $stokLama->update([
                        'jumlah' => 0,
                    ]);
                }
            }

            $queryStokBaru = Stok::where(
                'produk_id',
                $validated['produk_id']
            );

            if (!empty($validated['ukuran_id'])) {
                $queryStokBaru->where(
                    'ukuran_id',
                    $validated['ukuran_id']
                );
            } else {
                $queryStokBaru->whereNull('ukuran_id');
            }

            if (!empty($validated['warna_id'])) {
                $queryStokBaru->where(
                    'warna_id',
                    $validated['warna_id']
                );
            } else {
                $queryStokBaru->whereNull('warna_id');
            }

            $stokBaru = $queryStokBaru
                ->lockForUpdate()
                ->first();

            if ($stokBaru) {
                $stokBaru->increment(
                    'jumlah',
                    $validated['jumlah']
                );
            } else {
                Stok::create([
                    'produk_id' => $validated['produk_id'],
                    'ukuran_id' => $validated['ukuran_id'] ?? null,
                    'warna_id' => $validated['warna_id'] ?? null,
                    'jumlah' => $validated['jumlah'],
                ]);
            }

            $retur->update([
                'transaksi_id' => $validated['transaksi_id'],
                'produk_id' => $validated['produk_id'],
                'ukuran_id' => $validated['ukuran_id'] ?? null,
                'warna_id' => $validated['warna_id'] ?? null,
                'jumlah' => $validated['jumlah'],
                'alasan' => $validated['alasan'],
                'keterangan' => $validated['keterangan'] ?? null,
                'tanggal_retur' => $validated['tanggal_retur'],
            ]);
        });

        $retur->load([
            'produk',
            'transaksi',
            'ukuran',
            'warna'
        ]);

        return response()->json([
            'message' => 'Data retur berhasil diperbarui dan stok telah disesuaikan.',
            'data' => $retur,
        ], 200);
    }

    public function destroy(Retur $retur)
    {
        DB::transaction(function () use ($retur) {
            $query = Stok::where(
                'produk_id',
                $retur->produk_id
            );

            if ($retur->ukuran_id) {
                $query->where(
                    'ukuran_id',
                    $retur->ukuran_id
                );
            } else {
                $query->whereNull('ukuran_id');
            }

            if ($retur->warna_id) {
                $query->where(
                    'warna_id',
                    $retur->warna_id
                );
            } else {
                $query->whereNull('warna_id');
            }

            $stok = $query->lockForUpdate()->first();

            if ($stok) {
                $jumlahBaru = max(
                    0,
                    $stok->jumlah - $retur->jumlah
                );

                $stok->update([
                    'jumlah' => $jumlahBaru
                ]);
            }

            $retur->delete();
        });

        return response()->json([
            'message' => 'Data retur berhasil dihapus.',
        ]);
    }
}