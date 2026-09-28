<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Pengiriman;
use App\Models\Transaksi;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PengirimanController extends Controller
{
    public function index()
    {
        $pengiriman = Pengiriman::with('transaksi')
            ->latest()
            ->get();

        return response()->json($pengiriman);
    }

    public function create()
    {
        $transaksis = Transaksi::latest()->get();

        return response()->json([
            'transaksis' => $transaksis,
        ]);
    }

    public function show($id)
    {
        $pengiriman = Pengiriman::with('transaksi')
            ->findOrFail($id);

        return response()->json($pengiriman);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'transaksi_id' => 'required|exists:transaksis,id',
            'kurir' => 'required|string|max:100',
            'layanan' => 'required|string|max:100',
            'ongkir' => 'required|numeric|min:0',
            'nomor_resi' => 'nullable|string|max:255',
            'status' => 'nullable|in:menunggu,diproses,dikemas,dikirim,selesai',
            'catatan' => 'nullable|string',
            'foto_produk' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        if ($request->hasFile('foto_produk')) {
            $validated['foto_produk'] = $request
                ->file('foto_produk')
                ->store('pengiriman', 'public');
        }

        $pengiriman = Pengiriman::updateOrCreate(
            [
                'transaksi_id' => $validated['transaksi_id'],
            ],
            [
                'kurir' => $validated['kurir'],
                'layanan' => $validated['layanan'],
                'ongkir' => $validated['ongkir'],
                'nomor_resi' => $validated['nomor_resi'] ?? null,
                'status' => $validated['status'] ?? 'menunggu',
                'catatan' => $validated['catatan'] ?? null,
                'foto_produk' => $validated['foto_produk'] ?? null,
            ]
        );

        $pengiriman->load('transaksi');

        return response()->json([
            'message' => 'Data pengiriman berhasil disimpan.',
            'data' => $pengiriman,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $pengiriman = Pengiriman::findOrFail($id);

        $validated = $request->validate([
            'transaksi_id' => 'required|exists:transaksis,id',
            'kurir' => 'required|string|max:100',
            'layanan' => 'required|string|max:100',
            'ongkir' => 'required|numeric|min:0',
            'nomor_resi' => 'nullable|string|max:255',
            'status' => 'required|in:menunggu,diproses,dikemas,dikirim,selesai',
            'catatan' => 'nullable|string',
            'foto_produk' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        if ($request->hasFile('foto_produk')) {
            if (
                $pengiriman->foto_produk &&
                Storage::disk('public')->exists(
                    $pengiriman->foto_produk
                )
            ) {
                Storage::disk('public')->delete(
                    $pengiriman->foto_produk
                );
            }

            $validated['foto_produk'] = $request
                ->file('foto_produk')
                ->store('pengiriman', 'public');
        }

        $pengiriman->update($validated);

        $pengiriman->load('transaksi');

        return response()->json([
            'message' => 'Data pengiriman berhasil diperbarui.',
            'data' => $pengiriman,
        ]);
    }

    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:menunggu,diproses,dikemas,dikirim,selesai',
        ]);

        $pengiriman = Pengiriman::with('transaksi')
            ->findOrFail($id);

        $pengiriman->update([
            'status' => $request->status,
        ]);

        $transaksi = $pengiriman->transaksi;

        $statusLabel = [
            'menunggu' => 'Menunggu',
            'diproses' => 'Diproses',
            'dikemas' => 'Dikemas',
            'dikirim' => 'Dikirim',
            'selesai' => 'Selesai',
        ];

        if ($transaksi && $transaksi->user_id) {
            Notification::create([
                'user_id' => $transaksi->user_id,
                'transaksi_id' => $transaksi->id,
                'judul' => 'Status Pengiriman Diperbarui',
                'pesan' => 'Status pengiriman pesanan ' .
                    $transaksi->kode_transaksi .
                    ' sekarang ' .
                    $statusLabel[$request->status] .
                    '.',
                'status' => false,
            ]);
        }

        $pengiriman->refresh();
        $pengiriman->load('transaksi');

        return response()->json([
            'message' => 'Status pengiriman berhasil diperbarui.',
            'data' => $pengiriman,
        ]);
    }

    public function updateResi(Request $request, $id)
    {
        $request->validate([
            'nomor_resi' => 'required|string|max:255',
        ]);

        $pengiriman = Pengiriman::with('transaksi')
            ->findOrFail($id);

        $pengiriman->update([
            'nomor_resi' => $request->nomor_resi,
            'status' => 'dikirim',
        ]);

        $transaksi = $pengiriman->transaksi;

        if ($transaksi && $transaksi->user_id) {
            Notification::create([
                'user_id' => $transaksi->user_id,
                'transaksi_id' => $transaksi->id,
                'judul' => 'Pesanan Dikirim',
                'pesan' => 'Pesanan ' .
                    $transaksi->kode_transaksi .
                    ' telah dikirim. Nomor resi: ' .
                    $request->nomor_resi,
                'status' => false,
            ]);
        }

        $pengiriman->refresh();
        $pengiriman->load('transaksi');

        return response()->json([
            'message' => 'Nomor resi berhasil ditambahkan.',
            'data' => $pengiriman,
        ]);
    }

    public function tracking($transaksiId)
    {
        $pengiriman = Pengiriman::where(
            'transaksi_id',
            $transaksiId
        )
        ->with('transaksi')
        ->firstOrFail();

        return response()->json($pengiriman);
    }

    public function destroy($id)
    {
        $pengiriman = Pengiriman::findOrFail($id);

        if (
            $pengiriman->foto_produk &&
            Storage::disk('public')->exists(
                $pengiriman->foto_produk
            )
        ) {
            Storage::disk('public')->delete(
                $pengiriman->foto_produk
            );
        }

        $pengiriman->delete();

        return response()->json([
            'message' => 'Data pengiriman berhasil dihapus.',
        ]);
    }
}