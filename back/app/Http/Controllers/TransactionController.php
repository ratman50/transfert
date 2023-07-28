<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Http\Request;

class TransactionController extends Controller
{
    public function store(Request $request){
        $credentials=$request->validate(
            [
                "user"=>["required","numeric"],
                "compte"=>["sometimes","required","exists:App\Models\Compte,numero"],
                "montant"=>["required","numeric"],
                "type"=>["required","numeric","min:1","max:3"],
                "date"=>["required","date"],
                "immediat"=>["sometimes","boolean"],
                "code"=>["sometimes","boolean"]
            ]
            );
        ;
        dd($credentials);

    }
}
