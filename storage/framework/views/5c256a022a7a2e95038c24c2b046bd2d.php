

<?php $__env->startSection('title', 'Detail Produk'); ?>

<?php $__env->startSection('content'); ?>

<div class="container py-4">

    <a href="<?php echo e(route('pelanggan.belanja')); ?>" class="btn btn-secondary mb-3">
        ← Kembali
    </a>

    <div class="row">

        <div class="col-md-5">

            <?php if($produk->foto): ?>
                <img src="<?php echo e(asset('produk/'.$produk->foto)); ?>"
                     class="img-fluid rounded shadow"
                     alt="<?php echo e($produk->nama_produk); ?>">
            <?php else: ?>
                <img src="https://via.placeholder.com/500x500?text=Produk"
                     class="img-fluid rounded shadow"
                     alt="Produk">
            <?php endif; ?>

        </div>

        <div class="col-md-7">

            <h2><?php echo e($produk->nama_produk); ?></h2>

            <h3 class="text-primary mb-3">
                Rp <?php echo e(number_format($produk->harga, 0, ',', '.')); ?>

            </h3>

            <?php
                $stokProduk = $produk->stokData
                    ? $produk->stokData->sum('jumlah')
                    : 0;
            ?>

            <p>
                <strong>Stok :</strong>
                <?php echo e($stokProduk); ?>

            </p>

            <form action="<?php echo e(route('pelanggan.wishlist.store', $produk->id)); ?>"
                  method="POST"
                  class="mb-3">

                <?php echo csrf_field(); ?>

                <button type="submit"
                        class="btn btn-outline-danger">
                    ❤️ Tambahkan ke Wishlist
                </button>

            </form>

            <hr>

            <form action="<?php echo e(route('pelanggan.tambahKeranjang', $produk->id)); ?>"
                  method="POST">

                <?php echo csrf_field(); ?>

                <div class="mb-3">

                    <label class="form-label">
                        Pilih Warna
                    </label>

                    <select name="warna_id"
                            class="form-select"
                            required>

                        <?php $__currentLoopData = $warna; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $item): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>

                            <option value="<?php echo e($item->id); ?>">
                                <?php echo e($item->nama_warna); ?>

                            </option>

                        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>

                    </select>

                </div>

                <div class="mb-3">

                    <label class="form-label">
                        Pilih Ukuran
                    </label>

                    <select name="ukuran_id"
                            class="form-select"
                            required>

                        <?php $__currentLoopData = $ukuran; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $item): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>

                            <option value="<?php echo e($item->id); ?>">
                                <?php echo e($item->nama_ukuran); ?>

                            </option>

                        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>

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
                           max="<?php echo e(max($stokProduk, 1)); ?>"
                           <?php echo e($stokProduk <= 0 ? 'disabled' : ''); ?>

                           required>

                    <?php if($stokProduk <= 0): ?>

                        <small class="text-danger">
                            Stok produk sedang habis.
                        </small>

                    <?php endif; ?>

                </div>

                <hr>

                <div class="d-grid gap-2">

                    <?php if($stokProduk > 0): ?>

                        <button type="submit"
                                class="btn btn-success">
                            🛒 Tambah ke Keranjang
                        </button>

                        <a href="<?php echo e(route('pelanggan.checkout')); ?>"
                           class="btn btn-warning">
                            ⚡ Checkout
                        </a>

                    <?php else: ?>

                        <button type="button"
                                class="btn btn-secondary"
                                disabled>
                            Stok Habis
                        </button>

                    <?php endif; ?>

                </div>

            </form>

        </div>

    </div>

    <hr class="my-5">

    <div class="mb-5">

        <h4 class="mb-4">
            ⭐ Rating & Ulasan Produk
        </h4>

        <?php
            $reviews = $produk->reviews ?? collect();

            $jumlahReview = $reviews->count();

            $rataRating = $jumlahReview > 0
                ? round($reviews->avg('rating'), 1)
                : 0;
        ?>

        <div class="card shadow-sm mb-4">

            <div class="card-body">

                <div class="row align-items-center">

                    <div class="col-md-4 text-center">

                        <h1 class="display-4 fw-bold">
                            <?php echo e($rataRating); ?>

                        </h1>

                        <div class="text-warning fs-4">

                            <?php for($i = 1; $i <= 5; $i++): ?>

                                <?php if($i <= round($rataRating)): ?>
                                    ⭐
                                <?php else: ?>
                                    ☆
                                <?php endif; ?>

                            <?php endfor; ?>

                        </div>

                        <p class="text-muted mb-0">
                            <?php echo e($jumlahReview); ?> ulasan
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

        <?php $__empty_1 = true; $__currentLoopData = $reviews; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $review): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); $__empty_1 = false; ?>

            <div class="card shadow-sm mb-3">

                <div class="card-body">

                    <div class="d-flex justify-content-between">

                        <div>

                            <strong>
                                <?php echo e($review->user->name ?? 'Pelanggan'); ?>

                            </strong>

                            <div class="text-warning">

                                <?php for($i = 1; $i <= 5; $i++): ?>

                                    <?php if($i <= $review->rating): ?>
                                        ⭐
                                    <?php else: ?>
                                        ☆
                                    <?php endif; ?>

                                <?php endfor; ?>

                            </div>

                        </div>

                        <small class="text-muted">

                            <?php echo e($review->created_at?->format('d M Y')); ?>


                        </small>

                    </div>

                    <p class="mt-3 mb-2">
                        <?php echo e($review->komentar); ?>

                    </p>

                    <?php if($review->foto_produk): ?>

                        <div class="mt-3">

                            <img src="<?php echo e(asset('storage/'.$review->foto_produk)); ?>"
                                 class="img-fluid rounded shadow-sm"
                                 style="max-width:300px;max-height:300px;object-fit:cover;"
                                 alt="Foto ulasan">

                        </div>

                    <?php endif; ?>

                </div>

            </div>

        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); if ($__empty_1): ?>

            <div class="alert alert-light border text-center">

                <h5>Belum ada ulasan</h5>

                <p class="text-muted mb-0">
                    Belum ada pelanggan yang memberikan ulasan untuk produk ini.
                </p>

            </div>

        <?php endif; ?>

    </div>

    <hr class="my-5">

    <h4 class="mb-4">
        🛍️ Produk Terkait
    </h4>

    <div class="row">

        <?php $__empty_1 = true; $__currentLoopData = $produkTerkait; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $item): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); $__empty_1 = false; ?>

            <?php
                $stokTerkait = $item->stokData
                    ? $item->stokData->sum('jumlah')
                    : 0;
            ?>

            <div class="col-md-3 mb-4">

                <div class="card h-100 shadow-sm">

                    <?php if($item->foto): ?>

                        <img src="<?php echo e(asset('produk/'.$item->foto)); ?>"
                             class="card-img-top"
                             style="height:220px;object-fit:cover;"
                             alt="<?php echo e($item->nama_produk); ?>">

                    <?php else: ?>

                        <img src="https://via.placeholder.com/400x220?text=Produk"
                             class="card-img-top"
                             style="height:220px;object-fit:cover;"
                             alt="Produk">

                    <?php endif; ?>

                    <div class="card-body">

                        <h6>
                            <?php echo e($item->nama_produk); ?>

                        </h6>

                        <p class="text-danger fw-bold">
                            Rp <?php echo e(number_format($item->harga, 0, ',', '.')); ?>

                        </p>

                        <p class="small text-muted">
                            Stok :
                            <?php echo e($stokTerkait); ?>

                        </p>

                        <a href="<?php echo e(route('pelanggan.detailProduk', $item->id)); ?>"
                           class="btn btn-outline-primary btn-sm w-100">
                            Lihat Produk
                        </a>

                    </div>

                </div>

            </div>

        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); if ($__empty_1): ?>

            <div class="col-12">

                <div class="alert alert-warning text-center">
                    Belum ada produk terkait.
                </div>

            </div>

        <?php endif; ?>

    </div>

</div>

<?php $__env->stopSection(); ?>
<?php echo $__env->make('layouts.app', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?><?php /**PATH C:\xampp\htdocs\BrandForge\resources\views/pelanggan/detail_produk.blade.php ENDPATH**/ ?>