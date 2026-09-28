import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import {
    createBiayaOperasional,
} from "../api/biayaOperasional";

import FormModal from "../components/common/FormModal";

import "./BiayaOperasional.css";

function BiayaOperasionalCreatePage() {
    const navigate = useNavigate();

    const [namaBiaya, setNamaBiaya] = useState("");
    const [nominal, setNominal] = useState("");
    const [tanggal, setTanggal] = useState("");
    const [keterangan, setKeterangan] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!namaBiaya.trim()) {
            Swal.fire({
                icon: "warning",
                title: "Nama Biaya Belum Diisi",
                text: "Silakan masukkan nama biaya operasional.",
            });

            return;
        }

        if (
            nominal === "" ||
            Number(nominal) < 0
        ) {
            Swal.fire({
                icon: "warning",
                title: "Nominal Tidak Valid",
                text: "Nominal harus berupa angka minimal 0.",
            });

            return;
        }

        if (!tanggal) {
            Swal.fire({
                icon: "warning",
                title: "Tanggal Belum Dipilih",
                text: "Silakan pilih tanggal biaya operasional.",
            });

            return;
        }

        const confirmResult = await Swal.fire({
            icon: "question",
            title: "Simpan Biaya Operasional?",
            text: "Data biaya operasional akan disimpan.",
            showCancelButton: true,
            confirmButtonText: "Ya, Simpan",
            cancelButtonText: "Batal",
        });

        if (!confirmResult.isConfirmed) {
            return;
        }

        try {
            setSubmitting(true);

            await createBiayaOperasional({
                nama_biaya: namaBiaya.trim(),
                nominal: Number(nominal),
                tanggal,
                keterangan:
                    keterangan.trim() || null,
            });

            await Swal.fire({
                icon: "success",
                title: "Berhasil",
                text: "Biaya operasional berhasil ditambahkan.",
                timer: 1500,
                showConfirmButton: false,
            });

            navigate("/biaya-operasional");
        } catch (error) {
            console.error(
                "Gagal menambahkan biaya operasional:",
                error
            );

            const errors =
                error?.response?.data?.errors;

            let message =
                error?.response?.data?.message ||
                "Biaya operasional gagal ditambahkan.";

            if (errors) {
                message = Object.values(errors)
                    .flat()
                    .join("\n");
            }

            Swal.fire({
                icon: "error",
                title: "Gagal",
                text: message,
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="biaya-operasional-page">
            <FormModal
                show={true}
                title="Tambah Biaya Operasional"
                onClose={() =>
                    navigate("/biaya-operasional")
                }
                onSubmit={handleSubmit}
                submitText="Simpan"
                cancelText="Batal"
                loading={submitting}
                size="large"
            >
                <div className="biaya-operasional-form-grid">
                    <div className="biaya-operasional-form-group">
                        <label htmlFor="nama_biaya">
                            Nama Biaya
                        </label>

                        <input
                            id="nama_biaya"
                            type="text"
                            value={namaBiaya}
                            onChange={(e) =>
                                setNamaBiaya(
                                    e.target.value
                                )
                            }
                            placeholder="Contoh: Listrik"
                            maxLength={255}
                            required
                        />
                    </div>

                    <div className="biaya-operasional-form-group">
                        <label htmlFor="nominal">
                            Nominal
                        </label>

                        <input
                            id="nominal"
                            type="number"
                            min="0"
                            value={nominal}
                            onChange={(e) =>
                                setNominal(
                                    e.target.value
                                )
                            }
                            placeholder="0"
                            required
                        />
                    </div>

                    <div className="biaya-operasional-form-group">
                        <label htmlFor="tanggal">
                            Tanggal
                        </label>

                        <input
                            id="tanggal"
                            type="date"
                            value={tanggal}
                            onChange={(e) =>
                                setTanggal(
                                    e.target.value
                                )
                            }
                            required
                        />
                    </div>

                    <div className="biaya-operasional-form-group biaya-operasional-form-full">
                        <label htmlFor="keterangan">
                            Keterangan
                        </label>

                        <textarea
                            id="keterangan"
                            value={keterangan}
                            onChange={(e) =>
                                setKeterangan(
                                    e.target.value
                                )
                            }
                            rows="4"
                            placeholder="Keterangan tambahan..."
                        />
                    </div>
                </div>
            </FormModal>
        </div>
    );
}

export default BiayaOperasionalCreatePage;