<?php

namespace App\Http\Controllers;

use App\Http\Resources\TransactionResource;
use App\Models\Compte;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

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
                "historique"=>TransactionResource::collection( Transaction::where("user_id",$find->id)->get())
            ];
        }
        
        $user = User::where('numero', $numero)->first();
        
        if ($user) {
            return[
                "id"=>$user->id,
                "name"=>$user->name,
                "numero"=>$user->numero,
                "compte"=>Compte::where("numero","like","%$numero")->get(),
                "historique"=>TransactionResource::collection( Transaction::where("user_id",$user->id)->get())
            ] ;
        }
        
        return response('Compte or User not found', Response::HTTP_NOT_FOUND);
    }
}
