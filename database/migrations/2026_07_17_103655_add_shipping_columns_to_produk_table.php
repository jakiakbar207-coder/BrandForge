<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('produks', function (Blueprint $table) {

            $table->integer('berat')
                  ->default(0)
                  ->after('harga');

            $table->integer('panjang')
                  ->default(0)
                  ->after('berat');

            $table->integer('lebar')
                  ->default(0)
                  ->after('panjang');

            $table->integer('tinggi')
                  ->default(0)
                  ->after('lebar');

        });
    }


    public function down(): void
    {
        Schema::table('produks', function (Blueprint $table) {

            $table->dropColumn([
                'berat',
                'panjang',
                'lebar',
                'tinggi'
            ]);

        });
    }
};