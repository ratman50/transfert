<?php

use App\Models\Compte;
use App\Models\User;
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
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(User::class)->constrained();
            $table->string("compte_id")->nullable();
            $table->foreign("compte_id")->references("numero")->on("comptes");
            $table->float("montant");
            $table->enum("type_trans",["depot","retrait","transfert"]);
            $table->string("date")->date;
            $table->string("code",25)->nullable();
            $table->string("code_immediat",30)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('compte_user');
    }
};
