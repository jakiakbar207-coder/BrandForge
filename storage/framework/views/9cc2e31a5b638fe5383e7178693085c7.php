

<?php $__env->startSection('title', 'Transaksi Kasir'); ?>

<?php $__env->startSection('content'); ?>

<div class="container mt-4">

    <h2 class="mb-4">Transaksi Kasir</h2>

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

    <?php if($errors->any()): ?>
        <div class="alert alert-danger">
            <ul class="mb-0">
                <?php $__currentLoopData = $errors->all(); $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $error): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                    <li><?php echo e($error); ?></li>
                <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
            </ul>
        </div>
    <?php endif; ?>

    <div class="card">
        <div class="card-header">
            Form Transaksi
        </div>

        <div class="card-body">

            <form action="<?php echo e(route('kasir.store')); ?>" method="POST">
                <?php echo csrf_field(); ?>

                <div class="mb-3">
                    <label class="form-label">Pilih Produk</label>

                    <select name="stok_id" class="form-select" required>
                        <option value="">-- Pilih Produk --</option>

                        <?php $__currentLoopData = $stoks; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $stok): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                            <option value="<?php echo e($stok->id); ?>">
                                <?php echo e($stok->produk->nama_produk); ?>

                                |
                                <?php echo e($stok->ukuran->nama_ukuran ?? 'Tanpa Ukuran'); ?>

                                |
                                <?php echo e($stok->warna->nama_warna ?? 'Tanpa Warna'); ?>

                                |
                                Stok : <?php echo e($stok->jumlah); ?>

                                |
                                Rp <?php echo e(number_format($stok->produk->harga, 0, ',', '.')); ?>

                            </option>
                        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>

                    </select>
                </div>

                <div class="mb-3">
                    <label class="form-label">Jumlah</label>

                    <input
                        type="number"
                        name="jumlah"
                        class="form-control"
                        min="1"
                        required>
                </div>

                <div class="mb-3">
                    <label class="form-label">Uang Pembayaran</label>

                    <input
                        type="number"
                        name="bayar"
                        class="form-control"
                        min="0"
                        required>
                </div>

                <button type="submit" class="btn btn-primary">
                    Simpan Transaksi
                </button>

                <a href="<?php echo e(route('kasir.index')); ?>" class="btn btn-secondary">
                    Kembali
                </a>

            </form>

        </div>
    </div>

</div>

<?php $__env->stopSection(); ?>
<?php echo $__env->make('layouts.app', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?><?php /**PATH C:\xampp\htdocs\BrandForge\resources\views/kasir/transaksi.blade.php ENDPATH**/ ?>