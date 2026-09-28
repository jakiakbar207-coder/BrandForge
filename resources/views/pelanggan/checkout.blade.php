@extends('layouts.app')

@section('title', 'Checkout')

@section('content')

<div class="container py-4">

    <h2 class="mb-4">
        ⚡ Checkout
    </h2>

    @if($keranjangs->count() > 0)

        <div class="card shadow">

            <div class="card-header bg-primary text-white">
                Ringkasan Pesanan
            </div>

            <div class="card-body">

                <table class="table">

                    <thead>

                        <tr>
                            <th>Produk</th>
                            <th>Warna</th>
                            <th>Ukuran</th>
                            <th>Harga</th>
                            <th>Jumlah</th>
                            <th>Subtotal</th>
                        </tr>

                    </thead>

                    <tbody>

                        @foreach($keranjangs as $item)

                            @php
                                $subtotal = $item->produk->harga * $item->jumlah;
                            @endphp

                            <tr>

                                <td>
                                    {{ $item->produk->nama_produk }}
                                </td>

                                <td>
                                    {{ $item->warna->nama_warna }}
                                </td>

                                <td>
                                    {{ $item->ukuran->nama_ukuran }}
                                </td>

                                <td>
                                    Rp {{ number_format($item->produk->harga,0,',','.') }}
                                </td>

                                <td>
                                    {{ $item->jumlah }}
                                </td>

                                <td>
                                    Rp {{ number_format($subtotal,0,',','.') }}
                                </td>

                            </tr>

                        @endforeach

                    </tbody>

                    <tfoot>

                        <tr>

                            <th colspan="5" class="text-end">
                                Total Bayar
                            </th>

                           <th class="text-success">
                                Rp {{ number_format($total,0,',','.') }}
                            </th>
                        </tr>

                    </tfoot>

                </table>
                <div class="alert alert-info">

                    <b>Ongkir:</b>
                    Pilih setelah mengisi alamat

                    <br>

                    <b>Total + Ongkir:</b>
                    Menunggu perhitungan kurir

                </div>

                <hr>
                  <div class="d-flex justify-content-between">

                    <a href="{{ route('pelanggan.keranjang') }}" 
                    class="btn btn-secondary">
                        ← Kembali ke Keranjang
                    </a>


                    <form action="{{ route('pelanggan.prosesCheckout') }}" method="POST">

                        @csrf

                        <button type="submit" class="btn btn-success">
                            Isi Alamat →
                        </button>

                    </form>

                </div>

            </div>

        </div>

    @else

        <div class="alert alert-warning">

            Keranjang masih kosong.

        </div>

        <a href="{{ route('pelanggan.belanja') }}"
            class="btn btn-primary">

            🛍️ Belanja Produk

        </a>

    @endif

</div>

@endsection