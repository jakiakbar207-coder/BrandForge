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
        Schema::table('produks', function (Blueprint $table) {

            $table->foreignId('koleksi_id')
                  ->nullable()
                  ->after('kategori_id')
                  ->constrained('koleksis')
                  ->nullOnDelete();

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('produks', function (Blueprint $table) {

            $table->dropForeign(['koleksi_id']);
            $table->dropColumn('koleksi_id');

        });
    }
};