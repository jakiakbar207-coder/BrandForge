<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<title>Data Ukuran</title>

<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">

</head>
<body style="background:#f4f6f9;">

<div class="container mt-5">

<div class="d-flex justify-content-between mb-3">
<h2>Data Ukuran</h2>

<a href="{{ route('ukuran.create') }}" class="btn btn-primary">
+ Tambah Ukuran
</a>
</div>

@if(session('success'))
<div class="alert alert-success">
{{ session('success') }}
</div>
@endif

<table class="table table-bordered table-hover bg-white">

<thead class="table-dark">

<tr>

<th width="70">No</th>

<th>Nama Ukuran</th>

<th width="180">Aksi</th>

</tr>

</thead>

<tbody>

@forelse($ukurans as $item)

<tr>

<td>{{ $loop->iteration }}</td>

<td>{{ $item->nama_ukuran }}</td>

<td>

<a href="{{ route('ukuran.edit',$item->id) }}"
class="btn btn-warning btn-sm">

Edit

</a>

<form action="{{ route('ukuran.destroy',$item->id) }}"
method="POST"
style="display:inline">

@csrf
@method('DELETE')

<button
onclick="return confirm('Hapus ukuran?')"
class="btn btn-danger btn-sm">

Hapus

</button>

</form>

</td>

</tr>

@empty

<tr>

<td colspan="3" class="text-center">
Belum ada data ukuran
</td>

</tr>

@endforelse

</tbody>

</table>

<a href="/admin" class="btn btn-secondary">
← Dashboard Admin
</a>

</div>

</body>
</html>