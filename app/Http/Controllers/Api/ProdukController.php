<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Produk;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProdukController extends Controller
{
    public function index()
    {
        $produk = Produk::with([
            'kategori',
            'koleksi',
            'fotos'
        ])
            ->withSum('stokData as stok_total', 'jumlah')
            ->latest()
            ->get();

        return response()->json($produk);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'kategori_id' => 'required|exists:kategori,id_kategori',
            'koleksi_id' => 'nullable|exists:koleksi,id_koleksi',
            'nama_produk' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
            'harga' => 'required|numeric|min:0',
            'modal_produk' => 'nullable|numeric|min:0',
            'stok' => 'nullable|integer|min:0',
            'foto' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'berat' => 'nullable|numeric|min:0',
            'panjang' => 'nullable|numeric|min:0',
            'lebar' => 'nullable|numeric|min:0',
            'tinggi' => 'nullable|numeric|min:0',
        ]);

        if ($request->hasFile('foto')) {
            $validated['foto'] = $request->file('foto')
                ->store('produk', 'public');
        }

        $produk = Produk::create($validated);

        return response()->json([
            'message' => 'Produk berhasil ditambahkan',
            'data' => $produk->load([
                'kategori',
                'koleksi',
                'fotos'
            ])
        ], 201);
    }

    public function show($id)
    {
        $produk = Produk::with([
            'kategori',
            'koleksi',
            'fotos'
        ])
            ->withSum('stokData as stok_total', 'jumlah')
            ->findOrFail($id);

        return response()->json($produk);
    }

    public function update(Request $request, $id)
    {
        $produk = Produk::findOrFail($id);

        $validated = $request->validate([
            'kategori_id' => 'required|exists:kategori,id_kategori',
            'koleksi_id' => 'nullable|exists:koleksi,id_koleksi',
            'nama_produk' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
            'harga' => 'required|numeric|min:0',
            'modal_produk' => 'nullable|numeric|min:0',
            'stok' => 'nullable|integer|min:0',
            'foto' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'berat' => 'nullable|numeric|min:0',
            'panjang' => 'nullable|numeric|min:0',
            'lebar' => 'nullable|numeric|min:0',
            'tinggi' => 'nullable|numeric|min:0',
        ]);

        if ($request->hasFile('foto')) {
            if ($produk->foto) {
                Storage::disk('public')->delete($produk->foto);
            }

            $validated['foto'] = $request->file('foto')
                ->store('produk', 'public');
        }

        $produk->update($validated);

        return response()->json([
            'message' => 'Produk berhasil diperbarui',
            'data' => $produk->fresh()->load([
                'kategori',
                'koleksi',
                'fotos'
            ])
        ]);
    }

    public function destroy($id)
    {
        $produk = Produk::findOrFail($id);

        if ($produk->foto) {
            Storage::disk('public')->delete($produk->foto);
        }

        $produk->delete();

        return response()->json([
            'message' => 'Produk berhasil dihapus'
        ]);
    }

    public function pelangganBelanja(Request $request)
    {
        $query = Produk::with([
            'kategori',
            'koleksi',
            'stokData.warna',
            'stokData.ukuran',
            'fotos'
        ])
            ->withSum('stokData as stok_total', 'jumlah')
            ->whereHas('stokData', function ($q) {
                $q->where('jumlah', '>', 0);
            });

        if ($request->filled('search')) {
            $search = $request->search;

            $query->where(
                'nama_produk',
                'like',
                '%' . $search . '%'
            );
        }

        if ($request->filled('harga')) {
            if ($request->harga === '0-100000') {
                $query->whereBetween('harga', [
                    0,
                    100000
                ]);
            }

            if ($request->harga === '100001-300000') {
                $query->whereBetween('harga', [
                    100001,
                    300000
                ]);
            }

            if ($request->harga === '300000+') {
                $query->where(
                    'harga',
                    '>',
                    300000
                );
            }
        }

        if ($request->filled('kategori_id')) {
            $query->where(
                'kategori_id',
                $request->kategori_id
            );
        }

        if ($request->filled('koleksi_id')) {
            $query->where(
                'koleksi_id',
                $request->koleksi_id
            );
        }

        if ($request->filled('warna_id')) {
            $warnaId = $request->warna_id;

            $query->whereHas('stokData', function ($q) use ($warnaId) {
                $q->where('warna_id', $warnaId)
                    ->where('jumlah', '>', 0);
            });
        }

        if ($request->filled('ukuran_id')) {
            $ukuranId = $request->ukuran_id;

            $query->whereHas('stokData', function ($q) use ($ukuranId) {
                $q->where('ukuran_id', $ukuranId)
                    ->where('jumlah', '>', 0);
            });
        }

        $produk = $query
            ->latest()
            ->get();

        return response()->json([
            'produk' => $produk,
            'kategori' => \App\Models\Kategori::orderBy(
                'nama_kategori'
            )->get(),
            'koleksi' => \App\Models\Koleksi::orderBy(
                'nama_koleksi'
            )->get(),
            'warna' => \App\Models\Warna::orderBy(
                'nama_warna'
            )->get(),
            'ukuran' => \App\Models\Ukuran::orderBy(
                'nama_ukuran'
            )->get(),
        ]);
    }

    public function pelangganDetail($id)
    {
        $produk = Produk::with([
            'kategori',
            'koleksi',
            'stokData.warna',
            'stokData.ukuran',
            'fotos',
            'reviews.user'
        ])->findOrFail($id);

        $produk->setRelation(
            'stokData',
            $produk->stokData
                ->filter(function ($stok) {
                    return $stok->jumlah > 0;
                })
                ->values()
        );

        $warna = $produk->stokData
            ->filter(function ($stok) {
                return $stok->warna !== null;
            })
            ->pluck('warna')
            ->unique('id_warna')
            ->values();

        $ukuran = $produk->stokData
            ->filter(function ($stok) {
                return $stok->ukuran !== null;
            })
            ->pluck('ukuran')
            ->unique('id_ukuran')
            ->values();

        $produkTerkait = Produk::with([
            'kategori',
            'koleksi',
            'fotos'
        ])
            ->withSum('stokData as stok_total', 'jumlah')
            ->where(
                'kategori_id',
                $produk->kategori_id
            )
            ->where(
                'id',
                '!=',
                $produk->id
            )
            ->whereHas('stokData', function ($q) {
                $q->where('jumlah', '>', 0);
            })
            ->latest()
            ->limit(4)
            ->get();

        return response()->json([
            'produk' => $produk,
            'warna' => $warna,
            'ukuran' => $ukuran,
            'produk_terkait' => $produkTerkait,
        ]);
    }
}