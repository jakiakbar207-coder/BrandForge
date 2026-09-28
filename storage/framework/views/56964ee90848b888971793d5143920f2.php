<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo $__env->yieldContent('title'); ?> | BrandForge</title>

    <?php echo app('Illuminate\Foundation\Vite')(['resources/css/app.css', 'resources/js/app.js']); ?>

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

        <?php if(auth()->guard()->check()): ?>

            <?php if(Auth::user()->role == 'owner'): ?>

                <a href="<?php echo e(url('/owner')); ?>" class="<?php echo e(request()->is('owner') ? 'active' : ''); ?>">
                    <i class="bi bi-speedometer2"></i> Dashboard
                </a>

                <a href="<?php echo e(route('kategori.index')); ?>">
                    <i class="bi bi-tags"></i> Kategori
                </a>

                <a href="<?php echo e(route('produk.index')); ?>">
                    <i class="bi bi-box-seam"></i> Produk
                </a>

                <a href="<?php echo e(route('stok.index')); ?>">
                    <i class="bi bi-archive"></i> Stok
                </a>

                <a href="<?php echo e(route('kasir.index')); ?>">
                    <i class="bi bi-cart-check"></i> Kasir
                </a>

                <a href="<?php echo e(route('laporan.index')); ?>"
                    class="<?php echo e(request()->is('owner/laporan*') ? 'active' : ''); ?>">
                        <i class="bi bi-file-earmark-pdf"></i> Laporan
                    </a>

            <?php elseif(Auth::user()->role == 'admin'): ?>

                <a href="<?php echo e(url('/admin')); ?>" class="<?php echo e(request()->is('admin') ? 'active' : ''); ?>">
                    <i class="bi bi-speedometer2"></i> Dashboard

                <a href="<?php echo e(route('kategori.index')); ?>">
                    <i class="bi bi-tags"></i> Kategori
                </a>

                <a href="<?php echo e(route('produk.index')); ?>">
                    <i class="bi bi-box-seam"></i> Produk
                </a>

                <a href="<?php echo e(route('koleksi.index')); ?>">
                    <i class="bi bi-collection"></i> Koleksi
                </a>

                <a href="<?php echo e(route('stok.index')); ?>">
                    <i class="bi bi-archive"></i> Stok
                </a>

            <?php elseif(Auth::user()->role == 'kasir'): ?>

                <a href="<?php echo e(route('kasir.index')); ?>">
                    <i class="bi bi-speedometer2"></i> Dashboard
                </a>

                <a href="<?php echo e(route('kasir.transaksi')); ?>">
                    <i class="bi bi-cart-check"></i> Transaksi
                </a>

                <a href="<?php echo e(route('kasir.riwayat')); ?>">
                    <i class="bi bi-clock-history"></i> Riwayat
                </a>

            <?php elseif(Auth::user()->role == 'pelanggan'): ?>

                <a href="<?php echo e(url('/pelanggan')); ?>">
                    <i class="bi bi-speedometer2"></i> Dashboard
                </a>

            <?php endif; ?>

            <hr class="text-white">

            <a href="<?php echo e(route('logout')); ?>"
                onclick="event.preventDefault();document.getElementById('logout-form').submit();">
                <i class="bi bi-box-arrow-right"></i> Logout
            </a>

            <form id="logout-form" action="<?php echo e(route('logout')); ?>" method="POST" class="d-none">
                <?php echo csrf_field(); ?>
            </form>

        <?php endif; ?>

    </div>

    <!-- Content -->
    <div class="content">

        <nav class="navbar navbar-expand-lg navbar-custom">
            <div class="container-fluid">

                <h4 class="mb-0">
                    <?php echo $__env->yieldContent('title'); ?>
                </h4>

                <?php if(auth()->guard()->check()): ?>
                    <div class="user-box">
                        <i class="bi bi-person-circle"></i>
                        Halo, <?php echo e(Auth::user()->name); ?>

                        (<?php echo e(ucfirst(Auth::user()->role)); ?>)
                    </div>
                <?php endif; ?>

            </div>
        </nav>

        <div class="container-fluid p-4">

            <?php if(session('success')): ?>
                <div class="alert alert-success">
                    <?php echo e(session('success')); ?>

                </div>
            <?php endif; ?>

            <?php if(session('error')): ?>
                <div class="alert alert-danger">
                    <?php echo e(session('error')); ?>

                </div>
            <?php endif; ?>

            <?php echo $__env->yieldContent('content'); ?>

        </div>

        <footer>
            © 2026 BrandForge | Sistem Penjualan Clothing
        </footer>

    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>

</body>
</html><?php /**PATH C:\xampp\htdocs\BrandForge\resources\views/layouts/app.blade.php ENDPATH**/ ?>