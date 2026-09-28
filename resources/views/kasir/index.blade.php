@extends('layouts.app')

@section('title', 'Dashboard Kasir')

@section('content')

<style>

/* =========================================================
   DASHBOARD KASIR
========================================================= */

.kasir-dashboard {
    padding: 10px 5px 30px;
}


/* =========================================================
   HEADER
========================================================= */

.kasir-header {
    position: relative;

    background:
        linear-gradient(
            135deg,
            #0f172a,
            #1e3a8a,
            #2563eb
        );

    color: white;

    border-radius: 22px;

    padding: 28px 30px;

    margin-bottom: 25px;

    overflow: hidden;

    box-shadow:
        0 15px 35px rgba(15, 23, 42, 0.18);
}


.kasir-header::before {
    content: "";

    position: absolute;

    width: 220px;
    height: 220px;

    border-radius: 50%;

    right: -90px;
    top: -120px;

    background: rgba(255, 255, 255, 0.08);
}


.kasir-header::after {
    content: "";

    position: absolute;

    width: 120px;
    height: 120px;

    border-radius: 50%;

    right: 120px;
    bottom: -80px;

    background: rgba(96, 165, 250, 0.10);
}


.kasir-header-content {
    position: relative;

    z-index: 2;

    display: flex;

    align-items: center;

    justify-content: space-between;

    gap: 20px;
}


.kasir-title {
    display: flex;

    align-items: center;

    gap: 15px;
}


.kasir-icon {
    width: 55px;
    height: 55px;

    display: flex;

    align-items: center;
    justify-content: center;

    border-radius: 16px;

    background: rgba(255, 255, 255, 0.15);

    border: 1px solid rgba(255, 255, 255, 0.20);

    font-size: 26px;
}


.kasir-title h2 {
    margin: 0;

    font-size: 27px;

    font-weight: 700;
}


.kasir-title p {
    margin: 5px 0 0;

    color: #dbeafe;

    font-size: 14px;
}


/* =========================================================
   OWNER BUTTON
========================================================= */

.owner-button {
    display: inline-flex;

    align-items: center;

    gap: 8px;

    padding: 10px 17px;

    background: white;

    color: #1d4ed8;

    border-radius: 10px;

    text-decoration: none;

    font-size: 14px;

    font-weight: 600;

    transition: all 0.25s ease;
}


.owner-button:hover {
    background: #eff6ff;

    color: #1d4ed8;

    transform: translateY(-2px);

    box-shadow:
        0 8px 18px rgba(0, 0, 0, 0.15);
}


/* =========================================================
   SECTION TITLE
========================================================= */

.kasir-section-title {
    display: flex;

    align-items: center;

    justify-content: space-between;

    margin-bottom: 14px;
}


.kasir-section-title h4 {
    margin: 0;

    color: #1e293b;

    font-size: 18px;

    font-weight: 700;
}


.kasir-section-title span {
    color: #64748b;

    font-size: 13px;
}


/* =========================================================
   STATISTICS
========================================================= */

.kasir-stat-card {
    position: relative;

    background: white;

    border: 1px solid #e2e8f0;

    border-radius: 18px;

    padding: 22px;

    height: 100%;

    overflow: hidden;

    transition: all 0.3s ease;

    box-shadow:
        0 6px 20px rgba(15, 23, 42, 0.07);
}


.kasir-stat-card:hover {
    transform: translateY(-5px);

    box-shadow:
        0 15px 30px rgba(15, 23, 42, 0.12);
}


.kasir-stat-content {
    display: flex;

    align-items: center;

    justify-content: space-between;

    gap: 15px;
}


.kasir-stat-info span {
    display: block;

    color: #64748b;

    font-size: 13px;

    font-weight: 600;

    margin-bottom: 7px;
}


.kasir-stat-info h3 {
    margin: 0;

    font-size: 31px;

    font-weight: 750;

    color: #0f172a;
}


.kasir-stat-icon {
    width: 52px;
    height: 52px;

    display: flex;

    align-items: center;
    justify-content: center;

    border-radius: 14px;

    font-size: 23px;
}


