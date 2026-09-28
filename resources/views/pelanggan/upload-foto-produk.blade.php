@extends('layouts.app')

@section('title','Beri Ulasan Produk')

@section('content')

<div class="container mt-4">

    <div class="card shadow-sm">

        <div class="card-header">
            <h4 class="mb-0">⭐ Beri Ulasan Produk</h4>
        </div>

        <div class="card-body">

            <form action="{{ route('pelanggan.review.store', $detailTransaksi->id) }}"
                  method="POST"
                  enctype="multipart/form-data">

                @csrf

                {{-- Produk --}}
                <div class="mb-3">
                    <label class="form-label">
                        Produk
                    </label>

                    <input type="text"
                           class="form-control"
                           value="{{ $detailTransaksi->produk->nama_produk ?? '-' }}"
                           readonly>
                </div>


                {{-- Rating --}}
                <div class="mb-3">

                    <label class="form-label">
                        Rating
                    </label>

                    <select name="rating"
                            class="form-select"
                            required>

                        <option value="">-- Pilih Rating --</option>

                        <option value="5">⭐⭐⭐⭐⭐ Sangat Bagus</option>
                        <option value="4">⭐⭐⭐⭐ Bagus</option>
                        <option value="3">⭐⭐⭐ Cukup</option>
                        <option value="2">⭐⭐ Kurang</option>
                        <option value="1">⭐ Sangat Kurang</option>

                    </select>

                </div>


                {{-- Review --}}
                <div class="mb-3">

                    <label class="form-label">
                        Ulasan
                    </label>

                    <textarea name="komentar"
                              class="form-control"
                              rows="5"
                              placeholder="Tulis pengalaman kamu menggunakan produk ini..."
                              required></textarea>

                </div>


                {{-- Foto --}}
                <div class="mb-3">

                    <label class="form-label">
                        Foto Produk
                    </label>

                    <input type="file"
                           name="foto_produk"
                           class="form-control"
                           accept=".jpg,.jpeg,.png">

                    <small class="text-muted">
                        Format JPG, JPEG, atau PNG.
                    </small>

                </div>


                {{-- Tombol --}}
                <div class="d-flex gap-2">

                    <button type="submit"
                            class="btn btn-primary">
                        ⭐ Kirim Ulasan
                    </button>

                    <a href="{{ route('pelanggan.riwayat') }}"
                       class="btn btn-secondary">
                        Kembali
                    </a>

                </div>

            </form>

        </div>

    </div>

</div>

@endsection