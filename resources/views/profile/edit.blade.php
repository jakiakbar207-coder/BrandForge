@extends('pelanggan.layouts.app')

@section('title', 'Profil Saya')

@section('content')

<style>

/* PROFILE PAGE */

.profile-page {
    padding: 20px 0 50px;
    color: #1e293b;
}


/* BACK BUTTON */

.profile-back-wrapper {
    margin-bottom: 20px;
}

.profile-back-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;

    padding: 10px 16px;

    border: 1px solid #dbe3ef;
    border-radius: 11px;

    background: #ffffff;
    color: #2563eb;

    text-decoration: none;

    font-size: 14px;
    font-weight: 600;

    box-shadow: 0 4px 12px rgba(15, 23, 42, .05);

    transition: all .2s ease;
}

.profile-back-btn:hover {
    color: #ffffff;
    background: #2563eb;
    border-color: #2563eb;

    transform: translateX(-3px);

    box-shadow: 0 7px 18px rgba(37, 99, 235, .18);
}

.profile-back-btn i {
    font-size: 16px;
}


/* PROFILE HEADER */

.profile-header {
    position: relative;
    overflow: hidden;

    padding: 34px 36px;
    margin-bottom: 24px;

    border-radius: 24px;

    color: white;

    background:
        radial-gradient(
            circle at 90% 10%,
            rgba(255, 255, 255, .16),
            transparent 28%
        ),
        linear-gradient(
            135deg,
            #0f172a 0%,
            #1e3a8a 48%,
            #2563eb 100%
        );

    box-shadow: 0 15px 35px rgba(15, 23, 42, .15);
}

.profile-header::before {
    content: "";

    position: absolute;

    width: 240px;
    height: 240px;

    right: -90px;
    top: -130px;

    border-radius: 50%;

    background: rgba(255, 255, 255, .06);
}

.profile-header::after {
    content: "";

    position: absolute;

    width: 120px;
    height: 120px;

    right: 150px;
    bottom: -90px;

    border-radius: 50%;

    background: rgba(96, 165, 250, .10);
}

.profile-header-content {
    position: relative;
    z-index: 2;
}

.profile-icon {
    width: 68px;
    height: 68px;

    display: flex;
    align-items: center;
    justify-content: center;

    margin-bottom: 15px;

    border-radius: 18px;

    background: rgba(255, 255, 255, .14);
    border: 1px solid rgba(255, 255, 255, .18);

    color: white;

    font-size: 30px;

    box-shadow: 0 8px 20px rgba(0, 0, 0, .08);
}

.profile-header h2 {
    margin: 0 0 7px;

    font-size: 28px;
    font-weight: 750;
}

.profile-header p {
    margin: 0;

    color: #dbeafe;

    font-size: 14px;
    line-height: 1.6;
}


/* SUCCESS MESSAGE */

.status-success {
    display: flex;
    align-items: center;
    gap: 9px;

    padding: 13px 16px;
    margin-bottom: 20px;

    border: 1px solid #bbf7d0;
    border-radius: 11px;

    background: #f0fdf4;
    color: #166534;

    font-size: 14px;
    font-weight: 500;
}


/* PROFILE CARD */

.profile-card {
    padding: 28px;
    margin-bottom: 22px;

    background: #ffffff;

    border: 1px solid #e2e8f0;
    border-radius: 20px;

    box-shadow: 0 7px 22px rgba(15, 23, 42, .06);

    transition:
        transform .2s ease,
        box-shadow .2s ease;
}

.profile-card:hover {
    box-shadow: 0 12px 28px rgba(15, 23, 42, .08);
}


/* CARD HEADER */

.profile-card-header {
    display: flex;
    align-items: center;
    gap: 12px;

    margin-bottom: 22px;
}

.profile-card-icon {
    width: 44px;
    height: 44px;

    flex-shrink: 0;

    display: flex;
    align-items: center;
    justify-content: center;

    border-radius: 12px;

    background: #dbeafe;
    color: #2563eb;

    font-size: 19px;
}

.profile-card-title {
    margin: 0;

    color: #0f172a;

    font-size: 18px;
    font-weight: 700;
}

.profile-card-subtitle {
    margin: 3px 0 0;

    color: #64748b;

    font-size: 12px;
    line-height: 1.5;
}


/* FORM */

.profile-form-group {
    margin-bottom: 18px;
}

.profile-label {
    display: block;

    margin-bottom: 7px;

    color: #475569;

    font-size: 13px;
    font-weight: 600;
}

.profile-input {
    width: 100%;

    padding: 11px 14px;

    border: 1px solid #cbd5e1;
    border-radius: 10px;

    outline: none;

    background: #ffffff;
    color: #1e293b;

    font-size: 14px;

    transition: .2s ease;
}

.profile-input:hover {
    border-color: #94a3b8;
}

.profile-input:focus {
    border-color: #2563eb;

    box-shadow:
        0 0 0 3px rgba(37, 99, 235, .10);
}

.profile-input::placeholder {
    color: #94a3b8;
}


/* ERROR */

.profile-error {
    display: block;

    margin-top: 6px;

    color: #dc2626;

    font-size: 12px;
}


/* SAVE BUTTON */

.profile-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;

    gap: 7px;

    padding: 11px 20px;

    border: none;
    border-radius: 10px;

    background: #2563eb;
    color: white;

    font-size: 13px;
    font-weight: 600;

    cursor: pointer;

    transition: all .2s ease;
}

.profile-button:hover {
    background: #1d4ed8;
    color: white;

    transform: translateY(-1px);

    box-shadow:
        0 7px 16px rgba(37, 99, 235, .20);
}


