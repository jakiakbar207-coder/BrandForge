<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Supplier;
use Illuminate\Http\Request;

class SupplierController extends Controller
{
    public function index()
    {
        $suppliers = Supplier::latest()->get();

        return response()->json($suppliers);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama_supplier' => 'required|string|max:255',
            'kontak' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'alamat' => 'nullable|string',
        ]);

        $supplier = Supplier::create([
            'nama_supplier' => $request->nama_supplier,
            'kontak' => $request->kontak,
            'email' => $request->email,
            'alamat' => $request->alamat,
        ]);

        return response()->json([
            'message' => 'Supplier berhasil ditambahkan.',
            'data' => $supplier,
        ], 201);
    }

    public function show(Supplier $supplier)
    {
        return response()->json($supplier);
    }

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

        return response()->json([
            'message' => 'Supplier berhasil diperbarui.',
            'data' => $supplier,
        ]);
    }

    public function destroy(Supplier $supplier)
    {
        $supplier->delete();

        return response()->json([
            'message' => 'Supplier berhasil dihapus.',
        ]);
    }
}