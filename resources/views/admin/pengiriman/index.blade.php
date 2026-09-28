        @extends('layouts.app')

        @section('title', 'Data Pengiriman')

        @section('content')
        <div class="container-fluid">

            <div class="d-flex justify-content-between align-items-center mb-3">
                <h4>Data Pengiriman</h4>

                <a href="{{ route('admin.index') }}" class="btn btn-secondary">
                    <i class="bi bi-arrow-left"></i> Kembali
                </a>
            </div>

            <div class="card shadow-sm">
                <div class="card-body">

                    <table class="table table-bordered table-hover">
                        <thead class="table-dark">
                            <tr>
                                <th>No</th>
                                <th>Kode Transaksi</th>
                                <th>Penerima</th>
                                <th>Kurir</th>
                                <th>Layanan</th>
                                <th>No. Resi</th>
                                <th>Status</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>

                        <tbody>

                            @forelse($pengiriman as $item)

                            <tr>
                                <td>{{ $loop->iteration }}</td>

                                <td>{{ $item->transaksi->kode_transaksi ?? '-' }}</td>

                                <td>{{ $item->transaksi->nama_penerima ?? '-' }}</td>

                                <td>{{ $item->kurir }}</td>

                                <td>{{ $item->layanan }}</td>

                                <td>{{ $item->nomor_resi ?? '-' }}</td>

                                <td>
                                    <span class="badge bg-primary">
                                        {{ ucfirst($item->status) }}
                                    </span>
                                </td>

                               <td>
                                    <a href="{{ route('admin.pengiriman.edit', $item->transaksi_id) }}"
                                    class="btn btn-warning btn-sm">
                                        <i class="bi bi-pencil"></i> Edit
                                    </a>

                                    <a href="{{ route('admin.pengiriman.label', $item->id) }}"
                                    class="btn btn-info btn-sm"
                                    target="_blank">
                                        <i class="bi bi-printer"></i> Label
                                    </a>
                                </td>

                            </tr>

                            @empty

                            <tr>
                                <td colspan="8" class="text-center">
                                    Belum ada data pengiriman.
                                </td>
                            </tr>

                            @endforelse

                        </tbody>

                    </table>

                </div>
            </div>

        </div>
        @endsection