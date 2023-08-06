import { bodyClient, bodyHistorique } from "./dom.js";
import { IClient, IData, IHistorique } from "./interface.js";
import { getClient } from "./service/ClientService.js";
import { getHistorique } from "./service/TransactionService.js";

export function activePage(key:string|undefined){
    const menu= document.querySelectorAll<HTMLElement>(`.card_user > div`)!;
    menu.forEach(men=>{
         if(men.classList.contains('active'))
         {
              men.classList.remove("active");
         }
              men.classList.add("hidden");
    })
    
    const container=document.querySelector(`.card_user div[data-key="${key}"]`);
    container?.classList.add('active');
    container?.classList.remove('hidden');

}
export type fetching={
    get:<T>(url:string)=>Promise<T>;
    post:<T>(url:string, requestOption:RequestInit)=>Promise<T>;
}
export function fillTableClient(datas:IClient[], tbody:HTMLElement){
    
    tbody.innerHTML="";
    let html="";
    datas.forEach(data=>{
    html+=`<tr>
            <td>${data.numero}</td>
            <td>${data.name}</td>
            <td>
                <select>
            `;
    // let html:string="<select>";
    data.fournisseurs.forEach((fournisseur, index)=>{
        html+=`<option value=${index}>${fournisseur}</option>`;
    });
    html+="</select> </td>";
    tbody.innerHTML=html;
    })
}
export function fillTableHistorique(datas:IHistorique[], tbody:HTMLElement){
    let html="";
    datas.forEach(data=>{
    html+=`<tr>
            <td>${data.expediteur}</td>
            <td>${data.date}</td>
            <td>${data.destinataire }</td>
            <td>${data.type }</td>
            <td>${data.fournisseur }</td>
            <td>${data.montant }</td>
            `;
    });
    tbody.innerHTML=html;
  
}
let histo:IData<IHistorique>;
let client:IData<IClient>;
export async function fill()
{
    client = await getClient() ;
    if(client.data)
        fillTableClient(client.data, bodyClient);

}
export async function fillHisto(params:Map<String, String>) {
    
    histo=await getHistorique(params) ;
    console.log(histo);
    if(histo.data)
        fillTableHistorique(histo.data,bodyHistorique);
    else
        bodyHistorique.innerHTML="";
}




export const apiClient:fetching={
    get: async(url: string) => {
        const data=await fetch(url)
        .then(response=>response.json())
        .then(data=>data)
        .catch(error=>null);
        return data;       
    },
      post:async (url: string, requestOption: RequestInit) => {
        const data=await fetch(url, requestOption)
        .then(response=>response.json())
        .then(data=>data)
        .catch(error=>null);
        return data;
        
      } 
};
