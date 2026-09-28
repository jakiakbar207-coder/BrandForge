import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { login } from "../api/auth";
import "./Login.css";

function Login() {
    const navigate = useNavigate();
    const location = useLocation();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();

        setError("");

        const cleanEmail = email.trim();

        if (!cleanEmail) {
            setError("Email wajib diisi.");
            return;
        }

        if (!password) {
            setError("Password wajib diisi.");
            return;
        }

        setLoading(true);

        try {
            const response = await login(
                cleanEmail,
                password
            );

            console.log(
                "Response login Laravel:",
                response
            );

            const token =
                response?.token ||
                response?.data?.token;

            const user =
                response?.user ||
                response?.data?.user ||
                response?.data;

            if (!token) {
                throw new Error(
                    "Token tidak ditemukan dari server."
                );
            }

            if (
                !user ||
                typeof user !== "object"
            ) {
                throw new Error(
                    "Data user tidak ditemukan dari server."
                );
            }

            const role = String(
                user?.role || ""
            )
                .trim()
                .toLowerCase();

            if (!role) {
                console.error(
                    "Data user tidak memiliki role:",
                    user
                );

                throw new Error(
                    "Role pengguna tidak ditemukan dari server."
                );
            }

            const allowedRoles = [
                "owner",
                "admin",
                "kasir",
                "pelanggan",
            ];

            if (!allowedRoles.includes(role)) {
                console.error(
                    "Role pengguna tidak dikenali:",
                    role
                );

                throw new Error(
                    "Role pengguna tidak dikenali oleh sistem."
                );
            }

            const userData = {
                ...user,
                role: role,
            };

            localStorage.setItem(
                "token",
                token
            );

            localStorage.setItem(
                "user",
                JSON.stringify(userData)
            );

            localStorage.setItem(
                "role",
                role
            );

            console.log(
                "User tersimpan:",
                userData
            );

            console.log(
                "Role pengguna:",
                role
            );

            if (role === "owner") {
                navigate("/owner", {
                    replace: true,
                });

                return;
            }

            const requestedPath =
                location.state?.from?.pathname;

            if (
                requestedPath &&
                requestedPath !== "/login"
            ) {
                navigate(
                    requestedPath,
                    {
                        replace: true,
                    }
                );

                return;
            }

            navigate(
                "/dashboard",
                {
                    replace: true,
                }
            );
        } catch (err) {
            console.error(
                "Login gagal:",
                err
            );

            if (err.response) {
                const status =
                    err.response.status;

                const message =
                    err.response.data?.message;

                if (status === 401) {
                    setError(
                        message ||
                            "Email atau password salah."
                    );
                } else if (
                    status === 422
                ) {
                    setError(
                        message ||
                            "Data login tidak valid."
                    );
                } else if (
                    status === 404
                ) {
                    setError(
                        "Route login tidak ditemukan di Laravel."
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
                            "Login gagal."
                    );
                }
            } else if (err.request) {
                setError(
                    "Tidak dapat terhubung ke server Laravel."
                );
            } else {
                setError(
                    err.message ||
                        "Login gagal."
                );
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <div className="login-header">
                    <div className="login-icon">
                        <i className="bi bi-grid-1x2-fill"></i>
                    </div>

                    <h1>BrandForge</h1>

                    <p>
                        Silakan login untuk melanjutkan
                    </p>
                </div>

                {error && (
                    <div
                        className="login-error"
                        role="alert"
                    >
                        <span className="login-error-icon">
                            <i className="bi bi-exclamation-triangle-fill"></i>
                        </span>

                        <span>
                            {error}
                        </span>
                    </div>
                )}

                <form
                    onSubmit={handleLogin}
                    noValidate
                >
                    <div className="form-group">
                        <label htmlFor="email">
                            Email
                        </label>

                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={email}
                            onChange={(e) => {
                                setEmail(
                                    e.target.value
                                );

                                setError("");
                            }}
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
                                value={password}
                                onChange={(e) => {
                                    setPassword(
                                        e.target.value
                                    );

                                    setError("");
                                }}
                                placeholder="Masukkan password"
                                autoComplete="current-password"
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

                    <button
                        className="login-button"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="login-spinner"></span>
                                Memproses...
                            </>
                        ) : (
                            <>
                                <i className="bi bi-box-arrow-in-right"></i>
                                Login
                            </>
                        )}
                    </button>
                </form>

                <div className="register-link">
                    <span>
                        Belum punya akun?
                    </span>

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/register")
                        }
                        disabled={loading}
                    >
                        Daftar sebagai Pelanggan
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

                <div className="login-footer">
                    © {new Date().getFullYear()} BrandForge
                </div>
            </div>
        </div>
    );
}

export default Login;