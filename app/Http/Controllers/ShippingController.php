<?php

namespace App\Http\Controllers;

use App\Models\Pengiriman;
use App\Models\Transaksi;
use App\Models\Notification;
use Illuminate\Http\Request;

class ShippingController extends Controller
{

    public function index()
    {
        $pengiriman = Pengiriman::with('transaksi')
            ->latest()
            ->get();

        return view('admin.pengiriman.index', compact('pengiriman'));
    }

    public function edit($id)
    {
        $transaksi = Transaksi::findOrFail($id);

        $pengiriman = Pengiriman::where('transaksi_id', $id)
            ->first();

        return view(
            'admin.pengiriman.edit',
            compact('transaksi', 'pengiriman')
        );
    }

   public function store(Request $request)
    {
        $request->validate([
            'transaksi_id' => 'required',
            'kurir'        => 'required',
            'layanan'      => 'required',
            'ongkir'       => 'required|numeric',
        ]);

        Pengiriman::updateOrCreate(
            [
                'transaksi_id' => $request->transaksi_id
            ],
            [
                'kurir'       => $request->kurir,
                'layanan'     => $request->layanan,
                'ongkir'      => $request->ongkir,
                'nomor_resi'  => $request->nomor_resi,
                'status'      => $request->status ?? 'menunggu',
                'catatan'     => $request->catatan,
            ]
        );

        return redirect()
            ->route('admin.pengiriman.index')
            ->with('success', 'Data pengiriman berhasil disimpan');
    }

   public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:menunggu,diproses,dikemas,dikirim,selesai'
        ]);

        $pengiriman = Pengiriman::with('transaksi')
            ->findOrFail($id);

        $pengiriman->update([
            'status' => $request->status
        ]);

        $transaksi = $pengiriman->transaksi;

        $statusLabel = [
            'menunggu' => 'Menunggu',
            'diproses' => 'Diproses',
            'dikemas'  => 'Dikemas',
            'dikirim'  => 'Dikirim',
            'selesai'  => 'Selesai',
        ];

        // NOTIFIKASI PELANGGAN
        if ($transaksi && $transaksi->user_id) {

            Notification::create([
                'user_id'      => $transaksi->user_id,
                'transaksi_id' => $transaksi->id,
                'judul'        => 'Status Pengiriman Diperbarui',
                'pesan'        => 'Status pengiriman pesanan ' .
                                $transaksi->kode_transaksi .
                                ' sekarang ' .
                                $statusLabel[$request->status] .
                                '.',
                'status'       => false,
            ]);
        }

        return back()
            ->with('success', 'Status pengiriman diperbarui');
    }
  public function updateResi(Request $request, $id)
    {
        $request->validate([
            'nomor_resi' => 'required'
        ]);

        $pengiriman = Pengiriman::with('transaksi')
            ->findOrFail($id);

        $pengiriman->update([
            'nomor_resi' => $request->nomor_resi,
            'status' => 'dikirim'
        ]);

        $transaksi = $pengiriman->transaksi;

        // NOTIFIKASI PELANGGAN
        if ($transaksi && $transaksi->user_id) {

            Notification::create([
                'user_id'      => $transaksi->user_id,
                'transaksi_id' => $transaksi->id,
                'judul'        => 'Pesanan Dikirim',
                'pesan'        => 'Pesanan ' .
                                $transaksi->kode_transaksi .
                                ' telah dikirim. Nomor resi: ' .
                                $request->nomor_resi,
                'status'       => false,
            ]);
        }

        return back()
            ->with('success', 'Nomor resi berhasil ditambahkan');
    }


   public function tracking($id)
    {
        $pengiriman = Pengiriman::where('transaksi_id', $id)
            ->with('transaksi')
            ->firstOrFail();

        return view('pelanggan.tracking', compact('pengiriman'));
    }

    public function printLabel($id)
    {
        $pengiriman = Pengiriman::with('transaksi')->findOrFail($id);

        return view('admin.pengiriman.label', compact('pengiriman'));
    }

}
