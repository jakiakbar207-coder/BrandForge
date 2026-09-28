@extends('layouts.app')

@section('title', 'Tambah Produk')

@section('content')

<div class="container py-4">

    <div class="d-flex justify-content-between align-items-center mb-4">
        <h3 class="fw-bold">
            Tambah Produk
        </h3>

        <a href="{{ route('produk.index') }}" class="btn btn-secondary">
            ← Kembali
        </a>
    </div>

    @if ($errors->any())
        <div class="alert alert-danger">
            <strong>Terjadi kesalahan :</strong>
            <ul class="mb-0 mt-2">
                @foreach ($errors->all() as $error)
                    <li>{{ $error }}</li>
                @endforeach
            </ul>
        </div>
    @endif

    <div class="card shadow">

        <div class="card-body">

            <form action="{{ route('produk.store') }}"
                  method="POST"
                  enctype="multipart/form-data">

                @csrf

                <div class="row">

                    {{-- Kategori --}}
                    <div class="col-md-6 mb-3">
                        <label class="form-label">
                            Kategori
                        </label>

                        <select name="kategori_id" class="form-select" required>

                            <option value="">
                                -- Pilih Kategori --
                            </option>

                            @foreach($kategoris as $kategori)
                                <option
                                    value="{{ $kategori->id }}"
                                    {{ old('kategori_id')==$kategori->id ? 'selected' : '' }}>
                                    {{ $kategori->nama_kategori }}
                                </option>
                            @endforeach

                        </select>
                    </div>

                    {{-- Koleksi --}}
                    <div class="col-md-6 mb-3">
                        <label class="form-label">
                            Koleksi
                        </label>

                        <select name="koleksi_id" class="form-select">

                            <option value="">
                                Tidak Ada
                            </option>

                            @foreach($koleksis as $koleksi)
                                <option
                                    value="{{ $koleksi->id }}"
                                    {{ old('koleksi_id')==$koleksi->id ? 'selected' : '' }}>
                                    {{ $koleksi->nama_koleksi }}
                                </option>
                            @endforeach

                        </select>
                    </div>

                </div>

                {{-- Nama Produk --}}
                <div class="mb-3">
                    <label class="form-label">
                        Nama Produk
                    </label>

                    <input
                        type="text"
                        name="nama_produk"
                        class="form-control"
                        value="{{ old('nama_produk') }}"
                        required>
                </div>

                <div class="row">

                    {{-- Harga --}}
                    <div class="col-md-6 mb-3">

                        <label class="form-label">
                            Harga Jual
                        </label>

                        <input
                            type="number"
                            name="harga"
                            class="form-control"
                            value="{{ old('harga') }}"
                            required>

                    </div>

                    {{-- Modal --}}
                    <div class="col-md-6 mb-3">

                        <label class="form-label">
                            Modal Produk
                        </label>

                        <input
                            type="number"
                            name="modal_produk"
                            class="form-control"
                            value="{{ old('modal_produk') }}"
                            required>

                    </div>

                </div>

                {{-- Deskripsi --}}
                <div class="mb-3">

                    <label class="form-label">
                        Deskripsi
                    </label>

                    <textarea
                        name="deskripsi"
                        rows="4"
                        class="form-control">{{ old('deskripsi') }}</textarea>

                </div>

                <hr>

                <h5 class="mb-3">
                    Dimensi Produk
                </h5>

                <div class="row">

                    <div class="col-md-3 mb-3">

                        <label class="form-label">
                            Berat (gram)
                        </label>

                        <input
                            type="number"
                            name="berat"
                            class="form-control"
                            value="{{ old('berat',0) }}"
                            required>

                    </div>

                    <div class="col-md-3 mb-3">

                        <label class="form-label">
                            Panjang (cm)
                        </label>

                        <input
                            type="number"
                            name="panjang"
                            class="form-control"
                            value="{{ old('panjang',0) }}"
                            required>

                    </div>

                    <div class="col-md-3 mb-3">

                        <label class="form-label">
                            Lebar (cm)
                        </label>

                        <input
                            type="number"
                            name="lebar"
                            class="form-control"
                            value="{{ old('lebar',0) }}"
                            required>

                    </div>

                    <div class="col-md-3 mb-3">

                        <label class="form-label">
                            Tinggi (cm)
                        </label>

                        <input
                            type="number"
                            name="tinggi"
                            class="form-control"
                            value="{{ old('tinggi',0) }}"
                            required>

                    </div>

                </div>

                <hr>

        <h5 class="mb-3">
            Foto Produk
        </h5>

        <div class="alert alert-info">
            <strong>Informasi:</strong>
            Foto utama digunakan sebagai foto utama produk.
            Foto 2 sampai Foto 5 merupakan foto tambahan.
        </div>

        <div class="row">

            {{-- Foto Utama --}}
            <div class="col-md-4 mb-3">

                <label class="form-label">
                    Foto Utama
                </label>

                <input
                    type="file"
                    name="foto"
                    class="form-control"
                    accept="image/jpeg,image/png">

            </div>

            {{-- Foto 2 --}}
            <div class="col-md-4 mb-3">

                <label class="form-label">
                    Foto 2
                </label>

                <input
                    type="file"
                    name="foto2"
                    class="form-control"
                    accept="image/jpeg,image/png">

            </div>

            {{-- Foto 3 --}}
            <div class="col-md-4 mb-3">

                <label class="form-label">
                    Foto 3
                </label>

                <input
                    type="file"
                    name="foto3"
                    class="form-control"
                    accept="image/jpeg,image/png">

            </div>

            {{-- Foto 4 --}}
            <div class="col-md-4 mb-3">

                <label class="form-label">
                    Foto 4
                </label>

                <input
                    type="file"
                    name="foto4"
                    class="form-control"
                    accept="image/jpeg,image/png">

            </div>

            {{-- Foto 5 --}}
            <div class="col-md-4 mb-3">

                <label class="form-label">
                    Foto 5
                </label>

                <input
                    type="file"
                    name="foto5"
                    class="form-control"
                    accept="image/jpeg,image/png">

            </div>
            <hr class="mt-4">

        <div class="d-flex justify-content-end gap-2">

            <a href="{{ route('produk.index') }}"
            class="btn btn-secondary">
                ← Batal
            </a>

            <button type="submit"
                    class="btn btn-success">
                💾 Simpan Produk
            </button>

        </div>

        </div>

    </div>

</div>

@endsection