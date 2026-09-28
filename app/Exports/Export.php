<?php

namespace App\Exports;

use App\Models\Transaksi;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;

class Export implements FromCollection, WithHeadings, ShouldAutoSize
{
    // Mengambil data laporan transaksi
    public function collection()
    {
        $no = 1;

        return Transaksi::with('user')
            ->latest()
            ->get()
            ->map(function ($transaksi) use (&$no) {
                return [
                    'no' => $no++,
                    'kode_transaksi' => $transaksi->id,
                    'pelanggan' => $transaksi->user->name ?? '-',
                    'tanggal' => $transaksi->tanggal_transaksi,
                    'total' => $transaksi->total_harga,
                    'status' => $transaksi->status,
                ];
            });
    }

    // Judul kolom Excel
    public function headings(): array
    {
        return [
            'No',
            'Kode Transaksi',
            'Pelanggan',
            'Tanggal',
            'Total Penjualan',
            'Status',
        ];
    }
}