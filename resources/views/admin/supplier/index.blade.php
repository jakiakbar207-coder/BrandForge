@extends('layouts.app')

@section('title', 'Data Supplier')

@section('content')

<div class="d-flex justify-content-between align-items-center mb-4">
    <div>
        <h3 class="fw-bold mb-1">Data Supplier</h3>
        <p class="text-muted mb-0">Kelola data supplier toko.</p>
    </div>

    <a href="{{ route('supplier.create') }}" class="btn btn-primary">
        + Tambah Supplier
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
                        <th width="60">No</th>
                        <th>Nama Supplier</th>
                        <th>Kontak</th>
                        <th>Email</th>
                        <th>Alamat</th>
                        <th width="180">Aksi</th>
                    </tr>
                </thead>

                <tbody>

                    @forelse($suppliers as $supplier)

                        <tr>
                            <td>{{ $loop->iteration }}</td>

                            <td class="fw-semibold">
                                {{ $supplier->nama_supplier }}
                            </td>

                            <td>
                                {{ $supplier->kontak ?? '-' }}
                            </td>

                            <td>
                                {{ $supplier->email ?? '-' }}
                            </td>

                            <td>
                                {{ $supplier->alamat ?? '-' }}
                            </td>

                            <td>

                                <a href="{{ route('supplier.edit', $supplier->id) }}"
                                   class="btn btn-warning btn-sm">
                                    Edit
                                </a>

                                <form action="{{ route('supplier.destroy', $supplier->id) }}"
                                      method="POST"
                                      class="d-inline"
                                      onsubmit="return confirm('Yakin ingin menghapus supplier ini?')">

                                    @csrf
                                    @method('DELETE')

                                    <button type="submit"
                                            class="btn btn-danger btn-sm">
                                        Hapus
                                    </button>

                                </form>

                            </td>
                        </tr>

                    @empty

                        <tr>
                            <td colspan="6" class="text-center py-4 text-muted">
                                Belum ada data supplier.
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