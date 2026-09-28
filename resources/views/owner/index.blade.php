<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard Owner</title>

  <style>

/* =========================================================
   RESET
========================================================= */

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

html {
    scroll-behavior: smooth;
}

body {
    font-family: "Segoe UI", Arial, Helvetica, sans-serif;
    min-height: 100vh;

    background:
        radial-gradient(
            circle at 15% 10%,
            rgba(96, 165, 250, 0.18),
            transparent 28%
        ),
        radial-gradient(
            circle at 90% 90%,
            rgba(37, 99, 235, 0.20),
            transparent 30%
        ),
        linear-gradient(
            135deg,
            #0f172a 0%,
            #172554 48%,
            #1d4ed8 100%
        );

    color: #1e293b;
}


/* =========================================================
   CONTAINER
========================================================= */

.container {
    width: min(1200px, 92%);
    margin: auto;
    padding: 35px 0 50px;
}


/* =========================================================
   HEADER
========================================================= */

.header {
    position: relative;

    display: flex;
    align-items: center;
    gap: 12px;

    background: rgba(255, 255, 255, 0.97);

    border: 1px solid rgba(255, 255, 255, 0.7);

    border-radius: 24px;

    padding: 26px 30px;

    margin-bottom: 28px;

    box-shadow:
        0 20px 45px rgba(0, 0, 0, 0.18);

    overflow: hidden;
}


/* Dekorasi */

.header::before {
    content: "";

    position: absolute;

    width: 240px;
    height: 240px;

    right: -100px;
    top: -140px;

    border-radius: 50%;

    background: rgba(37, 99, 235, 0.08);
}

.header::after {
    content: "";

    position: absolute;

    width: 120px;
    height: 120px;

    right: 130px;
    bottom: -80px;

    border-radius: 50%;

    background: rgba(96, 165, 250, 0.08);
}


/* =========================================================
   HEADER TITLE
========================================================= */

.header-title {
    position: relative;

    z-index: 2;

    display: flex;
    align-items: center;

    gap: 14px;

    margin-right: auto;
}


/* Icon Owner */

.owner-icon {
    width: 54px;
    height: 54px;

    display: flex;
    align-items: center;
    justify-content: center;

    border-radius: 15px;

    background:
        linear-gradient(
            135deg,
            #2563eb,
            #1d4ed8
        );

    color: white;

    font-size: 25px;

    box-shadow:
        0 8px 20px rgba(37, 99, 235, 0.25);
}


/* Judul */

.header h1 {
    color: #0f172a;

    font-size: 26px;

    font-weight: 750;

    line-height: 1.2;
}


/* Subtitle */

.header-subtitle {
    color: #64748b;

    font-size: 13px;

    margin-top: 4px;
}


/* =========================================================
   HEADER BUTTON
========================================================= */

.header-actions {
    position: relative;

    z-index: 5;

    display: flex;

    align-items: center;

    gap: 10px;
}


/* Website */

.btn-website {
    display: inline-flex;

    align-items: center;

    justify-content: center;

    gap: 8px;

    padding: 11px 17px;

    border-radius: 11px;

    background: #eff6ff;

    border: 1px solid #dbeafe;

    color: #1d4ed8;

    text-decoration: none;

    font-size: 14px;

    font-weight: 650;

    transition: all 0.25s ease;
}


.btn-website:hover {
    background: #2563eb;

    color: white;

    border-color: #2563eb;

    transform: translateY(-2px);

    box-shadow:
        0 8px 18px rgba(37, 99, 235, 0.22);
}


/* Logout */

.logout {
    margin: 0;
}


.logout button {
    display: inline-flex;

    align-items: center;

    justify-content: center;

    gap: 8px;

    padding: 11px 17px;

    border-radius: 11px;

    background: #fff1f2;

    border: 1px solid #fecdd3;

    color: #e11d48;

    font-size: 14px;

    font-weight: 650;

    cursor: pointer;

    transition: all 0.25s ease;
}


.logout button:hover {
    background: #e11d48;

    color: white;

    border-color: #e11d48;

    transform: translateY(-2px);

    box-shadow:
        0 8px 18px rgba(225, 29, 72, 0.20);
}


/* =========================================================
   SECTION TITLE
========================================================= */

.section-title {
    display: flex;

    align-items: center;

    justify-content: space-between;

    margin-bottom: 15px;

    color: white;
}


.section-title h2 {
    font-size: 19px;

    font-weight: 650;
}


.section-title span {
    font-size: 13px;

    color: #bfdbfe;
}


