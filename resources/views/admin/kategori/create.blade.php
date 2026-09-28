<!DOCTYPE html>
<html lang="id">
<head>

<meta charset="UTF-8">

<title>Tambah Kategori</title>

<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">

</head>

<body class="bg-light">

<div class="container mt-5">

<h2>Tambah Kategori</h2>

<form action="{{ route('kategori.store') }}" method="POST">

@csrf

<div class="mb-3">

<label>Nama Kategori</label>

<input type="text" name="nama_kategori" class="form-control">

</div>

<button class="btn btn-primary">

Simpan

</button>

<a href="{{ route('kategori.index') }}" class="btn btn-secondary">

Kembali

</a>

</form>

</div>

</body>

</html>