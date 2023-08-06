<?php

namespace App\Http\Controllers;

use App\Http\Resources\TransactionResource;
use App\Models\Compte;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Http\Client\Response as ClientResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use Symfony\Component\HttpFoundation\Response;

use function PHPSTORM_META\map;
use function PHPUnit\Framework\isEmpty;
use function PHPUnit\Framework\returnSelf;

class UserController extends Controller
{
    public function find(Request $request, $numero) 
    {
        $compte = Compte::where('numero', $numero)->first();
       
        if ($compte) {
            $tabInfo= explode('_',$numero);
            $find=User::where('numero', $tabInfo[1])->first();

            return [
                "id"=>$find->id,
                "name"=>$find->name,
                "numero"=>$find->numero,
                "fournisseur"=>$tabInfo[0],
                "compte"=>[$compte],
                "historique"=>TransactionResource::collection( Transaction::where("compte_dest",$numero)->get())
            ];
        }
        
        $user = User::where('numero', $numero)->first();
        
        if ($user) {
            return[
                "id"=>$user->id,
                "name"=>$user->name,
                "numero"=>$user->numero,
                "compte"=>Compte::where("numero","like","%$numero")->get(),
                "historique"=>TransactionResource::collection( Transaction::where("expediteur_id",$user->id)->get())
            ] ;
        }
        
        return response('Compte or User not found', Response::HTTP_NOT_FOUND);
    }

    public function index(){
        $clients=User::all();
        $client_with_account= $clients->map(fn($client)=>[
            "name"=>$client->name,
            "numero"=>$client->numero,
            "fournisseurs"=>Compte::where("numero","like","%_{$client->numero}")->get()->map(
                fn($compte)=>explode("_",$compte->numero)[0]
            )
        ]);
        return response(["data"=>$client_with_account,"message"=>""]);
    }

    public function store(Request $request){
        $credentials=$request->validate(
            [
                "name"=>["required","min:5"],
                "numero"=>["required","max:9","unique:users"]
            ]
        );
        $response=[
            "message"=>"",
            "data"=>null
        ];
        $status="";
        if(!intval($credentials["numero"]))
        {
            $response["message"]="le champs numero ne doit etre que des chiffres";
            $status=HttpResponse::HTTP_NOT_FOUND;
        }
        else{
            $status=HttpResponse::HTTP_ACCEPTED;
            $credentials["password"]="123";
            $response["data"]=User::create($credentials);
        }
        
        return response($response,$status);
        
    }
}
