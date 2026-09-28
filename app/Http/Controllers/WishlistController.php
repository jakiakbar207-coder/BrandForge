<?php

namespace App\Http\Controllers;

use App\Models\Produk;
use App\Models\Wishlist;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class WishlistController extends Controller
{
    /**
     * Menampilkan wishlist pelanggan.
     */
    public function index()
    {
        $wishlists = Wishlist::with('produk')
            ->where('user_id', Auth::id())
            ->latest()
            ->get();

        return view('pelanggan.wishlist', compact('wishlists'));
    }

   public function store($produk)
    {
        $produkData = Produk::findOrFail($produk);

        $sudahAda = Wishlist::where('user_id', Auth::id())
            ->where('produk_id', $produkData->id)
            ->exists();

        if ($sudahAda) {
            return redirect()
                ->route('pelanggan.wishlist')
                ->with('info', 'Produk sudah ada di wishlist.');
        }

        Wishlist::create([
            'user_id' => Auth::id(),
            'produk_id' => $produkData->id,
        ]);

        return redirect()
            ->route('pelanggan.wishlist')
            ->with('success', 'Produk berhasil ditambahkan ke wishlist.');
    }

    public function destroy($produk)
    {
        Wishlist::where('user_id', Auth::id())
            ->where('produk_id', $produk)
            ->delete();

        return back()->with('success', 'Produk berhasil dihapus dari wishlist.');
    }
}