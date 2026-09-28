<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('detail_transaksis', function (Blueprint $table) {
            $table->foreignId('warna_id')
                ->nullable()
                ->after('produk_id')
                ->constrained('warnas')
                ->cascadeOnUpdate()
                ->nullOnDelete();

            $table->foreignId('ukuran_id')
                ->nullable()
                ->after('warna_id')
                ->constrained('ukurans')
                ->cascadeOnUpdate()
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('detail_transaksis', function (Blueprint $table) {
            $table->dropForeign(['warna_id']);
            $table->dropForeign(['ukuran_id']);
            $table->dropColumn(['warna_id', 'ukuran_id']);
        });
    }
};