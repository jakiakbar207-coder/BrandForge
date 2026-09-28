<?php

namespace App\Http\Controllers;

use App\Models\Koleksi;
use Illuminate\Http\Request;

class KoleksiController extends Controller
{
    /**
     * Menampilkan daftar koleksi.
     */
    public function index()
    {
        $koleksis = Koleksi::latest()->get();

        return view('admin.koleksi.index', compact('koleksis'));
    }

    /**
     * Menampilkan form tambah koleksi.
     */
    public function create()
    {
        return view('admin.koleksi.create');
    }

    /**
     * Menyimpan koleksi baru.
     */
    public function store(Request $request)
    {
        $request->validate([
            'nama_koleksi' => 'required|string|max:255|unique:koleksis,nama_koleksi',
            'deskripsi'    => 'nullable|string',
        ]);

        Koleksi::create([
            'nama_koleksi' => $request->nama_koleksi,
            'deskripsi'    => $request->deskripsi,
        ]);

        return redirect()
         ->route('koleksi.index')
            ->with('success', 'Koleksi berhasil ditambahkan.');
    }

    /**
     * Menampilkan form edit koleksi.
     */
    public function edit($id)
    {
        $koleksi = Koleksi::findOrFail($id);

        return view('admin.koleksi.edit', compact('koleksi'));
    }

    /**
     * Memperbarui data koleksi.
     */
    public function update(Request $request, $id)
    {
        $koleksi = Koleksi::findOrFail($id);

        $request->validate([
            'nama_koleksi' => 'required|string|max:255|unique:koleksis,nama_koleksi,' . $koleksi->id,
            'deskripsi'    => 'nullable|string',
        ]);

        $koleksi->update([
            'nama_koleksi' => $request->nama_koleksi,
            'deskripsi'    => $request->deskripsi,
        ]);

        return redirect()
            ->route('koleksi.index')
            ->with('success', 'Koleksi berhasil diperbarui.');
    }

    /**
     * Menghapus koleksi.
     */
    public function destroy($id)
    {
        $koleksi = Koleksi::findOrFail($id);

        $koleksi->delete();

        return redirect()
            ->route('koleksi.index')
            ->with('success', 'Koleksi berhasil dihapus.');
    }
}