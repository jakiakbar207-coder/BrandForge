<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();

            // Pelanggan yang memberikan review
            $table->foreignId('user_id')
                ->constrained('users')
                ->cascadeOnDelete();

            // Produk yang direview
            $table->foreignId('produk_id')
                ->constrained('produks')
                ->cascadeOnDelete();

            // Transaksi pembelian
            $table->foreignId('transaksi_id')
                ->constrained('transaksis')
                ->cascadeOnDelete();

            // Detail produk dalam transaksi
            $table->foreignId('detail_transaksi_id')
                ->constrained('detail_transaksis')
                ->cascadeOnDelete();

            // Rating 1 sampai 5
            $table->unsignedTinyInteger('rating');

            // Isi review
            $table->text('review')->nullable();

            // Foto produk dari pelanggan
            $table->string('foto')->nullable();

            $table->timestamps();

            // Satu detail transaksi hanya boleh direview sekali
            $table->unique('detail_transaksi_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};