

<?php $__env->startSection('title', 'Dashboard Belanja'); ?>

<?php $__env->startSection('content'); ?>

<style>

/* =========================================================
   DASHBOARD PELANGGAN
========================================================= */

.pelanggan-dashboard {
    padding: 10px 0 40px;
    color: #1e293b;
}


/* =========================================================
   HERO
========================================================= */

.shop-hero {
    position: relative;
    overflow: hidden;

    min-height: 190px;
    display: flex;
    align-items: center;

    padding: 35px 40px;
    margin-bottom: 30px;

    border-radius: 24px;

    color: white;

    background:
        radial-gradient(
            circle at 90% 10%,
            rgba(255,255,255,.18),
            transparent 28%
        ),
        linear-gradient(
            135deg,
            #0f172a 0%,
            #1e3a8a 48%,
            #2563eb 100%
        );

    box-shadow:
        0 15px 35px rgba(15,23,42,.18);
}

.shop-hero::before {
    content: "";

    position: absolute;

    width: 260px;
    height: 260px;

    border-radius: 50%;

    right: -90px;
    top: -130px;

    background: rgba(255,255,255,.07);
}

.shop-hero::after {
    content: "";

    position: absolute;

    width: 150px;
    height: 150px;

    border-radius: 50%;

    right: 170px;
    bottom: -110px;

    background: rgba(96,165,250,.10);
}

.hero-content {
    position: relative;
    z-index: 2;
}

.hero-content small {
    display: inline-block;

    padding: 6px 12px;
    margin-bottom: 10px;

    border-radius: 20px;

    background: rgba(255,255,255,.12);

    color: #dbeafe;

    font-size: 12px;
    font-weight: 600;
}

.hero-content h2 {
    margin: 0 0 8px;

    font-size: 30px;
    font-weight: 750;
}

.hero-content p {
    margin: 0;

    color: #dbeafe;

    font-size: 15px;
}


/* =========================================================
   SECTION
========================================================= */

.shop-section {
    margin-bottom: 32px;
}

.section-heading {
    display: flex;

    align-items: center;
    justify-content: space-between;

    margin-bottom: 17px;
}

.section-heading h4 {
    margin: 0;

    font-size: 20px;
    font-weight: 750;

    color: #0f172a;
}

.section-heading span {
    color: #64748b;

    font-size: 13px;
}


/* =========================================================
   MENU CARD
========================================================= */

.menu-card {
    position: relative;

    height: 100%;

    padding: 24px;

    background: #fff;

    border: 1px solid #e2e8f0;

    border-radius: 19px;

    box-shadow:
        0 7px 22px rgba(15,23,42,.06);

    transition:
        transform .25s ease,
        box-shadow .25s ease,
        border-color .25s ease;

    overflow: hidden;
}

.menu-card::before {
    content: "";

    position: absolute;

    top: 0;
    left: 0;

    width: 100%;
    height: 4px;

    background: linear-gradient(
        90deg,
        #2563eb,
        #60a5fa
    );
}

.menu-card:hover {
    transform: translateY(-6px);

    border-color: #bfdbfe;

    box-shadow:
        0 16px 35px rgba(15,23,42,.11);
}

.menu-icon {
    width: 56px;
    height: 56px;

    display: flex;

    align-items: center;
    justify-content: center;

    margin-bottom: 16px;

    border-radius: 16px;

    font-size: 25px;
}

.icon-blue {
    color: #2563eb;
    background: #dbeafe;
}

.icon-green {
    color: #16a34a;
    background: #dcfce7;
}

.icon-orange {
    color: #d97706;
    background: #fef3c7;
}

/* PROFIL */

.icon-purple {
    color: #7c3aed;
    background: #ede9fe;
}

.menu-card h4 {
    margin-bottom: 8px;

    color: #0f172a;

    font-size: 18px;
    font-weight: 700;
}

.menu-card p {
    min-height: 45px;

    margin-bottom: 18px;

    color: #64748b;

    font-size: 13px;

    line-height: 1.6;
}


/* =========================================================
   BUTTON
========================================================= */

.shop-btn {
    display: inline-flex;

    align-items: center;
    justify-content: center;

    gap: 7px;

    width: 100%;

    padding: 10px 15px;

    border: none;

    border-radius: 10px;

    text-decoration: none;

    font-size: 13px;
    font-weight: 650;

    transition: .25s ease;
}

.shop-btn:hover {
    transform: translateY(-2px);
}


/* BLUE */

.btn-blue {
    color: white;
    background: #2563eb;
}

