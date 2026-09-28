@extends('pelanggan.layouts.app')

@section('title', 'Belanja Produk')

@section('content')

<div class="container py-4">

    <h2 class="mb-4">
        🛍️ Belanja Produk
    </h2>

     <a href="{{ route('pelanggan.dashboardBelanja') }}"
       class="btn btn-secondary mb-4">
        ← Kembali ke Dashboard Belanja
    </a>


    <!-- SEARCH -->
   <form method="GET"
      action="{{ route('pelanggan.belanja') }}"
      class="row g-2 mb-4">

    <div class="col-md-3">
        <input
            type="text"
            name="search"
            class="form-control"
            placeholder="Cari produk..."
            value="{{ request('search') }}">
    </div>

    <div class="col-md-2">

        <select name="harga" class="form-select">

            <option value="">Harga</option>

            <option value="1"
            {{ request('harga')=='1'?'selected':'' }}>
                < 100.000
            </option>

            <option value="2"
            {{ request('harga')=='2'?'selected':'' }}>
                100.000 - 300.000
            </option>

            <option value="3"
            {{ request('harga')=='3'?'selected':'' }}>
                > 300.000
            </option>

        </select>

    </div>

    <div class="col-md-2">

        <select name="kategori" class="form-select">

            <option value="">Kategori</option>

            @foreach($kategoris as $kategori)

                <option
                    value="{{ $kategori->id }}"
                    {{ request('kategori')==$kategori->id?'selected':'' }}>

                    {{ $kategori->nama_kategori }}

                </option>

            @endforeach

        </select>

    </div>

    <div class="col-md-2">

        <select name="warna" class="form-select">

            <option value="">Warna</option>

            @foreach($warnas as $warna)

                <option
                    value="{{ $warna->id }}"
                    {{ request('warna')==$warna->id?'selected':'' }}>

                    {{ $warna->nama_warna }}

                </option>

            @endforeach

        </select>

    </div>

    <div class="col-md-2">

        <select name="ukuran" class="form-select">

            <option value="">Ukuran</option>

            @foreach($ukurans as $ukuran)

                <option
                    value="{{ $ukuran->id }}"
                    {{ request('ukuran')==$ukuran->id?'selected':'' }}>

                    {{ $ukuran->nama_ukuran }}

                </option>

            @endforeach

        </select>

    </div>

    <div class="col-md-1 d-grid">

        <button class="btn btn-primary">

            Cari

        </button>

    </div>

</form>

    <div class="row">

        @forelse($produks as $produk)

            <div class="col-md-4 mb-4">

                <div class="card h-100 shadow-sm">

                    @if($produk->foto)
                        <img src="{{ asset('produk/'.$produk->foto) }}"
                             class="card-img-top"
                             style="height:250px;object-fit:cover;">
                    @else
                        <img src="https://via.placeholder.com/400x250?text=Produk"
                             class="card-img-top"
                             style="height:250px;object-fit:cover;">
                    @endif

                    <div class="card-body">

                        <h5 class="card-title">
                            {{ $produk->nama_produk }}
                        </h5>

                        <h4 class="text-primary">
                            Rp {{ number_format($produk->harga,0,',','.') }}
                        </h4>

                        <p>
                            <strong>Stok :</strong>
                            {{ $produk->stokData->sum('jumlah') }}
                        </p>
                       <div class="d-flex gap-2">

                            <a href="{{ route('pelanggan.detailProduk', $produk->id) }}"
                            class="btn btn-primary flex-grow-1">
                                Lihat Produk
                            </a>

                            <form action="{{ route('pelanggan.wishlist.store', $produk->id) }}"
                                method="POST">
                                @csrf

                                <button type="submit"
                                        class="btn btn-outline-danger"
                                        title="Tambah ke Wishlist">
                                    ❤️
                                </button>
                            </form>

                        </div>

                    </div>

                </div>

            </div>

        @empty

            <div class="col-12">

                <div class="alert alert-warning text-center">
                    Produk tidak ditemukan.
                </div>

            </div>

        @endforelse

    </div>

</div>

@endsection