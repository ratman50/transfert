<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    use HasFactory;
    protected $guarded = []; 
    static $fields=[
        "user_id"=>"user",
        "compte_id"=>"compte",
        "type_trans"=>"type",
        "date"=>"date",
        "immediat"=>"immediat",
        // "code"=>"code",
        "montant"=>"montant"
    ];
    static public function handleType(int $type){
        $res="";
        switch ($type) {
            case 1:
                $res="depot";
                break;
            case 2:
                $res="retrait";
                break;
            default:
                $res="virement";
                break;
        }
        return $res;
    }
    static public function handleTransOnAccount($info){
        $res=[];
        foreach (Transaction::$fields as $key => $value) {
            if(isset($info[$value]))
            {
                $res[$key]=$info[$value];
            }
        }
        if($res["compte_id"]){
            $benef=Compte::where("numero",$res["compte_id"]);
            $beneficaire=$benef->first();
            $solde=$beneficaire->solde;
            
            $solde=$res["type_trans"]==1?$solde+$res["montant"]:$solde-$res["montant"];
            if($solde>0){
                $benef->update(["solde"=>$solde]);
                $res["type_trans"]=Transaction::handleType($res["type_trans"]);
                $transaction =Transaction::create($res);
                return $transaction;
            }
            

        }
        return null;
    }
}
