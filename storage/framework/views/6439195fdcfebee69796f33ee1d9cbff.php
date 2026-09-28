

<?php $__env->startSection('title','Riwayat Pesanan'); ?>

<?php $__env->startSection('content'); ?>

<div class="d-flex justify-content-between align-items-center mb-3">
    <h2>Riwayat Pesanan</h2>
    
    <a href="<?php echo e(route('pelanggan.index')); ?>" class="btn btn-secondary">
        ← Kembali ke Dashboard
    </a>
</div>

<table class="table table-bordered">

<thead>
<tr>
    <th>No</th>
    <th>Kode</th>
    <th>Tanggal</th>
    <th>Total</th>
    <th>Ongkir</th>
    <th>Kurir</th>
    <th>Layanan</th>
    <th>Resi</th>
    <th>Status Pengiriman</th>
    <th>Status Pesanan</th>
    <th>Aksi</th>
</tr>
</thead>

<tbody>

<?php $__empty_1 = true; $__currentLoopData = $transaksis; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $transaksi): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); $__empty_1 = false; ?>

<tr>

<td><?php echo e($loop->iteration); ?></td>

<td><?php echo e($transaksi->kode_transaksi); ?></td>

<td><?php echo e($transaksi->tanggal_transaksi); ?></td>

<td>Rp <?php echo e(number_format($transaksi->total_harga)); ?></td>

<td>
    Rp <?php echo e(number_format($transaksi->ongkir,0,',','.')); ?>

</td>

<td>
    <?php if($transaksi->pengiriman): ?>
        <?php echo e($transaksi->pengiriman->kurir); ?>

    <?php else: ?>
        -
    <?php endif; ?>
</td>


<td>
    <?php if($transaksi->pengiriman): ?>
        <?php echo e($transaksi->pengiriman->layanan); ?>

    <?php else: ?>
        -
    <?php endif; ?>
</td>


<td>
    <?php if($transaksi->pengiriman && $transaksi->pengiriman->nomor_resi): ?>

        <?php echo e($transaksi->pengiriman->nomor_resi); ?>


    <?php else: ?>

        Belum tersedia

    <?php endif; ?>
</td>


<td>

<?php if($transaksi->pengiriman): ?>

    <?php if($transaksi->pengiriman->status == 'menunggu'): ?>

        <span class="badge bg-warning">
            Menunggu
        </span>

    <?php elseif($transaksi->pengiriman->status == 'diproses'): ?>

        <span class="badge bg-info">
            Diproses
        </span>

    <?php elseif($transaksi->pengiriman->status == 'dikemas'): ?>

        <span class="badge bg-primary">
            Dikemas
        </span>

    <?php elseif($transaksi->pengiriman->status == 'dikirim'): ?>

        <span class="badge bg-success">
            Dikirim
        </span>

    <?php elseif($transaksi->pengiriman->status == 'selesai'): ?>

        <span class="badge bg-dark">
            Selesai
        </span>

    <?php endif; ?>

<?php else: ?>

    -

<?php endif; ?>

</td>

<td>
    <?php if($transaksi->status == 'Belum Bayar'): ?>

        <span class="badge bg-warning">
            Belum Bayar
        </span>

    <?php elseif($transaksi->status == 'Menunggu Verifikasi'): ?>

        <span class="badge bg-secondary">
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

    <?php endif; ?>
</td>

<td>

    <?php if($transaksi->status == 'Selesai'): ?>
        <button
            class="btn btn-success btn-sm mb-1"
            data-bs-toggle="modal"
            data-bs-target="#uploadFoto<?php echo e($transaksi->id); ?>">
            Upload Foto Produk
        </button>

    <?php $__currentLoopData = $transaksi->detailTransaksi; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $detail): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>

            <a href="<?php echo e(route('pelanggan.review.create', $detail->id)); ?>"
               class="btn btn-warning btn-sm mb-1">
                ⭐ Beri Ulasan
            </a>

        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>

    <?php endif; ?>

    <form action="<?php echo e(route('pelanggan.destroyTransaksi',$transaksi->id)); ?>"
          method="POST"
          onsubmit="return confirm('Yakin ingin menghapus pesanan ini?')">

        <?php echo csrf_field(); ?>
        <?php echo method_field('DELETE'); ?>

        <button class="btn btn-danger btn-sm">
            Hapus
        </button>

    </form>

</td>

</tr>

<!-- Modal Upload -->
<div class="modal fade" id="uploadFoto<?php echo e($transaksi->id); ?>">
    <div class="modal-dialog">
        <div class="modal-content">

            <form action="<?php echo e(route('pelanggan.uploadFotoProduk',$transaksi->id)); ?>"
                  method="POST"
                  enctype="multipart/form-data">

                <?php echo csrf_field(); ?>

                <div class="modal-header">
                    <h5 class="modal-title">Upload Foto Produk</h5>
                    <button type="button"
                            class="btn-close"
                            data-bs-dismiss="modal"></button>
                </div>

                <div class="modal-body">
                    <input type="file"
                           name="foto_produk"
                           class="form-control"
                           accept=".jpg,.jpeg,.png"
                           required>
                </div>

                <div class="modal-footer">
                    <button type="button"
                            class="btn btn-secondary"
                            data-bs-dismiss="modal">
                        Batal
                    </button>

                    <button type="submit"
                            class="btn btn-primary">
                        Upload
                    </button>
                </div>

            </form>

        </div>
    </div>
</div>

<?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); if ($__empty_1): ?>

<tr>
    <td colspan="11" class="text-center">
        Belum ada transaksi
    </td>
</tr>

<?php endif; ?>

</tbody>

</table>

</div>

<?php $__env->stopSection(); ?>
<?php echo $__env->make('layouts.app', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?><?php /**PATH C:\xampp\htdocs\BrandForge\resources\views/pelanggan/riwayat.blade.php ENDPATH**/ ?>