.btn-blue:hover {
    color: white;
    background: #1d4ed8;

    box-shadow:
        0 7px 16px rgba(37,99,235,.25);
}


/* GREEN */

.btn-green {
    color: white;
    background: #16a34a;
}

.btn-green:hover {
    color: white;
    background: #15803d;

    box-shadow:
        0 7px 16px rgba(22,163,74,.25);
}


/* ORANGE */

.btn-orange {
    color: white;
    background: #f59e0b;
}

.btn-orange:hover {
    color: white;
    background: #d97706;

    box-shadow:
        0 7px 16px rgba(245,158,11,.25);
}


/* PURPLE - PROFIL */

.btn-purple {
    color: white;
    background: #7c3aed;
}

.btn-purple:hover {
    color: white;
    background: #6d28d9;

    box-shadow:
        0 7px 16px rgba(124,58,237,.25);
}


/* =========================================================
   CART
========================================================= */

.cart-button {
    position: relative;
}

.cart-badge {
    position: absolute;

    top: -8px;
    right: -7px;

    min-width: 23px;
    height: 23px;

    display: flex;

    align-items: center;
    justify-content: center;

    padding: 0 6px;

    border-radius: 50px;

    background: #ef4444;

    color: white;

    border: 2px solid white;

    font-size: 11px;
    font-weight: 700;
}


/* =========================================================
   PRODUCT CARD
========================================================= */

.product-card {
    height: 100%;

    overflow: hidden;

    background: white;

    border: 1px solid #e2e8f0;

    border-radius: 17px;

    box-shadow:
        0 6px 20px rgba(15,23,42,.06);

    transition: .25s ease;
}

.product-card:hover {
    transform: translateY(-5px);

    border-color: #bfdbfe;

    box-shadow:
        0 15px 30px rgba(15,23,42,.11);
}

.product-image-wrapper {
    position: relative;

    height: 220px;

    overflow: hidden;

    background: #f8fafc;
}

.product-image {
    width: 100%;
    height: 100%;

    object-fit: cover;

    transition: transform .35s ease;
}

.product-card:hover .product-image {
    transform: scale(1.05);
}

.product-label {
    position: absolute;

    left: 12px;
    top: 12px;

    padding: 6px 10px;

    border-radius: 20px;

    color: white;

    background: rgba(15,23,42,.78);

    backdrop-filter: blur(5px);

    font-size: 11px;
    font-weight: 650;
}

.product-label.hot {
    background: #ef4444;
}

.product-label.recommend {
    background: #16a34a;
}

.product-body {
    padding: 17px;
}

.product-name {
    display: -webkit-box;

    overflow: hidden;

    min-height: 42px;

    margin-bottom: 7px;

    color: #0f172a;

    font-size: 14px;
    font-weight: 650;

    line-height: 1.5;

    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}

.product-price {
    margin-bottom: 7px;

    color: #dc2626;

    font-size: 16px;
    font-weight: 750;
}

.product-sold {
    display: block;

    margin-bottom: 13px;

    color: #16a34a;

    font-size: 12px;
}


/* =========================================================
   DIVIDER
========================================================= */

.shop-divider {
    height: 1px;

    margin: 8px 0 28px;

    border: 0;

    background:
        linear-gradient(
            90deg,
            transparent,
            #dbe3ef,
            transparent
        );
}


/* =========================================================
   EMPTY
========================================================= */

.empty-product {
    width: 100%;

    padding: 45px 20px;

    text-align: center;

    border: 1px dashed #cbd5e1;

    border-radius: 17px;

    background: #f8fafc;

    color: #64748b;
}

.empty-product-icon {
    margin-bottom: 10px;

    font-size: 35px;
}


/* =========================================================
   RESPONSIVE
========================================================= */

@media (max-width: 768px) {

    .shop-hero {
        min-height: 170px;

        padding: 28px 24px;

        border-radius: 19px;
    }

    .hero-content h2 {
        font-size: 24px;
    }

    .hero-content p {
        font-size: 13px;
    }

    .section-heading span {
        display: none;
    }

    .menu-card {
        padding: 21px;
    }
}

@media (max-width: 500px) {

    .pelanggan-dashboard {
        padding-top: 0;
    }

    .shop-hero {
        padding: 25px 20px;
    }

    .hero-content h2 {
        font-size: 22px;
    }

    .product-image-wrapper {
        height: 200px;
    }
}

</style>


