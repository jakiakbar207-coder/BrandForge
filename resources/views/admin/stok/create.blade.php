@extends('layouts.app')

@section('title', 'Tambah Stok')

@section('content')

<div class="container-fluid py-4">

    <div class="d-flex justify-content-between align-items-center mb-4">

        <div>
            <h3 class="fw-bold mb-1">📦 Tambah Stok</h3>
            <p class="text-muted mb-0">
                Tambahkan stok berdasarkan produk, ukuran, dan warna.
            </p>
        </div>

        <a href="{{ route('stok.index') }}"
           class="btn btn-secondary">

            ← Kembali

        </a>

    </div>

    @if ($errors->any())

        <div class="alert alert-danger">

            <strong>Terjadi kesalahan:</strong>

            <ul class="mb-0 mt-2">

                @foreach ($errors->all() as $error)

                    <li>{{ $error }}</li>

                @endforeach

            </ul>

        </div>

    @endif

    <div class="card border-0 shadow-sm">

        <div class="card-body">

            <form action="{{ route('stok.store') }}"
                  method="POST">

                @csrf

                {{-- PRODUK --}}
                <div class="mb-3">

                    <label class="form-label fw-semibold">
                        Produk
                    </label>

                    <select
                        name="produk_id"
                        class="form-select"
                        required>

                        <option value="">
                            -- Pilih Produk --
                        </option>

                        @foreach($produks as $produk)

                            <option
                                value="{{ $produk->id }}"
                                {{ old('produk_id') == $produk->id ? 'selected' : '' }}>

                                {{ $produk->nama_produk }}

                            </option>

                        @endforeach

                    </select>

                </div>

                <div class="row">

                    {{-- UKURAN --}}
                    <div class="col-md-6 mb-3">

                        <label class="form-label fw-semibold">
                            Ukuran
                        </label>

                        <select
                            name="ukuran_id"
                            class="form-select"
                            required>

                            <option value="">
                                -- Pilih Ukuran --
                            </option>

                            @foreach($ukurans as $ukuran)

                                <option
                                    value="{{ $ukuran->id }}"
                                    {{ old('ukuran_id') == $ukuran->id ? 'selected' : '' }}>

                                    {{ $ukuran->nama_ukuran }}

                                </option>

                            @endforeach

                        </select>

                    </div>

                    {{-- WARNA --}}
                    <div class="col-md-6 mb-3">

                        <label class="form-label fw-semibold">
                            Warna
                        </label>

                        <select
                            name="warna_id"
                            class="form-select"
                            required>

                            <option value="">
                                -- Pilih Warna --
                            </option>

                            @foreach($warnas as $warna)

                                <option
                                    value="{{ $warna->id }}"
                                    {{ old('warna_id') == $warna->id ? 'selected' : '' }}>

                                    {{ $warna->nama_warna }}

                                </option>

                            @endforeach

                        </select>

                    </div>

                </div>

                {{-- JUMLAH --}}
                <div class="mb-4">

                    <label class="form-label fw-semibold">
                        Jumlah Stok
                    </label>

                    <input
                        type="number"
                        name="jumlah"
                        class="form-control"
                        value="{{ old('jumlah', 0) }}"
                        min="0"
                        required>

                </div>

                <div class="d-flex justify-content-end gap-2">

                    <a href="{{ route('stok.index') }}"
                       class="btn btn-secondary">

                        Batal

                    </a>

                    <button
                        type="submit"
                        class="btn btn-success">

                        💾 Simpan Stok

                    </button>

                </div>

            </form>

        </div>

    </div>

</div>

@endsection