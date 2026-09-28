    

    <?php $__env->startSection('title', 'Detail Transaksi'); ?>

    <?php $__env->startSection('content'); ?>

    <div class="container mt-4">

        <div class="d-flex justify-content-between align-items-center mb-3">
            <h2>Detail Transaksi</h2>

            <a href="<?php echo e(route('kasir.riwayat')); ?>" class="btn btn-secondary">
                Kembali
            </a>
        </div>

        <div class="card mb-4">
            <div class="card-header">
                Informasi Transaksi
            </div>

            <div class="card-body">

                <table class="table table-bordered">

                    <tr>
                        <th width="250">Kode Transaksi</th>
                        <td><?php echo e($transaksi->kode_transaksi); ?></td>
                    </tr>

                    <tr>
                        <th>Tanggal</th>
                        <td>
                            <?php echo e(\Carbon\Carbon::parse($transaksi->tanggal_transaksi)->format('d-m-Y H:i')); ?>

                        </td>
                    </tr>

                    <tr>
                        <th>Kasir</th>
                        <td><?php echo e($transaksi->user->name); ?></td>
                    </tr>

                    <?php if($transaksi->nama_penerima): ?>

                        <tr>
                            <th>Nama Penerima</th>
                            <td><?php echo e($transaksi->nama_penerima); ?></td>
                        </tr>

                        <tr>
                            <th>No HP</th>
                            <td><?php echo e($transaksi->no_hp); ?></td>
                        </tr>

                        <tr>
                            <th>Alamat</th>
                            <td><?php echo e($transaksi->alamat); ?></td>
                        </tr>

                        <?php endif; ?>

                    <tr>
                        <th>Total Harga</th>
                        <td>
                            Rp <?php echo e(number_format($transaksi->total_harga, 0, ',', '.')); ?>

                        </td>
                    </tr>

                    <tr>
                        <th>Bayar</th>
                        <td>
                            Rp <?php echo e(number_format($transaksi->bayar, 0, ',', '.')); ?>

                        </td>
                    </tr>

                    <tr>
                        <th>Kembalian</th>
                        <td>
                            Rp <?php echo e(number_format($transaksi->kembalian, 0, ',', '.')); ?>

                        </td>
                    </tr>

                    <tr>
                        <th>Status Transaksi</th>
                        <td>
                            <?php if($transaksi->status == 'Menunggu Pembayaran'): ?>
                                <span class="badge bg-warning">Menunggu Pembayaran</span>
                            <?php elseif($transaksi->status == 'Diproses'): ?>
                                <span class="badge bg-info">Diproses</span>
                            <?php elseif($transaksi->status == 'Selesai'): ?>
                                <span class="badge bg-success">Selesai</span>
                            <?php else: ?>
                                <span class="badge bg-secondary"><?php echo e($transaksi->status); ?></span>
                            <?php endif; ?>
                        </td>
                    </tr>

                    <?php if($transaksi->pengiriman): ?>

                    <tr>
                        <th>Kurir</th>
                        <td><?php echo e($transaksi->pengiriman->kurir ?: '-'); ?></td>
                    </tr>

                    <tr>
                        <th>Layanan</th>
                        <td><?php echo e($transaksi->pengiriman->layanan ?: '-'); ?></td>
                    </tr>

                    <tr>
                        <th>Ongkir</th>
                        <td>
                            Rp <?php echo e(number_format($transaksi->pengiriman->ongkir,0,',','.')); ?>

                        </td>
                    </tr>

                    <tr>
                        <th>Nomor Resi</th>
                        <td>
                            <?php echo e($transaksi->pengiriman->nomor_resi ?: '-'); ?>

                        </td>
                    </tr>

                    <tr>
                            <th>Status Pengiriman</th>
                            <td>
                                <?php if($transaksi->pengiriman->status == 'menunggu'): ?>
                                    <span class="badge bg-warning">Menunggu</span>
                                <?php elseif($transaksi->pengiriman->status == 'dikirim'): ?>
                                    <span class="badge bg-success">Dikirim</span>
                                <?php else: ?>
                                    <span class="badge bg-secondary">
                                        <?php echo e(ucfirst($transaksi->pengiriman->status)); ?>

                                    </span>
                                <?php endif; ?>
                            </td>
                        </tr>

                        <?php if(!empty($transaksi->pengiriman->catatan)): ?>
                        <tr>
                            <th>Catatan</th>
                            <td><?php echo e($transaksi->pengiriman->catatan); ?></td>
                        </tr>
                        <?php endif; ?>

                    <?php endif; ?>

                </table>

            </div>
        </div>

        <div class="card">

            <div class="card-header">
                Detail Barang
            </div>

            <div class="card-body">

                <div class="table-responsive">

                    <table class="table table-bordered table-striped">

                        <thead class="table-dark">
                            <tr>
                                <th>No</th>
                                <th>Produk</th>
                                <th>Ukuran</th>
                                <th>Warna</th>
                                <th>Harga</th>
                                <th>Jumlah</th>
                                <th>Subtotal</th>
                            </tr>
                        </thead>

                        <tbody>

                        <?php $__currentLoopData = $transaksi->detailTransaksi; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $detail): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>

                            <tr>

                                <td><?php echo e($loop->iteration); ?></td>

                                <td><?php echo e($detail->produk->nama_produk); ?></td>

                            <td><?php echo e($detail->stok->ukuran->nama_ukuran ?? '-'); ?></td>

                            <td><?php echo e($detail->stok->warna->nama_warna ?? '-'); ?></td>
                                <td>
                                    Rp <?php echo e(number_format($detail->harga, 0, ',', '.')); ?>

                                </td>

                                <td><?php echo e($detail->jumlah); ?></td>

                                <td>
                                    Rp <?php echo e(number_format($detail->subtotal, 0, ',', '.')); ?>

                                </td>

                            </tr>

                            <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>

                        </tbody>

                        <tfoot>

                        <tr>
                            <th colspan="6" class="text-end">
                                Total Barang
                            </th>
                            <th>
                                Rp <?php echo e(number_format($transaksi->total_harga,0,',','.')); ?>

                            </th>
                        </tr>

                        <?php if($transaksi->pengiriman): ?>

                        <tr>
                            <th colspan="6" class="text-end">
                                Ongkir
                            </th>
                            <th>
                                Rp <?php echo e(number_format($transaksi->pengiriman->ongkir ?? 0,0,',','.')); ?>

                            </th>
                        </tr>

                    <?php
                        $grandTotal = $transaksi->total_harga + ($transaksi->pengiriman->ongkir ?? 0);
                    ?>

                    <tr class="table-success">
                        <th colspan="6" class="text-end">
                            Grand Total
                        </th>
                        <th>
                            Rp <?php echo e(number_format($grandTotal, 0, ',', '.')); ?>

                        </th>
                    </tr>

                        <?php endif; ?>

                        </tfoot>

                    </table>

                </div>

            </div>

        </div>

        <div class="mt-3">
        <a href="<?php echo e(route('kasir.struk', $transaksi->id)); ?>"
            class="btn btn-primary"
            target="_blank">
            Cetak Struk
        </a>
        </div>

    </div>

    <?php $__env->stopSection(); ?>
<?php echo $__env->make('layouts.app', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?><?php /**PATH C:\xampp\htdocs\BrandForge\resources\views/kasir/detail.blade.php ENDPATH**/ ?>