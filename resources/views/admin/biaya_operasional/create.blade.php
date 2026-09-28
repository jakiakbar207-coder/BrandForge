@extends('layouts.app')

@section('title', 'Tambah Biaya Operasional')

@section('content')

<div class="container py-4">

    <div class="card shadow">

        <div class="card-header bg-primary text-white">
            <h4 class="mb-0">Tambah Biaya Operasional</h4>
        </div>

        <div class="card-body">

            @if($errors->any())
                <div class="alert alert-danger">
                    <ul class="mb-0">
                        @foreach($errors->all() as $error)
                            <li>{{ $error }}</li>
                        @endforeach
                    </ul>
                </div>
            @endif

            <form action="{{ route('biaya-operasional.store') }}" method="POST">
                @csrf

                <div class="mb-3">
                    <label for="nama_biaya" class="form-label">
                        Nama Biaya
                    </label>

                    <input
                        type="text"
                        name="nama_biaya"
                        id="nama_biaya"
                        class="form-control"
                        value="{{ old('nama_biaya') }}"
                        placeholder="Contoh: Listrik, Internet, Transportasi"
                        required>
                </div>

                <div class="mb-3">
                    <label for="tanggal" class="form-label">
                        Tanggal
                    </label>

                    <input
                        type="date"
                        name="tanggal"
                        id="tanggal"
                        class="form-control"
                        value="{{ old('tanggal') }}"
                        required>
                </div>

                <div class="mb-3">
                    <label for="keterangan" class="form-label">
                        Keterangan
                    </label>

                    <textarea
                        name="keterangan"
                        id="keterangan"
                        class="form-control"
                        rows="4"
                        placeholder="Masukkan keterangan biaya">{{ old('keterangan') }}</textarea>
                </div>

                <div class="mb-3">
                    <label for="nominal" class="form-label">
                        Nominal
                    </label>

                    <input
                        type="number"
                        name="nominal"
                        id="nominal"
                        class="form-control"
                        value="{{ old('nominal') }}"
                        placeholder="Contoh: 500000"
                        min="0"
                        required>
                </div>

                <button type="submit" class="btn btn-success">
                    <i class="bi bi-save"></i>
                    Simpan
                </button>

                <a href="{{ route('biaya-operasional.index') }}"
                   class="btn btn-secondary">
                    Kembali
                </a>

            </form>

        </div>

    </div>

</div>      

@endsection