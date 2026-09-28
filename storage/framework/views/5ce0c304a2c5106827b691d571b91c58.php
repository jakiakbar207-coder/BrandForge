        

        <?php $__env->startSection('title', 'Data Pengiriman'); ?>

        <?php $__env->startSection('content'); ?>
        <div class="container-fluid">

            <div class="d-flex justify-content-between align-items-center mb-3">
                <h4>Data Pengiriman</h4>

                <a href="<?php echo e(route('admin.index')); ?>" class="btn btn-secondary">
                    <i class="bi bi-arrow-left"></i> Kembali
                </a>
            </div>

            <div class="card shadow-sm">
                <div class="card-body">

                    <table class="table table-bordered table-hover">
                        <thead class="table-dark">
                            <tr>
                                <th>No</th>
                                <th>Kode Transaksi</th>
                                <th>Penerima</th>
                                <th>Kurir</th>
                                <th>Layanan</th>
                                <th>No. Resi</th>
                                <th>Status</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>

                        <tbody>

                            <?php $__empty_1 = true; $__currentLoopData = $pengiriman; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $item): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); $__empty_1 = false; ?>

                            <tr>
                                <td><?php echo e($loop->iteration); ?></td>

                                <td><?php echo e($item->transaksi->kode_transaksi ?? '-'); ?></td>

                                <td><?php echo e($item->transaksi->nama_penerima ?? '-'); ?></td>

                                <td><?php echo e($item->kurir); ?></td>

                                <td><?php echo e($item->layanan); ?></td>

                                <td><?php echo e($item->nomor_resi ?? '-'); ?></td>

                                <td>
                                    <span class="badge bg-primary">
                                        <?php echo e(ucfirst($item->status)); ?>

                                    </span>
                                </td>

                               <td>
                                    <a href="<?php echo e(route('admin.pengiriman.edit', $item->transaksi_id)); ?>"
                                    class="btn btn-warning btn-sm">
                                        <i class="bi bi-pencil"></i> Edit
                                    </a>

                                    <a href="<?php echo e(route('admin.pengiriman.label', $item->id)); ?>"
                                    class="btn btn-info btn-sm"
                                    target="_blank">
                                        <i class="bi bi-printer"></i> Label
                                    </a>
                                </td>

                            </tr>

                            <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); if ($__empty_1): ?>

                            <tr>
                                <td colspan="8" class="text-center">
                                    Belum ada data pengiriman.
                                </td>
                            </tr>

                            <?php endif; ?>

                        </tbody>

                    </table>

                </div>
            </div>

        </div>
        <?php $__env->stopSection(); ?>
<?php echo $__env->make('layouts.app', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?><?php /**PATH C:\xampp\htdocs\BrandForge\resources\views/admin/pengiriman/index.blade.php ENDPATH**/ ?>