@extends('layouts.app')

@section('title', 'Data Koleksi')

@section('content')
<div class="container-fluid">

   <div class="d-flex justify-content-between align-items-center mb-3">
    <h4>Data Koleksi</h4>

    <div>
        <a href="{{ route('admin.index') }}" class="btn btn-secondary me-2">
            <i class="bi bi-arrow-left"></i> Kembali
        </a>

        <a href="{{ route('koleksi.create') }}" class="btn btn-primary">
            <i class="bi bi-plus-circle"></i> Tambah Koleksi
        </a>
    </div>
</div>

    @if(session('success'))
        <div class="alert alert-success">
            {{ session('success') }}
        </div>
    @endif

    <div class="card shadow-sm">
        <div class="card-body">

            <table class="table table-bordered table-hover">

                <thead class="table-dark">
                    <tr>
                        <th width="60">No</th>
                        <th>Nama Koleksi</th>
                        <th>Deskripsi</th>
                        <th width="170">Aksi</th>
                    </tr>
                </thead>

                <tbody>

                    @forelse($koleksis as $koleksi)

                        <tr>

                            <td>{{ $loop->iteration }}</td>

                            <td>{{ $koleksi->nama_koleksi }}</td>

                            <td>{{ $koleksi->deskripsi }}</td>

                            <td>

                                <a href="{{route('koleksi.edit', $koleksi->id) }}"
                                   class="btn btn-warning btn-sm">
                                    Edit
                                </a>    

                                <form action="{{route('koleksi.destroy', $koleksi->id) }}"
                                      method="POST"
                                      class="d-inline">

                                    @csrf
                                    @method('DELETE')

                                    <button class="btn btn-danger btn-sm"
                                            onclick="return confirm('Hapus koleksi?')">

                                        Hapus

                                    </button>

                                </form>

                            </td>

                        </tr>

                    @empty

                        <tr>

                            <td colspan="4" class="text-center">

                                Belum ada data koleksi.

                            </td>

                        </tr>

                    @endforelse

                </tbody>

            </table>

        </div>
    </div>

</div>
@endsection