@extends('layouts.app')

@section('title', 'Detail Retur')

@section('content')

<div class="d-flex justify-content-between align-items-center mb-4">

    <div>
        <h3 class="fw-bold mb-1">
            Detail Retur
        </h3>

        <p class="text-muted mb-0">
            Informasi retur barang.
        </p>
    </div>

    <a href="{{ route('retur.index') }}"
       class="btn btn-secondary">
        ← Kembali
    </a>

</div>

<div class="card shadow-sm border-0">

    <div class="card-body">

        <div class="row">

            <div class="col-md-6 mb-3">

                <strong>Produk</strong>

                <p>
                    {{ $retur->produk->nama_produk ?? '-' }}
                </p>

            </div>

            <div class="col-md-6 mb-3">

                <strong>Tanggal Retur</strong>

                <p>
                    {{ \Carbon\Carbon::parse($retur->tanggal_retur)->format('d/m/Y') }}
                </p>

            </div>

            <div class="col-md-4 mb-3">

                <strong>Ukuran</strong>

                <p>
                    {{ $retur->ukuran->nama_ukuran ?? '-' }}
                </p>

            </div>

            <div class="col-md-4 mb-3">

                <strong>Warna</strong>

                <p>
                    {{ $retur->warna->nama_warna ?? '-' }}
                </p>

            </div>

            <div class="col-md-4 mb-3">

                <strong>Jumlah</strong>

                <p>
                    {{ $retur->jumlah }}
                </p>

            </div>

            <div class="col-md-12 mb-3">

                <strong>Jenis Retur</strong>

                <p>

                    @if($retur->jenis === 'masuk')

                        <span class="badge bg-success">
                            Retur Masuk
                        </span>

                    @else

                        <span class="badge bg-danger">
                            Retur Keluar
                        </span>

                    @endif

                </p>

            </div>

            <div class="col-md-12">

                <strong>Alasan</strong>

                <p class="text-muted">
                    {{ $retur->alasan ?? '-' }}
                </p>

            </div>

        </div>

    </div>

</div>

@endsection