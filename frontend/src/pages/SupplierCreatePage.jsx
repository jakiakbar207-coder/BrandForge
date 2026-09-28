import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import { createSupplier } from "../api/supplier";

import FormModal from "../components/common/FormModal";

import "./Supplier.css";

function SupplierCreatePage() {
    const navigate = useNavigate();

    const [namaSupplier, setNamaSupplier] = useState("");
    const [kontak, setKontak] = useState("");
    const [email, setEmail] = useState("");
    const [alamat, setAlamat] = useState("");

    const [loadingSubmit, setLoadingSubmit] = useState(false);

    const handleSubmit = async () => {
        const nama = namaSupplier.trim();
        const kontakValue = kontak.trim();
        const emailValue = email.trim();
        const alamatValue = alamat.trim();

        if (!nama) {
            Swal.fire({
                icon: "warning",
                title: "Data Belum Lengkap",
                text: "Nama supplier wajib diisi.",
            });

            return;
        }

        try {
            setLoadingSubmit(true);

            await createSupplier({
                nama_supplier: nama,
                kontak: kontakValue || null,
                email: emailValue || null,
                alamat: alamatValue || null,
            });

            await Swal.fire({
                icon: "success",
                title: "Berhasil",
                text: "Supplier berhasil ditambahkan.",
                timer: 1500,
                showConfirmButton: false,
            });

            navigate("/supplier");
        } catch (error) {
            console.error(
                "Gagal menambahkan supplier:",
                error
            );

            const validationErrors =
                error.response?.data?.errors;

            const firstError = validationErrors
                ? Object.values(validationErrors).flat()[0]
                : null;

            const message =
                firstError ||
                error.response?.data?.message ||
                "Supplier gagal ditambahkan.";

            Swal.fire({
                icon: "error",
                title: "Gagal",
                text: message,
            });
        } finally {
            setLoadingSubmit(false);
        }
    };

    return (
        <FormModal
            show={true}
            title="Tambah Supplier"
            onClose={() => navigate("/supplier")}
            onSubmit={handleSubmit}
            submitText="Simpan"
            cancelText="Batal"
            loading={loadingSubmit}
            size="medium"
        >
            <div className="supplier-form-grid">
                <div className="supplier-form-group supplier-form-full">
                    <label htmlFor="nama_supplier">
                        Nama Supplier<span>*</span>
                    </label>

                    <input
                        id="nama_supplier"
                        type="text"
                        value={namaSupplier}
                        onChange={(event) =>
                            setNamaSupplier(event.target.value)
                        }
                        placeholder="Masukkan nama supplier"
                        disabled={loadingSubmit}
                        autoFocus
                    />
                </div>

                <div className="supplier-form-group">
                    <label htmlFor="kontak">
                        Kontak
                    </label>

                    <input
                        id="kontak"
                        type="text"
                        value={kontak}
                        onChange={(event) =>
                            setKontak(event.target.value)
                        }
                        placeholder="Nomor kontak"
                        disabled={loadingSubmit}
                    />
                </div>

                <div className="supplier-form-group">
                    <label htmlFor="email">
                        Email
                    </label>

                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(event) =>
                            setEmail(event.target.value)
                        }
                        placeholder="Email supplier"
                        disabled={loadingSubmit}
                    />
                </div>

                <div className="supplier-form-group supplier-form-full">
                    <label htmlFor="alamat">
                        Alamat
                    </label>

                    <textarea
                        id="alamat"
                        value={alamat}
                        onChange={(event) =>
                            setAlamat(event.target.value)
                        }
                        placeholder="Masukkan alamat supplier"
                        disabled={loadingSubmit}
                    />
                </div>
            </div>
        </FormModal>
    );
}

export default SupplierCreatePage;