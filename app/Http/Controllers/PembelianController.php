<?php

namespace App\Http\Controllers;

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

        return view('admin.pembelian.index', compact('pembelians'));
    }

    public function create()
    {
        $suppliers = Supplier::orderBy('nama_supplier')->get();
        $produks = Produk::orderBy('nama_produk')->get();
        $ukurans = Ukuran::orderBy('nama_ukuran')->get();
        $warnas = Warna::orderBy('nama_warna')->get();

        return view('admin.pembelian.create', compact(
            'suppliers',
            'produks',
            'ukurans',
            'warnas'
        ));
    }

    public function store(Request $request)
    {
        $request->validate([
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

        DB::transaction(function () use ($request) {

            $totalHarga = 0;

            foreach ($request->produk_id as $index => $produkId) {
                $jumlah = $request->jumlah[$index];
                $hargaModal = $request->harga_modal[$index];

                $totalHarga += $jumlah * $hargaModal;
            }

            $pembelian = Pembelian::create([
                'supplier_id' => $request->supplier_id,
                'tanggal_pembelian' => $request->tanggal_pembelian,
                'total_harga' => $totalHarga,
                'keterangan' => $request->catatan,
            ]);

            foreach ($request->produk_id as $index => $produkId) {

                $ukuranId = $request->ukuran_id[$index] ?? null;
                $warnaId = $request->warna_id[$index] ?? null;
                $jumlah = $request->jumlah[$index];
                $hargaModal = $request->harga_modal[$index];

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

        return redirect()
            ->route('pembelian.index')
            ->with('success', 'Pembelian berhasil disimpan dan stok berhasil ditambahkan.');
    }

    public function show(Pembelian $pembelian)
    {
        $pembelian->load([
            'supplier',
            'details.produk'
        ]);

        return view('admin.pembelian.show', compact('pembelian'));
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
                }
            }

            $pembelian->details()->delete();
            $pembelian->delete();
        });

        return redirect()   
            ->route('pembelian.index')
            ->with('success', 'Pembelian berhasil dihapus.');
    }
}