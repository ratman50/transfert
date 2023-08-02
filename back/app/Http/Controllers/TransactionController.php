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
                "expediteur"=>["sometimes","required","exists:App\Models\User,id"],
                "compte_exp"=>["sometimes","required","exists:App\Models\Compte,numero"],
                "destinataire"=>["sometimes","required","exists:App\Models\User,id"],
                "compte_dest"=>["sometimes","required","exists:App\Models\Compte,numero"],
                "montant"=>["required","numeric"],
                "type"=>["required","numeric","min:1","max:2"],
                "date"=>["required","date"],
                "immediat"=>["sometimes","boolean"],
                "code"=>["sometimes","string"]
            ]
            );
        ;
        $trans=Transaction::handleTransOnAccount($credentials);
       
        return $trans;
    }
    public function flux(Request $request, $numero){
        $client=$this->check($numero);
        return TransactionResource::collection( Transaction::where("user_id",$client->id)->get());
        if($client)
        return [];
        
    }
}
