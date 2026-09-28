<?php

namespace App\Http\Controllers;

use App\Models\Supplier;
use Illuminate\Http\Request;

class SupplierController extends Controller
{
    // Menampilkan daftar supplier
    public function index()
    {
        $suppliers = Supplier::latest()->get();

        return view('admin.supplier.index', compact('suppliers'));
    }

    // Form tambah supplier
    public function create()
    {
        return view('admin.supplier.create');
    }

    // Menyimpan supplier
    public function store(Request $request)
    {
        $request->validate([
            'nama_supplier' => 'required|string|max:255',
            'kontak' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'alamat' => 'nullable|string',
        ]);

        Supplier::create([
            'nama_supplier' => $request->nama_supplier,
            'kontak' => $request->kontak,
            'email' => $request->email,
            'alamat' => $request->alamat,
        ]);

        return redirect()
            ->route('supplier.index')
            ->with('success', 'Supplier berhasil ditambahkan.');
    }

    // Menampilkan detail supplier
    public function show(Supplier $supplier)
    {
        return view('admin.supplier.show', compact('supplier'));
    }

    // Form edit supplier
    public function edit(Supplier $supplier)
    {
        return view('admin.supplier.edit', compact('supplier'));
    }

    // Memperbarui supplier
    public function update(Request $request, Supplier $supplier)
    {
        $request->validate([
            'nama_supplier' => 'required|string|max:255',
            'kontak' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'alamat' => 'nullable|string',
        ]);

        $supplier->update([
            'nama_supplier' => $request->nama_supplier,
            'kontak' => $request->kontak,
            'email' => $request->email,
            'alamat' => $request->alamat,
        ]);

        return redirect()
            ->route('supplier.index')
            ->with('success', 'Supplier berhasil diperbarui.');
    }

    // Menghapus supplier   
    public function destroy(Supplier $supplier)
    {
        $supplier->delete();

        return redirect()
            ->route('supplier.index')
            ->with('success', 'Supplier berhasil dihapus.');
    }
}