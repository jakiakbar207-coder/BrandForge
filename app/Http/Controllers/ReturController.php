<?php

namespace App\Http\Controllers;

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

        return view('admin.retur.index', compact('returs'));
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

        return view('admin.retur.create', compact(
            'produks',
            'transaksis',
            'ukurans',
            'warnas'
        ));
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

        DB::transaction(function () use ($validated) {

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

            Retur::create([
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

        return redirect()
            ->route('retur.index')
            ->with(
                'success',
                'Retur berhasil disimpan dan stok telah dikembalikan.'
            );
    }

    public function show(Retur $retur)
    {
        $retur->load([
            'produk',
            'transaksi',
            'ukuran',
            'warna'
        ]);

        return view(
            'admin.retur.show',
            compact('retur')
        );
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

        return redirect()
            ->route('retur.index')
            ->with(
                'success',
                'Data retur berhasil dihapus.'
            );
    }
}