@extends('layouts.app')

@section('title', 'Edit Supplier')

@section('content')

<div class="d-flex justify-content-between align-items-center mb-4">

    <div>
        <h3 class="fw-bold mb-1">Edit Supplier</h3>
        <p class="text-muted mb-0">
            Perbarui informasi supplier.
        </p>
    </div>

    <a href="{{ route('supplier.index') }}"
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

        <form action="{{ route('supplier.update', $supplier->id) }}"
              method="POST">

            @csrf
            @method('PUT')

            <div class="mb-3">

                <label class="form-label">
                    Nama Supplier
                </label>

                <input type="text"
                       name="nama_supplier"
                       class="form-control"
                       value="{{ old('nama_supplier', $supplier->nama_supplier) }}"
                       required>

            </div>

            <div class="mb-3">

                <label class="form-label">
                    Kontak
                </label>

                <input type="text"
                       name="kontak"
                       class="form-control"
                       value="{{ old('kontak', $supplier->kontak) }}">

            </div>

            <div class="mb-3">

                <label class="form-label">
                    Email
                </label>

                <input type="email"
                       name="email"
                       class="form-control"
                       value="{{ old('email', $supplier->email) }}">

            </div>

            <div class="mb-4">

                <label class="form-label">
                    Alamat
                </label>

                <textarea name="alamat"
                          rows="4"
                          class="form-control">{{ old('alamat', $supplier->alamat) }}</textarea>

            </div>

            <div class="d-flex justify-content-end">

                <a href="{{ route('supplier.index') }}"
                   class="btn btn-secondary me-2">
                    Batal
                </a>

                <button type="submit"
                        class="btn btn-success">
                    Update Supplier
                </button>

            </div>

        </form>

    </div>

</div>

@endsection