

<?php $__env->startSection('title', 'Tambah Biaya Operasional'); ?>

<?php $__env->startSection('content'); ?>

<div class="container py-4">

    <div class="card shadow">

        <div class="card-header bg-primary text-white">
            <h4 class="mb-0">Tambah Biaya Operasional</h4>
        </div>

        <div class="card-body">

            <?php if($errors->any()): ?>
                <div class="alert alert-danger">
                    <ul class="mb-0">
                        <?php $__currentLoopData = $errors->all(); $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $error): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                            <li><?php echo e($error); ?></li>
                        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                    </ul>
                </div>
            <?php endif; ?>

            <form action="<?php echo e(route('biaya-operasional.store')); ?>" method="POST">
                <?php echo csrf_field(); ?>

                <div class="mb-3">
                    <label for="nama_biaya" class="form-label">
                        Nama Biaya
                    </label>

                    <input
                        type="text"
                        name="nama_biaya"
                        id="nama_biaya"
                        class="form-control"
                        value="<?php echo e(old('nama_biaya')); ?>"
                        placeholder="Contoh: Listrik, Internet, Transportasi"
                        required>
                </div>

                <div class="mb-3">
                    <label for="tanggal" class="form-label">
                        Tanggal
                    </label>

                    <input
                        type="date"
                        name="tanggal"
                        id="tanggal"
                        class="form-control"
                        value="<?php echo e(old('tanggal')); ?>"
                        required>
                </div>

                <div class="mb-3">
                    <label for="keterangan" class="form-label">
                        Keterangan
                    </label>

                    <textarea
                        name="keterangan"
                        id="keterangan"
                        class="form-control"
                        rows="4"
                        placeholder="Masukkan keterangan biaya"><?php echo e(old('keterangan')); ?></textarea>
                </div>

                <div class="mb-3">
                    <label for="nominal" class="form-label">
                        Nominal
                    </label>

                    <input
                        type="number"
                        name="nominal"
                        id="nominal"
                        class="form-control"
                        value="<?php echo e(old('nominal')); ?>"
                        placeholder="Contoh: 500000"
                        min="0"
                        required>
                </div>

                <button type="submit" class="btn btn-success">
                    <i class="bi bi-save"></i>
                    Simpan
                </button>

                <a href="<?php echo e(route('biaya-operasional.index')); ?>"
                   class="btn btn-secondary">
                    Kembali
                </a>

            </form>

        </div>

    </div>

</div>      

<?php $__env->stopSection(); ?>
<?php echo $__env->make('layouts.app', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?><?php /**PATH C:\xampp\htdocs\BrandForge\resources\views/admin/biaya_operasional/create.blade.php ENDPATH**/ ?>