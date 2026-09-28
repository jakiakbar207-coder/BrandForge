@extends('layouts.app')

@section('title', 'Edit Pengiriman')

@section('content')
<div class="container-fluid">

    <div class="d-flex justify-content-between align-items-center mb-3">
        <h4>Edit Pengiriman</h4>

        <a href="{{ route('admin.pengiriman.index') }}" class="btn btn-secondary">
            <i class="bi bi-arrow-left"></i> Kembali
        </a>
    </div>

    <div class="card shadow-sm">
        <div class="card-body">

            <form action="{{ route('admin.pengiriman.store') }}" method="POST">
                @csrf

                <input type="hidden" name="transaksi_id" value="{{ $transaksi->id }}">

                <div class="mb-3">
                    <label class="form-label">Kode Transaksi</label>
                    <input type="text"
                           class="form-control"
                           value="{{ $transaksi->kode_transaksi }}"
                           readonly>
                </div>

                <div class="mb-3">
                    <label class="form-label">Nama Penerima</label>
                    <input type="text"
                           class="form-control"
                           value="{{ $transaksi->nama_penerima }}"
                           readonly>
                </div>

                <div class="mb-3">
                    <label class="form-label">Kurir</label>
                    <select name="kurir" class="form-select" required>
                        <option value="">-- Pilih Kurir --</option>
                        <option value="JNE" {{ optional($pengiriman)->kurir == 'JNE' ? 'selected' : '' }}>JNE</option>
                        <option value="J&T" {{ optional($pengiriman)->kurir == 'J&T' ? 'selected' : '' }}>J&T</option>
                        <option value="SiCepat" {{ optional($pengiriman)->kurir == 'SiCepat' ? 'selected' : '' }}>SiCepat</option>
                        <option value="AnterAja" {{ optional($pengiriman)->kurir == 'AnterAja' ? 'selected' : '' }}>AnterAja</option>
                        <option value="POS Indonesia" {{ optional($pengiriman)->kurir == 'POS Indonesia' ? 'selected' : '' }}>POS Indonesia</option>
                    </select>
                </div>

                <div class="mb-3">
                    <label class="form-label">Layanan</label>
                    <input type="text"
                           name="layanan"
                           class="form-control"
                           value="{{ old('layanan', optional($pengiriman)->layanan) }}"
                           required>
                </div>

                <div class="mb-3">
                    <label class="form-label">Ongkir</label>
                    <input type="number"
                           name="ongkir"
                           class="form-control"
                           value="{{ old('ongkir', optional($pengiriman)->ongkir) }}"
                           required>
                </div>

                @if($pengiriman)
                <div class="mb-3">
                    <label class="form-label">Nomor Resi</label>
                    <input type="text"
                           class="form-control"
                           value="{{ $pengiriman->nomor_resi }}"
                           readonly>
                </div>

                <div class="mb-3">
                    <label class="form-label">Status Pengiriman</label>
                    <input type="text"
                           class="form-control"
                           value="{{ ucfirst($pengiriman->status) }}"
                           readonly>
                </div>
                @endif

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