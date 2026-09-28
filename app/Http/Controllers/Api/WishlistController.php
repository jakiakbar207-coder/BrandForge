<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Produk;
use App\Models\Wishlist;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class WishlistController extends Controller
{
    public function index()
    {
        $wishlists = Wishlist::with('produk')
            ->where('user_id', Auth::id())
            ->latest()
            ->get();

        return response()->json($wishlists);
    }

    public function store($produk)
    {
        $produkData = Produk::findOrFail($produk);

        $sudahAda = Wishlist::where('user_id', Auth::id())
            ->where('produk_id', $produkData->id)
            ->exists();

        if ($sudahAda) {
            return response()->json([
                'message' => 'Produk sudah ada di wishlist.',
            ], 409);
        }

        $wishlist = Wishlist::create([
            'user_id' => Auth::id(),
            'produk_id' => $produkData->id,
        ]);

        $wishlist->load('produk');

        return response()->json([
            'message' => 'Produk berhasil ditambahkan ke wishlist.',
            'data' => $wishlist,
        ], 201);
    }

    public function destroy($produk)
    {
        $wishlist = Wishlist::where('user_id', Auth::id())
            ->where('produk_id', $produk)
            ->first();

        if (!$wishlist) {
            return response()->json([
                'message' => 'Produk tidak ditemukan di wishlist.',
            ], 404);
        }

        $wishlist->delete();

        return response()->json([
            'message' => 'Produk berhasil dihapus dari wishlist.',
        ]);
    }
}