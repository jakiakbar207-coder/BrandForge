<?php

namespace App\Http\Controllers;

use App\Models\Ukuran;
use Illuminate\Http\Request;

class UkuranController extends Controller
{
    public function index()
    {
        $ukurans = Ukuran::latest()->get();
        return view('admin.ukuran.index', compact('ukurans'));
    }

    public function create()
    {
        return view('admin.ukuran.create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama_ukuran' => 'required'
        ]);

        Ukuran::create([
            'nama_ukuran' => $request->nama_ukuran
        ]);

        return redirect()->route('ukuran.index')
            ->with('success', 'Ukuran berhasil ditambahkan.');
    }

    public function show(Ukuran $ukuran)
    {
        //
    }

    public function edit(Ukuran $ukuran)
    {
        return view('admin.ukuran.edit', compact('ukuran'));
    }

    public function update(Request $request, Ukuran $ukuran)
    {
        $request->validate([
            'nama_ukuran' => 'required'
        ]);

        $ukuran->update([
            'nama_ukuran' => $request->nama_ukuran
        ]);

        return redirect()->route('ukuran.index')
            ->with('success', 'Ukuran berhasil diubah.');
    }

    public function destroy(Ukuran $ukuran)
    {
        $ukuran->delete();

        return redirect()->route('ukuran.index')
            ->with('success', 'Ukuran berhasil dihapus.');
    }
}