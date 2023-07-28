<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon as SupportCarbon;
use Illuminate\Support\Facades\Hash;

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
        if($credentials["code"]){
            $trans=Transaction::handleTransOnAccount($credentials);
            $code = str_shuffle(substr( Hash::make($credentials["date"]),0,25));
            $trans->update(["code"=>$code]);
        }

    }
}
