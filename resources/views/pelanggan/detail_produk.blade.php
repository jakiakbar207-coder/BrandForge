@extends('layouts.app')

@section('title', 'Detail Produk')

@section('content')

<div class="container py-4">

    <a href="{{ route('pelanggan.belanja') }}" class="btn btn-secondary mb-3">
        ← Kembali
    </a>

    <div class="row">

        <div class="col-md-5">

            @if($produk->foto)
                <img src="{{ asset('produk/'.$produk->foto) }}"
                     class="img-fluid rounded shadow"
                     alt="{{ $produk->nama_produk }}">
            @else
                <img src="https://via.placeholder.com/500x500?text=Produk"
                     class="img-fluid rounded shadow"
                     alt="Produk">
            @endif

        </div>

        <div class="col-md-7">

            <h2>{{ $produk->nama_produk }}</h2>

            <h3 class="text-primary mb-3">
                Rp {{ number_format($produk->harga, 0, ',', '.') }}
            </h3>

            @php
                $stokProduk = $produk->stokData
                    ? $produk->stokData->sum('jumlah')
                    : 0;
            @endphp

            <p>
                <strong>Stok :</strong>
                {{ $stokProduk }}
            </p>

            <form action="{{ route('pelanggan.wishlist.store', $produk->id) }}"
                  method="POST"
                  class="mb-3">

                @csrf

                <button type="submit"
                        class="btn btn-outline-danger">
                    ❤️ Tambahkan ke Wishlist
                </button>

            </form>

            <hr>

            <form action="{{ route('pelanggan.tambahKeranjang', $produk->id) }}"
                  method="POST">

                @csrf

                <div class="mb-3">

                    <label class="form-label">
                        Pilih Warna
                    </label>

                    <select name="warna_id"
                            class="form-select"
                            required>

                        @foreach($warna as $item)

                            <option value="{{ $item->id }}">
                                {{ $item->nama_warna }}
                            </option>

                        @endforeach

                    </select>

                </div>

                <div class="mb-3">

                    <label class="form-label">
                        Pilih Ukuran
                    </label>

                    <select name="ukuran_id"
                            class="form-select"
                            required>

                        @foreach($ukuran as $item)

                            <option value="{{ $item->id }}">
                                {{ $item->nama_ukuran }}
                            </option>

                        @endforeach

                    </select>

                </div>

                <div class="mb-3">

                    <label class="form-label">
                        Jumlah
                    </label>

                    <input type="number"
                           name="jumlah"
                           class="form-control"
                           value="1"
                           min="1"
                           max="{{ max($stokProduk, 1) }}"
                           {{ $stokProduk <= 0 ? 'disabled' : '' }}
                           required>

                    @if($stokProduk <= 0)

                        <small class="text-danger">
                            Stok produk sedang habis.
                        </small>

                    @endif

                </div>

                <hr>

                <div class="d-grid gap-2">

                    @if($stokProduk > 0)

                        <button type="submit"
                                class="btn btn-success">
                            🛒 Tambah ke Keranjang
                        </button>

                        <a href="{{ route('pelanggan.checkout') }}"
                           class="btn btn-warning">
                            ⚡ Checkout
                        </a>

                    @else

                        <button type="button"
                                class="btn btn-secondary"
                                disabled>
                            Stok Habis
                        </button>

                    @endif

                </div>

            </form>

        </div>

    </div>

    <hr class="my-5">

    <div class="mb-5">

        <h4 class="mb-4">
            ⭐ Rating & Ulasan Produk
        </h4>

        @php
            $reviews = $produk->reviews ?? collect();

            $jumlahReview = $reviews->count();

            $rataRating = $jumlahReview > 0
                ? round($reviews->avg('rating'), 1)
                : 0;
        @endphp

        <div class="card shadow-sm mb-4">

            <div class="card-body">

                <div class="row align-items-center">

                    <div class="col-md-4 text-center">

                        <h1 class="display-4 fw-bold">
                            {{ $rataRating }}
                        </h1>

                        <div class="text-warning fs-4">

                            @for($i = 1; $i <= 5; $i++)

                                @if($i <= round($rataRating))
                                    ⭐
                                @else
                                    ☆
                                @endif

                            @endfor

                        </div>

                        <p class="text-muted mb-0">
                            {{ $jumlahReview }} ulasan
                        </p>

                    </div>

                    <div class="col-md-8">

                        <p class="mb-2">
                            <strong>Rating Produk</strong>
                        </p>

                        <div class="text-warning fs-5">
                            ⭐⭐⭐⭐⭐
                        </div>

                        <small class="text-muted">
                            Rating diberikan oleh pelanggan yang telah membeli produk.
                        </small>

                    </div>

                </div>

            </div>

        </div>

        @forelse($reviews as $review)

            <div class="card shadow-sm mb-3">

                <div class="card-body">

                    <div class="d-flex justify-content-between">

                        <div>

                            <strong>
                                {{ $review->user->name ?? 'Pelanggan' }}
                            </strong>

                            <div class="text-warning">

                                @for($i = 1; $i <= 5; $i++)

                                    @if($i <= $review->rating)
                                        ⭐
                                    @else
                                        ☆
                                    @endif

                                @endfor

                            </div>

                        </div>

                        <small class="text-muted">

                            {{ $review->created_at?->format('d M Y') }}

                        </small>

                    </div>

                    <p class="mt-3 mb-2">
                        {{ $review->komentar }}
                    </p>

                    @if($review->foto_produk)

                        <div class="mt-3">

                            <img src="{{ asset('storage/'.$review->foto_produk) }}"
                                 class="img-fluid rounded shadow-sm"
                                 style="max-width:300px;max-height:300px;object-fit:cover;"
                                 alt="Foto ulasan">

                        </div>

                    @endif

                </div>

            </div>

        @empty

            <div class="alert alert-light border text-center">

                <h5>Belum ada ulasan</h5>

                <p class="text-muted mb-0">
                    Belum ada pelanggan yang memberikan ulasan untuk produk ini.
                </p>

            </div>

        @endforelse

    </div>

    <hr class="my-5">

    <h4 class="mb-4">
        🛍️ Produk Terkait
    </h4>

    <div class="row">

        @forelse($produkTerkait as $item)

            @php
                $stokTerkait = $item->stokData
                    ? $item->stokData->sum('jumlah')
                    : 0;
            @endphp

            <div class="col-md-3 mb-4">

                <div class="card h-100 shadow-sm">

                    @if($item->foto)

                        <img src="{{ asset('produk/'.$item->foto) }}"
                             class="card-img-top"
                             style="height:220px;object-fit:cover;"
                             alt="{{ $item->nama_produk }}">

                    @else

                        <img src="https://via.placeholder.com/400x220?text=Produk"
                             class="card-img-top"
                             style="height:220px;object-fit:cover;"
                             alt="Produk">

                    @endif

                    <div class="card-body">

                        <h6>
                            {{ $item->nama_produk }}
                        </h6>

                        <p class="text-danger fw-bold">
                            Rp {{ number_format($item->harga, 0, ',', '.') }}
                        </p>

                        <p class="small text-muted">
                            Stok :
                            {{ $stokTerkait }}
                        </p>

                        <a href="{{ route('pelanggan.detailProduk', $item->id) }}"
                           class="btn btn-outline-primary btn-sm w-100">
                            Lihat Produk
                        </a>

                    </div>

                </div>

            </div>

        @empty

            <div class="col-12">

                <div class="alert alert-warning text-center">
                    Belum ada produk terkait.
                </div>

            </div>

        @endforelse

    </div>

</div>

@endsection