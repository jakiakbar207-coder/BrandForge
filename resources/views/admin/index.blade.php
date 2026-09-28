@extends('layouts.app')

@section('title', 'Dashboard Admin')

@section('content')

<style>
    .admin-dashboard {
        padding-bottom: 30px;
    }

    .dashboard-header {
        background: linear-gradient(135deg, #0d6efd, #084298);
        color: white;
        border-radius: 16px;
        padding: 25px 30px;
        margin-bottom: 25px;
        box-shadow: 0 8px 25px rgba(0, 0, 0, .12);
    }

    .dashboard-header h2 {
        font-weight: 700;
        margin-bottom: 5px;
    }

    .dashboard-header p {
        margin-bottom: 0;
        opacity: .9;
    }

    .dashboard-header .btn {
        border-radius: 9px;
        font-weight: 600;
    }

    .section-title {
        display: flex;
        align-items: center;
        gap: 10px;
        margin: 28px 0 15px;
    }

    .section-title h5 {
        margin: 0;
        font-weight: 700;
    }

    .section-line {
        flex: 1;
        height: 1px;
        background: #dee2e6;
    }

    .menu-card {
        border: none;
        border-radius: 15px;
        background: white;
        box-shadow: 0 4px 14px rgba(0, 0, 0, .08);
        height: 100%;
        transition: all .2s ease;
        overflow: hidden;
    }

    .menu-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 25px rgba(0, 0, 0, .14);
    }

    .menu-card-body {
        padding: 22px;
        text-align: center;
    }

    .menu-icon {
        width: 65px;
        height: 65px;
        margin: 0 auto 14px;
        border-radius: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 30px;
    }

    .menu-card h6 {
        font-size: 17px;
        font-weight: 700;
        margin-bottom: 7px;
    }

    .menu-card p {
        font-size: 13px;
        color: #6c757d;
        min-height: 38px;
        margin-bottom: 15px;
    }

    .menu-card .btn {
        border-radius: 8px;
        font-weight: 600;
    }

    /* Warna icon */
    .icon-blue {
        background: #e7f0ff;
    }

    .icon-green {
        background: #e8f7ee;
    }

    .icon-cyan {
        background: #e5f8fb;
    }

    .icon-yellow {
        background: #fff5d9;
    }

    .icon-red {
        background: #ffe8eb;
    }

    .icon-dark {
        background: #e9ecef;
    }

    .icon-purple {
        background: #f0e9ff;
    }

    .icon-orange {
        background: #fff0df;
    }

    /* Notifikasi */
    .stock-alert {
        border: none;
        border-left: 5px solid #ffc107;
        border-radius: 12px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, .08);
    }

    .stock-alert h5 {
        font-weight: 700;
    }

    .stock-table {
        background: white;
        border-radius: 10px;
        overflow: hidden;
    }

    @media (max-width: 768px) {
        .dashboard-header {
            padding: 20px;
        }

        .dashboard-header .header-buttons {
            margin-top: 15px;
        }
    }
</style>


