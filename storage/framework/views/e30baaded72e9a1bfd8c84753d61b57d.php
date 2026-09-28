

<?php $__env->startSection('title', 'Biaya Operasional'); ?>

<?php $__env->startSection('content'); ?>

<div class="container py-4">

    <div class="d-flex justify-content-between align-items-center mb-4">

        <h3 class="fw-bold mb-0">
            Biaya Operasional
        </h3>

        <div>
            <a href="<?php echo e(route('biaya-operasional.create')); ?>"
               class="btn btn-primary me-2">
                + Tambah Biaya
            </a>

            <a href="<?php echo e(route('admin.index')); ?>"
               class="btn btn-secondary">
                Kembali
            </a>
        </div>

    </div>


    <?php if(session('success')): ?>

        <div class="alert alert-success">
            <?php echo e(session('success')); ?>

        </div>

    <?php endif; ?>


    <div class="card shadow-sm">

        <div class="card-body">

            <div class="table-responsive">

                <table class="table table-bordered table-hover align-middle">

                    <thead class="table-dark text-center">

                        <tr>
                            <th width="60">No</th>
                            <th>Tanggal</th>
                            <th>Keterangan</th>
                            <th>Nominal</th>
                            <th width="180">Aksi</th>
                        </tr>

                    </thead>


                    <tbody>

                        <?php $__empty_1 = true; $__currentLoopData = $biayas; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $biaya): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); $__empty_1 = false; ?>

                            <tr>

                                <td class="text-center">
                                    <?php echo e($loop->iteration); ?>

                                </td>


                                <td>
                                    <?php echo e(\Carbon\Carbon::parse($biaya->tanggal)->format('d-m-Y')); ?>

                                </td>


                                <td>
                                    <?php echo e($biaya->keterangan); ?>

                                </td>


                                <td>
                                    Rp <?php echo e(number_format($biaya->nominal, 0, ',', '.')); ?>

                                </td>


                                <td class="text-center">

                                    <a href="<?php echo e(route('biaya-operasional.edit', $biaya->id)); ?>"
                                       class="btn btn-warning btn-sm">
                                        Edit
                                    </a>


                                    <form action="<?php echo e(route('biaya-operasional.destroy', $biaya->id)); ?>"
                                          method="POST"
                                          class="d-inline">

                                        <?php echo csrf_field(); ?>
                                        <?php echo method_field('DELETE'); ?>

                                        <button type="submit"
                                                class="btn btn-danger btn-sm"
                                                onclick="return confirm('Yakin ingin menghapus biaya ini?')">
                                            Hapus
                                        </button>

                                    </form>

                                </td>

                            </tr>


                        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); if ($__empty_1): ?>

                            <tr>

                                <td colspan="5" class="text-center text-muted">

                                    Belum ada data biaya operasional.

                                </td>

                            </tr>

                        <?php endif; ?>

                    </tbody>

                </table>

            </div>

        </div>

    </div>

</div>

<?php $__env->stopSection(); ?>
<?php echo $__env->make('layouts.app', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?><?php /**PATH C:\xampp\htdocs\BrandForge\resources\views/admin/biaya_operasional/index.blade.php ENDPATH**/ ?>