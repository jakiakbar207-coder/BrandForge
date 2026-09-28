@extends('layouts.app')

@section('title', 'Riwayat Transaksi')

@section('content')

<div class="container mt-4">

    <div class="d-flex justify-content-between align-items-center mb-3">
        <h2>Riwayat Transaksi</h2>

        <a href="{{ route('kasir.index') }}" class="btn btn-secondary">
            Kembali
        </a>
    </div>

    @if(session('success'))
        <div class="alert alert-success">
            {{ session('success') }}
        </div>
    @endif

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

                        @forelse($transaksis as $transaksi)

                        <tr>
                            <td>{{ $loop->iteration }}</td>

                            <td>{{ $transaksi->kode_transaksi }}</td>

                            <td>{{ $transaksi->tanggal_transaksi }}</td>

                            <td>{{ $transaksi->nama_penerima }}</td>

                            <td>
                                Rp {{ number_format($transaksi->total_harga, 0, ',', '.') }}
                            </td>

                            <td>
                                Rp {{ number_format($transaksi->bayar, 0, ',', '.') }}
                            </td>

                            <td>
                                Rp {{ number_format($transaksi->kembalian, 0, ',', '.') }}
                            </td>

                          <td>
                                @if($transaksi->status == 'Menunggu Verifikasi')
                                    <span class="badge bg-warning">
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

                                @else
                                    <span class="badge bg-secondary">
                                        {{ $transaksi->status }}
                                    </span>
                                @endif
                            </td>

                            <td>

                                @if(
                                    $transaksi->pengiriman &&
                                    in_array($transaksi->status, ['Diproses','Selesai'])
                                )

                                    <div class="mb-2">
                                        <strong>Status:</strong>
                                       @if($transaksi->pengiriman->status == 'menunggu')
                                            <span class="badge bg-warning">Menunggu</span>

                                        @elseif($transaksi->pengiriman->status == 'diproses')
                                            <span class="badge bg-info">Diproses</span>

                                        @elseif($transaksi->pengiriman->status == 'dikemas')
                                            <span class="badge bg-primary">Dikemas</span>

                                        @elseif($transaksi->pengiriman->status == 'dikirim')
                                            <span class="badge bg-success">Dikirim</span>

                                        @elseif($transaksi->pengiriman->status == 'selesai')
                                            <span class="badge bg-dark">Selesai</span>

                                        @else
                                            <span class="badge bg-secondary">
                                                {{ ucfirst($transaksi->pengiriman->status) }}
                                            </span>
                                        @endif
                                    </div>
                                    <div class="mb-2">

                                        <label>Kurir</label>

                                        <input
                                            type="text"
                                            class="form-control form-control-sm"
                                            value="{{ $transaksi->pengiriman->kurir }}"
                                            readonly>

                                        </div>

                                            <div class="mb-2">

                                                <strong>Ongkir:</strong>

                                                Rp {{ number_format($transaksi->pengiriman->ongkir,0,',','.') }}

                                                </div>

                                                <div class="mb-2">
                                                        <strong>Layanan:</strong><br>

                                                        {{ $transaksi->pengiriman->layanan ?: '-' }}
                                                    </div>

                                                <div class="mb-2">
                                                        <strong>Resi:</strong><br>

                                                        @if($transaksi->pengiriman->nomor_resi)
                                                            {{ $transaksi->pengiriman->nomor_resi }}
                                                        @else
                                                            <span class="text-muted">Belum ada</span>
                                                        @endif
                                                    </div>

                                    @if($transaksi->pengiriman->status != 'selesai')

                                    <form action="{{ route('kasir.pengiriman.resi',$transaksi->id) }}"
                                        method="POST"
                                        class="mb-2">

                                        @csrf
                                        @method('PUT')

                                        <input type="text"
                                            name="nomor_resi"
                                            class="form-control form-control-sm"
                                            value="{{ $transaksi->pengiriman->nomor_resi }}"
                                            placeholder="Nomor Resi">

                                        <button class="btn btn-primary btn-sm mt-1 w-100">
                                            Simpan Resi
                                        </button>

                                    </form>

                                    @endif
                                  @if($transaksi->pengiriman->status != 'selesai')
                                       <form action="{{ route('kasir.pengiriman.status',$transaksi->id) }}"
                                    method="POST">

                                    @csrf
                                    @method('PUT')

                                    <select name="status"
                                        class="form-select form-select-sm mb-2"
                                        required>

                                        <option value="menunggu"
                                            {{ $transaksi->pengiriman->status == 'menunggu' ? 'selected' : '' }}>
                                            Menunggu
                                        </option>

                                        <option value="diproses"
                                            {{ $transaksi->pengiriman->status == 'diproses' ? 'selected' : '' }}>
                                            Diproses
                                        </option>

                                        <option value="dikemas"
                                            {{ $transaksi->pengiriman->status == 'dikemas' ? 'selected' : '' }}>
                                            Dikemas
                                        </option>

                                        <option value="dikirim"
                                            {{ $transaksi->pengiriman->status == 'dikirim' ? 'selected' : '' }}>
                                            Dikirim
                                        </option>

                                        <option value="selesai"
                                            {{ $transaksi->pengiriman->status == 'selesai' ? 'selected' : '' }}>
                                            Selesai
                                        </option>

                                    </select>

                                    <button class="btn btn-success btn-sm w-100">
                                        Simpan Status
                                    </button>

                                </form>
                                @else

                                    <span class="text-muted">
                                        Belum ada data
                                    </span>

                                @endif

                            @endif   

                            </td>


                    <td>

                <a href="{{ route('kasir.detail',$transaksi->id) }}"
                    class="btn btn-info btn-sm mb-1">
                    Detail
                </a>

                <a href="{{ route('kasir.buktiPembayaran',$transaksi->id) }}"
                    class="btn btn-warning btn-sm mb-1">
                    Bukti Pembayaran
                </a>

                <a href="{{ route('kasir.buktiProduk',$transaksi->id) }}"
                    class="btn btn-secondary btn-sm mb-1">
                    Foto Produk
                </a>

                @if($transaksi->pembayaran && $transaksi->pembayaran->status == 'Menunggu Verifikasi')
                    <form action="{{ route('kasir.verifikasi',$transaksi->id) }}"
                        method="POST"
                        class="d-inline">

                        @csrf
                        @method('PUT')

                        <button class="btn btn-primary btn-sm mb-1">
                            Verifikasi
                        </button>

                    </form>
                @endif

                @if($transaksi->bayar > 0 && $transaksi->status != 'Selesai')
                    <form action="{{ route('kasir.selesai',$transaksi->id) }}"
                        method="POST"
                        class="d-inline">

                        @csrf
                        @method('PUT')

                        <button class="btn btn-success btn-sm mb-1">
                            Selesai
                        </button>

                    </form>
                @endif

                <form action="{{ route('kasir.destroy',$transaksi->id) }}"
                    method="POST"
                    onsubmit="return confirm('Hapus transaksi ini?')">

                    @csrf
                    @method('DELETE')

                    <button class="btn btn-danger btn-sm">
                        Hapus
                    </button>

                </form>
    
            </td>

                        </tr>

                        @empty

                        <tr>
                            <td colspan="10" class="text-center">
                                Belum ada transaksi.
                            </td>
                        </tr>

                        @endforelse

                    </tbody>

                </table>

            </div>

        </div>
    </div>

</div>

@endsection