<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('produks', function (Blueprint $table) {

            $table->id();

            $table->foreignId('kategori_id')
                  ->constrained('kategoris')
                  ->cascadeOnDelete();

            $table->string('nama_produk');

            $table->integer('harga');

            $table->text('deskripsi')->nullable();

            $table->string('foto')->nullable(); //foto utama
            $table->string('foto2')->nullable();
            $table->string('foto3')->nullable();
            $table->string('foto4')->nullable();
            $table->string('foto5')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('produks');
    }
};