/* =========================================================
   MENU
========================================================= */

.menu {
    display: grid;

    grid-template-columns:
        repeat(3, 1fr);

    gap: 18px;
}


/* =========================================================
   CARD
========================================================= */

.card {
    position: relative;

    background: rgba(255, 255, 255, 0.98);

    border: 1px solid rgba(255, 255, 255, 0.8);

    border-radius: 20px;

    padding: 25px;

    min-height: 245px;

    display: flex;

    flex-direction: column;

    align-items: flex-start;

    box-shadow:
        0 10px 30px rgba(15, 23, 42, 0.12);

    overflow: hidden;

    transition:
        transform 0.3s ease,
        box-shadow 0.3s ease,
        border-color 0.3s ease;
}


/* Garis atas */

.card::before {
    content: "";

    position: absolute;

    left: 0;
    top: 0;

    width: 100%;
    height: 4px;

    background:
        linear-gradient(
            90deg,
            #2563eb,
            #60a5fa
        );
}


/* Lingkaran dekorasi */

.card::after {
    content: "";

    position: absolute;

    width: 100px;
    height: 100px;

    right: -35px;
    bottom: -40px;

    border-radius: 50%;

    background: rgba(37, 99, 235, 0.05);
}


/* Hover */

.card:hover {
    transform: translateY(-7px);

    border-color: #bfdbfe;

    box-shadow:
        0 20px 40px rgba(15, 23, 42, 0.16);
}


/* =========================================================
   CARD ICON
========================================================= */

.card-icon {
    width: 50px;
    height: 50px;

    display: flex;

    align-items: center;
    justify-content: center;

    border-radius: 14px;

    background: #eff6ff;

    color: #2563eb;

    font-size: 23px;

    margin-bottom: 18px;

    transition: all 0.25s ease;
}


.card:hover .card-icon {
    background: #2563eb;

    color: white;

    transform: scale(1.05);
}


/* =========================================================
   CARD TITLE
========================================================= */

.card h2 {
    position: relative;

    z-index: 2;

    color: #0f172a;

    font-size: 19px;

    font-weight: 700;

    margin-bottom: 8px;
}


/* =========================================================
   CARD DESCRIPTION
========================================================= */

.card p {
    position: relative;

    z-index: 2;

    color: #64748b;

    font-size: 13px;

    line-height: 1.65;

    margin-bottom: 20px;

    max-width: 300px;
}


/* =========================================================
   CARD BUTTON
========================================================= */

.card .btn {
    position: relative;

    z-index: 3;

    display: inline-flex;

    align-items: center;

    justify-content: center;

    gap: 7px;

    margin-top: auto;

    padding: 10px 17px;

    border-radius: 10px;

    background: #2563eb;

    color: white;

    text-decoration: none;

    font-size: 13px;

    font-weight: 650;

    transition: all 0.25s ease;
}


.card .btn:hover {
    background: #1d4ed8;

    transform: translateY(-2px);

    box-shadow:
        0 8px 18px rgba(37, 99, 235, 0.25);
}


/* =========================================================
   LAPORAN CARD
========================================================= */

.card-laporan {
    grid-column: span 3;

    min-height: 190px;

    flex-direction: row;

    align-items: center;

    gap: 22px;

    background:
        linear-gradient(
            135deg,
            #ffffff 0%,
            #eff6ff 100%
        );
}


/* Icon laporan */

.card-laporan .card-icon {
    flex-shrink: 0;

    width: 65px;
    height: 65px;

    font-size: 30px;

    background: #dbeafe;
}


/* Isi laporan */

.laporan-content {
    position: relative;

    z-index: 2;

    flex: 1;
}


.laporan-content h2 {
    margin-bottom: 7px;
}


.laporan-content p {
    margin-bottom: 0;

    max-width: 600px;
}


/* Tombol laporan */

.card-laporan .btn {
    flex-shrink: 0;

    margin-top: 0;

    padding: 12px 20px;
}


/* =========================================================
   FOOTER INFO
========================================================= */

.footer-info {
    margin-top: 24px;

    padding: 16px 20px;

    background: rgba(255, 255, 255, 0.10);

    border: 1px solid rgba(255, 255, 255, 0.12);

    border-radius: 14px;

    text-align: center;

    color: #dbeafe;

    font-size: 12px;
}


/* =========================================================
   TABLET
========================================================= */

@media (max-width: 950px) {

    .menu {
        grid-template-columns: repeat(2, 1fr);
    }

    .card-laporan {
        grid-column: span 2;
    }

}


