<?php

namespace App\Http\Controllers;

use App\Models\Produk;
use App\Models\ProdukFoto;
use App\Models\Kategori;
use App\Models\Koleksi;
use Illuminate\Http\Request;

class ProdukController extends Controller
{
    public function index()
    {
        $produks = Produk::with([
            'kategori',
            'koleksi',
            'fotos'
        ])
        ->latest()
        ->get();

        return view('admin.produk.index', compact('produks'));
    }

    public function create()
    {
        $kategoris = Kategori::all();
        $koleksis = Koleksi::all();

        return view(
            'admin.produk.create',
            compact('kategoris', 'koleksis')
        );
    }

    public function store(Request $request)
    {
        $request->validate([
            'kategori_id' => 'required|exists:kategoris,id',
            'koleksi_id' => 'nullable|exists:koleksis,id',
            'nama_produk' => 'required|string|max:255',
            'harga' => 'required|numeric|min:0',
            'modal_produk' => 'required|numeric|min:0',
            'deskripsi' => 'nullable|string',

            'foto' => 'nullable|file|image|max:2048',
            'foto2' => 'nullable|file|image|max:2048',
            'foto3' => 'nullable|file|image|max:2048',
            'foto4' => 'nullable|file|image|max:2048',
            'foto5' => 'nullable|file|image|max:2048',

            'berat' => 'required|integer|min:0',
            'panjang' => 'required|integer|min:0',
            'lebar' => 'required|integer|min:0',
            'tinggi' => 'required|integer|min:0',
        ]);

        $namaFoto = null;

        if ($request->hasFile('foto')) {
            $file = $request->file('foto');

            $namaFoto = time()
                . '_utama.'
                . $file->extension();

            $file->move(
                public_path('produk'),
                $namaFoto
            );
        }

        $produk = Produk::create([
            'kategori_id' => $request->kategori_id,
            'koleksi_id' => $request->koleksi_id,
            'nama_produk' => $request->nama_produk,
            'harga' => $request->harga,
            'modal_produk' => $request->modal_produk,
            'deskripsi' => $request->deskripsi,
            'foto' => $namaFoto,
            'berat' => $request->berat,
            'panjang' => $request->panjang,
            'lebar' => $request->lebar,
            'tinggi' => $request->tinggi,
        ]);

        foreach (['foto2', 'foto3', 'foto4', 'foto5'] as $field) {
            if ($request->hasFile($field)) {
                $file = $request->file($field);

                $namaFotoTambahan = time()
                    . '_'
                    . uniqid()
                    . '.'
                    . $file->extension();

                $file->move(
                    public_path('produk'),
                    $namaFotoTambahan
                );

                $produk->fotos()->create([
                    'foto' => $namaFotoTambahan,
                ]);
            }
        }

        return redirect()
            ->route('produk.index')
            ->with(
                'success',
                'Produk berhasil ditambahkan.'
            );
    }

    public function show(Produk $produk)
    {
        //
    }

    public function edit(Produk $produk)
    {
        $produk->load('fotos');

        $kategoris = Kategori::all();
        $koleksis = Koleksi::all();

        return view(
            'admin.produk.edit',
            compact(
                'produk',
                'kategoris',
                'koleksis'
            )
        );
    }

    public function update(Request $request, Produk $produk)
    {
        $request->validate([
            'kategori_id' => 'required|exists:kategoris,id',
            'koleksi_id' => 'nullable|exists:koleksis,id',
            'nama_produk' => 'required|string|max:255',
            'harga' => 'required|numeric|min:0',
            'modal_produk' => 'required|numeric|min:0',
            'deskripsi' => 'nullable|string',

            'foto' => 'nullable|file|image|max:2048',

            'fotos' => 'nullable|array',
            'fotos.*' => 'nullable|file|image|max:2048',

            'berat' => 'required|integer|min:0',
            'panjang' => 'required|integer|min:0',
            'lebar' => 'required|integer|min:0',
            'tinggi' => 'required|integer|min:0',
        ]);

        $namaFoto = $produk->foto;

        if ($request->hasFile('foto')) {
            if (
                $produk->foto &&
                file_exists(
                    public_path('produk/' . $produk->foto)
                )
            ) {
                unlink(
                    public_path('produk/' . $produk->foto)
                );
            }

            $file = $request->file('foto');

            $namaFoto = time()
                . '_utama.'
                . $file->extension();

            $file->move(
                public_path('produk'),
                $namaFoto
            );
        }

        $produk->update([
            'kategori_id' => $request->kategori_id,
            'koleksi_id' => $request->koleksi_id,
            'nama_produk' => $request->nama_produk,
            'harga' => $request->harga,
            'modal_produk' => $request->modal_produk,
            'deskripsi' => $request->deskripsi,
            'foto' => $namaFoto,
            'berat' => $request->berat,
            'panjang' => $request->panjang,
            'lebar' => $request->lebar,
            'tinggi' => $request->tinggi,
        ]);

        if ($request->hasFile('fotos')) {
            foreach ($request->file('fotos') as $file) {
                if (!$file->isValid()) {
                    continue;
                }

                $namaFotoTambahan = time()
                    . '_'
                    . uniqid()
                    . '.'
                    . $file->extension();

                $file->move(
                    public_path('produk'),
                    $namaFotoTambahan
                );

                ProdukFoto::create([
                    'produk_id' => $produk->id,
                    'foto' => $namaFotoTambahan,
                ]);
            }
        }

        return redirect()
            ->route('produk.index')
            ->with(
                'success',
                'Produk berhasil diubah.'
            );
    }

    public function destroy(Produk $produk)
    {
        if (
            $produk->foto &&
            file_exists(
                public_path('produk/' . $produk->foto)
            )
        ) {
            unlink(
                public_path('produk/' . $produk->foto)
            );
        }

        foreach ($produk->fotos as $foto) {
            if (
                $foto->foto &&
                file_exists(
                    public_path('produk/' . $foto->foto)
                )
            ) {
                unlink(
                    public_path('produk/' . $foto->foto)
                );
            }
        }

        $produk->fotos()->delete();
        $produk->delete();

        return redirect()
            ->route('produk.index')
            ->with(
                'success',
                'Produk berhasil dihapus.'
            );
    }
}