<div class="pelanggan-dashboard">

    

    <div class="shop-hero">

        <div class="hero-content">

            <small>
                🛍️ BRAND FORGE STORE
            </small>

            <h2>
                Dashboard Belanja
            </h2>

            <p>
                Temukan produk favoritmu dan nikmati
                pengalaman belanja yang mudah.
            </p>

        </div>

    </div>


    

    <div class="shop-section">

        <div class="section-heading">

            <h4>
                Menu Belanja
            </h4>

            <span>
                Kelola aktivitas belanjamu
            </span>

        </div>


        <div class="row g-3">


            

            <div class="col-md-4">

                <div class="menu-card">

                    <div class="menu-icon icon-blue">
                        🛍️
                    </div>

                    <h4>
                        Belanja Produk
                    </h4>

                    <p>
                        Jelajahi berbagai produk fashion
                        dan pilih produk yang ingin kamu beli.
                    </p>

                    <a
                        href="<?php echo e(route('pelanggan.belanja')); ?>"
                        class="shop-btn btn-blue"
                    >
                        <i class="bi bi-bag"></i>
                        Belanja Produk
                    </a>

                </div>

            </div>


            

            <div class="col-md-4">

                <div class="menu-card">

                    <div class="menu-icon icon-green">
                        🛒
                    </div>

                    <h4>
                        Keranjang
                    </h4>

                    <p>
                        Periksa produk yang sudah kamu pilih
                        sebelum melanjutkan pembelian.
                    </p>

                    <div class="cart-button">

                        <a
                            href="<?php echo e(route('pelanggan.keranjang')); ?>"
                            class="shop-btn btn-green"
                        >

                            <i class="bi bi-cart"></i>

                            Buka Keranjang

                            <span class="cart-badge">
                                <?php echo e($jumlahKeranjang); ?>

                            </span>

                        </a>

                    </div>

                </div>

            </div>


            

            <div class="col-md-4">

                <div class="menu-card">

                    <div class="menu-icon icon-orange">
                        📊
                    </div>

                    <h4>
                        Status Pesanan
                    </h4>

                    <p>
                        Pantau status pesanan dan lihat
                        perkembangan pembelianmu.
                    </p>

                    <a
                        href="<?php echo e(route('pelanggan.index')); ?>"
                        class="shop-btn btn-orange"
                    >

                        <i class="bi bi-speedometer2"></i>

                        Lihat Status

                    </a>

                </div>

            </div>


            

            <div class="col-md-4">

                <div class="menu-card">

                    <div class="menu-icon icon-purple">
                        👤
                    </div>

                    <h4>
                        Profil Saya
                    </h4>

                    <p>
                        Kelola informasi pribadi, nama, alamat,
                        nomor HP, email, dan password akunmu.
                    </p>

                    <a
                        href="<?php echo e(route('profile.edit')); ?>"
                        class="shop-btn btn-purple"
                    >

                        <i class="bi bi-person-circle"></i>

                        Kelola Profil

                    </a>

                </div>

            </div>


        </div>

    </div>


    

    <div class="shop-section">

        <hr class="shop-divider">

        <div class="section-heading">

            <h4>
                🆕 Produk Terbaru
            </h4>

            <span>
                Koleksi terbaru BrandForge
            </span>

        </div>


        <div class="row g-3">

            <?php $__empty_1 = true; $__currentLoopData = $produkTerbaru; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $produk): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); $__empty_1 = false; ?>

                <div class="col-6 col-md-4 col-lg-3">

                    <div class="product-card">

                        <div class="product-image-wrapper">

                            <?php if($produk->foto): ?>

                                <img
                                    src="<?php echo e(asset('produk/'.$produk->foto)); ?>"
                                    class="product-image"
                                    alt="<?php echo e($produk->nama_produk); ?>"
                                >

                            <?php else: ?>

                                <div class="d-flex align-items-center justify-content-center h-100 text-muted">
                                    🖼️ Tidak ada foto
                                </div>

                            <?php endif; ?>

                            <span class="product-label">
                                BARU
                            </span>

                        </div>


                        <div class="product-body">

                            <div class="product-name">
                                <?php echo e($produk->nama_produk); ?>

                            </div>

                            <div class="product-price">
                                Rp <?php echo e(number_format($produk->harga, 0, ',', '.')); ?>

                            </div>

                            <a
                                href="<?php echo e(route('pelanggan.detailProduk', $produk->id)); ?>"
                                class="shop-btn btn-blue"
                            >
                                Lihat Detail
                                <i class="bi bi-arrow-right"></i>
                            </a>

                        </div>

                    </div>

                </div>

            <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); if ($__empty_1): ?>

                <div class="col-12">

                    <div class="empty-product">

                        <div class="empty-product-icon">
                            📦
                        </div>

                        Belum ada produk terbaru.

                    </div>

                </div>

            <?php endif; ?>

        </div>

    </div>


    

    <div class="shop-section">

        <hr class="shop-divider">

        <div class="section-heading">

            <h4>
                🔥 Produk Terlaris
            </h4>

            <span>
                Produk yang paling banyak dibeli
            </span>

        </div>


        <div class="row g-3">

            <?php $__empty_1 = true; $__currentLoopData = $produkTerlaris; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $produk): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); $__empty_1 = false; ?>

                <div class="col-6 col-md-4 col-lg-3">

                    <div class="product-card">

                        <div class="product-image-wrapper">

                            <?php if($produk->foto): ?>

                                <img
                                    src="<?php echo e(asset('produk/'.$produk->foto)); ?>"
                                    class="product-image"
                                    alt="<?php echo e($produk->nama_produk); ?>"
                                >

                            <?php else: ?>

                                <div class="d-flex align-items-center justify-content-center h-100 text-muted">
                                    🖼️ Tidak ada foto
                                </div>

                            <?php endif; ?>

                            <span class="product-label hot">
                                🔥 TERLARIS
                            </span>

                        </div>


                        <div class="product-body">

                            <div class="product-name">
                                <?php echo e($produk->nama_produk); ?>

                            </div>

                            <div class="product-price">
                                Rp <?php echo e(number_format($produk->harga, 0, ',', '.')); ?>

                            </div>

                            <small class="product-sold">
                                ✓ Terjual
                                <?php echo e($produk->detail_transaksi_sum_jumlah ?? 0); ?>

                                pcs
                            </small>

                            <a
                                href="<?php echo e(route('pelanggan.detailProduk', $produk->id)); ?>"
                                class="shop-btn btn-blue"
                            >
                                Lihat Detail
                                <i class="bi bi-arrow-right"></i>
                            </a>

                        </div>

                    </div>

                </div>

            <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); if ($__empty_1): ?>

                <div class="col-12">

                    <div class="empty-product">

                        <div class="empty-product-icon">
                            🔥
                        </div>

                        Belum ada produk terlaris.

                    </div>

                </div>

            <?php endif; ?>

        </div>

    </div>


    

    <div class="shop-section">

        <hr class="shop-divider">

        <div class="section-heading">

            <h4>
                ✨ Rekomendasi Untukmu
            </h4>

            <span>
                Produk yang mungkin kamu sukai
            </span>

        </div>


        <div class="row g-3">

            <?php $__empty_1 = true; $__currentLoopData = $produkRekomendasi; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $produk): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); $__empty_1 = false; ?>

                <div class="col-6 col-md-4 col-lg-3">

                    <div class="product-card">

                        <div class="product-image-wrapper">

                            <?php if($produk->foto): ?>

                                <img
                                    src="<?php echo e(asset('produk/'.$produk->foto)); ?>"
                                    class="product-image"
                                    alt="<?php echo e($produk->nama_produk); ?>"
                                >

                            <?php else: ?>

                                <div class="d-flex align-items-center justify-content-center h-100 text-muted">
                                    🖼️ Tidak ada foto
                                </div>

                            <?php endif; ?>

                            <span class="product-label recommend">
                                ✨ REKOMENDASI
                            </span>

                        </div>


                        <div class="product-body">

                            <div class="product-name">
                                <?php echo e($produk->nama_produk); ?>

                            </div>

                            <div class="product-price">
                                Rp <?php echo e(number_format($produk->harga, 0, ',', '.')); ?>

                            </div>

                            <small class="product-sold">
                                ✓ Terjual
                                <?php echo e($produk->detail_transaksi_sum_jumlah ?? 0); ?>

                                pcs
                            </small>

                            <a
                                href="<?php echo e(route('pelanggan.detailProduk', $produk->id)); ?>"
                                class="shop-btn btn-green"
                            >
                                Lihat Detail
                                <i class="bi bi-arrow-right"></i>
                            </a>

                        </div>

                    </div>

                </div>

            <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); if ($__empty_1): ?>

                <div class="col-12">

                    <div class="empty-product">

                        <div class="empty-product-icon">
                            ✨
                        </div>

                        Belum ada produk rekomendasi.

                    </div>

                </div>

            <?php endif; ?>

        </div>

    </div>

</div>

<?php $__env->stopSection(); ?>
<?php echo $__env->make('pelanggan.layouts.app', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?><?php /**PATH C:\xampp\htdocs\BrandForge\resources\views/pelanggan/dashboard_belanja.blade.php ENDPATH**/ ?>