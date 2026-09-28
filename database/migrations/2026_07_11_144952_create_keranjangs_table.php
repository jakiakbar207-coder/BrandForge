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
        Schema::create('keranjangs', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')
                ->constrained()
                ->onDelete('cascade');

            $table->foreignId('produk_id')
                ->constrained()
                ->onDelete('cascade');

            $table->foreignId('ukuran_id')
                ->nullable()
                ->constrained()
                ->nullOnDelete();

            $table->foreignId('warna_id')
                ->nullable()
                ->constrained()
                ->nullOnDelete();

            $table->integer('jumlah');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('keranjangs');
    }
};