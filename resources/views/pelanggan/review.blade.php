@extends('layouts.app')

@section('title', 'Beri Ulasan Produk')

@section('content')

<div class="container mt-4">

    <a href="{{ route('pelanggan.riwayat') }}"
       class="btn btn-secondary mb-3">
        ← Kembali ke Riwayat
    </a>

    <div class="card shadow-sm">

        <div class="card-header">
            <h4 class="mb-0">⭐ Beri Ulasan Produk</h4>
        </div>

        <div class="card-body">

            {{-- Produk --}}
            <div class="row mb-4">

                <div class="col-md-4">

                    @if($detail->produk->foto)

                        <img src="{{ asset('produk/'.$detail->produk->foto) }}"
                             class="img-fluid rounded shadow-sm"
                             style="max-height:300px; object-fit:cover;">

                    @else

                        <div class="border rounded p-5 text-center">
                            Tidak ada foto produk
                        </div>

                    @endif

                </div>

                <div class="col-md-8">

                    <h3>
                        {{ $detail->produk->nama_produk }}
                    </h3>

                    <p class="text-muted">
                        Pesanan:
                        {{ $detail->transaksi->kode_transaksi }}
                    </p>

                </div>

            </div>

            <hr>

            {{-- FORM REVIEW --}}
            <form action="{{ route('pelanggan.review.store', $detail->id) }}"
                  method="POST"
                  enctype="multipart/form-data">

                @csrf

                {{-- Rating --}}
                <div class="mb-4">

                    <label class="form-label fw-bold">
                        Rating Produk
                    </label>

                    <select name="rating"
                            class="form-select"
                            required>

                        <option value="">
                            -- Pilih Rating --
                        </option>

                        <option value="5">
                            ⭐⭐⭐⭐⭐ Sangat Bagus
                        </option>

                        <option value="4">
                            ⭐⭐⭐⭐ Bagus
                        </option>

                        <option value="3">
                            ⭐⭐⭐ Cukup
                        </option>

                        <option value="2">
                            ⭐⭐ Kurang
                        </option>

                        <option value="1">
                            ⭐ Sangat Kurang
                        </option>

                    </select>

                </div>


                {{-- Komentar --}}
                <div class="mb-4">

                    <label class="form-label fw-bold">
                        Ulasan
                    </label>

                    <textarea name="komentar"
                              class="form-control"
                              rows="5"
                              placeholder="Bagaimana pengalaman kamu dengan produk ini?"
                              required></textarea>

                </div>


                {{-- Foto --}}
                <div class="mb-4">

                    <label class="form-label fw-bold">
                        Foto Produk
                    </label>

                    <input type="file"
                           name="foto_produk"
                           class="form-control"
                           accept=".jpg,.jpeg,.png">

                    <small class="text-muted">
                        Foto bersifat opsional. Format JPG, JPEG, PNG.
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
                        Batal
                    </a>

                </div>

            </form>

        </div>

    </div>

</div>

@endsection