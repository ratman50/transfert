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
            $table->foreignId("expediteur_id")->constrained("users");
            $table->string("compte_exp")->nullable();
            $table->foreign("compte_exp")->references("numero")->on("comptes");
            $table->foreignId("destinataire_id")->constrained("users");
            $table->string("compte_dest")->nullable();
            $table->foreign("compte_dest")->references("numero")->on("comptes");
            $table->float("montant");
            $table->enum("type_trans",["depot","retrait","transfert"]);
            $table->dateTime("date");
            $table->string("code",30)->nullable();
            $table->boolean("immediat")->default(false);
            $table->boolean("retire")->default(false);
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
