<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('review_fotos', function (Blueprint $table) {
            $table->id();

            // Review yang memiliki foto
            $table->foreignId('review_id')
                ->constrained('reviews')
                ->cascadeOnDelete();

            // Nama/path file foto
            $table->string('foto');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('review_fotos');
    }
};