<?php

namespace App\Http\Controllers;

use App\Models\Stok;
use App\Models\Produk;
use App\Models\Ukuran;
use App\Models\Warna;
use Illuminate\Http\Request;

class StokController extends Controller
{
    // Menampilkan semua data stok
    public function index()
    {
        $stoks = Stok::with([
            'produk',
            'ukuran',
            'warna'
        ])
        ->latest()
        ->get();

        return view('admin.stok.index', compact('stoks'));
    }

    // Form tambah stok
    public function create()
    {
        $produks = Produk::orderBy('nama_produk')->get();
        $ukurans = Ukuran::orderBy('nama_ukuran')->get();
        $warnas = Warna::orderBy('nama_warna')->get();

        return view('admin.stok.create', compact(
            'produks',
            'ukurans',
            'warnas'
        ));
    }

    // Menyimpan stok baru
    public function store(Request $request)
    {
        $validated = $request->validate([
            'produk_id' => 'required|exists:produks,id',
            'ukuran_id' => 'required|exists:ukurans,id',
            'warna_id' => 'required|exists:warnas,id',
            'jumlah' => 'required|integer|min:0',
        ]);

        // Cek apakah kombinasi produk + ukuran + warna sudah ada
        $stok = Stok::where('produk_id', $validated['produk_id'])
            ->where('ukuran_id', $validated['ukuran_id'])
            ->where('warna_id', $validated['warna_id'])
            ->first();

        if ($stok) {

            // Jika sudah ada, jumlah stok ditambahkan
            $stok->increment('jumlah', $validated['jumlah']);

            return redirect()
                ->route('stok.index')
                ->with(
                    'success',
                    'Stok sudah ada. Jumlah stok berhasil ditambahkan.'
                );
        }

        // Jika belum ada, buat stok baru
        Stok::create($validated);

        return redirect()
            ->route('stok.index')
            ->with(
                'success',
                'Data stok berhasil ditambahkan.'
            );
    }

    // Menampilkan detail stok
    public function show(Stok $stok)
    {
        $stok->load([
            'produk',
            'ukuran',
            'warna'
        ]);

        return view('admin.stok.show', compact('stok'));
    }

    // Form edit stok
    public function edit(Stok $stok)
    {
        $produks = Produk::orderBy('nama_produk')->get();
        $ukurans = Ukuran::orderBy('nama_ukuran')->get();
        $warnas = Warna::orderBy('nama_warna')->get();

        return view('admin.stok.edit', compact(
            'stok',
            'produks',
            'ukurans',
            'warnas'
        ));
    }

    // Update stok
    public function update(Request $request, Stok $stok)
    {
        $validated = $request->validate([
            'produk_id' => 'required|exists:produks,id',
            'ukuran_id' => 'required|exists:ukurans,id',
            'warna_id' => 'required|exists:warnas,id',
            'jumlah' => 'required|integer|min:0',
        ]);

        // Cek apakah kombinasi tersebut sudah dipakai stok lain
        $stokLain = Stok::where('produk_id', $validated['produk_id'])
            ->where('ukuran_id', $validated['ukuran_id'])
            ->where('warna_id', $validated['warna_id'])
            ->where('id', '!=', $stok->id)
            ->first();

        if ($stokLain) {
            return back()
                ->withInput()
                ->withErrors([
                    'produk_id' =>
                        'Stok dengan produk, ukuran, dan warna tersebut sudah ada.'
                ]);
        }

        $stok->update($validated);

        return redirect()
            ->route('stok.index')
            ->with(
                'success',
                'Data stok berhasil diperbarui.'
            );
    }

    // Hapus stok
    public function destroy(Stok $stok)
    {
        $stok->delete();

        return redirect()
            ->route('stok.index')
            ->with(
                'success',
                'Data stok berhasil dihapus.'
            );
    }
}