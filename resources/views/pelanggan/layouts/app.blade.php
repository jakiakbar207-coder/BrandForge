<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>@yield('title') | BrandForge</title>

    @vite(['resources/css/app.css', 'resources/js/app.js'])

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
        rel="stylesheet">

    <link rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">

    <style>
        body {
            background: #f8f9fa;
        }

        .navbar-brand {
            font-weight: bold;
        }

        footer {
            background: #212529;
            color: white;
            padding: 25px 0;
            margin-top: 60px;
        }

        .card {
            border: none;
            transition: .3s;
        }

        .card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 25px rgba(0, 0, 0, .15);
        }

        .nav-link {
            font-weight: 500;
        }
    </style>
</head>

<body>

    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">

        <div class="container">

            <!-- Brand -->
            <a class="navbar-brand" href="/">
                BrandForge
            </a>

            <button class="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarNav">

                <span class="navbar-toggler-icon"></span>

            </button>

            <div class="collapse navbar-collapse" id="navbarNav">

                <ul class="navbar-nav ms-auto">

                    @guest

                        <!-- LOGIN -->
                        <li class="nav-item">
                            <a class="nav-link" href="{{ route('login') }}">
                                Login
                            </a>
                        </li>

                        <!-- DAFTAR -->
                        <li class="nav-item">
                            <a class="btn btn-primary ms-2"
                                href="{{ route('register') }}">
                                Daftar
                            </a>
                        </li>

                    @else

                        <!-- DASHBOARD -->
                        <li class="nav-item">
                            <a class="nav-link"
                                href="{{ route('pelanggan.dashboardBelanja') }}">

                                <i class="bi bi-house"></i>
                                Dashboard

                            </a>
                        </li>


                        <!-- WISHLIST -->
                        <li class="nav-item">
                            <a class="nav-link"
                                href="{{ route('pelanggan.wishlist') }}">

                                <i class="bi bi-heart-fill"></i>
                                Wishlist

                            </a>
                        </li>


                        <!-- KERANJANG -->
                        <li class="nav-item">
                            <a class="nav-link"
                                href="{{ route('pelanggan.keranjang') }}">

                                <i class="bi bi-cart3"></i>
                                Keranjang

                            </a>
                        </li>


                        <!-- STATUS PESANAN -->
                        <li class="nav-item">
                            <a class="nav-link"
                                href="{{ route('pelanggan.index') }}">

                                <i class="bi bi-receipt"></i>
                                Status Pesanan

                            </a>
                        </li>


                        <!-- NOTIFIKASI -->
                        <li class="nav-item">
                            <a class="nav-link position-relative"
                                href="{{ route('pelanggan.notifikasi') }}"
                                title="Notifikasi">

                                <i class="bi bi-bell-fill fs-5"></i>

                                @php
                                    $jumlahNotifikasi = auth()->user()
                                        ->notifications()
                                        ->whereNull('read_at')
                                        ->count();
                                @endphp

                                @if ($jumlahNotifikasi > 0)

                                    <span class="position-absolute top-0 start-100 translate-middle
                                                badge rounded-pill bg-danger">

                                        {{ $jumlahNotifikasi }}

                                    </span>

                                @endif

                            </a>
                        </li>


                        <!-- PROFIL -->
                        <li class="nav-item">
                            <a class="nav-link"
                                href="{{ route('profile.edit') }}"
                                title="Profil">

                                <i class="bi bi-person-circle"></i>
                                Profil

                            </a>
                        </li>


                        <!-- LOGOUT -->
                        <li class="nav-item ms-2">

                            <form action="{{ route('logout') }}"
                                method="POST">

                                @csrf

                                <button type="submit"
                                    class="btn btn-danger">

                                    <i class="bi bi-box-arrow-right"></i>
                                    Logout

                                </button>

                            </form>

                        </li>

                    @endguest

                </ul>

            </div>

        </div>

    </nav>


    <!-- Isi Halaman -->
    <main>

        @yield('content')

    </main>


    <!-- Footer -->
    <footer>

        <div class="container text-center">

            <h5>BrandForge</h5>

            <p>
                Fashion Streetwear Indonesia
            </p>

            <hr>

            <p class="mb-0">
                © {{ date('Y') }} BrandForge. All Rights Reserved.
            </p>

        </div>

    </footer>


    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js">
    </script>

</body>

</html>