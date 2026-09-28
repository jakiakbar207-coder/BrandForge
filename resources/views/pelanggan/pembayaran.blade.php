@extends('layouts.app')

@section('title', 'Pembayaran')

@section('content')

<div class="container py-4">
    <h2 class="mb-3">
        💳 Pilih Metode Pembayaran
    </h2>

    <div class="row">

        <!-- DANA -->
        <div class="col-md-6 mb-4">

            <div class="card shadow h-100">

                <div class="card-body text-center">

                    <img src="{{ asset('images/dana.png') }}"
                         width="120"
                         class="mb-3">

                    <h4>DANA</h4>

                    <p class="mb-1">
                        Transfer ke:
                    </p>

                    <h5 class="text-primary">
                        085185912967
                    </h5>

                    <button
                        class="btn btn-outline-primary mt-2"
                        onclick="copyDana()">

                        📋 Salin Nomor

                    </button>

                    <br><br>

                    <a href="dana://"
                       class="btn btn-primary">

                        📱 Buka Aplikasi DANA

                    </a>

                </div>

            </div>

        </div>

        <!-- GOPAY -->
        <div class="col-md-6 mb-4">

            <div class="card shadow h-100">

                <div class="card-body text-center">

                    <img src="{{ asset('images/gopay.png') }}"
                         width="120"
                         class="mb-3">

                    <h4>GoPay</h4>

                    <p class="mb-1">
                        Transfer ke:
                    </p>

                    <h5 class="text-success">
                        081998166976
                    </h5>

                    <button
                        class="btn btn-outline-success mt-2"
                        onclick="copyGopay()">

                        📋 Salin Nomor

                    </button>

                    <br><br>

                    <a href="gojek://"
                       class="btn btn-success">

                        📱 Buka Aplikasi GoPay

                    </a>

                </div>

            </div>

        </div>

    </div>
      @php
        $ongkir = 10000;
        $totalPembayaran = $hargaProduk + $ongkir;
    @endphp

        <div class="card pembayaran-detail">

            <h3>🛒 Detail Pembayaran</h3>

                    <table class="table">
                       <tr>
                        <td>Harga Produk</td>
                        <td>
                            Rp {{ number_format($hargaProduk,0,',','.') }}
                        </td>
                    </tr>

                    <tr>
                        <td>Ongkir Bandung</td>
                        <td>
                            Rp {{ number_format($ongkir,0,',','.') }}
                        </td>
                    </tr>

                    <tr>
                        <th>Total Pembayaran</th>
                        <th>
                            Rp {{ number_format($totalPembayaran,0,',','.') }}
                        </th>
                    </tr>
                    </table>

                </div>


    <div class="card shadow">

        <div class="card-header bg-dark text-white">

            Upload Bukti Transfer

        </div>

        <div class="card-body">

          <form action="{{ route('pelanggan.upload', $transaksi->id) }}"
                method="POST"
                enctype="multipart/form-data">

                @csrf

                <div class="mb-3">

                    <label class="form-label">


                    </label>
                        <input type="file"
                            name="bukti"
                            class="form-control"
                            required>

                </div>

                <div class="d-flex justify-content-between">

                    <a href="{{ route('pelanggan.dashboardBelanja') }}"
                        class="btn btn-secondary">
                            ← Kembali
                        </a>
                    <button class="btn btn-primary">

                        Kirim Pembayaran

                    </button>

                </div>

            </form>

        </div>

    </div>

</div>

<script>

function copyDana() {

    navigator.clipboard.writeText("085185912967");

    alert("Nomor DANA berhasil disalin.");

}

function copyGopay() {

    navigator.clipboard.writeText("081998166976");

    alert("Nomor GoPay berhasil disalin.");

}

</script>

@endsection