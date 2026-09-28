@extends('layouts.app')

@section('title', 'Tambah Pengiriman')

@section('content')
<div class="container-fluid">

    <div class="d-flex justify-content-between align-items-center mb-3">
        <h4>Tambah Pengiriman</h4>

        <a href="{{ route('admin.pengiriman.index') }}" class="btn btn-secondary">
            <i class="bi bi-arrow-left"></i> Kembali
        </a>
    </div>

    <div class="card shadow-sm">
        <div class="card-body">

            <form action="{{ route('admin.pengiriman.store') }}" method="POST">
                @csrf

                <div class="mb-3">
                    <label class="form-label">Transaksi</label>

                    <select name="transaksi_id" class="form-select" required>
                        <option value="">-- Pilih Transaksi --</option>

                        @foreach($transaksis as $transaksi)
                            <option value="{{ $transaksi->id }}">
                                {{ $transaksi->kode_transaksi }} -
                                {{ $transaksi->nama_penerima }}
                            </option>
                        @endforeach

                    </select>
                </div>

                <div class="mb-3">
                    <label class="form-label">Kurir</label>

                    <select name="kurir" class="form-select" required>
                        <option value="">-- Pilih Kurir --</option>
                        <option value="JNE">JNE</option>
                        <option value="J&T">J&T</option>
                        <option value="SiCepat">SiCepat</option>
                        <option value="AnterAja">AnterAja</option>
                        <option value="POS Indonesia">POS Indonesia</option>
                    </select>
                </div>

                <div class="mb-3">
                    <label class="form-label">Layanan</label>
                    <input type="text"
                           name="layanan"
                           class="form-control"
                           placeholder="Contoh: REG, YES, OKE"
                           required>
                </div>

                <div class="mb-3">
                    <label class="form-label">Ongkir</label>
                    <input type="number"
                           name="ongkir"
                           class="form-control"
                           placeholder="Masukkan ongkir"
                           required>
                </div>

                <div class="mb-3">
                    <label class="form-label">Catatan</label>
                    <textarea name="catatan"
                              class="form-control"
                              rows="3"
                              placeholder="Catatan pengiriman (opsional)"></textarea>
                </div>

                <button type="submit" class="btn btn-primary">
                    <i class="bi bi-save"></i> Simpan
                </button>

                <a href="{{ route('admin.pengiriman.index') }}"
                   class="btn btn-secondary">
                    Batal
                </a>

            </form>

        </div>
    </div>

</div>
@endsection