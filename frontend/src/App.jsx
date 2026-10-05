
import { Routes, Route, Navigate } from "react-router-dom";

import Index from "./pages/index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

import OwnerDashboard from "./pages/owner/OwnerDashboard";
import LaporanPage from "./pages/laporan/LaporanPage";

import KategoriListPage from "./pages/KategoriListPage";
import KategoriCreatePage from "./pages/KategoriCreatePage";
import KategoriEditPage from "./pages/KategoriEditPage";

import KoleksiListPage from "./pages/KoleksiListPage";
import KoleksiCreatePage from "./pages/KoleksiCreatePage";
import KoleksiEditPage from "./pages/KoleksiEditPage";

import ProdukListPage from "./pages/ProdukListPage";
import ProdukCreatePage from "./pages/ProdukCreatePage";
import ProdukEditPage from "./pages/ProdukEditPage";
    
import UkuranListPage from "./pages/UkuranListPage";
import UkuranCreatePage from "./pages/UkuranCreatePage";
import UkuranEditPage from "./pages/UkuranEditPage";

import WarnaListPage from "./pages/WarnaListPage";
import WarnaCreatePage from "./pages/WarnaCreatePage";
import WarnaEditPage from "./pages/WarnaEditPage";

import StokListPage from "./pages/StokListPage";
import StokCreatePage from "./pages/StokCreatePage";
import StokEditPage from "./pages/StokEditPage";

import SupplierListPage from "./pages/SupplierListPage";
import SupplierCreatePage from "./pages/SupplierCreatePage";
import SupplierEditPage from "./pages/SupplierEditPage";

import PembelianListPage from "./pages/PembelianListPage";
import PembelianCreatePage from "./pages/PembelianCreatePage";
import PembelianDetailPage from "./pages/PembelianDetailPage";
import PembelianEditPage from "./pages/PembelianEditPage";

import ReturListPage from "./pages/ReturListPage";
import ReturCreatePage from "./pages/ReturCreatePage";
import ReturDetailPage from "./pages/ReturDetailPage";
import ReturEditPage from "./pages/ReturEditPage";

import PengirimanListPage from "./pages/PengirimanListPage";
import PengirimanCreatePage from "./pages/PengirimanCreatePage";
import PengirimanEditPage from "./pages/PengirimanEditPage";

import BiayaOperasionalListPage from "./pages/BiayaOperasionalListPage";
import BiayaOperasionalCreatePage from "./pages/BiayaOperasionalCreatePage";
import BiayaOperasionalEditPage from "./pages/BiayaOperasionalEditPage";

import TransaksiListPage from "./pages/kasir/TransaksiListPage";
import TransaksiCreatePage from "./pages/kasir/TransaksiCreatePage";
import TransaksiDetailPage from "./pages/kasir/TransaksiDetailPage";
import PembayaranKasirPage from "./pages/kasir/PembayaranPage";
import VerifikasiPage from "./pages/kasir/VerifikasiPage";
import TransaksiSelesaiPage from "./pages/kasir/TransaksiSelesaiPage";
import StrukPage from "./pages/kasir/StrukPage";
import RiwayatTransaksiPage from "./pages/kasir/RiwayatTransaksiPage";
import PengirimanPage from "./pages/kasir/PengirimanPage";

import PelangganDashboard from "./pages/pelanggan/PelangganDashboard";
import BelanjaPage from "./pages/pelanggan/BelanjaPage";
import DetailProdukPage from "./pages/pelanggan/DetailProdukPage";
import WishlistPage from "./pages/pelanggan/WishlistPage";
import KeranjangPage from "./pages/pelanggan/KeranjangPage";
import CheckoutPage from "./pages/pelanggan/CheckoutPage";
import AlamatPage from "./pages/pelanggan/AlamatPage";
import PembayaranPage from "./pages/pelanggan/PembayaranPage";
import PesananPage from "./pages/pelanggan/PesananPage";
import TrackingPage from "./pages/pelanggan/TrackingPage";
import RiwayatPage from "./pages/pelanggan/RiwayatPage";
import ReviewPage from "./pages/pelanggan/ReviewPage";
import UploadFotoProdukPage from "./pages/pelanggan/UploadFotoProdukPage";
import NotifikasiPage from "./pages/pelanggan/NotifikasiPage";

