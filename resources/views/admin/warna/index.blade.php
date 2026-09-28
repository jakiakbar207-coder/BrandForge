<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Data Warna</title>

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">

    <style>
        body{
            background:#f4f6f9;
        }

        .container{
            margin-top:40px;
        }

        .card{
            border:none;
            border-radius:15px;
            box-shadow:0 5px 15px rgba(0,0,0,.1);
        }

        .btn{
            border-radius:8px;
        }

        table{
            vertical-align:middle;
        }
    </style>
</head>
<body>

<div class="container">

    <div class="card">

        <div class="card-header bg-danger text-white d-flex justify-content-between align-items-center">

            <h4 class="mb-0">🎨 Data Warna</h4>

            <a href="{{ route('warna.create') }}" class="btn btn-light">
                + Tambah Warna
            </a>

        </div>

        <div class="card-body">

            @if(session('success'))
                <div class="alert alert-success">
                    {{ session('success') }}
                </div>
            @endif

            <table class="table table-bordered table-hover">

                <thead class="table-dark">

                    <tr>
                        <th width="80">No</th>
                        <th>Nama Warna</th>
                        <th width="220">Aksi</th>
                    </tr>

                </thead>

                <tbody>

                @forelse($warnas as $warna)

                    <tr>

                        <td>{{ $loop->iteration }}</td>

                        <td>{{ $warna->nama_warna }}</td>

                        <td>

                            <a href="{{ route('warna.edit',$warna->id) }}"
                               class="btn btn-warning btn-sm">
                                Edit
                            </a>

                            <form action="{{ route('warna.destroy',$warna->id) }}"
                                  method="POST"
                                  class="d-inline">

                                @csrf
                                @method('DELETE')

                                <button
                                    type="submit"
                                    class="btn btn-danger btn-sm"
                                    onclick="return confirm('Yakin ingin menghapus warna ini?')">
                                    Hapus
                                </button>

                            </form>

                        </td>

                    </tr>

                @empty

                    <tr>

                        <td colspan="3" class="text-center">
                            Belum ada data warna.
                        </td>

                    </tr>

                @endforelse

                </tbody>

            </table>

            <a href="/admin" class="btn btn-secondary">
                ← Kembali ke Dashboard Admin
            </a>

        </div>

    </div>

</div>

</body>
</html>