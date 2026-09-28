@extends('layouts.app')

@section('title', 'Data Kategori')

@section('content')

<div class="container py-4">

    <div class="d-flex justify-content-between align-items-center mb-4">

        <h3 class="fw-bold">
            📂 Master Data Kategori
        </h3>

        <div>

            <a href="{{ route('admin.index') }}" class="btn btn-secondary">
                ← Dashboard Admin
            </a>

            <a href="{{ route('kategori.create') }}" class="btn btn-primary">
                + Tambah Kategori
            </a>

        </div>

    </div>

    @if(session('success'))

        <div class="alert alert-success">

            {{ session('success') }}

        </div>

    @endif

    <div class="card shadow">

        <div class="card-body">

            <table class="table table-bordered table-hover align-middle">

                <thead class="table-dark">

                    <tr>

                        <th width="70">No</th>

                        <th>Nama Kategori</th>

                        <th width="220" class="text-center">
                            Aksi
                        </th>

                    </tr>

                </thead>

                <tbody>

                    @forelse($kategoris as $kategori)

                        <tr>

                            <td>{{ $loop->iteration }}</td>

                            <td>{{ $kategori->nama_kategori }}</td>

                            <td class="text-center">

                                <a href="{{ route('kategori.edit', $kategori->id) }}"
                                   class="btn btn-warning btn-sm">
                                    Edit
                                </a>

                                <form action="{{ route('kategori.destroy', $kategori->id) }}"
                                      method="POST"
                                      class="d-inline">

                                    @csrf
                                    @method('DELETE')

                                    <button
                                        type="submit"
                                        class="btn btn-danger btn-sm"
                                        onclick="return confirm('Yakin ingin menghapus kategori ini?')">

                                        Hapus

                                    </button>

                                </form>

                            </td>

                        </tr>

                    @empty

                        <tr>

                            <td colspan="3" class="text-center text-muted">

                                Belum ada data kategori.

                            </td>

                        </tr>

                    @endforelse

                </tbody>

            </table>

        </div>

    </div>

</div>

@endsection