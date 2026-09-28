@extends('layouts.app')

@section('title', 'Data Stok')

@section('content')

<div class="container-fluid py-4">

    <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
            <h3 class="fw-bold mb-1">📦 Data Stok</h3>
            <p class="text-muted mb-0">
                Kelola stok produk berdasarkan ukuran dan warna.
            </p>
        </div>

        <a href="{{ route('stok.create') }}" class="btn btn-primary">
            + Tambah Stok
        </a>
    </div>

    @if(session('success'))
        <div class="alert alert-success alert-dismissible fade show">
            {{ session('success') }}

            <button type="button"
                    class="btn-close"
                    data-bs-dismiss="alert">
            </button>
        </div>
    @endif

    <div class="card border-0 shadow-sm">

        <div class="card-body">

            <div class="table-responsive">

                <table class="table table-hover align-middle mb-0">

                    <thead class="table-dark">

                        <tr>
                            <th>No</th>
                            <th>Produk</th>
                            <th>Ukuran</th>
                            <th>Warna</th>
                            <th>Jumlah</th>
                            <th width="180">Aksi</th>
                        </tr>

                    </thead>

                    <tbody>

                    @forelse($stoks as $stok)

                        <tr>

                            <td>
                                {{ $loop->iteration }}
                            </td>

                            <td>
                                <strong>
                                    {{ $stok->produk->nama_produk ?? '-' }}
                                </strong>
                            </td>

                            <td>
                                <span class="badge bg-secondary">
                                    {{ $stok->ukuran->nama_ukuran ?? '-' }}
                                </span>
                            </td>

                            <td>
                                {{ $stok->warna->nama_warna ?? '-' }}
                            </td>

                            <td>

                                @if($stok->jumlah <= 5)

                                    <span class="badge bg-danger">
                                        {{ $stok->jumlah }} — Menipis
                                    </span>

                                @else

                                    <span class="badge bg-success">
                                        {{ $stok->jumlah }}
                                    </span>

                                @endif

                            </td>

                            <td>

                                <a href="{{ route('stok.edit', $stok->id) }}"
                                   class="btn btn-warning btn-sm">
                                    Edit
                                </a>

                                <form
                                    action="{{ route('stok.destroy', $stok->id) }}"
                                    method="POST"
                                    class="d-inline">

                                    @csrf
                                    @method('DELETE')

                                    <button
                                        type="submit"
                                        class="btn btn-danger btn-sm"
                                        onclick="return confirm('Yakin ingin menghapus stok ini?')">

                                        Hapus

                                    </button>

                                </form>

                            </td>

                        </tr>

                    @empty

                        <tr>

                            <td colspan="6"
                                class="text-center text-muted py-4">

                                📦 Belum ada data stok.

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

</div>

@endsection