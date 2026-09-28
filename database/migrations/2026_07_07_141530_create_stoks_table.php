<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    // Run the migrations.
    public function up(): void
    {
        Schema::create('stoks', function (Blueprint $table) {

            $table->id();

            $table->foreignId('produk_id')
                ->constrained('produks')
                ->cascadeOnDelete();

            $table->foreignId('ukuran_id')
                ->constrained('ukurans')
                ->cascadeOnDelete();

            $table->foreignId('warna_id')
                ->constrained('warnas')
                ->cascadeOnDelete();

            $table->unsignedInteger('jumlah')->default(0);

            $table->timestamps();

            // Satu kombinasi produk + ukuran + warna hanya boleh satu
            $table->unique([
                'produk_id',
                'ukuran_id',
                'warna_id'
            ]);
        });
    }

    // Reverse the migrations.
    public function down(): void
    {
        Schema::dropIfExists('stoks');
    }
};