<?php

namespace App\Http\Controllers;

use App\Models\BiayaOperasional;
use Illuminate\Http\Request;

class BiayaOperasionalController extends Controller
{
    
     // Menampilkan daftar biaya operasional
    public function index()
    {
        $biayas = BiayaOperasional::latest()->get();

        return view('admin.biaya_operasional.index', compact('biayas'));
    }

     // Menampilkan form tambah biaya
    public function create()
    {
        return view('admin.biaya_operasional.create');
    }

    // Menyimpan biaya operasional
    public function store(Request $request)
    {
        $request->validate([
            'nama_biaya' => 'required|string|max:255',
            'nominal' => 'required|numeric|min:0',
            'tanggal' => 'required|date',
            'keterangan' => 'nullable|string',
        ]);

        BiayaOperasional::create([
            'nama_biaya' => $request->nama_biaya,
            'nominal' => $request->nominal,
            'tanggal' => $request->tanggal,
            'keterangan' => $request->keterangan,
        ]);

        return redirect()
            ->route('biaya-operasional.index')
            ->with('success', 'Biaya operasional berhasil ditambahkan.');
    }

    //Menampilkan form edit biaya
    public function edit(BiayaOperasional $biayaOperasional)
    {
        return view(
            'admin.biaya_operasional.edit',
            compact('biayaOperasional')
        );
    }

    // Memperbarui biaya operasional
    public function update(Request $request, BiayaOperasional $biayaOperasional)
    {
        $request->validate([
            'nama_biaya' => 'required|string|max:255',
            'nominal' => 'required|numeric|min:0',
            'tanggal' => 'required|date',
            'keterangan' => 'nullable|string',
        ]);

        $biayaOperasional->update([
            'nama_biaya' => $request->nama_biaya,
            'nominal' => $request->nominal,
            'tanggal' => $request->tanggal,
            'keterangan' => $request->keterangan,
        ]);

        return redirect()
            ->route('biaya-operasional.index')
            ->with('success', 'Biaya operasional berhasil diperbarui.');
    }

    // Menghapus biaya operasional
    public function destroy(BiayaOperasional $biayaOperasional)
    {
        $biayaOperasional->delete();

        return redirect()
            ->route('biaya-operasional.index')
            ->with('success', 'Biaya operasional berhasil dihapus.');
    }
}