<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('transaksis', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')
                ->constrained('users')
                ->cascadeOnUpdate()
                ->cascadeOnDelete();

            $table->string('nama_penerima')->nullable();
            $table->text('alamat')->nullable();
            $table->string('no_hp')->nullable();

            $table->string('kode_transaksi')->unique();

            $table->dateTime('tanggal_transaksi');

            $table->decimal('total_harga', 15, 2)->default(0);

            $table->decimal('ongkir', 15, 2)->default(0);

            $table->decimal('bayar', 15, 2)->default(0);

            $table->decimal('kembalian', 15, 2)->default(0);

            $table->string('status')->default('Menunggu Verifikasi');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transaksis');
    }
};