/* =========================================================
   STAT COLORS
========================================================= */

.stat-warning {
    background: #fffbeb;

    border-color: #fde68a;
}


.stat-warning .kasir-stat-icon {
    background: #fef3c7;

    color: #d97706;
}


.stat-warning .kasir-stat-info h3 {
    color: #b45309;
}


.stat-process {
    background: #eff6ff;

    border-color: #bfdbfe;
}


.stat-process .kasir-stat-icon {
    background: #dbeafe;

    color: #2563eb;
}


.stat-process .kasir-stat-info h3 {
    color: #1d4ed8;
}


.stat-success {
    background: #f0fdf4;

    border-color: #bbf7d0;
}


.stat-success .kasir-stat-icon {
    background: #dcfce7;

    color: #16a34a;
}


.stat-success .kasir-stat-info h3 {
    color: #15803d;
}


/* =========================================================
   MENU SECTION
========================================================= */

.kasir-menu {
    margin-top: 25px;
}


/* =========================================================
   MENU CARD
========================================================= */

.kasir-menu-card {
    position: relative;

    background: white;

    border: 1px solid #e2e8f0;

    border-radius: 20px;

    padding: 25px;

    height: 100%;

    overflow: hidden;

    box-shadow:
        0 7px 22px rgba(15, 23, 42, 0.07);

    transition: all 0.3s ease;
}


.kasir-menu-card:hover {
    transform: translateY(-6px);

    border-color: #bfdbfe;

    box-shadow:
        0 16px 32px rgba(15, 23, 42, 0.12);
}


.kasir-menu-icon {
    width: 55px;
    height: 55px;

    display: flex;

    align-items: center;
    justify-content: center;

    border-radius: 15px;

    margin-bottom: 18px;

    font-size: 25px;
}


.transaksi-icon {
    background: #dbeafe;

    color: #2563eb;
}


.riwayat-icon {
    background: #dcfce7;

    color: #16a34a;
}


.kasir-menu-card h5 {
    margin-bottom: 8px;

    color: #0f172a;

    font-size: 19px;

    font-weight: 700;
}


.kasir-menu-card p {
    color: #64748b;

    font-size: 14px;

    line-height: 1.6;

    margin-bottom: 20px;
}


/* =========================================================
   BUTTON
========================================================= */

.kasir-btn {
    display: inline-flex;

    align-items: center;
    justify-content: center;

    gap: 8px;

    padding: 10px 17px;

    border-radius: 10px;

    text-decoration: none;

    font-size: 13px;

    font-weight: 650;

    transition: all 0.25s ease;
}


.kasir-btn-primary {
    background: #2563eb;

    color: white;
}


.kasir-btn-primary:hover {
    background: #1d4ed8;

    color: white;

    transform: translateY(-2px);

    box-shadow:
        0 7px 16px rgba(37, 99, 235, 0.25);
}


.kasir-btn-success {
    background: #16a34a;

    color: white;
}


.kasir-btn-success:hover {
    background: #15803d;

    color: white;

    transform: translateY(-2px);

    box-shadow:
        0 7px 16px rgba(22, 163, 74, 0.25);
}


/* =========================================================
   RESPONSIVE
========================================================= */

@media (max-width: 768px) {

    .kasir-dashboard {
        padding: 5px 0 25px;
    }


    .kasir-header {
        padding: 23px;

        border-radius: 18px;
    }


    .kasir-header-content {
        flex-direction: column;

        align-items: flex-start;
    }


    .owner-button {
        width: 100%;

        justify-content: center;
    }


    .kasir-title h2 {
        font-size: 23px;
    }


    .kasir-section-title span {
        display: none;
    }


    .kasir-stat-card {
        padding: 20px;
    }


    .kasir-stat-info h3 {
        font-size: 27px;
    }

}


@media (max-width: 500px) {

    .kasir-title {
        align-items: flex-start;
    }


    .kasir-icon {
        width: 48px;
        height: 48px;

        font-size: 22px;
    }


    .kasir-title h2 {
        font-size: 21px;
    }


    .kasir-title p {
        font-size: 12px;
    }


    .kasir-menu-card {
        padding: 22px;
    }

}

