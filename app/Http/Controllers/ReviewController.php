<?php

namespace App\Http\Controllers;

use App\Models\DetailTransaksi;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class ReviewController extends Controller
{
    public function create($detailTransaksi)
    {
        $detail = DetailTransaksi::with([
            'produk',
            'transaksi',
        ])->findOrFail($detailTransaksi);

        // Pastikan transaksi milik user yang sedang login
        if ($detail->transaksi->user_id !== Auth::id()) {
            abort(403);
        }

        // Pastikan transaksi sudah selesai
        if ($detail->transaksi->status !== 'Selesai') {
            return back()->with(
                'error',
                'Produk hanya dapat direview setelah pesanan selesai.'
            );
        }

        // Cek apakah sudah pernah direview
        $sudahReview = Review::where(
            'detail_transaksi_id',
            $detail->id
        )->exists();

        if ($sudahReview) {
            return back()->with(
                'info',
                'Produk ini sudah pernah direview.'
            );
        }

        return view('pelanggan.review', compact('detail'));
    }

    public function store(Request $request, $detailTransaksi)
    {
        $detail = DetailTransaksi::with([
            'produk',
            'transaksi',
        ])->findOrFail($detailTransaksi);

        // Pastikan transaksi milik user yang sedang login
        if ($detail->transaksi->user_id !== Auth::id()) {
            abort(403);
        }

        // Pastikan transaksi sudah selesai
        if ($detail->transaksi->status !== 'Selesai') {
            return back()->with(
                'error',
                'Produk hanya dapat direview setelah pesanan selesai.'
            );
        }

        // Cegah review ganda
        $sudahReview = Review::where(
            'detail_transaksi_id',
            $detail->id
        )->exists();

        if ($sudahReview) {
            return back()->with(
                'info',
                'Produk ini sudah pernah direview.'
            );
        }

        // Validasi
        $validated = $request->validate([
            'rating' => [
                'required',
                'integer',
                'min:1',
                'max:5',
            ],

            'review' => [
                'nullable',
                'string',
                'max:1000',
            ],

            'foto.*' => [
                'nullable',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:5120',
            ],
        ]);

        // Simpan review
        $review = Review::create([
            'user_id' => Auth::id(),
            'produk_id' => $detail->produk_id,
            'transaksi_id' => $detail->transaksi_id,
            'detail_transaksi_id' => $detail->id,
            'rating' => $validated['rating'],
            'review' => $validated['review'] ?? null,
        ]);

        // Simpan beberapa foto review
        if ($request->hasFile('foto')) {

            foreach ($request->file('foto') as $foto) {

                $path = $foto->store(
                    'review-fotos',
                    'public'
                );

                $review->fotos()->create([
                    'foto' => $path,
                ]);
            }
        }

        return redirect()
            ->route(
                'pelanggan.index'
            )
            ->with(
                'success',
                'Review dan rating berhasil dikirim.'
            );
    }

    public function destroy($review)
    {
        $review = Review::with('fotos')
            ->where('user_id', Auth::id())
            ->findOrFail($review);

        // Hapus file foto dari storage
        foreach ($review->fotos as $foto) {

            if (Storage::disk('public')->exists($foto->foto)) {
                Storage::disk('public')->delete($foto->foto);
            }
        }

        $review->delete();

        return back()->with(
            'success',
            'Review berhasil dihapus.'
        );
    }
}