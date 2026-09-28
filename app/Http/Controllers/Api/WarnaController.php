<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Warna;
use Illuminate\Http\Request;

class WarnaController extends Controller
{
    public function index()
    {
        $warnas = Warna::latest()->get();

        return response()->json($warnas);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama_warna' => 'required|string|max:100',
        ]);

        $warna = Warna::create([
            'nama_warna' => $request->nama_warna,
        ]);

        return response()->json([
            'message' => 'Warna berhasil ditambahkan.',
            'data' => $warna,
        ], 201);
    }

    public function show(Warna $warna)
    {
        return response()->json($warna);
    }

    public function update(Request $request, Warna $warna)
    {
        $request->validate([
            'nama_warna' => 'required|string|max:100',
        ]);

        $warna->update([
            'nama_warna' => $request->nama_warna,
        ]);

        return response()->json([
            'message' => 'Warna berhasil diubah.',
            'data' => $warna,
        ]);
    }

    public function destroy(Warna $warna)
    {
        $warna->delete();

        return response()->json([
            'message' => 'Warna berhasil dihapus.',
        ]);
    }
}