<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Label Pengiriman</title>

    <style>
        body{
            font-family: Arial, Helvetica, sans-serif;
            background:#f2f2f2;
        }

        .label{
            width:700px;
            margin:30px auto;
            background:#fff;
            border:2px solid #000;
            padding:25px;
        }

        h2{
            text-align:center;
            margin-bottom:20px;
        }

        table{
            width:100%;
            border-collapse:collapse;
        }

        td{
            padding:8px;
            vertical-align:top;
        }

        .judul{
            width:180px;
            font-weight:bold;
        }

        .footer{
            margin-top:30px;
            text-align:center;
            font-size:13px;
        }

        .barcode{
            margin-top:25px;
            text-align:center;
            font-size:24px;
            font-weight:bold;
            letter-spacing:4px;
        }

        @media print{

            .btn-print{
                display:none;
            }

            body{
                background:#fff;
            }

            .label{
                border:none;
                width:100%;
                margin:0;
            }
        }
    </style>
</head>

<body>

<div style="text-align:center;margin-bottom:20px;" class="btn-print">
    <button onclick="window.print()">
        🖨 Cetak Label
    </button>
</div>

<div class="label">

    <h2>LABEL PENGIRIMAN</h2>

    <table>

        <tr>
            <td class="judul">Kode Transaksi</td>
            <td>: {{ $pengiriman->transaksi->kode_transaksi }}</td>
        </tr>

        <tr>
            <td class="judul">Penerima</td>
            <td>: {{ $pengiriman->transaksi->nama_penerima }}</td>
        </tr>

        <tr>
            <td class="judul">No. HP</td>
            <td>: {{ $pengiriman->transaksi->no_hp }}</td>
        </tr>

        <tr>
            <td class="judul">Alamat</td>
            <td>: {{ $pengiriman->transaksi->alamat }}</td>
        </tr>

        <tr>
            <td class="judul">Kurir</td>
            <td>: {{ $pengiriman->kurir }}</td>
        </tr>

        <tr>
            <td class="judul">Layanan</td>
            <td>: {{ $pengiriman->layanan }}</td>
        </tr>

        <tr>
            <td class="judul">Nomor Resi</td>
            <td>: {{ $pengiriman->nomor_resi ?? '-' }}</td>
        </tr>

        <tr>
            <td class="judul">Status</td>
            <td>: {{ ucfirst($pengiriman->status) }}</td>
        </tr>

    </table>

    <div class="barcode">
        *{{ $pengiriman->transaksi->kode_transaksi }}*
    </div>

    <div class="footer">
        <strong>BrandForge Clothing Store</strong><br>
        Cetak:
        {{ now()->format('d-m-Y H:i') }}
    </div>

</div>

<script>
window.onload = function(){
    window.print();
}
</script>

</body>
</html>