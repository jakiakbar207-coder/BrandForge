@extends('layouts.app')

@section('title', 'Transaksi Kasir')

@section('content')

<div class="container mt-4">

    <h2 class="mb-4">Transaksi Kasir</h2>

    @if(session('success'))
        <div class="alert alert-success">
            {{ session('success') }}
        </div>
    @endif

    @if(session('error'))
        <div class="alert alert-danger">
            {{ session('error') }}
        </div>
    @endif

    @if ($errors->any())
        <div class="alert alert-danger">
            <ul class="mb-0">
                @foreach ($errors->all() as $error)
                    <li>{{ $error }}</li>
                @endforeach
            </ul>
        </div>
    @endif

    <div class="card">
        <div class="card-header">
            Form Transaksi
        </div>

        <div class="card-body">

            <form action="{{ route('kasir.store') }}" method="POST">
                @csrf

                <div class="mb-3">
                    <label class="form-label">Pilih Produk</label>

                    <select name="stok_id" class="form-select" required>
                        <option value="">-- Pilih Produk --</option>

                        @foreach($stoks as $stok)
                            <option value="{{ $stok->id }}">
                                {{ $stok->produk->nama_produk }}
                                |
                                {{ $stok->ukuran->nama_ukuran ?? 'Tanpa Ukuran' }}
                                |
                                {{ $stok->warna->nama_warna ?? 'Tanpa Warna' }}
                                |
                                Stok : {{ $stok->jumlah }}
                                |
                                Rp {{ number_format($stok->produk->harga, 0, ',', '.') }}
                            </option>
                        @endforeach

                    </select>
                </div>

                <div class="mb-3">
                    <label class="form-label">Jumlah</label>

                    <input
                        type="number"
                        name="jumlah"
                        class="form-control"
                        min="1"
                        required>
                </div>

                <div class="mb-3">
                    <label class="form-label">Uang Pembayaran</label>

                    <input
                        type="number"
                        name="bayar"
                        class="form-control"
                        min="0"
                        required>
                </div>

                <button type="submit" class="btn btn-primary">
                    Simpan Transaksi
                </button>

                <a href="{{ route('kasir.index') }}" class="btn btn-secondary">
                    Kembali
                </a>

            </form>

        </div>
    </div>

</div>

@endsection