

<?php $__env->startSection('title', 'Data Stok'); ?>

<?php $__env->startSection('content'); ?>

<div class="container-fluid py-4">

    <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
            <h3 class="fw-bold mb-1">📦 Data Stok</h3>
            <p class="text-muted mb-0">
                Kelola stok produk berdasarkan ukuran dan warna.
            </p>
        </div>

        <a href="<?php echo e(route('stok.create')); ?>" class="btn btn-primary">
            + Tambah Stok
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

    <div class="card border-0 shadow-sm">

        <div class="card-body">

            <div class="table-responsive">

                <table class="table table-hover align-middle mb-0">

                    <thead class="table-dark">

                        <tr>
                            <th>No</th>
                            <th>Produk</th>
                            <th>Ukuran</th>
                            <th>Warna</th>
                            <th>Jumlah</th>
                            <th width="180">Aksi</th>
                        </tr>

                    </thead>

                    <tbody>

                    <?php $__empty_1 = true; $__currentLoopData = $stoks; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $stok): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); $__empty_1 = false; ?>

                        <tr>

                            <td>
                                <?php echo e($loop->iteration); ?>

                            </td>

                            <td>
                                <strong>
                                    <?php echo e($stok->produk->nama_produk ?? '-'); ?>

                                </strong>
                            </td>

                            <td>
                                <span class="badge bg-secondary">
                                    <?php echo e($stok->ukuran->nama_ukuran ?? '-'); ?>

                                </span>
                            </td>

                            <td>
                                <?php echo e($stok->warna->nama_warna ?? '-'); ?>

                            </td>

                            <td>

                                <?php if($stok->jumlah <= 5): ?>

                                    <span class="badge bg-danger">
                                        <?php echo e($stok->jumlah); ?> — Menipis
                                    </span>

                                <?php else: ?>

                                    <span class="badge bg-success">
                                        <?php echo e($stok->jumlah); ?>

                                    </span>

                                <?php endif; ?>

                            </td>

                            <td>

                                <a href="<?php echo e(route('stok.edit', $stok->id)); ?>"
                                   class="btn btn-warning btn-sm">
                                    Edit
                                </a>

                                <form
                                    action="<?php echo e(route('stok.destroy', $stok->id)); ?>"
                                    method="POST"
                                    class="d-inline">

                                    <?php echo csrf_field(); ?>
                                    <?php echo method_field('DELETE'); ?>

                                    <button
                                        type="submit"
                                        class="btn btn-danger btn-sm"
                                        onclick="return confirm('Yakin ingin menghapus stok ini?')">

                                        Hapus

                                    </button>

                                </form>

                            </td>

                        </tr>

                    <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); if ($__empty_1): ?>

                        <tr>

                            <td colspan="6"
                                class="text-center text-muted py-4">

                                📦 Belum ada data stok.

                            </td>

                        </tr>

                    <?php endif; ?>

                    </tbody>

                </table>
                <a href="<?php echo e(route('admin.index')); ?>" class="btn btn-secondary mt-3">
                    ← Kembali ke Dashboard Admin
                </a>

            </div>

        </div>

    </div>

</div>

<?php $__env->stopSection(); ?>
<?php echo $__env->make('layouts.app', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?><?php /**PATH C:\xampp\htdocs\BrandForge\resources\views/admin/stok/index.blade.php ENDPATH**/ ?>