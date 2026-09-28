<?php

namespace App\Http\Controllers;

use App\Models\Transaksi;
use App\Models\Pengiriman;
use App\Models\DetailTransaksi;
use App\Models\Stok;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class KasirController extends Controller
{
    public function index()
    {
        $menungguVerifikasi = Transaksi::where(
            'status',
            'Menunggu Verifikasi'
        )->count();

        $diproses = Transaksi::where(
            'status',
            'Diproses'
        )->count();

        $selesai = Transaksi::where(
            'status',
            'Selesai'
        )->count();

        return view('kasir.index', compact(
            'menungguVerifikasi',
            'diproses',
            'selesai'
        ));
    }

    public function transaksi()
    {
        $stoks = Stok::with([
            'produk',
            'ukuran',
            'warna'
        ])->get();

        return view('kasir.transaksi', compact('stoks'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'stok_id' => 'required|exists:stoks,id',
            'jumlah' => 'required|integer|min:1',
            'bayar' => 'required|numeric|min:0',
        ]);

        DB::beginTransaction();

        try {
            $stok = Stok::with('produk')
                ->findOrFail($request->stok_id);

            if ($request->jumlah > $stok->jumlah) {
                DB::rollBack();

                return back()->with(
                    'error',
                    'Stok tidak mencukupi.'
                );
            }

            $harga = $stok->produk->harga;

            $subtotal = $harga * $request->jumlah;

            if ($request->bayar < $subtotal) {
                DB::rollBack();

                return back()->with(
                    'error',
                    'Uang pembayaran kurang.'
                );
            }

            $transaksi = Transaksi::create([
                'user_id' => Auth::id(),
                'nama_penerima' => Auth::user()->name,
                'alamat' => '-',
                'no_hp' => '-',
                'kode_transaksi' => 'TRX-' . date('YmdHis'),
                'tanggal_transaksi' => now(),
                'total_harga' => $subtotal,
                'bayar' => $request->bayar,
                'kembalian' => $request->bayar - $subtotal,
                'status' => 'Diproses',
            ]);

            DetailTransaksi::create([
                'transaksi_id' => $transaksi->id,
                'stok_id' => $stok->id,
                'produk_id' => $stok->produk_id,
                'jumlah' => $request->jumlah,
                'harga' => $harga,
                'subtotal' => $subtotal,
            ]);

            $stok->jumlah -= $request->jumlah;
            $stok->save();

            DB::commit();

            return redirect()
                ->route('kasir.riwayat')
                ->with(
                    'success',
                    'Transaksi berhasil disimpan.'
                );

        } catch (\Exception $e) {
            DB::rollBack();

            return back()->with(
                'error',
                $e->getMessage()
            );
        }
    }

    public function riwayat()
    {
        $transaksis = Transaksi::with([
            'user',
            'pembayaran',
            'pengiriman'
        ])
        ->latest()
        ->get();

        return view(
            'kasir.riwayat',
            compact('transaksis')
        );
    }

    public function show($id)
    {
        $transaksi = Transaksi::with([
            'user',
            'pengiriman',
            'detailTransaksi.produk',
            'detailTransaksi.stok.ukuran',
            'detailTransaksi.stok.warna',
        ])->findOrFail($id);

        return view(
            'kasir.detail',
            compact('transaksi')
        );
    }

    public function selesai($id)
    {
        $transaksi = Transaksi::with('user')
            ->findOrFail($id);

        $transaksi->update([
            'bayar' => $transaksi->total_harga,
            'kembalian' => 0,
            'status' => 'Selesai',
        ]);

        if ($transaksi->user_id) {
            Notification::create([
                'user_id' => $transaksi->user_id,
                'transaksi_id' => $transaksi->id,
                'judul' => 'Pesanan Selesai',
                'pesan' => 'Pesanan ' .
                    $transaksi->kode_transaksi .
                    ' telah selesai.',
                'status' => false,
                'type' => 'pesanan_selesai',
                'notifiable_type' => 'App\Models\User',
                'notifiable_id' => $transaksi->user_id,
                'data' => json_encode([
                    'transaksi_id' => $transaksi->id,
                    'kode_transaksi' => $transaksi->kode_transaksi,
                    'status' => 'Selesai',
                ]),
            ]);
        }

        return redirect()
            ->route('kasir.riwayat')
            ->with(
                'success',
                'Pesanan selesai.'
            );
    }

    public function verifikasi($id)
    {
        $transaksi = Transaksi::with([
            'pembayaran',
            'user'
        ])->findOrFail($id);

        $transaksi->update([
            'status' => 'Diproses',
            'bayar' => $transaksi->total_harga,
            'kembalian' => 0,
        ]);

        if ($transaksi->pembayaran) {
            $transaksi->pembayaran->update([
                'status' => 'Terverifikasi'
            ]);
        }

        $pengiriman = Pengiriman::where(
            'transaksi_id',
            $transaksi->id
        )->first();

        if ($pengiriman) {
            $pengiriman->update([
                'status' => 'menunggu'
            ]);
        }

        if ($transaksi->user_id) {
            Notification::create([
                'user_id' => $transaksi->user_id,
                'transaksi_id' => $transaksi->id,
                'judul' => 'Pesanan Diproses',
                'pesan' => 'Pembayaran pesanan ' .
                    $transaksi->kode_transaksi .
                    ' telah diverifikasi. Pesanan sedang diproses.',
                'status' => false,
                'type' => 'pesanan_diproses',
                'notifiable_type' => 'App\Models\User',
                'notifiable_id' => $transaksi->user_id,
                'data' => json_encode([
                    'transaksi_id' => $transaksi->id,
                    'kode_transaksi' => $transaksi->kode_transaksi,
                    'status' => 'Diproses',
                ]),
            ]);
        }

        return redirect()
            ->route('kasir.riwayat')
            ->with(
                'success',
                'Pembayaran berhasil diverifikasi.'
            );
    }

    public function updateResi(Request $request, $id)
    {
        $request->validate([
            'nomor_resi' => 'required',
        ]);

        $pengiriman = Pengiriman::with('transaksi')
            ->where('transaksi_id', $id)
            ->firstOrFail();

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
                'type' => 'pesanan_dikirim',
                'notifiable_type' => 'App\Models\User',
                'notifiable_id' => $transaksi->user_id,
                'data' => json_encode([
                    'transaksi_id' => $transaksi->id,
                    'kode_transaksi' => $transaksi->kode_transaksi,
                    'nomor_resi' => $request->nomor_resi,
                    'status' => 'Dikirim',
                ]),
            ]);
        }

        return back()->with(
            'success',
            'Nomor resi berhasil disimpan.'
        );
    }

    public function updateStatusKirim(
        Request $request,
        $id
    ) {
        $request->validate([
            'status' => 'required|in:menunggu,diproses,dikemas,dikirim,selesai',
        ]);

        $pengiriman = Pengiriman::with('transaksi')
            ->where('transaksi_id', $id)
            ->firstOrFail();

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
                'type' => 'status_pengiriman',
                'notifiable_type' => 'App\Models\User',
                'notifiable_id' => $transaksi->user_id,
                'data' => json_encode([
                    'transaksi_id' => $transaksi->id,
                    'kode_transaksi' => $transaksi->kode_transaksi,
                    'status' => $request->status,
                    'status_label' => $statusLabel[$request->status],
                ]),
            ]);
        }

        return back()->with(
            'success',
            'Status pengiriman berhasil diperbarui.'
        );
    }

    public function printLabel($id)
    {
        $pengiriman = Pengiriman::with('pesanan')
            ->findOrFail($id);

        return view(
            'kasir.label',
            compact('pengiriman')
        );
    }

    public function buktiPembayaran($id)
    {
        $transaksi = Transaksi::with('pembayaran')
            ->findOrFail($id);

        return view(
            'kasir.buktipembayaran',
            compact('transaksi')
        );
    }

    public function buktiProduk($id)
    {
        $transaksi = Transaksi::with('pengiriman')
            ->findOrFail($id);

        return view(
            'kasir.buktiproduk',
            compact('transaksi')
        );
    }
}