/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 650px) {

    .container {
        width: 94%;

        padding: 20px 0 35px;
    }


    /* Header */

    .header {
        padding: 22px;

        flex-direction: column;

        align-items: stretch;

        gap: 15px;
    }


    .header-title {
        margin-right: 0;
    }


    .owner-icon {
        width: 48px;
        height: 48px;

        font-size: 22px;
    }


    .header h1 {
        font-size: 22px;
    }


    .header-subtitle {
        font-size: 12px;
    }


    .header-actions {
        width: 100%;

        display: grid;

        grid-template-columns: 1fr 1fr;
    }


    .btn-website,
    .logout button {
        width: 100%;
    }


    /* Section */

    .section-title {
        margin-bottom: 12px;
    }


    .section-title h2 {
        font-size: 17px;
    }


    .section-title span {
        display: none;
    }


    /* Cards */

    .menu {
        grid-template-columns: 1fr;

        gap: 15px;
    }


    .card {
        min-height: 220px;

        padding: 23px;
    }


    .card-laporan {
        grid-column: span 1;

        min-height: auto;

        flex-direction: column;

        align-items: flex-start;
    }


    .card-laporan .btn {
        margin-top: 5px;
    }

}


/* =========================================================
   SMALL MOBILE
========================================================= */

@media (max-width: 400px) {

    .header-actions {
        grid-template-columns: 1fr;
    }

}

</style>


</head>

<body>


<div class="container">


    <!-- =====================================================
         HEADER
    ====================================================== -->

    <div class="header">


        <div class="header-title">

            <div class="owner-icon">
                👑
            </div>

            <div>

                <h1>
                    Dashboard Owner
                </h1>

                <div class="header-subtitle">
                    Kelola dan pantau sistem BrandForge
                </div>

            </div>

        </div>


        <div class="header-actions">

            <!-- Logout -->

            <form
                class="logout"
                method="POST"
                action="{{ route('logout') }}"
            >

                @csrf

                <button type="submit">

                    <i class="bi bi-box-arrow-right"></i>

                    Logout

                </button>

            </form>


        </div>


    </div>


    <!-- =====================================================
         SECTION TITLE
    ====================================================== -->

    <div class="section-title">

        <h2>
            Menu Utama
        </h2>

        <span>
            Owner Control Panel
        </span>

    </div>


    <!-- =====================================================
         MENU
    ====================================================== -->

    <div class="menu">


        <!-- ADMIN -->

        <div class="card">

            <div class="card-icon">
                🛠️
            </div>

            <h2>
                Admin
            </h2>

            <p>
                Kelola produk, koleksi, kategori,
                stok, retur, dan data toko.
            </p>

            <a
                href="/admin"
                class="btn"
            >

                Buka Admin
                <i class="bi bi-arrow-right"></i>

            </a>

        </div>


        <!-- KASIR -->

        <div class="card">

            <div class="card-icon">
                💰
            </div>

            <h2>
                Kasir
            </h2>

            <p>
                Kelola transaksi penjualan,
                pembayaran, dan proses pesanan.
            </p>

            <a
                href="/kasir"
                class="btn"
            >

                Buka Kasir
                <i class="bi bi-arrow-right"></i>

            </a>

        </div>


        <!-- PELANGGAN -->

        <div class="card">

            <div class="card-icon">
                🛒
            </div>

            <h2>
                Pelanggan
            </h2>

            <p>
                Lihat tampilan toko sebagaimana
                yang digunakan oleh pelanggan.
            </p>

            <a
                href="/pelanggan"
                class="btn"
            >

                Buka Pelanggan
                <i class="bi bi-arrow-right"></i>

            </a>

        </div>


        <!-- LAPORAN -->

        <div class="card card-laporan">

            <div class="card-icon">
                📊
            </div>


            <div class="laporan-content">

                <h2>
                    Dashboard Laporan
                </h2>

                <p>
                    Pantau statistik bisnis, grafik penjualan,
                    laba/rugi, serta export laporan ke PDF dan Excel.
                </p>

            </div>


            <a
                href="{{ route('laporan.index') }}"
                class="btn"
            >

                Buka Dashboard

                <i class="bi bi-arrow-right"></i>

            </a>

        </div>


    </div>


    <!-- =====================================================
         FOOTER
    ====================================================== -->

    <div class="footer-info">

        🔐
        Area Owner —
        Akses penuh untuk mengelola dan memantau BrandForge

    </div>


</div>


</body>
</html>