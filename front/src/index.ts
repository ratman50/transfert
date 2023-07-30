let phones=document.querySelectorAll(".phone") as NodeList ;
const URL_API="http://127.0.0.1:8000/api/";
const ClassFournisseur=document.querySelector(".fournisseurs") as HTMLSelectElement ;
const ValMontant=document.getElementById("montant") as HTMLInputElement;
const valider=document.getElementById("valider");
const transaction=document.getElementById("transaction")as HTMLSelectElement;
const compte_info=document.getElementById("compte_info");
const detail=document.querySelector(".detail") as HTMLElement;
let   fournisseurAuthorized:string;
var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");
myHeaders.append("Accept", "application/json");

interface ISend{
    user:string;
    compte?:string;
    montant:string;
    type:string;
    date:Date;

};
let dataSend:ISend={
    user:"",
    compte:"",
    montant:"",
    type:"",
    date:new Date()
};
const fournisseurs=[
    "OM",
    "WV",
    "CB",
    "WR",
];
const montantMin=[
    500,
    500,
    10000,
    1000
];
const tabExpediteur=new Map([
    ["OM","#f77500"],
    ["WV","#48CBF2"],
    ["CB","#8D8B95"],
    ["WR","#21AC49"],
]);
type fetching=(url:string)=>Promise<Object>;
let  getUser:fetching=async(url:string)=>{
    const data=await fetch(url)
    .then(response=>response.json())
    .then(data=>data)
    .catch(error=>null);
    
    return data; 
};
// console.log( getUser("user/771143226"));
interface ICompte{
    "numero":string;
    "solde":string;
}
interface IHistorique{
    compte: string;
    montant:string,
    type: string,
    date: Date,
}
interface IUser{
    name:string;
    id:string;
    numero:string;
    fournisseur?:string;
    compte:Array<ICompte>;
    historique:Array<IHistorique>;
}
function fillDetail(data:IUser,container:HTMLElement){
   container!.querySelector(".name>span")!.innerHTML=data.name;
   container!.querySelector(".numero>span")!.innerHTML=data.numero;
   const body=container!.querySelector("table>tbody");
   body!.innerHTML="";
    
   data.historique.forEach(hist=>{
    body!.innerHTML+=
    `<tr>
        <td>${hist.compte}</td>
        <td>${hist.montant}</td>
        <td>${hist.type}</td>
        <td>${hist.date}</td>
    </tr>`;
   });

   
}
let user:IUser;
let sender:IUser;
phones.forEach((phone)=>{
    
    phone.addEventListener("input",async(event)=>{
        const element=event.target as HTMLInputElement ;
        const value=element.value;
        const sibling=element!.parentElement!.nextElementSibling as HTMLElement;
        const expediteur=document.querySelector(".variant") as HTMLElement;
        
        
        let valueInput:string="";
        const reg=/^(\d{9}|\w{2}_\d{9})$/;
        if(reg.test(value))
        {
            user=await getUser(`${URL_API}user/${value}`) as IUser;
            valueInput="non definie";
            if(user){
                valueInput=user.name;
                dataSend.user=user.id;
                
                fillDetail(user, detail);
                const fournisseur=user.fournisseur;
                if(fournisseur && element.classList.contains("expide")){
                    sender=user;
                    const color=tabExpediteur.get(fournisseur!.toUpperCase()) || "transparent";
                    expediteur.style.backgroundColor=color;
                }
                // else if(!element.classList.contains("expide")){
                //     dataSend.compte=element.value;

                // }
                // else
                // expediteur.innerHTML=epx;
            }else
            expediteur.style.backgroundColor="transparent";
        }
        sibling.querySelector("input")!.value=valueInput; 
        
        
    })
})

ClassFournisseur?.addEventListener("change",()=>{
    const val:number=+ClassFournisseur.value;
    const blues = document.querySelectorAll<HTMLElement>(".blue"); 

    blues.forEach((blue) => {   
        const color=tabExpediteur.get(fournisseurs[val-1])||"transparent";
        blue.style.backgroundColor=  color;   
    });
    const numero=document.getElementById("numero");
    ValMontant.classList.remove("active");
    const minIndice=montantMin[val-1];
    const not_montant=document.querySelector(".not_montant") as HTMLElement;
    not_montant.textContent="Le montant minimum est de";
    not_montant.classList.remove("active");
    if(+ValMontant.value<minIndice ){
        not_montant.textContent+=" "+minIndice;
        not_montant.classList.add("active");
        console.log(minIndice);
        console.log(not_montant);
        
        ValMontant.classList.add("active");
    }
    
});

ValMontant.addEventListener("input",()=>{
    const val:number=+ClassFournisseur.value;
    const minIndice=montantMin[val-1];
    const not_montant=document.querySelector(".not_montant") as HTMLElement;
    not_montant.textContent="Le montant minimum est de";
    not_montant.classList.remove("active");
    if(+ValMontant.value<minIndice ){
        not_montant.textContent+=" "+minIndice;
        not_montant.classList.add("active");
        ValMontant.classList.add("active");
    }

})
valider?.addEventListener("click",()=>{
    
    const type=transaction.options[transaction.options.selectedIndex].textContent||"";
    dataSend.type=type=="depot"?"1":"2";
    dataSend.montant=ValMontant.value;
    dataSend.date=new Date();
    dataSend.compte=document.querySelector<HTMLInputElement>("#recep")?.value;
    dataSend.user=sender.id;
    let raw=JSON.stringify(dataSend);
    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
      };
      console.log(dataSend);
      
      fetch(`${URL_API}transaction`, requestOptions)
      .then(response => response.json())
      .then(result => console.log(result))
      .catch(error => console.log('error', error));

})
compte_info?.addEventListener('click',(event)=>{
    if(user)
    {
        detail?.classList.toggle("active");  

    }
    
})

transaction.addEventListener("change",(event)=>{
    const element=event.target as HTMLSelectElement;
    const dest=document.querySelector(".dest");

    dest?.classList.remove("disabled");
    if(element.value=="2"){
        dest?.classList.add("disabled");
    }
    
    if(ClassFournisseur.value)
    {
        const posFourni=+ClassFournisseur.value-1;
        fournisseurAuthorized=fournisseurs[posFourni];
        console.log(fournisseurAuthorized);
        
        
    }
})