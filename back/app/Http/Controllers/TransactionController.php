<?php

namespace App\Http\Controllers;

use App\Http\Resources\TransactionResource;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;


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
    public function flux(Request $request){
        $credentials=$request->validate([
            "numero"=>["sometimes","required"],
            "montant"=>["sometimes","required"],
            "date"=>["sometimes","required"]
        ]);
        $where=[];
        $client=isset($credentials["numero"])?$this->check($credentials["numero"]):null;
        if(isset($client))
            $where[]=["expediteur_id",$client->id];
        if(isset($credentials["date"]) && strlen($credentials["date"])>5)
        {
            $date=$credentials["date"];
            $where[]=["date",'like',"%$date%"];
        }
        if(isset($credentials["montant"]) && strlen($credentials["montant"])>3)
            $where[]=["montant","<=",$credentials["montant"]];
        return count($where)? TransactionResource::collection( Transaction::where($where)->get()):TransactionResource::collection( Transaction::all());
        
        
    }
    public function retrait(Request $request){
        $credentials=$request->validate([
            "code"=>["required","string","exists:App\Models\Transaction,code"]
        ]);
        $trans=Transaction::where(
            [
                "code"=>$credentials["code"],
                "retire"=>false
            ]
            )->first();
        if($trans){

            $updateTrans=Transaction::where([
                "code"=>$credentials["code"],
                "retire"=>false
            ])->update(["retire"=>true]);
            $tab=$trans->toArray();
            unset($tab["id"]);
            $trans_eff=Transaction::create($tab)->update([
                "date"=>now(),
                "retire"=>true,
                "type_trans"=>"retrait"
            ]);
            return response($trans_eff);
        }
        return response(["deja retire"], Response::HTTP_NOT_FOUND);
    }
}
