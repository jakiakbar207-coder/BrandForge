@extends('layouts.app')

@section('title', 'Pembelian Stok')

@section('content')

<div class="d-flex justify-content-between align-items-center mb-4">

    <div>
        <h3 class="fw-bold mb-1">Pembelian Stok</h3>
        <p class="text-muted mb-0">
            Riwayat pembelian stok dari supplier.
        </p>
    </div>

    <a href="{{ route('pembelian.create') }}"
       class="btn btn-primary">
        + Pembelian Baru
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
                        <th>Supplier</th>
                        <th>Total</th>
                        <th width="150">Aksi</th>
                    </tr>

                </thead>

                <tbody>

                    @forelse($pembelians as $pembelian)

                        <tr>

                            <td>
                                {{ $loop->iteration }}
                            </td>

                            <td>
                                {{ \Carbon\Carbon::parse($pembelian->tanggal_pembelian)->format('d/m/Y') }}
                            </td>

                            <td class="fw-semibold">
                                {{ $pembelian->supplier->nama_supplier ?? '-' }}
                            </td>

                            <td>
                                Rp {{ number_format($pembelian->total_harga, 0, ',', '.') }}
                            </td>

                            <td>

                                <a href="{{ route('pembelian.show', $pembelian->id) }}"
                                   class="btn btn-info btn-sm text-white">
                                    Detail
                                </a>

                            </td>

                        </tr>

                    @empty

                        <tr>

                            <td colspan="5"
                                class="text-center py-4 text-muted">

                                Belum ada pembelian.

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