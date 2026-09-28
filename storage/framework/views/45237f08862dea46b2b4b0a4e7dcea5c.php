

<?php $__env->startSection('title', 'Riwayat Transaksi'); ?>

<?php $__env->startSection('content'); ?>

<div class="container mt-4">

    <div class="d-flex justify-content-between align-items-center mb-3">
        <h2>Riwayat Transaksi</h2>

        <a href="<?php echo e(route('kasir.index')); ?>" class="btn btn-secondary">
            Kembali
        </a>
    </div>

    <?php if(session('success')): ?>
        <div class="alert alert-success">
            <?php echo e(session('success')); ?>

        </div>
    <?php endif; ?>

    <div class="card">
        <div class="card-body">

            <div class="table-responsive">

                <table class="table table-bordered table-striped">

                    <thead class="table-dark">
                        <tr>
                            <th>No</th>
                            <th>Kode</th>
                            <th>Tanggal</th>
                            <th>Pelanggan</th>
                            <th>Total</th>
                            <th>Bayar</th>
                            <th>Kembalian</th>
                            <th>Status</th>
                            <th>Pengiriman</th>
                            <th>Aksi</th>
                            </tr>
                    </thead>

                    <tbody>

                        <?php $__empty_1 = true; $__currentLoopData = $transaksis; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $transaksi): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); $__empty_1 = false; ?>

                        <tr>
                            <td><?php echo e($loop->iteration); ?></td>

                            <td><?php echo e($transaksi->kode_transaksi); ?></td>

                            <td><?php echo e($transaksi->tanggal_transaksi); ?></td>

                            <td><?php echo e($transaksi->nama_penerima); ?></td>

                            <td>
                                Rp <?php echo e(number_format($transaksi->total_harga, 0, ',', '.')); ?>

                            </td>

                            <td>
                                Rp <?php echo e(number_format($transaksi->bayar, 0, ',', '.')); ?>

                            </td>

                            <td>
                                Rp <?php echo e(number_format($transaksi->kembalian, 0, ',', '.')); ?>

                            </td>

                          <td>
                                <?php if($transaksi->status == 'Menunggu Verifikasi'): ?>
                                    <span class="badge bg-warning">
                                        Menunggu Verifikasi
                                    </span>

                                <?php elseif($transaksi->status == 'Diproses'): ?>
                                    <span class="badge bg-info">
                                        Diproses
                                    </span>

                                <?php elseif($transaksi->status == 'Selesai'): ?>
                                    <span class="badge bg-success">
                                        Selesai
                                    </span>

                                <?php else: ?>
                                    <span class="badge bg-secondary">
                                        <?php echo e($transaksi->status); ?>

                                    </span>
                                <?php endif; ?>
                            </td>

                            <td>

                                <?php if(
                                    $transaksi->pengiriman &&
                                    in_array($transaksi->status, ['Diproses','Selesai'])
                                ): ?>

                                    <div class="mb-2">
                                        <strong>Status:</strong>
                                       <?php if($transaksi->pengiriman->status == 'menunggu'): ?>
                                            <span class="badge bg-warning">Menunggu</span>

                                        <?php elseif($transaksi->pengiriman->status == 'diproses'): ?>
                                            <span class="badge bg-info">Diproses</span>

                                        <?php elseif($transaksi->pengiriman->status == 'dikemas'): ?>
                                            <span class="badge bg-primary">Dikemas</span>

                                        <?php elseif($transaksi->pengiriman->status == 'dikirim'): ?>
                                            <span class="badge bg-success">Dikirim</span>

                                        <?php elseif($transaksi->pengiriman->status == 'selesai'): ?>
                                            <span class="badge bg-dark">Selesai</span>

                                        <?php else: ?>
                                            <span class="badge bg-secondary">
                                                <?php echo e(ucfirst($transaksi->pengiriman->status)); ?>

                                            </span>
                                        <?php endif; ?>
                                    </div>
                                    <div class="mb-2">

                                        <label>Kurir</label>

                                        <input
                                            type="text"
                                            class="form-control form-control-sm"
                                            value="<?php echo e($transaksi->pengiriman->kurir); ?>"
                                            readonly>

                                        </div>

                                            <div class="mb-2">

                                                <strong>Ongkir:</strong>

                                                Rp <?php echo e(number_format($transaksi->pengiriman->ongkir,0,',','.')); ?>


                                                </div>

                                                <div class="mb-2">
                                                        <strong>Layanan:</strong><br>

                                                        <?php echo e($transaksi->pengiriman->layanan ?: '-'); ?>

                                                    </div>

                                                <div class="mb-2">
                                                        <strong>Resi:</strong><br>

                                                        <?php if($transaksi->pengiriman->nomor_resi): ?>
                                                            <?php echo e($transaksi->pengiriman->nomor_resi); ?>

                                                        <?php else: ?>
                                                            <span class="text-muted">Belum ada</span>
                                                        <?php endif; ?>
                                                    </div>

                                    <?php if($transaksi->pengiriman->status != 'selesai'): ?>

                                    <form action="<?php echo e(route('kasir.pengiriman.resi',$transaksi->id)); ?>"
                                        method="POST"
                                        class="mb-2">

                                        <?php echo csrf_field(); ?>
                                        <?php echo method_field('PUT'); ?>

                                        <input type="text"
                                            name="nomor_resi"
                                            class="form-control form-control-sm"
                                            value="<?php echo e($transaksi->pengiriman->nomor_resi); ?>"
                                            placeholder="Nomor Resi">

                                        <button class="btn btn-primary btn-sm mt-1 w-100">
                                            Simpan Resi
                                        </button>

                                    </form>

                                    <?php endif; ?>
                                  <?php if($transaksi->pengiriman->status != 'selesai'): ?>
                                       <form action="<?php echo e(route('kasir.pengiriman.status',$transaksi->id)); ?>"
                                    method="POST">

                                    <?php echo csrf_field(); ?>
                                    <?php echo method_field('PUT'); ?>

                                    <select name="status"
                                        class="form-select form-select-sm mb-2"
                                        required>

                                        <option value="menunggu"
                                            <?php echo e($transaksi->pengiriman->status == 'menunggu' ? 'selected' : ''); ?>>
                                            Menunggu
                                        </option>

                                        <option value="diproses"
                                            <?php echo e($transaksi->pengiriman->status == 'diproses' ? 'selected' : ''); ?>>
                                            Diproses
                                        </option>

                                        <option value="dikemas"
                                            <?php echo e($transaksi->pengiriman->status == 'dikemas' ? 'selected' : ''); ?>>
                                            Dikemas
                                        </option>

                                        <option value="dikirim"
                                            <?php echo e($transaksi->pengiriman->status == 'dikirim' ? 'selected' : ''); ?>>
                                            Dikirim
                                        </option>

                                        <option value="selesai"
                                            <?php echo e($transaksi->pengiriman->status == 'selesai' ? 'selected' : ''); ?>>
                                            Selesai
                                        </option>

                                    </select>

                                    <button class="btn btn-success btn-sm w-100">
                                        Simpan Status
                                    </button>

                                </form>
                                <?php else: ?>

                                    <span class="text-muted">
                                        Belum ada data
                                    </span>

                                <?php endif; ?>

                            <?php endif; ?>   

                            </td>


                    <td>

                <a href="<?php echo e(route('kasir.detail',$transaksi->id)); ?>"
                    class="btn btn-info btn-sm mb-1">
                    Detail
                </a>

                <a href="<?php echo e(route('kasir.buktiPembayaran',$transaksi->id)); ?>"
                    class="btn btn-warning btn-sm mb-1">
                    Bukti Pembayaran
                </a>

                <a href="<?php echo e(route('kasir.buktiProduk',$transaksi->id)); ?>"
                    class="btn btn-secondary btn-sm mb-1">
                    Foto Produk
                </a>

                <?php if($transaksi->pembayaran && $transaksi->pembayaran->status == 'Menunggu Verifikasi'): ?>
                    <form action="<?php echo e(route('kasir.verifikasi',$transaksi->id)); ?>"
                        method="POST"
                        class="d-inline">

                        <?php echo csrf_field(); ?>
                        <?php echo method_field('PUT'); ?>

                        <button class="btn btn-primary btn-sm mb-1">
                            Verifikasi
                        </button>

                    </form>
                <?php endif; ?>

                <?php if($transaksi->bayar > 0 && $transaksi->status != 'Selesai'): ?>
                    <form action="<?php echo e(route('kasir.selesai',$transaksi->id)); ?>"
                        method="POST"
                        class="d-inline">

                        <?php echo csrf_field(); ?>
                        <?php echo method_field('PUT'); ?>

                        <button class="btn btn-success btn-sm mb-1">
                            Selesai
                        </button>

                    </form>
                <?php endif; ?>

                <form action="<?php echo e(route('kasir.destroy',$transaksi->id)); ?>"
                    method="POST"
                    onsubmit="return confirm('Hapus transaksi ini?')">

                    <?php echo csrf_field(); ?>
                    <?php echo method_field('DELETE'); ?>

                    <button class="btn btn-danger btn-sm">
                        Hapus
                    </button>

                </form>
    
            </td>

                        </tr>

                        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); if ($__empty_1): ?>

                        <tr>
                            <td colspan="10" class="text-center">
                                Belum ada transaksi.
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
<?php echo $__env->make('layouts.app', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?><?php /**PATH C:\xampp\htdocs\BrandForge\resources\views/kasir/riwayat.blade.php ENDPATH**/ ?>