import AdminLayout from "./components/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute";

import { DASHBOARD_ROLES } from "./config/roles";

const OWNER_ADMIN_ROLES = [
    "owner",
    "admin",
];

const OWNER_KASIR_ROLES = [
    "owner",
    "kasir",
];

const OWNER_PELANGGAN_ROLES = [
    "owner",
    "pelanggan",
];

function App() {
    return (
        <Routes>
            <Route
                path="/"
                element={<Index />}
            />

            <Route
                path="/login"
                element={<Login />}
            />

            <Route
                path="/register"
                element={<Register />}
            />

            <Route element={<ProtectedRoute />}>
                <Route
                    element={
                        <ProtectedRoute
                            allowedRoles={["owner"]}
                        />
                    }
                >
                    <Route
                        path="/owner"
                        element={<OwnerDashboard />}
                    />
                </Route>

                {/* Route Pelanggan */}
                <Route
                    element={
                        <ProtectedRoute
                            allowedRoles={OWNER_PELANGGAN_ROLES}
                        />
                    }
                >
                    <Route element={<AdminLayout />}>
                        <Route
                            path="/pelanggan"
                            element={<PelangganDashboard />}
                        />

                        <Route
                            path="/pelanggan/belanja"
                            element={<BelanjaPage />}
                        />

                        <Route
                            path="/pelanggan/detail/:id"
                            element={<DetailProdukPage />}
                        />

                        <Route
                            path="/pelanggan/wishlist"
                            element={<WishlistPage />}
                        />

                        <Route
                            path="/pelanggan/keranjang"
                            element={<KeranjangPage />}
                        />

                        <Route
                            path="/pelanggan/checkout"
                            element={<CheckoutPage />}
                        />

                        <Route
                            path="/pelanggan/alamat/:id"
                            element={<AlamatPage />}
                        />

                        <Route
                            path="/pelanggan/pembayaran/:id"
                            element={<PembayaranPage />}
                        />

                        <Route
                            path="/pelanggan/pesanan"
                            element={<PesananPage />}
                        />

                        <Route
                            path="/pelanggan/pesanan/:id/tracking"
                            element={<TrackingPage />}
                        />

                        <Route
                            path="/pelanggan/riwayat"
                            element={<RiwayatPage />}
                        />

                        <Route
                            path="/pelanggan/review/:detailTransaksiId"
                            element={<ReviewPage />}
                        />

                        <Route
                            path="/pelanggan/upload-foto/:transaksiId"
                            element={<UploadFotoProdukPage />}
                        />

                        <Route
                            path="/pelanggan/notifikasi"
                            element={<NotifikasiPage />}
                        />
                    </Route>
                </Route>

                {/* Route Admin dan Dashboard */}
                <Route element={<AdminLayout />}>
                    <Route
                        element={
                            <ProtectedRoute
                                allowedRoles={[
                                    ...DASHBOARD_ROLES,
                                    "owner",
                                ]}
                            />
                        }
                    >
                        <Route
                            path="/dashboard"
                            element={<Dashboard />}
                        />
                    </Route>

                    {/* Kategori, Koleksi, Produk, dan Master Data */}
                    <Route
                        element={
                            <ProtectedRoute
                                allowedRoles={OWNER_ADMIN_ROLES}
                            />
                        }
                    >
                        <Route
                            path="/kategori"
                            element={<KategoriListPage />}
                        />

                        <Route
                            path="/kategori/tambah"
                            element={<KategoriCreatePage />}
                        />

                        <Route
                            path="/kategori/edit/:id"
                            element={<KategoriEditPage />}
                        />

                        <Route
                            path="/koleksi"
                            element={<KoleksiListPage />}
                        />

                        <Route
                            path="/koleksi/create"
                            element={<KoleksiCreatePage />}
                        />

                        <Route
                            path="/koleksi/edit/:id"
                            element={<KoleksiEditPage />}
                        />

                        <Route
                            path="/produk"
                            element={<ProdukListPage />}
                        />

                        <Route
                            path="/produk/create"
                            element={<ProdukCreatePage />}
                        />

                        <Route
                            path="/produk/edit/:id"
                            element={<ProdukEditPage />}
                        />

                        <Route
                            path="/ukuran"
                            element={<UkuranListPage />}
                        />

                        <Route
                            path="/ukuran/create"
                            element={<UkuranCreatePage />}
                        />

                        <Route
                            path="/ukuran/edit/:id"
                            element={<UkuranEditPage />}
                        />

                        <Route
                            path="/warna"
                            element={<WarnaListPage />}
                        />

                        <Route
                            path="/warna/create"
                            element={<WarnaCreatePage />}
                        />

                        <Route
                            path="/warna/edit/:id"
                            element={<WarnaEditPage />}
                        />

                        <Route
                            path="/stok"
                            element={<StokListPage />}
                        />

                        <Route
                            path="/stok/create"
                            element={<StokCreatePage />}
                        />

                        <Route
                            path="/stok/edit/:id"
                            element={<StokEditPage />}
                        />

                        <Route
                            path="/supplier"
                            element={<SupplierListPage />}
                        />

                        <Route
                            path="/supplier/create"
                            element={<SupplierCreatePage />}
                        />

                        <Route
                            path="/supplier/edit/:id"
                            element={<SupplierEditPage />}
                        />

                        <Route
                            path="/pembelian"
                            element={<PembelianListPage />}
                        />

                        <Route
                            path="/pembelian/create"
                            element={<PembelianCreatePage />}
                        />

                        <Route
                            path="/pembelian/detail/:id"
                            element={<PembelianDetailPage />}
                        />

                        <Route
                            path="/pembelian/edit/:id"
                            element={<PembelianEditPage />}
                        />

                        <Route
                            path="/retur"
                            element={<ReturListPage />}
                        />

                        <Route
                            path="/retur/create"
                            element={<ReturCreatePage />}
                        />

                        <Route
                            path="/retur/detail/:id"
                            element={<ReturDetailPage />}
                        />

                        <Route
                            path="/retur/edit/:id"
                            element={<ReturEditPage />}
                        />

                        <Route
                            path="/pengiriman"
                            element={<PengirimanListPage />}
                        />

                        <Route
                            path="/pengiriman/create"
                            element={<PengirimanCreatePage />}
                        />

                        <Route
                            path="/pengiriman/edit/:id"
                            element={<PengirimanEditPage />}
                        />

                        <Route
                            path="/biaya-operasional"
                            element={<BiayaOperasionalListPage />}
                        />

                        <Route
                            path="/biaya-operasional/create"
                            element={<BiayaOperasionalCreatePage />}
                        />

                        <Route
                            path="/biaya-operasional/edit/:id"
                            element={<BiayaOperasionalEditPage />}
                        />
                    </Route>

                    {/* Route Kasir */}
                    <Route
                        element={
                            <ProtectedRoute
                                allowedRoles={OWNER_KASIR_ROLES}
                            />
                        }
                    >
                        <Route
                            path="/kasir"
                            element={<Dashboard />}
                        />

                        <Route
                            path="/kasir/transaksi"
                            element={<TransaksiListPage />}
                        />

                        <Route
                            path="/kasir/transaksi/create"
                            element={<TransaksiCreatePage />}
                        />

                        <Route
                            path="/kasir/transaksi/detail/:id"
                            element={<TransaksiDetailPage />}
                        />

                        <Route
                            path="/kasir/transaksi/pembayaran/:id"
                            element={<PembayaranKasirPage />}
                        />

                        <Route
                            path="/kasir/transaksi/verifikasi/:id"
                            element={<VerifikasiPage />}
                        />

                        <Route
                            path="/kasir/transaksi/selesai/:id"
                            element={<TransaksiSelesaiPage />}
                        />

                        <Route
                            path="/kasir/transaksi/struk/:id"
                            element={<StrukPage />}
                        />

                        <Route
                            path="/kasir/riwayat"
                            element={<RiwayatTransaksiPage />}
                        />

                        <Route
                            path="/kasir/pengiriman/:id"
                            element={<PengirimanPage />}
                        />
                    </Route>

                    {/* Route Laporan */}
                    <Route
                        element={
                            <ProtectedRoute
                                allowedRoles={["owner"]}
                            />
                        }
                    >
                        <Route
                            path="/laporan"
                            element={<LaporanPage />}
                        />
                    </Route>
                </Route>
            </Route>

            <Route
                path="*"
                element={
                    <Navigate
                        to="/"
                        replace
                    />
                }
            />
        </Routes>
    );
}

export default App;