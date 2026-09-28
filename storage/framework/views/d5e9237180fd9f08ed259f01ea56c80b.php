

<?php $__env->startSection('title', 'Data Kategori'); ?>

<?php $__env->startSection('content'); ?>

<div class="container py-4">

    <div class="d-flex justify-content-between align-items-center mb-4">

        <h3 class="fw-bold">
            📂 Master Data Kategori
        </h3>

        <div>

            <a href="<?php echo e(route('admin.index')); ?>" class="btn btn-secondary">
                ← Dashboard Admin
            </a>

            <a href="<?php echo e(route('kategori.create')); ?>" class="btn btn-primary">
                + Tambah Kategori
            </a>

        </div>

    </div>

    <?php if(session('success')): ?>

        <div class="alert alert-success">

            <?php echo e(session('success')); ?>


        </div>

    <?php endif; ?>

    <div class="card shadow">

        <div class="card-body">

            <table class="table table-bordered table-hover align-middle">

                <thead class="table-dark">

                    <tr>

                        <th width="70">No</th>

                        <th>Nama Kategori</th>

                        <th width="220" class="text-center">
                            Aksi
                        </th>

                    </tr>

                </thead>

                <tbody>

                    <?php $__empty_1 = true; $__currentLoopData = $kategoris; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $kategori): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); $__empty_1 = false; ?>

                        <tr>

                            <td><?php echo e($loop->iteration); ?></td>

                            <td><?php echo e($kategori->nama_kategori); ?></td>

                            <td class="text-center">

                                <a href="<?php echo e(route('kategori.edit', $kategori->id)); ?>"
                                   class="btn btn-warning btn-sm">
                                    Edit
                                </a>

                                <form action="<?php echo e(route('kategori.destroy', $kategori->id)); ?>"
                                      method="POST"
                                      class="d-inline">

                                    <?php echo csrf_field(); ?>
                                    <?php echo method_field('DELETE'); ?>

                                    <button
                                        type="submit"
                                        class="btn btn-danger btn-sm"
                                        onclick="return confirm('Yakin ingin menghapus kategori ini?')">

                                        Hapus

                                    </button>

                                </form>

                            </td>

                        </tr>

                    <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); if ($__empty_1): ?>

                        <tr>

                            <td colspan="3" class="text-center text-muted">

                                Belum ada data kategori.

                            </td>

                        </tr>

                    <?php endif; ?>

                </tbody>

            </table>

        </div>

    </div>

</div>

<?php $__env->stopSection(); ?>
<?php echo $__env->make('layouts.app', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?><?php /**PATH C:\xampp\htdocs\BrandForge\resources\views/admin/kategori/index.blade.php ENDPATH**/ ?>