/* DELETE ACCOUNT */

.delete-card {
    border-color: #fecaca;
}

.delete-card .profile-card-icon {
    background: #fee2e2;
    color: #dc2626;
}

.delete-card .profile-card-title {
    color: #b91c1c;
}

.delete-description {
    margin: 0 0 20px;

    color: #64748b;

    font-size: 13px;
    line-height: 1.7;
}

.delete-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;

    gap: 7px;

    padding: 10px 18px;

    border: none;
    border-radius: 10px;

    background: #dc2626;
    color: white;

    font-size: 13px;
    font-weight: 600;

    cursor: pointer;

    transition: all .2s ease;
}

.delete-button:hover {
    background: #b91c1c;
    color: white;

    transform: translateY(-1px);

    box-shadow:
        0 7px 16px rgba(220, 38, 38, .20);
}


/* RESPONSIVE */

@media (max-width: 768px) {

    .profile-page {
        padding: 10px 0 40px;
    }

    .profile-back-btn {
        width: 100%;
        justify-content: center;
    }

    .profile-header {
        padding: 28px 24px;
        border-radius: 19px;
    }

    .profile-header h2 {
        font-size: 24px;
    }

    .profile-card {
        padding: 22px;
        border-radius: 17px;
    }

}

@media (max-width: 500px) {

    .profile-header {
        padding: 24px 20px;
    }

    .profile-header h2 {
        font-size: 22px;
    }

    .profile-icon {
        width: 60px;
        height: 60px;

        font-size: 26px;
    }

    .profile-card {
        padding: 20px;
    }

    .profile-button,
    .delete-button {
        width: 100%;
    }

}

</style>


<div class="container profile-page">

     TOMBOL KEMBALI

    <div class="profile-back-wrapper">

        <a
            href="{{ route('pelanggan.dashboardBelanja') }}"
            class="profile-back-btn"
        >
            <i class="bi bi-arrow-left"></i>

            Kembali ke Dashboard Belanja
        </a>

    </div>


     HEADER PROFIL

    <div class="profile-header">

        <div class="profile-header-content">

            <div class="profile-icon">
                <i class="bi bi-person"></i>
            </div>

            <h2>
                Profil Saya
            </h2>

            <p>
                Kelola informasi akun dan data pribadi kamu
                dengan mudah.
            </p>

        </div>

    </div>


     STATUS

    @if(session('status') === 'profile-updated')

        <div class="status-success">

            <i class="bi bi-check-circle-fill"></i>

            <span>
                Profil berhasil diperbarui.
            </span>

        </div>

    @endif


     INFORMASI PROFIL

    <div class="profile-card">

        <div class="profile-card-header">

            <div class="profile-card-icon">
                <i class="bi bi-person-circle"></i>
            </div>

            <div>

                <h4 class="profile-card-title">
                    Informasi Profil
                </h4>

                <p class="profile-card-subtitle">
                    Perbarui nama dan alamat email akunmu.
                </p>

            </div>

        </div>


        <form
            method="POST"
            action="{{ route('profile.update') }}"
        >

            @csrf

            @method('PATCH')


             NAMA

            <div class="profile-form-group">

                <label class="profile-label">
                    Nama
                </label>

                <input
                    type="text"
                    name="name"
                    class="profile-input"
                    value="{{ old('name', $user->name) }}"
                    required
                    autocomplete="name"
                    placeholder="Masukkan nama"
                >

                @error('name')

                    <small class="profile-error">
                        {{ $message }}
                    </small>

                @enderror

            </div>


             EMAIL

            <div class="profile-form-group">

                <label class="profile-label">
                    Email
                </label>

                <input
                    type="email"
                    name="email"
                    class="profile-input"
                    value="{{ old('email', $user->email) }}"
                    required
                    autocomplete="username"
                    placeholder="Masukkan email"
                >

                @error('email')

                    <small class="profile-error">
                        {{ $message }}
                    </small>

                @enderror

            </div>


            <button
                type="submit"
                class="profile-button"
            >
                <i class="bi bi-save"></i>

                Simpan Perubahan
            </button>

        </form>

    </div>


     HAPUS AKUN

    <div class="profile-card delete-card">

        <div class="profile-card-header">

            <div class="profile-card-icon">
                <i class="bi bi-shield-exclamation"></i>
            </div>

            <div>

                <h4 class="profile-card-title">
                    Hapus Akun
                </h4>

                <p class="profile-card-subtitle">
                    Tindakan ini tidak dapat dibatalkan.
                </p>

            </div>

        </div>


        <p class="delete-description">

            Setelah akun dihapus, semua data akun akan
            dihapus secara permanen. Pastikan kamu benar-benar
            ingin menghapus akun ini.

        </p>


        <form
            method="POST"
            action="{{ route('profile.destroy') }}"
        >

            @csrf

            @method('DELETE')


             PASSWORD

            <div class="profile-form-group">

                <label class="profile-label">
                    Password
                </label>

                <input
                    type="password"
                    name="password"
                    class="profile-input"
                    placeholder="Masukkan password untuk konfirmasi"
                    required
                >

                @error('password', 'userDeletion')

                    <small class="profile-error">
                        {{ $message }}
                    </small>

                @enderror

            </div>


            <button
                type="submit"
                class="delete-button"
                onclick="return confirm('Yakin ingin menghapus akun? Semua data akun akan dihapus secara permanen.')"
            >
                <i class="bi bi-trash"></i>

                Hapus Akun
            </button>

        </form>

    </div>

</div>

@endsection