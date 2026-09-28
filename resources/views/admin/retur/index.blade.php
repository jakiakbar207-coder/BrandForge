@extends('layouts.app')

@section('title', 'Retur Barang')

@section('content')

<div class="d-flex justify-content-between align-items-center mb-4">

    <div>
        <h3 class="fw-bold mb-1">
            Retur Barang
        </h3>

        <p class="text-muted mb-0">
            Riwayat retur barang.
        </p>
    </div>

    <a href="{{ route('retur.create') }}"
       class="btn btn-primary">
        + Tambah Retur
    </a>

</div>

@if(session('success'))

    <div class="alert alert-success">
        {{ session('success') }}
    </div>

@endif

<div class="card shadow-sm border-0">

    <div class="card-body">

        <div class="table-responsive">

            <table class="table table-hover align-middle">

                <thead class="table-light">

                    <tr>
                        <th>No</th>
                        <th>Tanggal</th>
                        <th>Produk</th>
                        <th>Ukuran</th>
                        <th>Warna</th>
                        <th>Jumlah</th>
                        <th>Jenis</th>
                        <th>Aksi</th>
                    </tr>

                </thead>

                <tbody>

                    @forelse($returs as $retur)

                        <tr>

                            <td>
                                {{ $loop->iteration }}
                            </td>

                            <td>
                                {{ \Carbon\Carbon::parse($retur->tanggal_retur)->format('d/m/Y') }}
                            </td>

                            <td>
                                {{ $retur->produk->nama_produk ?? '-' }}
                            </td>

                            <td>
                                {{ $retur->ukuran->nama_ukuran ?? '-' }}
                            </td>

                            <td>
                                {{ $retur->warna->nama_warna ?? '-' }}
                            </td>

                            <td>
                                {{ $retur->jumlah }}
                            </td>

                            <td>

                                @if($retur->jenis === 'masuk')

                                    <span class="badge bg-success">
                                        Masuk
                                    </span>

                                @else

                                    <span class="badge bg-danger">
                                        Keluar
                                    </span>

                                @endif

                            </td>

                            <td>

                                <a href="{{ route('retur.show', $retur->id) }}"
                                   class="btn btn-info btn-sm text-white">
                                    Detail
                                </a>

                            </td>

                        </tr>

                    @empty

                        <tr>

                            <td colspan="8"
                                class="text-center py-4 text-muted">

                                Belum ada data retur.

                            </td>

                        </tr>

                    @endforelse

                </tbody>

            </table>
            <a href="{{ route('admin.index') }}" class="btn btn-secondary mt-3">
                ← Kembali ke Dashboard Admin
            </a>

        </div>

    </div>

</div>

@endsection