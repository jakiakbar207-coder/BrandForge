<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title') | BrandForge</title>

    @vite(['resources/css/app.css', 'resources/js/app.js'])

    <!-- Bootstrap -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">

    <!-- Bootstrap Icons -->
    <link rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">

    <style>
        body {
            background: #f5f6fa;
            overflow-x: hidden;
        }

        .sidebar {
            width: 250px;
            height: 100vh;
            position: fixed;
            top: 0;
            left: 0;
            background: #212529;
            overflow-y: auto;
            z-index: 1100;
        }

        .logo {
            background: #0d6efd;
            color: white;
            font-size: 25px;
            font-weight: bold;
            text-align: center;
            padding: 20px;
        }

        .logo a {
            color: white;
            text-decoration: none;
        }

        .sidebar a {
            color: white;
            text-decoration: none;
            display: block;
            padding: 14px 20px;
            transition: .3s;
        }

        .sidebar a:hover,
        .sidebar a.active {
            background: #0d6efd;
            padding-left: 28px;
        }

        .sidebar a i {
            margin-right: 8px;
        }

        .content {
            margin-left: 250px;
            min-height: 100vh;
            background: #f5f6fa;
        }

        .navbar-custom {
            background: white;
            position: sticky;
            top: 0;
            z-index: 1000;
            box-shadow: 0 2px 10px rgba(0, 0, 0, .08);
        }

        footer {
            margin-top: 40px;
            background: white;
            text-align: center;
            padding: 15px;
            box-shadow: 0 -2px 10px rgba(0, 0, 0, .08);
        }

        .user-box {
            font-weight: 600;
        }

        @media(max-width:768px) {

            .sidebar {
                width: 70px;
            }

            .sidebar a {
                font-size: 0;
            }

            .sidebar a i {
                font-size: 20px;
            }

            .content {
                margin-left: 70px;
            }

            .logo {
                font-size: 18px;
            }

            .logo i {
                font-size: 22px !important;
            }
        }
    </style>
</head>

<body>

    <!-- Sidebar -->
    <div class="sidebar">

        <div class="logo">
            <a href="/" class="text-white text-decoration-none">
                <i class="bi bi-shop fs-2"></i><br>
                BrandForge
            </a>
        </div>

        @auth

            @if(Auth::user()->role == 'owner')

                <a href="{{ url('/owner') }}" class="{{ request()->is('owner') ? 'active' : '' }}">
                    <i class="bi bi-speedometer2"></i> Dashboard
                </a>

                <a href="{{ route('kategori.index') }}">
                    <i class="bi bi-tags"></i> Kategori
                </a>

                <a href="{{ route('produk.index') }}">
                    <i class="bi bi-box-seam"></i> Produk
                </a>

                <a href="{{ route('stok.index') }}">
                    <i class="bi bi-archive"></i> Stok
                </a>

                <a href="{{ route('kasir.index') }}">
                    <i class="bi bi-cart-check"></i> Kasir
                </a>

                <a href="{{ route('laporan.index') }}"
                    class="{{ request()->is('owner/laporan*') ? 'active' : '' }}">
                        <i class="bi bi-file-earmark-pdf"></i> Laporan
                    </a>

            @elseif(Auth::user()->role == 'admin')

                <a href="{{ url('/admin') }}" class="{{ request()->is('admin') ? 'active' : '' }}">
                    <i class="bi bi-speedometer2"></i> Dashboard

                <a href="{{ route('kategori.index') }}">
                    <i class="bi bi-tags"></i> Kategori
                </a>

                <a href="{{ route('produk.index') }}">
                    <i class="bi bi-box-seam"></i> Produk
                </a>

                <a href="{{ route('koleksi.index') }}">
                    <i class="bi bi-collection"></i> Koleksi
                </a>

                <a href="{{ route('stok.index') }}">
                    <i class="bi bi-archive"></i> Stok
                </a>

            @elseif(Auth::user()->role == 'kasir')

                <a href="{{ route('kasir.index') }}">
                    <i class="bi bi-speedometer2"></i> Dashboard
                </a>

                <a href="{{ route('kasir.transaksi') }}">
                    <i class="bi bi-cart-check"></i> Transaksi
                </a>

                <a href="{{ route('kasir.riwayat') }}">
                    <i class="bi bi-clock-history"></i> Riwayat
                </a>

            @elseif(Auth::user()->role == 'pelanggan')

                <a href="{{ url('/pelanggan') }}">
                    <i class="bi bi-speedometer2"></i> Dashboard
                </a>

            @endif

            <hr class="text-white">

            <a href="{{ route('logout') }}"
                onclick="event.preventDefault();document.getElementById('logout-form').submit();">
                <i class="bi bi-box-arrow-right"></i> Logout
            </a>

            <form id="logout-form" action="{{ route('logout') }}" method="POST" class="d-none">
                @csrf
            </form>

        @endauth

    </div>

    <!-- Content -->
    <div class="content">

        <nav class="navbar navbar-expand-lg navbar-custom">
            <div class="container-fluid">

                <h4 class="mb-0">
                    @yield('title')
                </h4>

                @auth
                    <div class="user-box">
                        <i class="bi bi-person-circle"></i>
                        Halo, {{ Auth::user()->name }}
                        ({{ ucfirst(Auth::user()->role) }})
                    </div>
                @endauth

            </div>
        </nav>

        <div class="container-fluid p-4">

            @if(session('success'))
                <div class="alert alert-success">
                    {{ session('success') }}
                </div>
            @endif

            @if(session('error'))
                <div class="alert alert-danger">
                    {{ session('error') }}
                </div>
            @endif

            @yield('content')

        </div>

        <footer>
            © 2026 BrandForge | Sistem Penjualan Clothing
        </footer>

    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>

</body>
</html>