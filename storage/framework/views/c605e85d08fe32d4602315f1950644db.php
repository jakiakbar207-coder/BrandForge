<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Laporan BrandForge</title>

    <style>
        body{
            font-family: Arial, sans-serif;
            font-size:12px;
        }

        h2,h3{
            text-align:center;
            margin:5px 0;
        }

        table{
            width:100%;
            border-collapse:collapse;
            margin-top:10px;
        }

        table,th,td{
            border:1px solid #000;
        }

        th{
            background:#f2f2f2;
            text-align:center;
            padding:8px;
        }

        td{
            padding:6px;
        }

        .info{
            margin-top:15px;
            margin-bottom:15px;
        }

        .info table td{
            border:none;
            padding:4px;
        }

        hr{
            margin:15px 0;
        }
    </style>

</head>
<body>

<h2>BRANDFORGE</h2>
<h3>Laporan Dashboard Owner</h3>

<hr>

<div class="info">

<table>

<tr>
    <td width="35%"><strong>Total Pendapatan</strong></td>
    <td>Rp <?php echo e(number_format($totalPendapatan,0,',','.')); ?></td>
</tr>

<tr>
    <td><strong>Jumlah Order</strong></td>
    <td><?php echo e($jumlahOrder); ?></td>
</tr>

<tr>
    <td><strong>Produk Terjual</strong></td>
    <td><?php echo e($produkTerjual); ?></td>
</tr>

<tr>
    <td><strong>Jumlah Pelanggan</strong></td>
    <td><?php echo e($jumlahPelanggan); ?></td>
</tr>

<tr>
    <td><strong>Penjualan</strong></td>
    <td>Rp <?php echo e(number_format($penjualan,0,',','.')); ?></td>
</tr>

<tr>
    <td><strong>Modal Produk</strong></td>
    <td>Rp <?php echo e(number_format($modalProduk,0,',','.')); ?></td>
</tr>

<tr>
    <td><strong>Biaya Operasional</strong></td>
    <td>Rp <?php echo e(number_format($biayaOperasional,0,',','.')); ?></td>
</tr>

<tr>
    <td><strong>Laba Bersih</strong></td>
    <td>
        <strong>
            Rp <?php echo e(number_format($labaBersih,0,',','.')); ?>

        </strong>
    </td>
</tr>

</table>

</div>

<hr>

<h3>Data Transaksi</h3>

<table>

<thead>

<tr>
    <th>No</th>
    <th>Kode</th>
    <th>Pelanggan</th>
    <th>Tanggal</th>
    <th>Total</th>
    <th>Bayar</th>
    <th>Kembalian</th>
    <th>Status</th>
</tr>

</thead>

<tbody>

<?php $__empty_1 = true; $__currentLoopData = $transaksi; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $item): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); $__empty_1 = false; ?>

<tr>

<td><?php echo e($loop->iteration); ?></td>

<td><?php echo e($item->kode_transaksi); ?></td>

<td><?php echo e($item->nama_penerima); ?></td>

<td><?php echo e($item->tanggal_transaksi); ?></td>

<td>
Rp <?php echo e(number_format($item->total_harga,0,',','.')); ?>

</td>

<td>
Rp <?php echo e(number_format($item->bayar,0,',','.')); ?>

</td>

<td>
Rp <?php echo e(number_format($item->kembalian,0,',','.')); ?>

</td>

<td><?php echo e(ucfirst($item->status)); ?></td>

</tr>

<?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); if ($__empty_1): ?>

<tr>

<td colspan="8" style="text-align:center">
Tidak ada data transaksi

</td>

</tr>

<?php endif; ?>

</tbody>

</table>

</body>
</html><?php /**PATH C:\xampp\htdocs\BrandForge\resources\views/laporan/pdf.blade.php ENDPATH**/ ?>