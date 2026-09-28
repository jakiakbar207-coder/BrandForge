@extends('layouts.app')

@section('title','Tambah Koleksi')

@section('content')

<div class="container">

    <div class="card">

        <div class="card-header">

            <h4>Tambah Koleksi</h4>

        </div>

        <div class="card-body">

            <form action="{{ route('koleksi.store') }}"
                  method="POST">

                @csrf

                <div class="mb-3">

                    <label class="form-label">

                        Nama Koleksi

                    </label>

                    <input type="text"
                           name="nama_koleksi"
                           class="form-control"
                           required>

                </div>

                <div class="mb-3">

                    <label class="form-label">

                        Deskripsi

                    </label>

                    <textarea name="deskripsi"
                              class="form-control"
                              rows="4"></textarea>

                </div>

                <button class="btn btn-success">

                    Simpan

                </button>

                <a href="{{ route('koleksi.index') }}"
                   class="btn btn-secondary">

                    Kembali

                </a>

            </form>

        </div>

    </div>

</div>

@endsection