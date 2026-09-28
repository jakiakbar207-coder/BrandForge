<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('produk_fotos', function (Blueprint $table) {
            $table->id();

            $table->foreignId('produk_id')
                ->constrained('produks')
                ->onDelete('cascade');

            $table->string('foto');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('produk_fotos');
    }
};