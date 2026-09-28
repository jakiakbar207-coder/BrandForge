

<?php $__env->startSection('title', 'Bukti Pembayaran'); ?>

<?php $__env->startSection('content'); ?>

<div class="container mt-4">

    <a href="<?php echo e(route('kasir.riwayat')); ?>" class="btn btn-secondary mb-3">
        ← Kembali
    </a>

    <div class="card">
        <div class="card-header bg-warning">
            <h4>Bukti Pembayaran</h4>
        </div>

        <div class="card-body text-center">

            <?php if($transaksi->pembayaran && $transaksi->pembayaran->bukti): ?>

                <img src="<?php echo e(asset('bukti/'.$transaksi->pembayaran->bukti)); ?>"
                     class="img-fluid rounded"
                     style="max-height:600px;">

            <?php else: ?>

                <div class="alert alert-danger">
                    Bukti pembayaran belum diupload.
                </div>

            <?php endif; ?>

        </div>
    </div>

</div>

<?php $__env->stopSection(); ?>
<?php echo $__env->make('layouts.app', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?><?php /**PATH C:\xampp\htdocs\BrandForge\resources\views/kasir/buktipembayaran.blade.php ENDPATH**/ ?>