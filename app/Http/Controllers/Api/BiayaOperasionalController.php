<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BiayaOperasional;
use Illuminate\Http\Request;

class BiayaOperasionalController extends Controller
{
    public function index()
    {
        $biayas = BiayaOperasional::latest()->get();

        return response()->json($biayas);
    }

    public function create()
    {
        return response()->json([
            'message' => 'Form tambah biaya operasional.'
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_biaya' => 'required|string|max:255',
            'nominal' => 'required|numeric|min:0',
            'tanggal' => 'required|date',
            'keterangan' => 'nullable|string',
        ]);

        $biayaOperasional = BiayaOperasional::create([
            'nama_biaya' => $validated['nama_biaya'],
            'nominal' => $validated['nominal'],
            'tanggal' => $validated['tanggal'],
            'keterangan' => $validated['keterangan'] ?? null,
        ]);

        return response()->json([
            'message' => 'Biaya operasional berhasil ditambahkan.',
            'data' => $biayaOperasional,
        ], 201);
    }

    public function show(BiayaOperasional $biayaOperasional)
    {
        return response()->json($biayaOperasional);
    }

    public function edit(BiayaOperasional $biayaOperasional)
    {
        return response()->json([
            'data' => $biayaOperasional,
        ]);
    }

    public function update(
        Request $request,
        BiayaOperasional $biayaOperasional
    ) {
        $validated = $request->validate([
            'nama_biaya' => 'required|string|max:255',
            'nominal' => 'required|numeric|min:0',
            'tanggal' => 'required|date',
            'keterangan' => 'nullable|string',
        ]);

        $biayaOperasional->update([
            'nama_biaya' => $validated['nama_biaya'],
            'nominal' => $validated['nominal'],
            'tanggal' => $validated['tanggal'],
            'keterangan' => $validated['keterangan'] ?? null,
        ]);

        return response()->json([
            'message' => 'Biaya operasional berhasil diperbarui.',
            'data' => $biayaOperasional,
        ]);
    }

    public function destroy(BiayaOperasional $biayaOperasional)
    {
        $biayaOperasional->delete();

        return response()->json([
            'message' => 'Biaya operasional berhasil dihapus.',
        ]);
    }
}