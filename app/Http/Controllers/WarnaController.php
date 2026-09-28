<?php

namespace App\Http\Controllers;

use App\Models\Warna;
use Illuminate\Http\Request;

class WarnaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $warnas = Warna::latest()->get();

        return view('admin.warna.index', compact('warnas'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('admin.warna.create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'nama_warna' => 'required|string|max:100',
        ]);

        Warna::create([
            'nama_warna' => $request->nama_warna,
        ]);

        return redirect()
            ->route('warna.index')
            ->with('success', 'Warna berhasil ditambahkan.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Warna $warna)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Warna $warna)
    {
        return view('admin.warna.edit', compact('warna'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Warna $warna)
    {
        $request->validate([
            'nama_warna' => 'required|string|max:100',
        ]);

        $warna->update([
            'nama_warna' => $request->nama_warna,
        ]);

        return redirect()
            ->route('warna.index')
            ->with('success', 'Warna berhasil diubah.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Warna $warna)
    {
        $warna->delete();

        return redirect()
            ->route('warna.index')
            ->with('success', 'Warna berhasil dihapus.');
    }
}