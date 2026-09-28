@extends('layouts.app')

@section('title', 'Notifikasi')

@section('content')

<div class="container py-4">

    {{-- Header --}}
    <div class="d-flex justify-content-between align-items-center mb-4">

        <div>
            <h3 class="mb-1">
                🔔 Notifikasi Pesanan
            </h3>

            <p class="text-muted mb-0">
                Informasi terbaru mengenai pesanan kamu.
            </p>
        </div>

        {{-- Tandai semua sudah dibaca --}}
        @if(auth()->user()->unreadNotifications->count() > 0)

            <form action="{{ route('notifikasi.dibacaSemua') }}"
                  method="POST">

                @csrf

                <button type="submit"
                        class="btn btn-outline-primary">

                    ✓ Tandai Semua Dibaca

                </button>

            </form>

        @endif

    </div>


    {{-- Daftar Notifikasi --}}
    @forelse($notifications as $notification)

        <div class="card mb-3 shadow-sm
            {{ is_null($notification->read_at) ? 'border-primary' : '' }}">

            <div class="card-body">

                <div class="d-flex justify-content-between align-items-start">

                    {{-- Isi Notifikasi --}}
                    <div class="me-3">

                        <h5 class="mb-2">

                            {{ $notification->data['title']
                                ?? 'Notifikasi Pesanan' }}

                        </h5>


                        <p class="mb-2">

                            {{ $notification->data['message']
                                ?? 'Ada pembaruan pada pesanan kamu.' }}

                        </p>


                        {{-- Kode Transaksi --}}
                        @if(isset($notification->data['kode_transaksi']))

                            <small class="text-muted">

                                Kode Transaksi:
                                <strong>
                                    {{ $notification->data['kode_transaksi'] }}
                                </strong>

                            </small>

                        @endif


                        {{-- Status --}}
                        @if(isset($notification->data['status']))

                            <div class="mt-2">

                                <span class="badge bg-primary">

                                    Status:
                                    {{ ucfirst($notification->data['status']) }}

                                </span>

                            </div>

                        @endif


                        {{-- Waktu --}}
                        <small class="text-muted d-block mt-2">

                            {{ $notification->created_at->diffForHumans() }}

                        </small>

                    </div>


                    {{-- Status Dibaca --}}
                    <div>

                        @if(is_null($notification->read_at))

                            <form action="{{ route(
                                        'notifikasi.dibaca',
                                        $notification->id
                                    ) }}"
                                  method="POST">

                                @csrf

                                <button type="submit"
                                        class="btn btn-sm btn-primary">

                                    Tandai Dibaca

                                </button>

                            </form>

                        @else

                            <span class="badge bg-secondary">

                                Sudah Dibaca

                            </span>

                        @endif

                    </div>

                </div>

            </div>

        </div>

    @empty

        {{-- Tidak Ada Notifikasi --}}
        <div class="card shadow-sm">

            <div class="card-body text-center py-5">

                <div class="fs-1 mb-3">
                    🔔
                </div>

                <h5>
                    Belum Ada Notifikasi
                </h5>

                <p class="text-muted mb-3">

                    Saat ada perubahan status pesanan,
                    notifikasi akan muncul di sini.

                </p>

                <a href="{{ route('pelanggan.riwayat') }}"
                   class="btn btn-primary">

                    Lihat Riwayat Pesanan

                </a>

            </div>

        </div>

    @endforelse


    {{-- Tombol Kembali --}}
    <div class="mt-4">

        <a href="{{ route('pelanggan.dashboardBelanja') }}"
           class="btn btn-secondary">

            ← Kembali ke Dashboard

        </a>

    </div>

</div>

@endsection