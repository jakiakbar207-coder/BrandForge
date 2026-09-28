@extends('layouts.app')

@section('title', 'Dashboard Admin')

@section('content')

<div class="container-fluid">

    <h2 class="mb-4">Dashboard Admin</h2>

    <div class="row">

        <div class="col-md-4 mb-3">
            <div class="card bg-primary text-white">
                <div class="card-body">
                    <h5>Total Produk</h5>
                    <h2>120</h2>
                </div>
            </div>
        </div>

        <div class="col-md-4 mb-3">
            <div class="card bg-success text-white">
                <div class="card-body">
                    <h5>Total Kategori</h5>
                    <h2>12</h2>
                </div>
            </div>
        </div>

        <div class="col-md-4 mb-3">
            <div class="card bg-warning">
                <div class="card-body">
                    <h5>Stok Hampir Habis</h5>
                    <h2>5</h2>
                </div>
            </div>
        </div>

    </div>

</div>

@endsection