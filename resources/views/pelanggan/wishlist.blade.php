@extends('pelanggan.layouts.app')

@section('title', 'Wishlist Saya')

@section('content')

<div class="container py-4">

    <div class="d-flex justify-content-between align-items-center mb-4">

        <h2 class="mb-0">
            ❤️ Wishlist Saya
        </h2>

        <a href="{{ route('pelanggan.belanja') }}"
           class="btn btn-primary">
            🛍️ Belanja Produk
        </a>

    </div>

    {{-- Pesan berhasil --}}
    @if(session('success'))
        <div class="alert alert-success alert-dismissible fade show">
            {{ session('success') }}

            <button type="button"
                    class="btn-close"
                    data-bs-dismiss="alert">
            </button>
        </div>
    @endif

    {{-- Pesan informasi --}}
    @if(session('info'))
        <div class="alert alert-info alert-dismissible fade show">
            {{ session('info') }}

            <button type="button"
                    class="btn-close"
                    data-bs-dismiss="alert">
            </button>
        </div>
    @endif

    @if($wishlists->count() > 0)

        <div class="row">

            @foreach($wishlists as $wishlist)

                @php
                    $produk = $wishlist->produk;

                    $stokProduk = $produk && $produk->stokData
                        ? $produk->stokData->sum('jumlah')
                        : 0;
                @endphp

                @if($produk)

                    <div class="col-md-4 col-lg-3 mb-4">

                        <div class="card h-100 shadow-sm">

                            {{-- Foto Produk --}}
                            @if($produk->foto)

                                <img src="{{ asset('produk/' . $produk->foto) }}"
                                     class="card-img-top"
                                     alt="{{ $produk->nama_produk }}"
                                     style="height:220px; object-fit:cover;">

                            @else

                                <div class="d-flex align-items-center justify-content-center bg-light"
                                     style="height:220px;">

                                    <span class="text-muted">
                                        Tidak ada foto
                                    </span>

                                </div>

                            @endif

                            <div class="card-body d-flex flex-column">

                                {{-- Nama Produk --}}
                                <h5 class="card-title">
                                    {{ $produk->nama_produk }}
                                </h5>

                                {{-- Harga --}}
                                <h5 class="text-primary">
                                    Rp {{ number_format($produk->harga, 0, ',', '.') }}
                                </h5>

                                {{-- Stok --}}
                                <p class="text-muted mb-3">

                                    <strong>Stok:</strong>

                                    @if($stokProduk > 0)
                                        {{ $stokProduk }} tersedia
                                    @else
                                        <span class="text-danger">
                                            Stok habis
                                        </span>
                                    @endif

                                </p>

                                {{-- Tombol --}}
                                <div class="mt-auto">

                                    <a href="{{ route('pelanggan.detailProduk', $produk->id) }}"
                                       class="btn btn-primary w-100 mb-2">
                                        👀 Lihat Produk
                                    </a>

                                    <form action="{{ route('pelanggan.wishlist.destroy', $produk->id) }}"
                                          method="POST">

                                        @csrf

                                        @method('DELETE')

                                        <button type="submit"
                                                class="btn btn-outline-danger w-100"
                                                onclick="return confirm('Hapus produk ini dari wishlist?')">

                                            ❤️ Hapus dari Wishlist

                                        </button>

                                    </form>

                                </div>

                            </div>

                        </div>

                    </div>

                @endif

            @endforeach

        </div>

    @else

        {{-- Wishlist kosong --}}
        <div class="text-center py-5">

            <div style="font-size: 70px;">
                ❤️
            </div>

            <h4 class="mt-3">
                Wishlist masih kosong
            </h4>

            <p class="text-muted">
                Belum ada produk yang kamu simpan ke wishlist.
            </p>

            <a href="{{ route('pelanggan.belanja') }}"
               class="btn btn-primary">

                🛍️ Mulai Belanja

            </a>

        </div>

    @endif

</div>  

@endsection