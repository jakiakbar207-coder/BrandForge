<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Struk Transaksi</title>

    <style>
        body{
            font-family: Arial, Helvetica, sans-serif;
            font-size: 13px;
            margin: 20px;
        }

        .text-center{
            text-align: center;
        }

        table{
            width:100%;
            border-collapse: collapse;
            margin-top:10px;
        }

        table th,
        table td{
            border:1px solid #000;
            padding:6px;
        }

        hr{
            margin:15px 0;
        }
    </style>
</head>
<body onload="window.print()">

<div class="text-center">
    <h2>BrandForge</h2>
    <p>Struk Pembelian</p>
</div>

<hr>

<table>
    <tr>
        <td width="35%">Kode Transaksi</td>
        <td>: {{ $transaksi->kode_transaksi }}</td>
    </tr>

    <tr>
        <td>Tanggal</td>
        <td>: {{ $transaksi->tanggal_transaksi }}</td>
    </tr>

    <tr>
        <td>Kasir</td>
        <td>: {{ $transaksi->user->name }}</td>
    </tr>
</table>

<br>

<table>
    <thead>
        <tr>
            <th>No</th>
            <th>Produk</th>
            <th>Ukuran</th>
            <th>Warna</th>
            <th>Harga</th>
            <th>Qty</th>
            <th>Subtotal</th>
        </tr>
    </thead>

    <tbody>

    @foreach($transaksi->detailTransaksi as $detail)

        <tr>
            <td>{{ $loop->iteration }}</td>

            <td>{{ $detail->produk->nama_produk }}</td>

            <td>{{ $detail->stok->ukuran->nama_ukuran }}</td>

            <td>{{ $detail->stok->warna->nama_warna }}</td>

            <td>
                Rp {{ number_format($detail->harga,0,',','.') }}
            </td>

            <td>{{ $detail->jumlah }}</td>

            <td>
                Rp {{ number_format($detail->subtotal,0,',','.') }}
            </td>
        </tr>

    @endforeach

    </tbody>
</table>

<br>

<table>
    <tr>
        <td width="35%">Total</td>
        <td>
            Rp {{ number_format($transaksi->total_harga,0,',','.') }}
        </td>
    </tr>

    <tr>
        <td>Bayar</td>
        <td>
            Rp {{ number_format($transaksi->bayar,0,',','.') }}
        </td>
    </tr>

    <tr>
        <td>Kembalian</td>
        <td>
            Rp {{ number_format($transaksi->kembalian,0,',','.') }}
        </td>
    </tr>
</table>

<hr>

<div class="text-center">
    <p>Terima kasih telah berbelanja di <strong>BrandForge</strong></p>
</div>

</body>
</html>