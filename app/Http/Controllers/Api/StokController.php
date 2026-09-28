<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Stok;
use App\Models\Produk;
use App\Models\Ukuran;
use App\Models\Warna;
use Illuminate\Http\Request;

class StokController extends Controller
{
    public function index()
    {
        $stoks = Stok::with([
            'produk',
            'ukuran',
            'warna'
        ])
        ->latest()
        ->get();

        return response()->json($stoks);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'produk_id' => 'required|exists:produks,id',
            'ukuran_id' => 'required|exists:ukurans,id',
            'warna_id' => 'required|exists:warnas,id',
            'jumlah' => 'required|integer|min:0',
        ]);

        $stok = Stok::where('produk_id', $validated['produk_id'])
            ->where('ukuran_id', $validated['ukuran_id'])
            ->where('warna_id', $validated['warna_id'])
            ->first();

        if ($stok) {
            $stok->increment('jumlah', $validated['jumlah']);

            $stok->load([
                'produk',
                'ukuran',
                'warna'
            ]);

            return response()->json([
                'message' => 'Stok sudah ada. Jumlah stok berhasil ditambahkan.',
                'data' => $stok
            ]);
        }

        $stok = Stok::create($validated);

        $stok->load([
            'produk',
            'ukuran',
            'warna'
        ]);

        return response()->json([
            'message' => 'Data stok berhasil ditambahkan.',
            'data' => $stok
        ], 201);
    }

    public function show(Stok $stok)
    {
        $stok->load([
            'produk',
            'ukuran',
            'warna'
        ]);

        return response()->json($stok);
    }

    public function update(Request $request, Stok $stok)
    {
        $validated = $request->validate([
            'produk_id' => 'required|exists:produks,id',
            'ukuran_id' => 'required|exists:ukurans,id',
            'warna_id' => 'required|exists:warnas,id',
            'jumlah' => 'required|integer|min:0',
        ]);

        $stokLain = Stok::where('produk_id', $validated['produk_id'])
            ->where('ukuran_id', $validated['ukuran_id'])
            ->where('warna_id', $validated['warna_id'])
            ->where('id', '!=', $stok->id)
            ->first();

        if ($stokLain) {
            return response()->json([
                'message' => 'Stok dengan produk, ukuran, dan warna tersebut sudah ada.',
                'errors' => [
                    'produk_id' => [
                        'Stok dengan produk, ukuran, dan warna tersebut sudah ada.'
                    ]
                ]
            ], 422);
        }

        $stok->update($validated);

        $stok->load([
            'produk',
            'ukuran',
            'warna'
        ]);

        return response()->json([
            'message' => 'Data stok berhasil diperbarui.',
            'data' => $stok
        ]);
    }

    public function destroy(Stok $stok)
    {
        $stok->delete();

        return response()->json([
            'message' => 'Data stok berhasil dihapus.'
        ]);
    }
}