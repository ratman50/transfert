<?php

namespace Database\Seeders;

use App\Models\Compte;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CompteSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $comptes=[
            [
                "numero"=>"WV_771143226",
                "solde"=>2000
            ],
            [
                "numero"=>"OM_771143226",
                "solde"=>2000
            ],
            [
                "numero"=>"CB_771143226",
                "solde"=>2000
            ],
        ];
        Compte::insert($comptes);
    }
}
