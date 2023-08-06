export interface IClient{
    name:string,
    numero:string,
    fournisseurs:string[];
}
export interface ISendClient{
    name:string,
    numero:string
}

export interface IHistorique{
    expediteur:string,
	fournisseur: string,
    destinataire: string,
    type: string,
    date: string,
	montant: number,
	retire?: boolean
}
export interface IData <T>{
    data?:T[],
    message:string
}
export interface IFilter{
    [key:string]:string,
}
