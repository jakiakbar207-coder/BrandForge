<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
   public function up()
{
    Schema::table('transaksis', function (Blueprint $table) {

        $table->string('nama_penerima')->after('user_id');

        $table->text('alamat')->after('nama_penerima');

        $table->string('no_hp')->after('alamat');

    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('transaksis', function (Blueprint $table) {
            //
        });
    }
};
