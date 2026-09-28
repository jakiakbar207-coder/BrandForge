<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('detail_transaksis', function (Blueprint $table) {
            $table->id();

            // Relasi ke transaksi
            $table->foreignId('transaksi_id')
                ->constrained('transaksis')
                ->cascadeOnUpdate()
                ->cascadeOnDelete();

            // Relasi ke stok
            $table->foreignId('stok_id')
                ->constrained('stoks')
                ->cascadeOnUpdate()
                ->cascadeOnDelete();

            // Relasi ke produk
            $table->foreignId('produk_id')
                ->constrained('produks')
                ->cascadeOnUpdate()
                ->cascadeOnDelete();

            // Jumlah barang yang dibeli
            $table->integer('jumlah');

            // Harga satuan saat transaksi
            $table->decimal('harga', 15, 2);

            // Subtotal
            $table->decimal('subtotal', 15, 2);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('detail_transaksis');
    }
};