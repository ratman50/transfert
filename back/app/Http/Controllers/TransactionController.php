<?php

namespace App\Http\Controllers;

use App\Http\Resources\TransactionResource;
use App\Models\Transaction;
use App\Models\User;
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
                "compte"=>["required","exists:App\Models\Compte,numero"],
                "montant"=>["required","numeric"],
                "type"=>["required","numeric","min:1","max:3"],
                "date"=>["required","date"],
                "immediat"=>["sometimes","boolean"],
                "code"=>["sometimes","boolean"]
            ]
            );
        ;
        $trans=Transaction::handleTransOnAccount($credentials);
        if(isset($credentials["code"])){
                $code = str_shuffle(substr( Hash::make($credentials["date"]),0,25));
                $trans->update(["code"=>$code]);
                return [...$credentials,"code"=>$code];
        }
        return $credentials;
    }
    public function flux(Request $request, $numero){
        $client=$this->check($numero);
        return TransactionResource::collection( Transaction::where("user_id",$client->id)->get());
        if($client)
        return [];
        
    }
}
