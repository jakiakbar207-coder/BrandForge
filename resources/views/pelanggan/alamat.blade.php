```blade
@extends('layouts.app')

@section('title','Alamat Pengiriman')

@section('content')

<div class="container py-4">

    <div class="row justify-content-center">

        <div class="col-md-7">

            <div class="card shadow border-0">

                <div class="card-header bg-primary text-white">
                    <h5 class="mb-0">
                        📍 Alamat Pengiriman
                    </h5>
                </div>

                <div class="card-body">

                    {{-- ERROR --}}
                    @if ($errors->any())
                        <div class="alert alert-danger">
                            <ul class="mb-0">
                                @foreach ($errors->all() as $error)
                                    <li>{{ $error }}</li>
                                @endforeach
                            </ul>
                        </div>
                    @endif


                    {{-- INFO --}}
                    <div class="alert alert-info">
                        <strong>Data pengiriman</strong>

                        <br>

                        Nama, alamat, dan nomor WhatsApp
                        diambil dari data akun kamu.
                    </div>


                    <form action="{{ route('pelanggan.simpanAlamat', $transaksi->id) }}"
                          method="POST">

                        @csrf


                        {{-- NAMA --}}
                        <div class="mb-3">

                            <label class="form-label fw-bold">
                                Nama Penerima
                            </label>

                            <input type="text"
                                   name="nama_penerima"
                                   class="form-control"
                                   value="{{ old('nama_penerima', Auth::user()->name) }}"
                                   placeholder="Nama penerima"
                                   required>

                        </div>


                        {{-- ALAMAT --}}
                        <div class="mb-3">

                            <label class="form-label fw-bold">
                                Alamat Lengkap
                            </label>

                            <textarea name="alamat"
                                      class="form-control"
                                      rows="4"
                                      placeholder="Alamat lengkap"
                                      required>{{ old('alamat', Auth::user()->alamat) }}</textarea>

                        </div>


                        {{-- NOMOR HP --}}
                        <div class="mb-3">

                            <label class="form-label fw-bold">
                                No WhatsApp
                            </label>

                            <input type="text"
                                   name="no_hp"
                                   class="form-control"
                                   value="{{ old('no_hp', Auth::user()->no_hp) }}"
                                   placeholder="08xxxxxxxxxx"
                                   required>

                        </div>


                        {{-- KURIR --}}
                        <div class="mb-3">

                            <label class="form-label fw-bold">
                                Pilih Kurir
                            </label>

                            <select name="kurir"
                                    class="form-control"
                                    required>

                                <option value="">
                                    -- Pilih Kurir --
                                </option>

                                <option value="JNE"
                                    {{ old('kurir') == 'JNE' ? 'selected' : '' }}>
                                    JNE
                                </option>

                                <option value="J&T"
                                    {{ old('kurir') == 'J&T' ? 'selected' : '' }}>
                                    J&T
                                </option>

                                <option value="SiCepat"
                                    {{ old('kurir') == 'SiCepat' ? 'selected' : '' }}>
                                    SiCepat
                                </option>

                                <option value="AnterAja"
                                    {{ old('kurir') == 'AnterAja' ? 'selected' : '' }}>
                                    AnterAja
                                </option>

                            </select>

                        </div>


                        {{-- LAYANAN --}}
                        <div class="mb-3">

                            <label class="form-label fw-bold">
                                Pilih Layanan
                            </label>

                            <select name="layanan"
                                    class="form-control"
                                    required>

                                <option value="">
                                    -- Pilih Layanan --
                                </option>

                                <option value="REG"
                                    {{ old('layanan') == 'REG' ? 'selected' : '' }}>
                                    REG
                                </option>

                                <option value="YES"
                                    {{ old('layanan') == 'YES' ? 'selected' : '' }}>
                                    YES
                                </option>

                                <option value="Express"
                                    {{ old('layanan') == 'Express' ? 'selected' : '' }}>
                                    Express
                                </option>

                            </select>

                        </div>


                        <hr>


                        {{-- TOMBOL --}}
                        <div class="d-flex justify-content-between">

                            <a href="{{ route('pelanggan.checkout') }}"
                               class="btn btn-secondary">

                                ← Kembali

                            </a>


                            <button type="submit"
                                    class="btn btn-success">

                                Lanjut Pembayaran →

                            </button>

                        </div>

                    </form>

                </div>

            </div>

        </div>

    </div>

</div>

@endsection
```
