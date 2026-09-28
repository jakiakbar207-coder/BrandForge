@extends('layouts.app')

@section('title', 'Keranjang')

@section('content')

<div class="container py-4">

    <h2 class="mb-4">
        🛒 Keranjang Belanja
    </h2>

   @if($keranjangs->count() > 0)
        <div class="table-responsive">

            <table class="table table-bordered align-middle">

                <thead class="table-dark">

                    <tr>
                        <th>Foto</th>
                        <th>Produk</th>
                        <th>Warna</th>
                        <th>Ukuran</th>
                        <th>Harga</th>
                        <th>Jumlah</th>
                        <th>Subtotal</th>
                        <th>Aksi</th>
                    </tr>

                </thead>

                <tbody>

                    @php
                        $total = 0;
                    @endphp

                    @foreach($keranjangs as $item)

                        @php
                            $subtotal = $item->produk->harga * $item->jumlah;
                            $total += $subtotal;
                        @endphp

                        <tr>

                            <td width="120">

                                @if($item->produk->foto)

                                    <img src="{{ asset('storage/'.$item->produk->foto) }}"
                                         class="img-fluid rounded">

                                @else

                                    <img src="https://via.placeholder.com/100"
                                         class="img-fluid rounded">

                                @endif

                            </td>

                            <td>
                                {{ $item->produk->nama_produk }}
                            </td>

                           <td>
                                {{ $item->warna->nama_warna }}
                            </td>

                            <td>
                                {{ $item->ukuran->nama_ukuran }}
                            </td>
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

                            <td>

                                <form action="{{ route('keranjang.destroy',$item->id) }}"
                                      method="POST">

                                    @csrf
                                    @method('DELETE')

                                    <button class="btn btn-danger btn-sm">

                                        Hapus

                                    </button>

                                </form>

                            </td>

                        </tr>

                    @endforeach

                </tbody>

                <tfoot>

                    <tr>

                        <th colspan="6" class="text-end">

                            Total

                        </th>

                        <th>

                            Rp {{ number_format($total,0,',','.') }}

                        </th>

                        <th></th>

                    </tr>

                </tfoot>

            </table>

        </div>

        <div class="d-flex justify-content-between mt-4">

            <a href="{{ route('pelanggan.belanja') }}"
               class="btn btn-secondary">

                ← Lanjut Belanja

            </a>

            <a href="{{ route('pelanggan.checkout') }}"
               class="btn btn-success">

                ⚡ Checkout

            </a>

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