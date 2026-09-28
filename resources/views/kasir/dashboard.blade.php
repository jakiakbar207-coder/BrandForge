@extends('layouts.app')

@section('title', 'Dashboard Kasir')

@section('content')

<div class="container-fluid">

    <h2 class="mb-4">Dashboard Kasir</h2>

    <div class="row">

    <div class="col-md-4 mb-3">
        <div class="card bg-warning text-white">
            <div class="card-body text-center">
                <h5>Menunggu Verifikasi</h5>
                <h2>{{ $menungguVerifikasi }}</h2>
            </div>
        </div>
    </div>

    <div class="col-md-4 mb-3">
        <div class="card bg-primary text-white">
            <div class="card-body text-center">
                <h5>Diproses</h5>
                <h2>{{ $diproses }}</h2>
            </div>
        </div>
    </div>

    <div class="col-md-4 mb-3">
        <div class="card bg-success text-white">
            <div class="card-body text-center">
                <h5>Selesai</h5>
                <h2>{{ $selesai }}</h2>
            </div>
        </div>
    </div>

</div>

</div>

@endsection