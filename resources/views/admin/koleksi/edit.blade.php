@extends('layouts.app')

@section('title','Edit Koleksi')

@section('content')

<div class="container">

    <div class="card">

        <div class="card-header">

            <h4>Edit Koleksi</h4>

        </div>

        <div class="card-body">

            <form action="{{ route('koleksi.update',$koleksi->id) }}"
                  method="POST">

                @csrf
                @method('PUT')

                <div class="mb-3">

                    <label class="form-label">

                        Nama Koleksi

                    </label>

                    <input type="text"
                           name="nama_koleksi"
                           class="form-control"
                           value="{{ old('nama_koleksi',$koleksi->nama_koleksi) }}"
                           required>

                </div>

                <div class="mb-3">

                    <label class="form-label">

                        Deskripsi

                    </label>

                    <textarea
                        name="deskripsi"
                        class="form-control"
                        rows="4">{{ old('deskripsi',$koleksi->deskripsi) }}</textarea>

                </div>

                <button class="btn btn-primary">

                    Update

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