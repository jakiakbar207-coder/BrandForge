

<?php $__env->startSection('title', 'Wishlist Saya'); ?>

<?php $__env->startSection('content'); ?>

<div class="container py-4">

    <div class="d-flex justify-content-between align-items-center mb-4">

        <h2 class="mb-0">
            ❤️ Wishlist Saya
        </h2>

        <a href="<?php echo e(route('pelanggan.belanja')); ?>"
           class="btn btn-primary">
            🛍️ Belanja Produk
        </a>

    </div>

    
    <?php if(session('success')): ?>
        <div class="alert alert-success alert-dismissible fade show">
            <?php echo e(session('success')); ?>


            <button type="button"
                    class="btn-close"
                    data-bs-dismiss="alert">
            </button>
        </div>
    <?php endif; ?>

    
    <?php if(session('info')): ?>
        <div class="alert alert-info alert-dismissible fade show">
            <?php echo e(session('info')); ?>


            <button type="button"
                    class="btn-close"
                    data-bs-dismiss="alert">
            </button>
        </div>
    <?php endif; ?>

    <?php if($wishlists->count() > 0): ?>

        <div class="row">

            <?php $__currentLoopData = $wishlists; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $wishlist): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>

                <?php
                    $produk = $wishlist->produk;

                    $stokProduk = $produk && $produk->stokData
                        ? $produk->stokData->sum('jumlah')
                        : 0;
                ?>

                <?php if($produk): ?>

                    <div class="col-md-4 col-lg-3 mb-4">

                        <div class="card h-100 shadow-sm">

                            
                            <?php if($produk->foto): ?>

                                <img src="<?php echo e(asset('produk/' . $produk->foto)); ?>"
                                     class="card-img-top"
                                     alt="<?php echo e($produk->nama_produk); ?>"
                                     style="height:220px; object-fit:cover;">

                            <?php else: ?>

                                <div class="d-flex align-items-center justify-content-center bg-light"
                                     style="height:220px;">

                                    <span class="text-muted">
                                        Tidak ada foto
                                    </span>

                                </div>

                            <?php endif; ?>

                            <div class="card-body d-flex flex-column">

                                
                                <h5 class="card-title">
                                    <?php echo e($produk->nama_produk); ?>

                                </h5>

                                
                                <h5 class="text-primary">
                                    Rp <?php echo e(number_format($produk->harga, 0, ',', '.')); ?>

                                </h5>

                                
                                <p class="text-muted mb-3">

                                    <strong>Stok:</strong>

                                    <?php if($stokProduk > 0): ?>
                                        <?php echo e($stokProduk); ?> tersedia
                                    <?php else: ?>
                                        <span class="text-danger">
                                            Stok habis
                                        </span>
                                    <?php endif; ?>

                                </p>

                                
                                <div class="mt-auto">

                                    <a href="<?php echo e(route('pelanggan.detailProduk', $produk->id)); ?>"
                                       class="btn btn-primary w-100 mb-2">
                                        👀 Lihat Produk
                                    </a>

                                    <form action="<?php echo e(route('pelanggan.wishlist.destroy', $produk->id)); ?>"
                                          method="POST">

                                        <?php echo csrf_field(); ?>

                                        <?php echo method_field('DELETE'); ?>

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

                <?php endif; ?>

            <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>

        </div>

    <?php else: ?>

        
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

            <a href="<?php echo e(route('pelanggan.belanja')); ?>"
               class="btn btn-primary">

                🛍️ Mulai Belanja

            </a>

        </div>

    <?php endif; ?>

</div>  

<?php $__env->stopSection(); ?>
<?php echo $__env->make('pelanggan.layouts.app', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?><?php /**PATH C:\xampp\htdocs\BrandForge\resources\views/pelanggan/wishlist.blade.php ENDPATH**/ ?>