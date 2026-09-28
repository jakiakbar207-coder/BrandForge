@extends('layouts.app')

@section('title', 'Detail Pembelian')

@section('content')

<div class="d-flex justify-content-between align-items-center mb-4">

    <div>
        <h3 class="fw-bold mb-1">
            Detail Pembelian
        </h3>

        <p class="text-muted mb-0">
            Informasi pembelian stok.
        </p>
    </div>

    <a href="{{ route('pembelian.index') }}"
       class="btn btn-secondary">
        ← Kembali
    </a>

</div>

<div class="card shadow-sm border-0">

    <div class="card-body">

        <div class="row mb-4">

            <div class="col-md-6">

                <strong>Supplier</strong>

                <p>
                    {{ $pembelian->supplier->nama_supplier ?? '-' }}
                </p>

            </div>

            <div class="col-md-6">

                <strong>Tanggal Pembelian</strong>

                <p>
                    {{ \Carbon\Carbon::parse($pembelian->tanggal_pembelian)->format('d/m/Y') }}
                </p>

            </div>

        </div>

        <div class="table-responsive">

            <table class="table table-bordered">

                <thead class="table-light">

                    <tr>
                        <th>Produk</th>
                        <th>Ukuran</th>
                        <th>Warna</th>
                        <th>Jumlah</th>
                        <th>Harga Beli</th>
                        <th>Subtotal</th>
                    </tr>

                </thead>

                <tbody>

                    @foreach($pembelian->details as $detail)

                        <tr>

                            <td>
                                {{ $detail->produk->nama_produk ?? '-' }}
                            </td>

                            <td>
                                {{ $detail->ukuran->nama_ukuran ?? '-' }}
                            </td>

                            <td>
                                {{ $detail->warna->nama_warna ?? '-' }}
                            </td>

                            <td>
                                {{ $detail->jumlah }}
                            </td>

                            <td>
                                Rp {{ number_format($detail->harga_beli, 0, ',', '.') }}
                            </td>

                            <td>
                                Rp {{ number_format($detail->subtotal, 0, ',', '.') }}
                            </td>

                        </tr>

                    @endforeach

                </tbody>

            </table>

        </div>

        <div class="text-end">

            <strong>
                Total:
                Rp {{ number_format($pembelian->total_harga, 0, ',', '.') }}
            </strong>

        </div>

        @if($pembelian->catatan)

            <hr>

            <strong>Catatan:</strong>

            <p class="text-muted">
                {{ $pembelian->catatan }}
            </p>

        @endif

    </div>

</div>

@endsection