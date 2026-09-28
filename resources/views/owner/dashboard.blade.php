@extends('layouts.app')

@section('title', 'Dashboard Owner')

@section('content')

<div class="container-fluid">

    <h2 class="mb-4">Dashboard Owner</h2>

    <div class="row">

        <div class="col-md-3 mb-3">
            <div class="card bg-primary text-white shadow">
                <div class="card-body">
                    <h5>Total Produk</h5>
                    <h2>{{ $totalProduk }}</h2>
                </div>
            </div>
        </div>

        <div class="col-md-3 mb-3">
            <div class="card bg-success text-white shadow">
                <div class="card-body">
                    <h5>Total Transaksi</h5>
                    <h2>{{ $totalTransaksi }}</h2>
                </div>
            </div>
        </div>

        <div class="col-md-3 mb-3">
            <div class="card bg-warning text-dark shadow">
                <div class="card-body">
                    <h5>Pendapatan</h5>
                    <h2>Rp {{ number_format($pendapatan, 0, ',', '.') }}</h2>
                </div>
            </div>
        </div>

        <div class="col-md-3 mb-3">
            <div class="card bg-danger text-white shadow">
                <div class="card-body">
                    <h5>Produk Hampir Habis</h5>
                    <h2>{{ $produkHampirHabis }}</h2>
                </div>
            </div>
        </div>
      
    </div>

</div>

@endsection