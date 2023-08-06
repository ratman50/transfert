<?php

namespace App\Http\Resources;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TransactionResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $tab=[
            "expediteur"=>User::find($this->expediteur_id)->name,
            "fournisseur"=>$this->compte_exp ? explode("_", $this->compte_exp)[0]:"WR",
            "destinataire"=>$this->expediteur_id==$this->destinataire_id?"himself": User::find($this->destinataire_id)->name,
            "type"=>$this->type_trans,
            "date"=>$this->date,
            "montant"=>$this->montant

        ];
        if(!$this->compte_exp)
            $tab["retire"]=$this->retire ;
        return $tab;
    }
}
