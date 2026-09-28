@extends('layouts.app')

@section('title', 'Bukti Pembayaran')

@section('content')

<div class="container mt-4">

    <a href="{{ route('kasir.riwayat') }}" class="btn btn-secondary mb-3">
        ← Kembali
    </a>

    <div class="card">
        <div class="card-header bg-warning">
            <h4>Bukti Pembayaran</h4>
        </div>

        <div class="card-body text-center">

            @if($transaksi->pembayaran && $transaksi->pembayaran->bukti)

                <img src="{{ asset('bukti/'.$transaksi->pembayaran->bukti) }}"
                     class="img-fluid rounded"
                     style="max-height:600px;">

            @else

                <div class="alert alert-danger">
                    Bukti pembayaran belum diupload.
                </div>

            @endif

        </div>
    </div>

</div>

@endsection