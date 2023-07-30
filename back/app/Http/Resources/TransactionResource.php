<?php

namespace App\Http\Resources;

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
        return [
            "compte"=>$this->compte_id,
            "montant"=>$this->montant,
            "type"=>$this->type_trans,
            "date"=>$this->date,

        ];
    }
}
