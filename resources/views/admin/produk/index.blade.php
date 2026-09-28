@extends('layouts.app')

@section('title', 'Data Produk')

@section('content')

<div class="container py-4">

    <div class="d-flex justify-content-between align-items-center mb-4">

        <h2 class="fw-bold">
            📦 Data Produk
        </h2>

        <div>

            <a href="{{ route('admin.index') }}" class="btn btn-secondary">
                Dashboard
            </a>

            <a href="{{ route('produk.create') }}" class="btn btn-primary">
                + Tambah Produk
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

            <div class="table-responsive">

                <table class="table table-bordered table-hover align-middle">

                    <thead class="table-dark text-center">

                        <tr>

                            <th width="60">No</th>
                            <th width="90">Foto</th>
                            <th>Nama Produk</th>
                            <th>Kategori</th>
                            <th>Koleksi</th>
                            <th>Harga</th>
                            <th>Modal</th>
                            <th width="170">Aksi</th>

                        </tr>

                    </thead>

                    <tbody>

                    @forelse($produks as $produk)

                        <tr>

                            <td class="text-center">
                                {{ $loop->iteration }}
                            </td>

                            <td class="text-center">

                                @if($produk->foto)

                                    <img
                                        src="{{ asset('produk/'.$produk->foto) }}"
                                        class="img-thumbnail"
                                        width="70">

                                @else

                                    <span class="text-muted">
                                        -
                                    </span>

                                @endif

                            </td>

                            <td>

                                <strong>
                                    {{ $produk->nama_produk }}
                                </strong>

                            </td>

                            <td>
                                {{ $produk->kategori->nama_kategori ?? '-' }}
                            </td>

                            <td>
                                {{ $produk->koleksi->nama_koleksi ?? '-' }}
                            </td>

                            <td>
                                Rp {{ number_format($produk->harga,0,',','.') }}
                            </td>

                            <td>
                                Rp {{ number_format($produk->modal_produk,0,',','.') }}
                            </td>

                            <td class="text-center">

                                <a href="{{ route('produk.edit',$produk->id) }}"
                                   class="btn btn-warning btn-sm">

                                    Edit

                                </a>

                                <form
                                    action="{{ route('produk.destroy',$produk->id) }}"
                                    method="POST"
                                    class="d-inline">

                                    @csrf
                                    @method('DELETE')

                                    <button
                                        class="btn btn-danger btn-sm"
                                        onclick="return confirm('Yakin ingin menghapus produk ini?')">

                                        Hapus

                                    </button>

                                </form>

                            </td>

                        </tr>

                    @empty

                        <tr>

                            <td colspan="8" class="text-center">

                                Belum ada data produk.

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