<div class="admin-dashboard">

    {{-- ========================================= --}}
    {{-- HEADER --}}
    {{-- ========================================= --}}

    <div class="dashboard-header">

        <div class="row align-items-center">

            <div class="col-md-8">

                <h2>
                    Dashboard Admin
                </h2>

                <p>
                    Selamat datang,
                    <strong>{{ auth()->user()->name }}</strong>
                    ({{ ucfirst(auth()->user()->role) }})
                </p>

            </div>

            <div class="col-md-4 text-md-end header-buttons">

                @if(auth()->user()->role == 'owner')

                    <a href="{{ route('owner.index') }}"
                       class="btn btn-warning">
                        👑 Owner
                    </a>

                @endif

            </div>

        </div>

    </div>


    {{-- ========================================= --}}
    {{-- NOTIFIKASI STOK --}}
    {{-- ========================================= --}}

    @if($jumlahStokMenipis > 0)

        <div class="alert alert-warning stock-alert mb-4">

            <div class="d-flex justify-content-between align-items-center mb-3">

                <h5 class="mb-0">
                    ⚠️ Stok Menipis
                </h5>

                <span class="badge bg-danger rounded-pill">
                    {{ $jumlahStokMenipis }} Produk
                </span>

            </div>

            <div class="table-responsive stock-table">

                <table class="table table-hover table-bordered mb-0">

                    <thead class="table-light">

                        <tr>
                            <th>Produk</th>
                            <th>Ukuran</th>
                            <th>Warna</th>
                            <th>Sisa Stok</th>
                        </tr>

                    </thead>

                    <tbody>

                    @foreach($stokMenipis as $stok)

                        <tr>

                            <td>
                                {{ $stok->produk->nama_produk ?? '-' }}
                            </td>

                            <td>
                                {{ $stok->ukuran->nama_ukuran ?? '-' }}
                            </td>

                            <td>
                                {{ $stok->warna->nama_warna ?? '-' }}
                            </td>

                            <td>
                                <span class="badge bg-danger">
                                    {{ $stok->jumlah }}
                                </span>
                            </td>

                        </tr>

                    @endforeach

                    </tbody>

                </table>

            </div>

        </div>

    @endif


    {{-- ========================================= --}}
    {{-- MASTER DATA --}}
    {{-- ========================================= --}}

    <div class="section-title">

        <span>🗂️</span>

        <h5>Master Data</h5>

        <div class="section-line"></div>

    </div>


    <div class="row g-4">

        {{-- KATEGORI --}}
        <div class="col-xl-3 col-lg-4 col-md-6">

            <div class="menu-card">

                <div class="menu-card-body">

                    <div class="menu-icon icon-blue">
                        📂
                    </div>

                    <h6>Kategori</h6>

                    <p>
                        Kelola kategori produk
                    </p>

                    <a href="{{ route('kategori.index') }}"
                       class="btn btn-primary w-100">
                        Kelola
                    </a>

                </div>

            </div>

        </div>


        {{-- PRODUK --}}
        <div class="col-xl-3 col-lg-4 col-md-6">

            <div class="menu-card">

                <div class="menu-card-body">

                    <div class="menu-icon icon-green">
                        📦
                    </div>

                    <h6>Produk</h6>

                    <p>
                        Kelola data produk
                    </p>

                    <a href="{{ route('produk.index') }}"
                       class="btn btn-success w-100">
                        Kelola
                    </a>

                </div>

            </div>

        </div>


        {{-- KOLEKSI --}}
        <div class="col-xl-3 col-lg-4 col-md-6">

            <div class="menu-card">

                <div class="menu-card-body">

                    <div class="menu-icon icon-cyan">
                        🛍️
                    </div>

                    <h6>Koleksi</h6>

                    <p>
                        Kelola koleksi produk
                    </p>

                    <a href="{{ route('koleksi.index') }}"
                       class="btn btn-info text-white w-100">
                        Kelola
                    </a>

                </div>

            </div>

        </div>


        {{-- UKURAN --}}
        <div class="col-xl-3 col-lg-4 col-md-6">

            <div class="menu-card">

                <div class="menu-card-body">

                    <div class="menu-icon icon-yellow">
                        📏
                    </div>

                    <h6>Ukuran</h6>

                    <p>
                        Kelola ukuran produk
                    </p>

                    <a href="{{ route('ukuran.index') }}"
                       class="btn btn-warning w-100">
                        Kelola
                    </a>

                </div>

            </div>

        </div>


        {{-- WARNA --}}
        <div class="col-xl-3 col-lg-4 col-md-6">

            <div class="menu-card">

                <div class="menu-card-body">

                    <div class="menu-icon icon-red">
                        🎨
                    </div>

                    <h6>Warna</h6>

                    <p>
                        Kelola warna produk
                    </p>

                    <a href="{{ route('warna.index') }}"
                       class="btn btn-danger w-100">
                        Kelola
                    </a>

                </div>

            </div>

        </div>


        {{-- STOK --}}
        <div class="col-xl-3 col-lg-4 col-md-6">

            <div class="menu-card">

                <div class="menu-card-body">

                    <div class="menu-icon icon-dark">
                        📦
                    </div>

                    <h6>Stok / Gudang</h6>

                    <p>
                        Kelola stok produk
                    </p>

                    <a href="{{ route('stok.index') }}"
                       class="btn btn-dark w-100">
                        Kelola
                    </a>

                </div>

            </div>

        </div>

    </div>


    {{-- ========================================= --}}
    {{-- OPERASIONAL TOKO - TAHAP 4 --}}
    {{-- ========================================= --}}

    <div class="section-title">

        <span>🏪</span>

        <h5>Operasional Toko & Gudang</h5>

        <div class="section-line"></div>

    </div>


    <div class="row g-4">

        {{-- SUPPLIER --}}
        <div class="col-xl-3 col-lg-4 col-md-6">

            <div class="menu-card">

                <div class="menu-card-body">

                    <div class="menu-icon icon-purple">
                        🏢
                    </div>

                    <h6>Supplier</h6>

                    <p>
                        Kelola data supplier
                    </p>

                    <a href="{{ route('supplier.index') }}"
                       class="btn btn-primary w-100">
                        Kelola
                    </a>

                </div>

            </div>

        </div>


        {{-- PEMBELIAN --}}
        <div class="col-xl-3 col-lg-4 col-md-6">

            <div class="menu-card">

                <div class="menu-card-body">

                    <div class="menu-icon icon-green">
                        📥
                    </div>

                    <h6>Pembelian Stok</h6>

                    <p>
                        Catat pembelian stok
                    </p>

                    <a href="{{ route('pembelian.index') }}"
                       class="btn btn-success w-100">
                        Kelola
                    </a>

                </div>

            </div>

        </div>


        {{-- RETUR --}}
        <div class="col-xl-3 col-lg-4 col-md-6">

            <div class="menu-card">

                <div class="menu-card-body">

                    <div class="menu-icon icon-orange">
                        🔄
                    </div>

                    <h6>Retur Barang</h6>

                    <p>
                        Kelola retur barang
                    </p>

                    <a href="{{ route('retur.index') }}"
                       class="btn btn-danger w-100">
                        Kelola
                    </a>

                </div>

            </div>

        </div>

    </div>


    {{-- ========================================= --}}
    {{-- MENU LAINNYA --}}
    {{-- ========================================= --}}

    <div class="section-title">

        <span>⚙️</span>

        <h5>Menu Lainnya</h5>

        <div class="section-line"></div>

    </div>


    <div class="row g-4">

        {{-- PENGIRIMAN --}}
        <div class="col-xl-3 col-lg-4 col-md-6">

            <div class="menu-card">

                <div class="menu-card-body">

                    <div class="menu-icon icon-blue">
                        🚚
                    </div>

                    <h6>Pengiriman</h6>

                    <p>
                        Kelola pengiriman
                    </p>

                    <a href="{{ route('admin.pengiriman.index') }}"
                       class="btn btn-secondary w-100">
                        Kelola
                    </a>

                </div>

            </div>

        </div>


        {{-- LAPORAN --}}
        <div class="col-xl-3 col-lg-4 col-md-6">

            <div class="menu-card">

                <div class="menu-card-body">

                    <div class="menu-icon icon-cyan">
                        📊
                    </div>

                    <h6>Laporan</h6>

                    <p>
                        Laporan penjualan
                    </p>

                    <a href="{{ route('laporan.index') }}"
                       class="btn btn-primary w-100">
                        Lihat
                    </a>

                </div>

            </div>

        </div>


        {{-- BIAYA OPERASIONAL --}}
        <div class="col-xl-3 col-lg-4 col-md-6">

            <div class="menu-card">

                <div class="menu-card-body">

                    <div class="menu-icon icon-yellow">
                        💰
                    </div>

                    <h6>Biaya Operasional</h6>

                    <p>
                        Kelola biaya operasional
                    </p>

                    <a href="{{ route('biaya-operasional.index') }}"
                       class="btn btn-outline-dark w-100">
                        Kelola
                    </a>

                </div>

            </div>

        </div>

    </div>

</div>

@endsection