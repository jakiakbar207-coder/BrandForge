<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('returs', function (Blueprint $table) {
            $table->id();

            $table->foreignId('produk_id')
                ->constrained('produks')
                ->onDelete('cascade');

            $table->foreignId('ukuran_id')
                ->nullable()
                ->constrained('ukurans')
                ->nullOnDelete();

            $table->foreignId('warna_id')
                ->nullable()
                ->constrained('warnas')
                ->nullOnDelete();

            $table->integer('jumlah')->default(1);

            $table->enum('jenis', [
                'masuk',
                'keluar'
            ])->default('keluar');

            $table->text('alasan')->nullable();

            $table->date('tanggal_retur');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('returs');
    }
};