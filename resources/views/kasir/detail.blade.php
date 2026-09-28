    @extends('layouts.app')

    @section('title', 'Detail Transaksi')

    @section('content')

    <div class="container mt-4">

        <div class="d-flex justify-content-between align-items-center mb-3">
            <h2>Detail Transaksi</h2>

            <a href="{{ route('kasir.riwayat') }}" class="btn btn-secondary">
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
                        <td>{{ $transaksi->kode_transaksi }}</td>
                    </tr>

                    <tr>
                        <th>Tanggal</th>
                        <td>
                            {{ \Carbon\Carbon::parse($transaksi->tanggal_transaksi)->format('d-m-Y H:i') }}
                        </td>
                    </tr>

                    <tr>
                        <th>Kasir</th>
                        <td>{{ $transaksi->user->name }}</td>
                    </tr>

                    @if($transaksi->nama_penerima)

                        <tr>
                            <th>Nama Penerima</th>
                            <td>{{ $transaksi->nama_penerima }}</td>
                        </tr>

                        <tr>
                            <th>No HP</th>
                            <td>{{ $transaksi->no_hp }}</td>
                        </tr>

                        <tr>
                            <th>Alamat</th>
                            <td>{{ $transaksi->alamat }}</td>
                        </tr>

                        @endif

                    <tr>
                        <th>Total Harga</th>
                        <td>
                            Rp {{ number_format($transaksi->total_harga, 0, ',', '.') }}
                        </td>
                    </tr>

                    <tr>
                        <th>Bayar</th>
                        <td>
                            Rp {{ number_format($transaksi->bayar, 0, ',', '.') }}
                        </td>
                    </tr>

                    <tr>
                        <th>Kembalian</th>
                        <td>
                            Rp {{ number_format($transaksi->kembalian, 0, ',', '.') }}
                        </td>
                    </tr>

                    <tr>
                        <th>Status Transaksi</th>
                        <td>
                            @if($transaksi->status == 'Menunggu Pembayaran')
                                <span class="badge bg-warning">Menunggu Pembayaran</span>
                            @elseif($transaksi->status == 'Diproses')
                                <span class="badge bg-info">Diproses</span>
                            @elseif($transaksi->status == 'Selesai')
                                <span class="badge bg-success">Selesai</span>
                            @else
                                <span class="badge bg-secondary">{{ $transaksi->status }}</span>
                            @endif
                        </td>
                    </tr>

                    @if($transaksi->pengiriman)

                    <tr>
                        <th>Kurir</th>
                        <td>{{ $transaksi->pengiriman->kurir ?: '-' }}</td>
                    </tr>

                    <tr>
                        <th>Layanan</th>
                        <td>{{ $transaksi->pengiriman->layanan ?: '-' }}</td>
                    </tr>

                    <tr>
                        <th>Ongkir</th>
                        <td>
                            Rp {{ number_format($transaksi->pengiriman->ongkir,0,',','.') }}
                        </td>
                    </tr>

                    <tr>
                        <th>Nomor Resi</th>
                        <td>
                            {{ $transaksi->pengiriman->nomor_resi ?: '-' }}
                        </td>
                    </tr>

                    <tr>
                            <th>Status Pengiriman</th>
                            <td>
                                @if($transaksi->pengiriman->status == 'menunggu')
                                    <span class="badge bg-warning">Menunggu</span>
                                @elseif($transaksi->pengiriman->status == 'dikirim')
                                    <span class="badge bg-success">Dikirim</span>
                                @else
                                    <span class="badge bg-secondary">
                                        {{ ucfirst($transaksi->pengiriman->status) }}
                                    </span>
                                @endif
                            </td>
                        </tr>

                        @if(!empty($transaksi->pengiriman->catatan))
                        <tr>
                            <th>Catatan</th>
                            <td>{{ $transaksi->pengiriman->catatan }}</td>
                        </tr>
                        @endif

                    @endif

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

                        @foreach($transaksi->detailTransaksi as $detail)

                            <tr>

                                <td>{{ $loop->iteration }}</td>

                                <td>{{ $detail->produk->nama_produk }}</td>

                            <td>{{ $detail->stok->ukuran->nama_ukuran ?? '-' }}</td>

                            <td>{{ $detail->stok->warna->nama_warna ?? '-' }}</td>
                                <td>
                                    Rp {{ number_format($detail->harga, 0, ',', '.') }}
                                </td>

                                <td>{{ $detail->jumlah }}</td>

                                <td>
                                    Rp {{ number_format($detail->subtotal, 0, ',', '.') }}
                                </td>

                            </tr>

                            @endforeach

                        </tbody>

                        <tfoot>

                        <tr>
                            <th colspan="6" class="text-end">
                                Total Barang
                            </th>
                            <th>
                                Rp {{ number_format($transaksi->total_harga,0,',','.') }}
                            </th>
                        </tr>

                        @if($transaksi->pengiriman)

                        <tr>
                            <th colspan="6" class="text-end">
                                Ongkir
                            </th>
                            <th>
                                Rp {{ number_format($transaksi->pengiriman->ongkir ?? 0,0,',','.') }}
                            </th>
                        </tr>

                    @php
                        $grandTotal = $transaksi->total_harga + ($transaksi->pengiriman->ongkir ?? 0);
                    @endphp

                    <tr class="table-success">
                        <th colspan="6" class="text-end">
                            Grand Total
                        </th>
                        <th>
                            Rp {{ number_format($grandTotal, 0, ',', '.') }}
                        </th>
                    </tr>

                        @endif

                        </tfoot>

                    </table>

                </div>

            </div>

        </div>

        <div class="mt-3">
        <a href="{{ route('kasir.struk', $transaksi->id) }}"
            class="btn btn-primary"
            target="_blank">
            Cetak Struk
        </a>
        </div>

    </div>

    @endsection