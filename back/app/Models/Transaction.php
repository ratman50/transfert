<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Hash;

class Transaction extends Model
{
    use HasFactory;
    protected $guarded = []; 
    static $fields=[
        "expediteur_id"=>"expediteur",
        "destinataire_id"=>"destinataire",
        "compte_dest"=>"compte_dest",
        "compte_exp"=>"compte_exp",
        "type_trans"=>"type",
        "date"=>"date",
        "immediat"=>"immediat",
        "montant"=>"montant",
        "code"=>"code"
    ];
    static public function handleTransOnAccount($info){
        $res=[];
        foreach (Transaction::$fields as $key => $value) {
            if(isset($info[$value]))
            {
                $res[$key]=$info[$value];
            }
        }
        if(isset($res["code"])){
            $anc_trans=Transaction::where("code", $res["code"]);
            $update_anc=Transaction::where("code", $res["code"])->update(["retire"=>true]);
            
        }
        if(!isset($res["compte_exp"]) && !isset($res["compte_dest"]) && isset($res["expediteur_id"]) && isset($res["destinataire_id"])){
            if($res["type_trans"]==1){

                $res["code"]=str_shuffle(substr(Hash::make($res["date"]),0,25));
                return Transaction::create($res);
            }
        }
        $compte_exp=$res["compte_exp"];
        $expid=Compte::where("numero",$compte_exp);
        $expediteur=Compte::where("numero",$compte_exp)->first();
        if(!isset($res["destinataire"]) && !isset($res["compte_dest"]) && isset($res["compte_exp"])){
            $trans=$res["type_trans"]==1?$expediteur->solde+$res["montant"]:$expediteur->solde-$res["montant"];
            if($trans>=0){
                $expid->update(["solde"=>$trans]);
                $res["expediteur_id"]=User::where(["numero"=>explode('_', $res["compte_exp"])[1]])->first()->id;
                $res["destinataire_id"]=$res["expediteur_id"];
                $res["compte_dest"]=$res["compte_exp"];
                return Transaction::create($res);

            }
            return null;
        }
        $compte_dest=$res["compte_dest"];
        $dest=Compte::where("numero",$compte_dest);
        $destinataire=Compte::where("numero",$compte_dest)->first();

        if(isset($compte_exp) && isset($compte_dest) && explode("_",$destinataire->numero)[0]==explode("_",$expediteur->numero)[0])
        {
            $solde_expid=$expediteur->solde-$res["montant"];
            $num_exp=explode("_",$expediteur->numero)[1];
            $num_dest=explode("_",$destinataire->numero)[1];
            $id_exp=User::where(["numero"=>$num_exp])->first()->id;
            $id_dest=User::where(["numero"=>$num_dest])->first()->id;
            if($expediteur->numero!==$destinataire->numero && $res["type_trans"]==1 && $solde_expid>0){
                $dest->update(["solde"=>$destinataire->solde+$res["montant"]]);
                $expid->update(["solde"=>$solde_expid]);
                $res["expediteur_id"]=$id_exp;
                $res["destinataire_id"]=$id_dest;
                return Transaction::create($res);
            }
            
        }

        return null;
    }
}
