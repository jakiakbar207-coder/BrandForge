<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
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

        if ($detail->transaksi->user_id !== Auth::id()) {
            return response()->json([
                'message' => 'Anda tidak memiliki akses ke transaksi ini.',
            ], 403);
        }

        if ($detail->transaksi->status !== 'Selesai') {
            return response()->json([
                'message' => 'Produk hanya dapat direview setelah pesanan selesai.',
            ], 422);
        }

        $sudahReview = Review::where(
            'detail_transaksi_id',
            $detail->id
        )->exists();

        if ($sudahReview) {
            return response()->json([
                'message' => 'Produk ini sudah pernah direview.',
            ], 409);
        }

        return response()->json([
            'data' => $detail,
        ]);
    }

    public function store(Request $request, $detailTransaksi)
    {
        $detail = DetailTransaksi::with([
            'produk',
            'transaksi',
        ])->findOrFail($detailTransaksi);

        if ($detail->transaksi->user_id !== Auth::id()) {
            return response()->json([
                'message' => 'Anda tidak memiliki akses ke transaksi ini.',
            ], 403);
        }

        if ($detail->transaksi->status !== 'Selesai') {
            return response()->json([
                'message' => 'Produk hanya dapat direview setelah pesanan selesai.',
            ], 422);
        }

        $sudahReview = Review::where(
            'detail_transaksi_id',
            $detail->id
        )->exists();

        if ($sudahReview) {
            return response()->json([
                'message' => 'Produk ini sudah pernah direview.',
            ], 409);
        }

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

        $review = Review::create([
            'user_id' => Auth::id(),
            'produk_id' => $detail->produk_id,
            'transaksi_id' => $detail->transaksi_id,
            'detail_transaksi_id' => $detail->id,
            'rating' => $validated['rating'],
            'review' => $validated['review'] ?? null,
        ]);

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

        $review->load([
            'produk',
            'fotos',
        ]);

        return response()->json([
            'message' => 'Review dan rating berhasil dikirim.',
            'data' => $review,
        ], 201);
    }

    public function destroy($review)
    {
        $review = Review::with('fotos')
            ->where('user_id', Auth::id())
            ->findOrFail($review);

        foreach ($review->fotos as $foto) {
            if (
                Storage::disk('public')->exists(
                    $foto->foto
                )
            ) {
                Storage::disk('public')->delete(
                    $foto->foto
                );
            }
        }

        $review->delete();

        return response()->json([
            'message' => 'Review berhasil dihapus.',
        ]);
    }
}