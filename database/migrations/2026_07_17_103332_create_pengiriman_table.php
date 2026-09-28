    <?php

    use Illuminate\Database\Migrations\Migration;
    use Illuminate\Database\Schema\Blueprint;
    use Illuminate\Support\Facades\Schema;

    return new class extends Migration
    {
        public function up(): void
        {
            Schema::create('pengiriman', function (Blueprint $table) {

                $table->id();

                // Hubungan ke pesanan
           $table->foreignId('transaksi_id')
            ->constrained('transaksis')
            ->cascadeOnDelete();
                // Data pengiriman
                $table->string('kurir')->nullable();

                $table->string('layanan')->nullable();

                $table->integer('ongkir')
                    ->default(0);

                $table->string('nomor_resi')
                    ->nullable();

                $table->enum('status', [
                    'menunggu',
                    'diproses',
                    'dikemas',
                    'dikirim',
                    'selesai'
                ])->default('menunggu');

                $table->text('catatan')
                    ->nullable();

                $table->timestamps();

            });
        }


        public function down(): void
        {
            Schema::dropIfExists('pengiriman');
        }
    };