</style>


<div class="kasir-dashboard">


    <!-- =====================================================
         HEADER
    ====================================================== -->

    <div class="kasir-header">

        <div class="kasir-header-content">

            <div class="kasir-title">

                <div class="kasir-icon">
                    💰
                </div>

                <div>

                    <h2>
                        Dashboard Kasir
                    </h2>

                    <p>
                        Kelola transaksi dan pantau pesanan
                        BrandForge.
                    </p>

                </div>

            </div>


            @if(auth()->user()->role == 'owner')

                <a
                    href="/owner"
                    class="owner-button"
                >

                    <i class="bi bi-speedometer2"></i>

                    Dashboard Owner

                </a>

            @endif

        </div>

    </div>


    <!-- =====================================================
         STATISTIK
    ====================================================== -->

    <div class="kasir-section-title">

        <h4>
            Ringkasan Transaksi
        </h4>

        <span>
            Status transaksi saat ini
        </span>

    </div>


    <div class="row g-3">


        <!-- MENUNGGU VERIFIKASI -->

        <div class="col-md-4">

            <div class="kasir-stat-card stat-warning">

                <div class="kasir-stat-content">

                    <div class="kasir-stat-info">

                        <span>
                            Menunggu Verifikasi
                        </span>

                        <h3>
                            {{ $menungguVerifikasi }}
                        </h3>

                    </div>

                    <div class="kasir-stat-icon">
                        ⏳
                    </div>

                </div>

            </div>

        </div>


        <!-- DIPROSES -->

        <div class="col-md-4">

            <div class="kasir-stat-card stat-process">

                <div class="kasir-stat-content">

                    <div class="kasir-stat-info">

                        <span>
                            Sedang Diproses
                        </span>

                        <h3>
                            {{ $diproses }}
                        </h3>

                    </div>

                    <div class="kasir-stat-icon">
                        🔄
                    </div>

                </div>

            </div>

        </div>


        <!-- SELESAI -->

        <div class="col-md-4">

            <div class="kasir-stat-card stat-success">

                <div class="kasir-stat-content">

                    <div class="kasir-stat-info">

                        <span>
                            Transaksi Selesai
                        </span>

                        <h3>
                            {{ $selesai }}
                        </h3>

                    </div>

                    <div class="kasir-stat-icon">
                        ✓
                    </div>

                </div>

            </div>

        </div>

    </div>


    <!-- =====================================================
         MENU KASIR
    ====================================================== -->

    <div class="kasir-menu">

        <div class="kasir-section-title">

            <h4>
                Menu Kasir
            </h4>

            <span>
                Kelola transaksi penjualan
            </span>

        </div>


        <div class="row g-3">


            <!-- TRANSAKSI -->

            <div class="col-md-6">

                <div class="kasir-menu-card">

                    <div class="kasir-menu-icon transaksi-icon">
                        🛒
                    </div>

                    <h5>
                        Transaksi Penjualan
                    </h5>

                    <p>
                        Mulai transaksi baru, pilih produk,
                        kelola jumlah barang, dan proses
                        pembayaran pelanggan.
                    </p>

                    <a
                        href="{{ route('kasir.transaksi') }}"
                        class="kasir-btn kasir-btn-primary"
                    >

                        Buka Transaksi

                        <i class="bi bi-arrow-right"></i>

                    </a>

                </div>

            </div>


            <!-- RIWAYAT -->

            <div class="col-md-6">

                <div class="kasir-menu-card">

                    <div class="kasir-menu-icon riwayat-icon">
                        📋
                    </div>

                    <h5>
                        Riwayat Transaksi
                    </h5>

                    <p>
                        Lihat transaksi sebelumnya,
                        periksa status pembayaran,
                        dan pantau riwayat penjualan.
                    </p>

                    <a
                        href="{{ route('kasir.riwayat') }}"
                        class="kasir-btn kasir-btn-success"
                    >

                        Lihat Riwayat

                        <i class="bi bi-arrow-right"></i>

                    </a>

                </div>

            </div>


        </div>

    </div>


</div>

@endsection