<?php

namespace App\Http\Controllers;

use App\Models\Compte;
use App\Models\User;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;

class Controller extends BaseController
{
    use AuthorizesRequests, ValidatesRequests;

    public function check($numero){
        $compte = Compte::where('numero', $numero)->first();
        if ($compte) {
            $tabInfo= explode('_',$numero);
            return User::where('numero', $tabInfo[1])->first();
        }
        $user = User::where('numero', $numero)->first();
        
        if ($user)
            return $user;
        return null;
    }
}
