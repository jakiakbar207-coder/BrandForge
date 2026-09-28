<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Ukuran;
use Illuminate\Http\Request;

class UkuranController extends Controller
{
    public function index()
    {
        $ukurans = Ukuran::latest()->get();

        return response()->json($ukurans);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama_ukuran' => 'required'
        ]);

        $ukuran = Ukuran::create([
            'nama_ukuran' => $request->nama_ukuran
        ]);

        return response()->json([
            'message' => 'Ukuran berhasil ditambahkan.',
            'data' => $ukuran
        ], 201);
    }

    public function show(Ukuran $ukuran)
    {
        return response()->json($ukuran);
    }

    public function update(Request $request, Ukuran $ukuran)
    {
        $request->validate([
            'nama_ukuran' => 'required'
        ]);

        $ukuran->update([
            'nama_ukuran' => $request->nama_ukuran
        ]);

        return response()->json([
            'message' => 'Ukuran berhasil diubah.',
            'data' => $ukuran
        ]);
    }

    public function destroy(Ukuran $ukuran)
    {
        $ukuran->delete();

        return response()->json([
            'message' => 'Ukuran berhasil dihapus.'
        ]);
    }
}