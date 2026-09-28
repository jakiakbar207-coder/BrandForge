<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Koleksi;
use Illuminate\Http\Request;

class KoleksiController extends Controller
{
    /**
     * MENAMPILKAN SEMUA KOLEKSI
     */
    public function index()
    {
        $koleksis = Koleksi::orderBy('nama_koleksi', 'ASC')->get();

        return response()->json([
            'success' => true,
            'data' => $koleksis
        ], 200);
    }

    /**
     * DETAIL KOLEKSI
     */
    public function show(string $id)
    {
        $koleksi = Koleksi::find($id);

        if (!$koleksi) {
            return response()->json([
                'success' => false,
                'message' => 'Koleksi tidak ditemukan'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $koleksi
        ], 200);
    }

    /**
     * TAMBAH KOLEKSI
     */
    public function store(Request $request)
    {
        $request->validate([
            'nama_koleksi' => 'required|string|max:255|unique:koleksis,nama_koleksi',
            'deskripsi'    => 'nullable|string',
        ]);

        $koleksi = Koleksi::create([
            'nama_koleksi' => $request->nama_koleksi,
            'deskripsi'    => $request->deskripsi,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Koleksi berhasil ditambahkan',
            'data' => $koleksi
        ], 201);
    }

    /**
     * HAPUS KOLEKSI
     */
    public function destroy(string $id)
    {
        $koleksi = Koleksi::find($id);

        if (!$koleksi) {
            return response()->json([
                'success' => false,
                'message' => 'Koleksi tidak ditemukan'
            ], 404);
        }

        $koleksi->delete();

        return response()->json([
            'success' => true,
            'message' => 'Koleksi berhasil dihapus'
        ], 200);
    }

    /**
     * UPDATE KOLEKSI
     */
    public function update(Request $request, string $id)
    {
        $request->validate([
            'nama_koleksi' => 'required|string|max:255|unique:koleksis,nama_koleksi,' . $id,
            'deskripsi'    => 'nullable|string',
        ]);

        $koleksi = Koleksi::find($id);

        if (!$koleksi) {
            return response()->json([
                'success' => false,
                'message' => 'Koleksi tidak ditemukan'
            ], 404);
        }

        $koleksi->update([
            'nama_koleksi' => $request->nama_koleksi,
            'deskripsi'    => $request->deskripsi,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Koleksi berhasil diupdate',
            'data' => $koleksi
        ], 200);
    }
}