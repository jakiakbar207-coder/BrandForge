<!DOCTYPE html>
<html lang="id">
<head>

<meta charset="UTF-8">

<title>Edit Ukuran</title>

<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">

</head>

<body style="background:#f4f6f9;">

<div class="container mt-5">

<div class="card">

<div class="card-header bg-warning">

Edit Ukuran

</div>

<div class="card-body">

<form
action="{{ route('ukuran.update',$ukuran->id) }}"
method="POST">

@csrf

@method('PUT')

<div class="mb-3">

<label>Nama Ukuran</label>

<input
type="text"
name="nama_ukuran"
class="form-control"
value="{{ $ukuran->nama_ukuran }}"
required>

</div>

<button class="btn btn-success">

Update

</button>

<a href="{{ route('ukuran.index') }}"
class="btn btn-secondary">

Kembali

</a>

</form>

</div>

</div>

</div>

</body>

</html>