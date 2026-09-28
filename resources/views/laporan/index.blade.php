@extends('layouts.app')

@section('content')
<div class="container py-4">

    <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
            <h2 class="fw-bold mb-1">📊 Laporan Transaksi</h2>
            <small class="text-muted">
                Ringkasan penjualan BrandForge
            </small>
        </div>

        <div>
            <a href="{{ route('laporan.pdf') }}" class="btn btn-danger">
                📄 Download PDF
            </a>

            <a href="{{ route('laporan.excel') }}" class="btn btn-success">
                📊 Download Excel
            </a>

              <a href="{{ route('admin.index') }}"
               class="btn btn-secondary">
                Kembali
            </a>
            <a href="{{ route('owner.index') }}"
               class="btn btn-danger">
                 owner
            </a>
        </div>
    </div>

    {{-- Pendapatan --}}
    <div class="row g-3 mb-4">

        <div class="col-md-3">
            <div class="card shadow border-0 bg-success text-white">
                <div class="card-body text-center">
                    <h6>Total Pendapatan</h6>
                    <h3>
                        Rp {{ number_format($totalPendapatan,0,',','.') }}
                    </h3>
                </div>
            </div>
        </div>

        <div class="col-md-3">
            <div class="card shadow border-0">
                <div class="card-body text-center">
                    <h6 class="text-muted">Harian</h6>
                    <h4 class="text-primary">
                        Rp {{ number_format($pendapatanHarian,0,',','.') }}
                    </h4>
                </div>
            </div>
        </div>

        <div class="col-md-3">
            <div class="card shadow border-0">
                <div class="card-body text-center">
                    <h6 class="text-muted">Bulanan</h6>
                    <h4 class="text-warning">
                        Rp {{ number_format($pendapatanBulanan,0,',','.') }}
                    </h4>
                </div>
            </div>
        </div>

        <div class="col-md-3">
            <div class="card shadow border-0">
                <div class="card-body text-center">
                    <h6 class="text-muted">Tahunan</h6>
                    <h4 class="text-info">
                        Rp {{ number_format($pendapatanTahunan,0,',','.') }}
                    </h4>
                </div>
            </div>
        </div>

    </div>

    {{-- Statistik --}}
    <div class="row g-3 mb-4">

        <div class="col-md-4">
            <div class="card shadow-sm border-primary">
                <div class="card-body text-center">
                    <h6>Jumlah Order</h6>
                    <h2>{{ $jumlahOrder }}</h2>
                </div>
            </div>
        </div>

        <div class="col-md-4">
            <div class="card shadow-sm border-success">
                <div class="card-body text-center">
                    <h6>Produk Terjual</h6>
                    <h2>{{ $produkTerjual }}</h2>
                </div>
            </div>
        </div>

        <div class="col-md-4">
            <div class="card shadow-sm border-info">
                <div class="card-body text-center">
                    <h6>Jumlah Pelanggan</h6>
                    <h2>{{ $jumlahPelanggan }}</h2>
                </div>
            </div>
        </div>

    </div>

    {{-- Laba Rugi --}}
    <div class="card shadow mb-4">

        <div class="card-header bg-dark text-white">
            <h5 class="mb-0">
                💰 Laporan Laba / Rugi
            </h5>
        </div>

        <div class="card-body">

            <table class="table table-bordered mb-0">

                <tr>
                    <th width="40%">Penjualan</th>
                    <td>
                        Rp {{ number_format($penjualan,0,',','.') }}
                    </td>
                </tr>

                <tr>
                    <th>Modal Produk</th>
                    <td>
                        Rp {{ number_format($modalProduk,0,',','.') }}
                    </td>
                </tr>

                <tr>
                    <th>Biaya Operasional</th>
                    <td>
                        Rp {{ number_format($biayaOperasional,0,',','.') }}
                    </td>
                </tr>

                <tr class="table-success">
                    <th>Laba Bersih</th>
                    <th>
                        Rp {{ number_format($labaBersih,0,',','.') }}
                    </th>
                </tr>

            </table>

        </div>

    </div>

    {{-- Data Transaksi --}}
    <div class="card shadow">

        <div class="card-header bg-primary text-white">
            <h5 class="mb-0">
                📋 Data Transaksi
            </h5>
        </div>

        <div class="card-body">

            <div class="table-responsive">

                <table class="table table-bordered table-hover align-middle">

                    <thead class="table-dark">

                        <tr>
                            <th>No</th>
                            <th>Kode</th>
                            <th>Pelanggan</th>
                            <th>Tanggal</th>
                            <th>Total</th>
                            <th>Bayar</th>
                            <th>Kembalian</th>
                            <th>Status</th>
                        </tr>

                    </thead>

                    <tbody>

                    @forelse($transaksi as $item)

                        <tr>
                            <td>{{ $loop->iteration }}</td>
                            <td>{{ $item->kode_transaksi }}</td>
                            <td>{{ $item->nama_penerima }}</td>
                            <td>{{ $item->tanggal_transaksi }}</td>
                            <td>Rp {{ number_format($item->total_harga,0,',','.') }}</td>
                            <td>Rp {{ number_format($item->bayar,0,',','.') }}</td>
                            <td>Rp {{ number_format($item->kembalian,0,',','.') }}</td>

                            <td>
                                <span class="badge bg-success">
                                    {{ ucfirst($item->status) }}
                                </span>
                            </td>

                        </tr>

                    @empty

                        <tr>
                            <td colspan="8" class="text-center">
                                Belum ada data transaksi.
                            </td>
                        </tr>

                    @endforelse

                    </tbody>

                </table>

            </div>

        </div>

    </div>

</div>
@endsection