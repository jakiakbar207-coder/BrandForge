@extends('layouts.app')

@section('title', 'Pembelian Stok')

@section('content')

<div class="d-flex justify-content-between align-items-center mb-4">
    <div>
        <h3 class="fw-bold mb-1">
            Pembelian Stok
        </h3>
        <p class="text-muted mb-0">
            Tambahkan stok dari supplier.
        </p>
    </div>

    <a href="{{ route('pembelian.index') }}"
       class="btn btn-secondary">
        ← Kembali
    </a>
</div>

@if($errors->any())
    <div class="alert alert-danger">
        <strong>Terjadi kesalahan:</strong>

        <ul class="mb-0 mt-2">
            @foreach($errors->all() as $error)
                <li>{{ $error }}</li>
            @endforeach
        </ul>
    </div>
@endif

<div class="card shadow-sm border-0">
    <div class="card-body">

        <form action="{{ route('pembelian.store') }}"
              method="POST">

            @csrf

            <div class="row">

                <div class="col-md-6 mb-3">
                    <label class="form-label">
                        Supplier
                    </label>

                    <select name="supplier_id"
                            class="form-select"
                            required>

                        <option value="">
                            -- Pilih Supplier --
                        </option>

                        @foreach($suppliers as $supplier)

                            <option value="{{ $supplier->id }}"
                                {{ old('supplier_id') == $supplier->id ? 'selected' : '' }}>

                                {{ $supplier->nama_supplier }}

                            </option>

                        @endforeach

                    </select>
                </div>

                <div class="col-md-6 mb-3">

                    <label class="form-label">
                        Tanggal Pembelian
                    </label>

                    <input type="date"
                           name="tanggal_pembelian"
                           class="form-control"
                           value="{{ old('tanggal_pembelian', date('Y-m-d')) }}"
                           required>

                </div>

            </div>

            <hr>

            <h5 class="fw-bold mb-3">
                Produk
            </h5>

            <div class="row">

                <div class="col-md-4 mb-3">

                    <label class="form-label">
                        Produk
                    </label>

                    <select name="produk_id[]"
                            class="form-select"
                            required>

                        <option value="">
                            -- Pilih Produk --
                        </option>

                        @foreach($produks as $produk)

                            <option value="{{ $produk->id }}"
                                {{ old('produk_id.0') == $produk->id ? 'selected' : '' }}>

                                {{ $produk->nama_produk }}

                            </option>

                        @endforeach

                    </select>

                </div>

                <div class="col-md-4 mb-3">

                    <label class="form-label">
                        Ukuran
                    </label>

                    <select name="ukuran_id[]"
                            class="form-select">

                        <option value="">
                            -- Pilih Ukuran --
                        </option>

                        @foreach($ukurans as $ukuran)

                            <option value="{{ $ukuran->id }}"
                                {{ old('ukuran_id.0') == $ukuran->id ? 'selected' : '' }}>

                                {{ $ukuran->nama_ukuran }}

                            </option>

                        @endforeach

                    </select>

                </div>

                <div class="col-md-4 mb-3">

                    <label class="form-label">
                        Warna
                    </label>

                    <select name="warna_id[]"
                            class="form-select">

                        <option value="">
                            -- Pilih Warna --
                        </option>

                        @foreach($warnas as $warna)

                            <option value="{{ $warna->id }}"
                                {{ old('warna_id.0') == $warna->id ? 'selected' : '' }}>

                                {{ $warna->nama_warna }}

                            </option>

                        @endforeach

                    </select>

                </div>

            </div>

            <div class="row">

                <div class="col-md-6 mb-3">

                    <label class="form-label">
                        Jumlah
                    </label>

                    <input type="number"
                           name="jumlah[]"
                           class="form-control"
                           min="1"
                           value="{{ old('jumlah.0', 1) }}"
                           required>

                </div>

                <div class="col-md-6 mb-3">

                    <label class="form-label">
                        Harga Modal
                    </label>

                    <input type="number"
                           name="harga_modal[]"
                           class="form-control"
                           min="0"
                           value="{{ old('harga_modal.0', 0) }}"
                           required>

                </div>

            </div>

            <div class="mb-4">

                <label class="form-label">
                    Catatan
                </label>

                <textarea name="catatan"
                          class="form-control"
                          rows="3">{{ old('catatan') }}</textarea>

            </div>

            <div class="d-flex justify-content-end">

                <a href="{{ route('pembelian.index') }}"
                   class="btn btn-secondary me-2">

                    Batal

                </a>

                <button type="submit"
                        class="btn btn-success">

                    Simpan Pembelian

                </button>

            </div>

        </form>

    </div>
</div>

@endsection