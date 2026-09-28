@extends('layouts.app')

@section('title', 'Biaya Operasional')

@section('content')

<div class="container py-4">

    <div class="d-flex justify-content-between align-items-center mb-4">

        <h3 class="fw-bold mb-0">
            Biaya Operasional
        </h3>

        <div>
            <a href="{{ route('biaya-operasional.create') }}"
               class="btn btn-primary me-2">
                + Tambah Biaya
            </a>

            <a href="{{ route('admin.index') }}"
               class="btn btn-secondary">
                Kembali
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

            <div class="table-responsive">

                <table class="table table-bordered table-hover align-middle">

                    <thead class="table-dark text-center">

                        <tr>
                            <th width="60">No</th>
                            <th>Tanggal</th>
                            <th>Keterangan</th>
                            <th>Nominal</th>
                            <th width="180">Aksi</th>
                        </tr>

                    </thead>


                    <tbody>

                        @forelse($biayas as $biaya)

                            <tr>

                                <td class="text-center">
                                    {{ $loop->iteration }}
                                </td>


                                <td>
                                    {{ \Carbon\Carbon::parse($biaya->tanggal)->format('d-m-Y') }}
                                </td>


                                <td>
                                    {{ $biaya->keterangan }}
                                </td>


                                <td>
                                    Rp {{ number_format($biaya->nominal, 0, ',', '.') }}
                                </td>


                                <td class="text-center">

                                    <a href="{{ route('biaya-operasional.edit', $biaya->id) }}"
                                       class="btn btn-warning btn-sm">
                                        Edit
                                    </a>


                                    <form action="{{ route('biaya-operasional.destroy', $biaya->id) }}"
                                          method="POST"
                                          class="d-inline">

                                        @csrf
                                        @method('DELETE')

                                        <button type="submit"
                                                class="btn btn-danger btn-sm"
                                                onclick="return confirm('Yakin ingin menghapus biaya ini?')">
                                            Hapus
                                        </button>

                                    </form>

                                </td>

                            </tr>


                        @empty

                            <tr>

                                <td colspan="5" class="text-center text-muted">

                                    Belum ada data biaya operasional.

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