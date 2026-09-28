@extends('layouts.app')

@section('title', 'Edit Produk')

@section('content')

<div class="container py-4">

    <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
            <h3 class="fw-bold mb-1">Edit Produk</h3>
            <small class="text-muted">
                Ubah informasi dan foto produk
            </small>
        </div>

        <a href="{{ route('produk.index') }}" class="btn btn-secondary">
            ← Kembali
        </a>
    </div>

    {{-- Error --}}
    @if ($errors->any())
        <div class="alert alert-danger">
            <strong>Terjadi kesalahan:</strong>

            <ul class="mb-0 mt-2">
                @foreach ($errors->all() as $error)
                    <li>{{ $error }}</li>
                @endforeach
            </ul>
        </div>
    @endif

    {{-- Form --}}
    <div class="card shadow-sm border-0">
        <div class="card-body p-4">

            <form action="{{ route('produk.update', $produk->id) }}"
                  method="POST"
                  enctype="multipart/form-data">

                @csrf
                @method('PUT')

                {{-- INFORMASI PRODUK --}}
                <h5 class="fw-bold mb-3">
                    Informasi Produk
                </h5>

                <div class="row">

                    {{-- Kategori --}}
                    <div class="col-md-6 mb-3">
                        <label class="form-label fw-semibold">
                            Kategori
                        </label>

                        <select name="kategori_id"
                                class="form-select"
                                required>

                            @foreach($kategoris as $kategori)
                                <option value="{{ $kategori->id }}"
                                    {{ old('kategori_id', $produk->kategori_id) == $kategori->id ? 'selected' : '' }}>
                                    {{ $kategori->nama_kategori }}
                                </option>
                            @endforeach

                        </select>
                    </div>

                    {{-- Koleksi --}}
                    <div class="col-md-6 mb-3">
                        <label class="form-label fw-semibold">
                            Koleksi
                        </label>

                        <select name="koleksi_id"
                                class="form-select">

                            <option value="">
                                Tidak Ada
                            </option>

                            @foreach($koleksis as $koleksi)
                                <option value="{{ $koleksi->id }}"
                                    {{ old('koleksi_id', $produk->koleksi_id) == $koleksi->id ? 'selected' : '' }}>
                                    {{ $koleksi->nama_koleksi }}
                                </option>
                            @endforeach

                        </select>
                    </div>

                </div>

                {{-- Nama Produk --}}
                <div class="mb-3">
                    <label class="form-label fw-semibold">
                        Nama Produk
                    </label>

                    <input type="text"
                           name="nama_produk"
                           class="form-control"
                           value="{{ old('nama_produk', $produk->nama_produk) }}"
                           required>
                </div>

                {{-- Harga --}}
                <div class="row">

                    <div class="col-md-6 mb-3">
                        <label class="form-label fw-semibold">
                            Harga Jual
                        </label>

                        <input type="number"
                               name="harga"
                               class="form-control"
                               value="{{ old('harga', $produk->harga) }}"
                               required>
                    </div>

                    <div class="col-md-6 mb-3">
                        <label class="form-label fw-semibold">
                            Modal Produk
                        </label>

                        <input type="number"
                               name="modal_produk"
                               class="form-control"
                               value="{{ old('modal_produk', $produk->modal_produk) }}"
                               required>
                    </div>

                </div>

                {{-- Deskripsi --}}
                <div class="mb-4">
                    <label class="form-label fw-semibold">
                        Deskripsi
                    </label>

                    <textarea name="deskripsi"
                              rows="4"
                              class="form-control">{{ old('deskripsi', $produk->deskripsi) }}</textarea>
                </div>

                <hr>

                {{-- DIMENSI --}}
                <h5 class="fw-bold mb-3">
                    Dimensi Produk
                </h5>

                <div class="row">

                    <div class="col-md-3 mb-3">
                        <label class="form-label">
                            Berat (gram)
                        </label>

                        <input type="number"
                               name="berat"
                               class="form-control"
                               value="{{ old('berat', $produk->berat) }}"
                               required>
                    </div>

                    <div class="col-md-3 mb-3">
                        <label class="form-label">
                            Panjang (cm)
                        </label>

                        <input type="number"
                               name="panjang"
                               class="form-control"
                               value="{{ old('panjang', $produk->panjang) }}"
                               required>
                    </div>

                    <div class="col-md-3 mb-3">
                        <label class="form-label">
                            Lebar (cm)
                        </label>

                        <input type="number"
                               name="lebar"
                               class="form-control"
                               value="{{ old('lebar', $produk->lebar) }}"
                               required>
                    </div>

                    <div class="col-md-3 mb-3">
                        <label class="form-label">
                            Tinggi (cm)
                        </label>

                        <input type="number"
                               name="tinggi"
                               class="form-control"
                               value="{{ old('tinggi', $produk->tinggi) }}"
                               required>
                    </div>

                </div>

                <hr>

                {{-- FOTO PRODUK --}}
                <h5 class="fw-bold mb-3">
                    Foto Produk
                </h5>

                <p class="text-muted small">
                    Foto utama disimpan pada produk. Foto tambahan disimpan sebagai
                    multi foto pada tabel <strong>produk_fotos</strong>.
                </p>

                {{-- FOTO UTAMA --}}
                <div class="mb-4">

                    <label class="form-label fw-semibold">
                        Foto Utama
                    </label>

                    <div class="mb-2">

                        @if($produk->foto)

                            <img src="{{ asset('produk/' . $produk->foto) }}"
                                 class="img-thumbnail"
                                 style="width:220px;height:220px;object-fit:cover;">

                        @else

                            <div class="border rounded d-flex align-items-center justify-content-center"
                                 style="width:220px;height:220px;background:#f8f9fa;">

                                <span class="text-muted">
                                    Belum ada foto
                                </span>

                            </div>

                        @endif

                    </div>

                    <input type="file"
                           name="foto"
                           class="form-control"
                           accept=".jpg,.jpeg,.png">

                    <div class="form-text">
                        Format yang diperbolehkan: JPG, JPEG, PNG. Maksimal 2 MB.
                    </div>

                </div>

                {{-- FOTO TAMBAHAN --}}
                <div class="mb-3">

                    <label class="form-label fw-semibold">
                        Foto Tambahan
                    </label>

                    <input type="file"
                           name="fotos[]"
                           class="form-control"
                           accept=".jpg,.jpeg,.png"
                           multiple>

                    <div class="form-text">
                        Kamu dapat memilih beberapa foto sekaligus.
                        Format JPG, JPEG, PNG dengan ukuran maksimal 2 MB per foto.
                    </div>

                </div>

                {{-- FOTO LAMA --}}
                @if($produk->fotos && $produk->fotos->count() > 0)

                    <div class="mt-4">

                        <h6 class="fw-bold">
                            Foto Tambahan Saat Ini
                        </h6>

                        <div class="row">

                            @foreach($produk->fotos as $foto)

                                <div class="col-md-3 mb-3">

                                    <div class="card border">

                                        <img src="{{ asset('produk/' . $foto->foto) }}"
                                             class="card-img-top"
                                             style="height:180px;object-fit:cover;">

                                    </div>

                                </div>

                            @endforeach

                        </div>

                    </div>

                @endif

                <hr>

                {{-- BUTTON --}}
                <div class="d-flex justify-content-end gap-2 mt-4">

                    <a href="{{ route('produk.index') }}"
                       class="btn btn-secondary">
                        Batal
                    </a>

                    <button type="submit"
                            class="btn btn-success">
                         Simpan Perubahan
                    </button>

                </div>

            </form>

        </div>
    </div>

</div>

@endsection