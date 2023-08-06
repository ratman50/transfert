import { URL_API } from "../const.js";
import { apiClient } from "../fonction.js";
import { IData, IHistorique } from "../interface.js";

export async function  getHistorique(params:Map<String, String>):Promise<IData<IHistorique>>{
    const urlTrans=["numero","date","montant"];
    let res='';
    params.forEach((param)=>{
        if(param[1])
        res+=param[0]+"="+param[1]+"&";
    });
    if(res)
        res=res.slice(0,-1);
    const data =await apiClient.get<IData<IHistorique>>(`${URL_API}/transaction/user?${res}`);
    return data;
}