<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Tambah Warna</title>

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>

<div class="container mt-5">

    <div class="card shadow">
        <div class="card-header bg-primary text-white">
            <h4>Tambah Warna</h4>
        </div>

        <div class="card-body">

            @if($errors->any())
                <div class="alert alert-danger">
                    <ul>
                        @foreach($errors->all() as $error)
                            <li>{{ $error }}</li>
                        @endforeach
                    </ul>
                </div>
            @endif

            <form action="{{ route('warna.store') }}" method="POST">
                @csrf

                <div class="mb-3">
                    <label>Nama Warna</label>
                    <input
                        type="text"
                        name="nama_warna"
                        class="form-control"
                        value="{{ old('nama_warna') }}"
                        required>
                </div>

                <button class="btn btn-success">
                    Simpan
                </button>

                <a href="{{ route('warna.index') }}" class="btn btn-secondary">
                    Kembali
                </a>

            </form>

        </div>
    </div>

</div>

</body>
</html>