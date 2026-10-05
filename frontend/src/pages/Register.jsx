import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { register } from "../api/auth";
import "./Register.css";

function Register() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        alamat: "",
        no_hp: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const [showPassword, setShowPassword] =
        useState(false);

    const [showPasswordConfirmation, setShowPasswordConfirmation] =
        useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));

        setError("");
        setSuccess("");
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        const name = form.name.trim();
        const alamat = form.alamat.trim();
        const no_hp = form.no_hp.trim();
        const email = form.email.trim();

        if (!name) {
            setError("Nama wajib diisi.");
            return;
        }

        if (!email) {
            setError("Email wajib diisi.");
            return;
        }

        if (!form.password) {
            setError("Password wajib diisi.");
            return;
        }

        if (form.password.length < 8) {
            setError(
                "Password minimal 8 karakter."
            );
            return;
        }

        if (
            form.password !==
            form.password_confirmation
        ) {
            setError(
                "Konfirmasi password tidak sama."
            );
            return;
        }

        setLoading(true);

        try {
            const response = await register({
                name,
                alamat: alamat || null,
                no_hp: no_hp || null,
                email,
                password: form.password,
                password_confirmation:
                    form.password_confirmation,
            });

            console.log(
                "Response register Laravel:",
                response
            );

            setSuccess(
                "Registrasi berhasil. Silakan login menggunakan akun yang baru dibuat."
            );

            setForm({
                name: "",
                alamat: "",
                no_hp: "",
                email: "",
                password: "",
                password_confirmation: "",
            });

            setTimeout(() => {
                navigate("/login", {
                    replace: true,
                });
            }, 1500);
        } catch (err) {
            console.error(
                "Registrasi gagal:",
                err
            );

            if (err.response) {
                const status =
                    err.response.status;

                const responseData =
                    err.response.data;

                const message =
                    responseData?.message;

                if (status === 422) {
                    const validationErrors =
                        responseData?.errors;

                    if (
                        validationErrors &&
                        typeof validationErrors ===
                            "object"
                    ) {
                        const firstError =
                            Object.values(
                                validationErrors
                            )
                                .flat()
                                .find(
                                    (item) =>
                                        item
                                );

                        setError(
                            firstError ||
                                message ||
                                "Data registrasi tidak valid."
                        );
                    } else {
                        setError(
                            message ||
                                "Data registrasi tidak valid."
                        );
                    }
                } else if (
                    status === 409
                ) {
                    setError(
                        message ||
                            "Email sudah terdaftar."
                    );
                } else if (
                    status >= 500
                ) {
                    setError(
                        "Terjadi kesalahan pada server Laravel."
                    );
                } else {
                    setError(
                        message ||
                            "Registrasi gagal."
                    );
                }
            } else if (err.request) {
                setError(
                    "Tidak dapat terhubung ke server Laravel."
                );
            } else {
                setError(
                    err.message ||
                        "Registrasi gagal."
                );
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-page">
            <div className="register-card">

                <div className="register-header">

                    <div className="register-icon">
                        <i className="bi bi-person-plus-fill"></i>
                    </div>

                    <h1>Daftar Pelanggan</h1>

                    <p>
                        Buat akun untuk mulai berbelanja di BrandForge
                    </p>

                </div>

                {error && (
                    <div
                        className="register-error"
                        role="alert"
                    >
                        <span className="register-error-icon">
                            <i className="bi bi-exclamation-triangle-fill"></i>
                        </span>

                        <span>
                            {error}
                        </span>
                    </div>
                )}

                {success && (
                    <div
                        className="register-success"
                        role="alert"
                    >
                        <span className="register-success-icon">
                            <i className="bi bi-check-circle-fill"></i>
                        </span>

                        <span>
                            {success}
                        </span>
                    </div>
                )}

                <form
                    onSubmit={handleRegister}
                    noValidate
                >

                    <div className="form-group">

                        <label htmlFor="name">
                            Nama
                        </label>

                        <input
                            id="name"
                            name="name"
                            type="text"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Masukkan nama lengkap"
                            autoComplete="name"
                            disabled={loading}
                            required
                        />

                    </div>

                    <div className="form-group">

                        <label htmlFor="alamat">
                            Alamat
                        </label>

                        <input
                            id="alamat"
                            name="alamat"
                            type="text"
                            value={form.alamat}
                            onChange={handleChange}
                            placeholder="Masukkan alamat"
                            autoComplete="street-address"
                            disabled={loading}
                        />

                    </div>

                    <div className="form-group">

                        <label htmlFor="no_hp">
                            Nomor HP
                        </label>

                        <input
                            id="no_hp"
                            name="no_hp"
                            type="tel"
                            value={form.no_hp}
                            onChange={handleChange}
                            placeholder="Masukkan nomor HP"
                            autoComplete="tel"
                            disabled={loading}
                        />

                    </div>

                    <div className="form-group">

                        <label htmlFor="email">
                            Email
                        </label>

                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="Masukkan email"
                            autoComplete="email"
                            disabled={loading}
                            required
                        />

                    </div>

                    <div className="form-group">

                        <label htmlFor="password">
                            Password
                        </label>

                        <div className="password-wrapper">

                            <input
                                id="password"
                                name="password"
                                type={
                                    showPassword
                                        ? "text"
                                        : "password"
                                }
                                value={form.password}
                                onChange={handleChange}
                                placeholder="Minimal 8 karakter"
                                autoComplete="new-password"
                                disabled={loading}
                                required
                            />

                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() =>
                                    setShowPassword(
                                        (previous) =>
                                            !previous
                                    )
                                }
                                disabled={loading}
                                aria-label={
                                    showPassword
                                        ? "Sembunyikan password"
                                        : "Tampilkan password"
                                }
                            >
                                <i
                                    className={
                                        showPassword
                                            ? "bi bi-eye-slash"
                                            : "bi bi-eye"
                                    }
                                ></i>
                            </button>

                        </div>

                    </div>

                    <div className="form-group">

                        <label htmlFor="password_confirmation">
                            Konfirmasi Password
                        </label>

                        <div className="password-wrapper">

                            <input
                                id="password_confirmation"
                                name="password_confirmation"
                                type={
                                    showPasswordConfirmation
                                        ? "text"
                                        : "password"
                                }
                                value={
                                    form.password_confirmation
                                }
                                onChange={handleChange}
                                placeholder="Ulangi password"
                                autoComplete="new-password"
                                disabled={loading}
                                required
                            />

                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() =>
                                    setShowPasswordConfirmation(
                                        (previous) =>
                                            !previous
                                    )
                                }
                                disabled={loading}
                                aria-label={
                                    showPasswordConfirmation
                                        ? "Sembunyikan konfirmasi password"
                                        : "Tampilkan konfirmasi password"
                                }
                            >
                                <i
                                    className={
                                        showPasswordConfirmation
                                            ? "bi bi-eye-slash"
                                            : "bi bi-eye"
                                    }
                                ></i>
                            </button>

                        </div>

                    </div>

                    <button
                        className="register-button"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="register-spinner"></span>
                                Mendaftarkan...
                            </>
                        ) : (
                            <>
                                <i className="bi bi-person-plus"></i>
                                Daftar
                            </>
                        )}
                    </button>

                </form>

                <div className="login-link">
                    <span>
                        Sudah punya akun?
                    </span>

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/login")
                        }
                        disabled={loading}
                    >
                        Login
                    </button>
                </div>

                <button
                    type="button"
                    className="back-button"
                    onClick={() =>
                        navigate("/")
                    }
                    disabled={loading}
                >
                    <i className="bi bi-arrow-left"></i>
                    Kembali ke Beranda
                </button>

                <div className="register-footer">
                    © {new Date().getFullYear()} BrandForge
                </div>
                    
            </div>
        </div>
    );
}

export default Register;