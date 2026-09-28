@extends('layouts.app')

@section('title','Riwayat Pesanan')

@section('content')

<div class="d-flex justify-content-between align-items-center mb-3">
    <h2>Riwayat Pesanan</h2>
    
    <a href="{{ route('pelanggan.index') }}" class="btn btn-secondary">
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

@forelse($transaksis as $transaksi)

<tr>

<td>{{ $loop->iteration }}</td>

<td>{{ $transaksi->kode_transaksi }}</td>

<td>{{ $transaksi->tanggal_transaksi }}</td>

<td>Rp {{ number_format($transaksi->total_harga) }}</td>

<td>
    Rp {{ number_format($transaksi->ongkir,0,',','.') }}
</td>

<td>
    @if($transaksi->pengiriman)
        {{ $transaksi->pengiriman->kurir }}
    @else
        -
    @endif
</td>


<td>
    @if($transaksi->pengiriman)
        {{ $transaksi->pengiriman->layanan }}
    @else
        -
    @endif
</td>


<td>
    @if($transaksi->pengiriman && $transaksi->pengiriman->nomor_resi)

        {{ $transaksi->pengiriman->nomor_resi }}

    @else

        Belum tersedia

    @endif
</td>


<td>

@if($transaksi->pengiriman)

    @if($transaksi->pengiriman->status == 'menunggu')

        <span class="badge bg-warning">
            Menunggu
        </span>

    @elseif($transaksi->pengiriman->status == 'diproses')

        <span class="badge bg-info">
            Diproses
        </span>

    @elseif($transaksi->pengiriman->status == 'dikemas')

        <span class="badge bg-primary">
            Dikemas
        </span>

    @elseif($transaksi->pengiriman->status == 'dikirim')

        <span class="badge bg-success">
            Dikirim
        </span>

    @elseif($transaksi->pengiriman->status == 'selesai')

        <span class="badge bg-dark">
            Selesai
        </span>

    @endif

@else

    -

@endif

</td>

<td>
    @if($transaksi->status == 'Belum Bayar')

        <span class="badge bg-warning">
            Belum Bayar
        </span>

    @elseif($transaksi->status == 'Menunggu Verifikasi')

        <span class="badge bg-secondary">
            Menunggu Verifikasi
        </span>

    @elseif($transaksi->status == 'Diproses')

        <span class="badge bg-info">
            Diproses
        </span>

    @elseif($transaksi->status == 'Selesai')

        <span class="badge bg-success">
            Selesai
        </span>

    @endif
</td>

<td>

    @if($transaksi->status == 'Selesai')
        <button
            class="btn btn-success btn-sm mb-1"
            data-bs-toggle="modal"
            data-bs-target="#uploadFoto{{ $transaksi->id }}">
            Upload Foto Produk
        </button>

    @foreach($transaksi->detailTransaksi as $detail)

            <a href="{{ route('pelanggan.review.create', $detail->id) }}"
               class="btn btn-warning btn-sm mb-1">
                ⭐ Beri Ulasan
            </a>

        @endforeach

    @endif

    <form action="{{ route('pelanggan.destroyTransaksi',$transaksi->id) }}"
          method="POST"
          onsubmit="return confirm('Yakin ingin menghapus pesanan ini?')">

        @csrf
        @method('DELETE')

        <button class="btn btn-danger btn-sm">
            Hapus
        </button>

    </form>

</td>

</tr>

<!-- Modal Upload -->
<div class="modal fade" id="uploadFoto{{ $transaksi->id }}">
    <div class="modal-dialog">
        <div class="modal-content">

            <form action="{{ route('pelanggan.uploadFotoProduk',$transaksi->id) }}"
                  method="POST"
                  enctype="multipart/form-data">

                @csrf

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

@empty

<tr>
    <td colspan="11" class="text-center">
        Belum ada transaksi
    </td>
</tr>

@endforelse

</tbody>

</table>

</div>

@endsection