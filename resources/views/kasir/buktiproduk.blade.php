@extends('layouts.app')

@section('title', 'Foto Produk')

@section('content')

<div class="container mt-4">

    <a href="{{ route('kasir.riwayat') }}" class="btn btn-secondary mb-3">
        ← Kembali
    </a>

    <div class="card">
        <div class="card-header bg-secondary text-white">
            <h4>Foto Produk</h4>
        </div>

        <div class="card-body text-center">

            @if($transaksi->pengiriman && $transaksi->pengiriman->foto_produk)

            <img
                src="{{ asset('foto_produk/'.$transaksi->pengiriman->foto_produk) }}"
                class="img-fluid rounded"
                style="max-height:600px;">

        @else

            <div class="alert alert-danger">
                Foto produk belum diupload.
            </div>

        @endif

        </div>
    </div>

</div>

@endsection