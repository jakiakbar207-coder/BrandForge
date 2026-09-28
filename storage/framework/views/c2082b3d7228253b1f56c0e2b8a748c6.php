

<?php $__env->startSection('title', 'Belanja Produk'); ?>

<?php $__env->startSection('content'); ?>

<div class="container py-4">

    <h2 class="mb-4">
        🛍️ Belanja Produk
    </h2>

     <a href="<?php echo e(route('pelanggan.dashboardBelanja')); ?>"
       class="btn btn-secondary mb-4">
        ← Kembali ke Dashboard Belanja
    </a>


    <!-- SEARCH -->
   <form method="GET"
      action="<?php echo e(route('pelanggan.belanja')); ?>"
      class="row g-2 mb-4">

    <div class="col-md-3">
        <input
            type="text"
            name="search"
            class="form-control"
            placeholder="Cari produk..."
            value="<?php echo e(request('search')); ?>">
    </div>

    <div class="col-md-2">

        <select name="harga" class="form-select">

            <option value="">Harga</option>

            <option value="1"
            <?php echo e(request('harga')=='1'?'selected':''); ?>>
                < 100.000
            </option>

            <option value="2"
            <?php echo e(request('harga')=='2'?'selected':''); ?>>
                100.000 - 300.000
            </option>

            <option value="3"
            <?php echo e(request('harga')=='3'?'selected':''); ?>>
                > 300.000
            </option>

        </select>

    </div>

    <div class="col-md-2">

        <select name="kategori" class="form-select">

            <option value="">Kategori</option>

            <?php $__currentLoopData = $kategoris; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $kategori): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>

                <option
                    value="<?php echo e($kategori->id); ?>"
                    <?php echo e(request('kategori')==$kategori->id?'selected':''); ?>>

                    <?php echo e($kategori->nama_kategori); ?>


                </option>

            <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>

        </select>

    </div>

    <div class="col-md-2">

        <select name="warna" class="form-select">

            <option value="">Warna</option>

            <?php $__currentLoopData = $warnas; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $warna): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>

                <option
                    value="<?php echo e($warna->id); ?>"
                    <?php echo e(request('warna')==$warna->id?'selected':''); ?>>

                    <?php echo e($warna->nama_warna); ?>


                </option>

            <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>

        </select>

    </div>

    <div class="col-md-2">

        <select name="ukuran" class="form-select">

            <option value="">Ukuran</option>

            <?php $__currentLoopData = $ukurans; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $ukuran): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>

                <option
                    value="<?php echo e($ukuran->id); ?>"
                    <?php echo e(request('ukuran')==$ukuran->id?'selected':''); ?>>

                    <?php echo e($ukuran->nama_ukuran); ?>


                </option>

            <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>

        </select>

    </div>

    <div class="col-md-1 d-grid">

        <button class="btn btn-primary">

            Cari

        </button>

    </div>

</form>

    <div class="row">

        <?php $__empty_1 = true; $__currentLoopData = $produks; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $produk): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); $__empty_1 = false; ?>

            <div class="col-md-4 mb-4">

                <div class="card h-100 shadow-sm">

                    <?php if($produk->foto): ?>
                        <img src="<?php echo e(asset('produk/'.$produk->foto)); ?>"
                             class="card-img-top"
                             style="height:250px;object-fit:cover;">
                    <?php else: ?>
                        <img src="https://via.placeholder.com/400x250?text=Produk"
                             class="card-img-top"
                             style="height:250px;object-fit:cover;">
                    <?php endif; ?>

                    <div class="card-body">

                        <h5 class="card-title">
                            <?php echo e($produk->nama_produk); ?>

                        </h5>

                        <h4 class="text-primary">
                            Rp <?php echo e(number_format($produk->harga,0,',','.')); ?>

                        </h4>

                        <p>
                            <strong>Stok :</strong>
                            <?php echo e($produk->stokData->sum('jumlah')); ?>

                        </p>
                       <div class="d-flex gap-2">

                            <a href="<?php echo e(route('pelanggan.detailProduk', $produk->id)); ?>"
                            class="btn btn-primary flex-grow-1">
                                Lihat Produk
                            </a>

                            <form action="<?php echo e(route('pelanggan.wishlist.store', $produk->id)); ?>"
                                method="POST">
                                <?php echo csrf_field(); ?>

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

        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); if ($__empty_1): ?>

            <div class="col-12">

                <div class="alert alert-warning text-center">
                    Produk tidak ditemukan.
                </div>

            </div>

        <?php endif; ?>

    </div>

</div>

<?php $__env->stopSection(); ?>
<?php echo $__env->make('pelanggan.layouts.app', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?><?php /**PATH C:\xampp\htdocs\BrandForge\resources\views/pelanggan/belanja.blade.php ENDPATH**/ ?>