```blade
@extends('layouts.app')

@section('title', 'Dashboard Status')

@section('content')

<style>

/* =========================================================
   DASHBOARD STATUS BRANDFORGE
========================================================= */

.status-dashboard {
    padding: 10px 0 40px;
}


/* =========================================================
   HERO
========================================================= */

.status-hero {
    position: relative;
    overflow: hidden;

    padding: 32px 35px;
    margin-bottom: 28px;

    border-radius: 22px;

    color: white;

    background:
        radial-gradient(
            circle at 90% 10%,
            rgba(255,255,255,.18),
            transparent 30%
        ),
        linear-gradient(
            135deg,
            #0f172a 0%,
            #1e3a8a 48%,
            #2563eb 100%
        );

    box-shadow:
        0 14px 35px rgba(15,23,42,.16);
}

.status-hero::before {
    content: "";

    position: absolute;

    width: 230px;
    height: 230px;

    border-radius: 50%;

    right: -70px;
    top: -130px;

    background: rgba(255,255,255,.07);
}

.status-hero::after {
    content: "";

    position: absolute;

    width: 130px;
    height: 130px;

    border-radius: 50%;

    right: 160px;
    bottom: -90px;

    background: rgba(96,165,250,.10);
}

.status-hero-content {
    position: relative;
    z-index: 2;
}

.status-hero-title {
    display: flex;
    align-items: center;
    gap: 12px;

    margin-bottom: 8px;

    font-size: 29px;
    font-weight: 750;
}

.status-hero-title .hero-icon {
    width: 48px;
    height: 48px;

    display: flex;
    align-items: center;
    justify-content: center;

    border-radius: 14px;

    background: rgba(255,255,255,.13);

    font-size: 23px;
}

.status-hero p {
    margin: 0;

    color: #dbeafe;

    font-size: 14px;
}


/* =========================================================
   OWNER BUTTON
========================================================= */

.owner-button {
    position: relative;
    z-index: 3;

    display: inline-flex;

    align-items: center;
    gap: 7px;

    padding: 10px 17px;

    color: #0f172a;

    background: white;

    border: none;
    border-radius: 10px;

    text-decoration: none;

    font-size: 13px;
    font-weight: 700;

    transition: .25s ease;
}

.owner-button:hover {
    color: #0f172a;

    transform: translateY(-2px);

    box-shadow:
        0 8px 18px rgba(0,0,0,.18);
}


/* =========================================================
   WELCOME
========================================================= */

.welcome-box {
    display: flex;

    align-items: center;
    gap: 15px;

    padding: 17px 20px;

    margin-bottom: 25px;

    border: 1px solid #bfdbfe;

    border-radius: 15px;

    background: #eff6ff;

    color: #1e3a8a;
}

.welcome-icon {
    width: 42px;
    height: 42px;

    flex-shrink: 0;

    display: flex;

    align-items: center;
    justify-content: center;

    border-radius: 12px;

    background: #dbeafe;

    font-size: 20px;
}

.welcome-box strong {
    display: block;

    margin-bottom: 2px;

    font-size: 14px;
}

.welcome-box span {
    color: #64748b;

    font-size: 12px;
}


/* =========================================================
   SECTION TITLE
========================================================= */

.status-section-title {
    display: flex;

    align-items: center;
    justify-content: space-between;

    margin-bottom: 15px;
}

.status-section-title h4 {
    margin: 0;

    color: #0f172a;

    font-size: 19px;
    font-weight: 750;
}

.status-section-title span {
    color: #64748b;

    font-size: 12px;
}


/* =========================================================
   STAT CARD
========================================================= */

.status-card {
    position: relative;

    height: 100%;

    overflow: hidden;

    padding: 20px;

    background: white;

    border: 1px solid #e2e8f0;

    border-radius: 17px;

    box-shadow:
        0 6px 20px rgba(15,23,42,.06);

    transition:
        transform .25s ease,
        box-shadow .25s ease,
        border-color .25s ease;
}

.status-card:hover {
    transform: translateY(-5px);

    border-color: #bfdbfe;

    box-shadow:
        0 14px 30px rgba(15,23,42,.11);
}

.status-card::before {
    content: "";

    position: absolute;

    left: 0;
    top: 0;

    width: 100%;
    height: 4px;

    background: var(--status-color);
}

.status-top {
    display: flex;

    align-items: center;
    justify-content: space-between;

    margin-bottom: 17px;
}

.status-icon {
    width: 47px;
    height: 47px;

    display: flex;

    align-items: center;
    justify-content: center;

    border-radius: 13px;

    background: var(--status-bg);

    color: var(--status-color);

    font-size: 21px;
}

.status-label {
    color: #64748b;

    font-size: 12px;
    font-weight: 600;
}

.status-number {
    margin: 0;

    color: #0f172a;

    font-size: 29px;
    font-weight: 750;

    line-height: 1;
}


/* =========================================================
   COLOR VARIANTS
========================================================= */

.status-total {
    --status-color: #2563eb;
    --status-bg: #dbeafe;
}

.status-waiting {
    --status-color: #64748b;
    --status-bg: #f1f5f9;
}

.status-unpaid {
    --status-color: #d97706;
    --status-bg: #fef3c7;
}

.status-process {
    --status-color: #0891b2;
    --status-bg: #cffafe;
}

.status-shipped {
    --status-color: #7c3aed;
    --status-bg: #ede9fe;
}

.status-complete {
    --status-color: #16a34a;
    --status-bg: #dcfce7;
}


/* =========================================================
   ACTION
========================================================= */

.status-actions {
    display: flex;

    flex-wrap: wrap;

    gap: 12px;

    margin-top: 28px;

    padding-top: 22px;

    border-top: 1px solid #e2e8f0;
}

.action-button {
    display: inline-flex;

    align-items: center;
    justify-content: center;

    gap: 8px;

    padding: 11px 18px;

    border-radius: 10px;

    text-decoration: none;

    font-size: 13px;
    font-weight: 650;

    transition: .25s ease;
}

.action-button:hover {
    transform: translateY(-2px);
}

.action-website {
    color: white;

    background: #2563eb;
}

.action-website:hover {
    color: white;

    background: #1d4ed8;

    box-shadow:
        0 7px 16px rgba(37,99,235,.25);
}

.action-history {
    color: white;

    background: #16a34a;
}

.action-history:hover {
    color: white;

    background: #15803d;

    box-shadow:
        0 7px 16px rgba(22,163,74,.25);
}


/* =========================================================
   RESPONSIVE
========================================================= */

@media (max-width: 768px) {

    .status-hero {
        padding: 25px 22px;
    }

    .status-hero-title {
        font-size: 24px;
    }

    .status-hero-title .hero-icon {
        width: 42px;
        height: 42px;
    }

    .status-section-title span {
        display: none;
    }

    .status-actions {
        flex-direction: column;
    }

    .action-button {
        width: 100%;
    }
}

@media (max-width: 500px) {

    .status-hero {
        border-radius: 18px;
    }

    .status-hero-title {
        font-size: 21px;
    }

    .welcome-box {
        padding: 14px;
    }

    .status-card {
        padding: 18px;
    }

}

</style>


<div class="status-dashboard">


    {{-- =====================================================
         HERO
    ====================================================== --}}

    <div class="status-hero">

        <div class="status-hero-content">

            <div class="d-flex justify-content-between align-items-center gap-3 flex-wrap">

                <div>

                    <div class="status-hero-title">

                        <div class="hero-icon">
                            📊
                        </div>

                        <span>
                            Dashboard Status
                        </span>

                    </div>

                    <p>
                        Pantau seluruh status pesananmu
                        di BrandForge.
                    </p>

                </div>


                @if(Auth::user()->role == 'owner')

                    <a
                        href="{{ route('owner.index') }}"
                        class="owner-button"
                    >
                        <i class="bi bi-speedometer2"></i>
                        Dashboard Owner
                    </a>

                @endif

            </div>

        </div>

    </div>


    {{-- =====================================================
         WELCOME
    ====================================================== --}}

    <div class="welcome-box">

        <div class="welcome-icon">
            👋
        </div>

        <div>

            <strong>
                Selamat datang di BrandForge
            </strong>

            <span>
                Cek perkembangan pesananmu dengan mudah
                melalui dashboard ini.
            </span>

        </div>

    </div>


    {{-- =====================================================
         STATUS PESANAN
    ====================================================== --}}

    <div class="status-section-title">

        <h4>
            Ringkasan Pesanan
        </h4>

        <span>
            Status pesanan kamu
        </span>

    </div>


    <div class="row g-3">


        {{-- TOTAL PESANAN --}}

        <div class="col-6 col-md-4 col-lg-2">

            <div class="status-card status-total">

                <div class="status-top">

                    <div class="status-icon">
                        🛍️
                    </div>

                </div>

                <div class="status-label">
                    Total Pesanan
                </div>

                <h2 class="status-number">
                    {{ $totalPesanan }}
                </h2>

            </div>

        </div>


        {{-- MENUNGGU VERIFIKASI --}}

        <div class="col-6 col-md-4 col-lg-2">

            <div class="status-card status-waiting">

                <div class="status-top">

                    <div class="status-icon">
                        ⏳
                    </div>

                </div>

                <div class="status-label">
                    Menunggu Verifikasi
                </div>

                <h2 class="status-number">
                    {{ $menungguVerifikasi }}
                </h2>

            </div>

        </div>


        {{-- BELUM BAYAR --}}

        <div class="col-6 col-md-4 col-lg-2">

            <div class="status-card status-unpaid">

                <div class="status-top">

                    <div class="status-icon">
                        💳
                    </div>

                </div>

                <div class="status-label">
                    Belum Bayar
                </div>

                <h2 class="status-number">
                    {{ $belumBayar }}
                </h2>

            </div>

        </div>


        {{-- DIPROSES --}}

        <div class="col-6 col-md-4 col-lg-2">

            <div class="status-card status-process">

                <div class="status-top">

                    <div class="status-icon">
                        ⚙️
                    </div>

                </div>

                <div class="status-label">
                    Diproses
                </div>

                <h2 class="status-number">
                    {{ $diproses }}
                </h2>

            </div>

        </div>


        {{-- DIKIRIM --}}

        <div class="col-6 col-md-4 col-lg-2">

            <div class="status-card status-shipped">

                <div class="status-top">

                    <div class="status-icon">
                        🚚
                    </div>

                </div>

                <div class="status-label">
                    Dikirim
                </div>

                <h2 class="status-number">
                    {{ $dikirim }}
                </h2>

            </div>

        </div>


        {{-- SELESAI --}}

        <div class="col-6 col-md-4 col-lg-2">

            <div class="status-card status-complete">

                <div class="status-top">

                    <div class="status-icon">
                        ✓
                    </div>

                </div>

                <div class="status-label">
                    Selesai
                </div>

                <h2 class="status-number">
                    {{ $selesai }}
                </h2>

            </div>

        </div>


    </div>


    {{-- =====================================================
         ACTION
    ====================================================== --}}

    <div class="status-actions">

        <a
            href="{{ route('pelanggan.riwayat') }}"
            class="action-button action-history"
        >
            <i class="bi bi-clock-history"></i>
            Riwayat Pesanan
        </a>

    </div>


</div>

@endsection
```
