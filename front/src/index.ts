let phones=document.querySelectorAll(".phone") as NodeList ;
const URL_API="http://127.0.0.1:8000/api/";
const ClassFournisseur=document.querySelector(".fournisseurs") as HTMLSelectElement ;
const ValMontant=document.getElementById("montant") as HTMLInputElement;
const valider=document.getElementById("valider") as HTMLButtonElement;
const transaction=document.getElementById("transaction")as HTMLSelectElement;
const compte_info=document.getElementById("compte_info");
const detail=document.querySelector(".detail") as HTMLElement;
const generated=document.querySelector(".generated") ;
const numero=document.getElementById("numero") as HTMLInputElement;

let   fournisseurAuthorized:string;
var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");
myHeaders.append("Accept", "application/json");
let compteDepot:string|undefined;
valider.disabled=true;

interface ISend{
    user:string;
    compte?:string;
    code?:boolean;
    montant:string;
    type:string;
    date:Date;

};
const notif=numero.parentElement?.querySelector<HTMLElement>(".notification_numero");
function handleNumSender() {
    const reg=/^(\d{9})$/;
    notif?.classList.add("disabled");
    numero.classList.remove("active");
    if(sender && fournisseurs[ClassFournisseur.selectedIndex-1]=="WR" && !reg.test(numero.value)){
        notif?.classList.remove("disabled");
        console.log(notif);
        notif?.classList.add("active");
        numero.classList.add("active");
        
                
    }
}
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
const type_trans=[
    {
        id:1,val:"depot"
    },
    {
        id:2,val:"retrait"
    },
]
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
            compte_info?.classList.remove("active");
            if(user){
                valueInput=user.name;
                dataSend.user=user.id;
                compte_info?.classList.add("active")
                fillDetail(user, detail);
                const fournisseur=user.fournisseur;
                sender={...user};
                if(fournisseur && element.classList.contains("expide")){
                    const color=tabExpediteur.get(fournisseur!.toUpperCase()) || "transparent";
                    handleNumSender();
                    expediteur.style.backgroundColor=color;
                }
                else if(!element.classList.contains("expide")){
                    dataSend.compte=element.value;
                    notif?.classList.add("disabled");
                    notif?.classList.remove("active")
                    numero.classList.remove("active");

                }
                // else
                // expediteur.innerHTML=epx;
            }else{
                expediteur.style.backgroundColor="transparent";

            }
        }
        sibling.querySelector("input")!.value=valueInput; 
        
        
    })
})

ClassFournisseur?.addEventListener("change",(event)=>{
    const target=event.target as HTMLSelectElement;
    const val:number=+ClassFournisseur.value;
    const blues = document.querySelectorAll<HTMLElement>(".blue"); 
    
    blues.forEach((blue) => {   
        const color=tabExpediteur.get(fournisseurs[val-1])||"transparent";
        blue.style.backgroundColor=  color;   
    });
    ValMontant.classList.remove("active");
    const minIndice=montantMin[val-1];
    const not_montant=document.querySelector(".not_montant") as HTMLElement;
    not_montant.textContent="Le montant minimum est de";
    not_montant.classList.remove("active");
    if(+ValMontant.value<minIndice ){
        not_montant.textContent+=" "+minIndice;
        not_montant.classList.add("active");
        ValMontant.classList.add("active");
    }
    const posFourni=+ClassFournisseur.value-1;
    fournisseurAuthorized=fournisseurs[posFourni];
    if(sender)
    {
        compteDepot=sender.compte.find(com=>com.numero.startsWith(fournisseurAuthorized))?.numero;
                
    }
   
    handleNumSender();
    
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
   
    // dataSend.compte=document.querySelector<HTMLInputElement>("#recep")?.value;
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
      .then(result =>{
          console.log(result);
          if(dataSend.code){
            generated!.querySelector("p")!.textContent=result.code;
          }
        } 

      )
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
    if(ClassFournisseur.value)
    {
        const posFourni=+ClassFournisseur.value-1;
        fournisseurAuthorized=fournisseurs[posFourni];
        
        
    }
    if(element.value=="2"){
        dest?.classList.add("disabled");
        console.log(compteDepot);
        dataSend.compte=compteDepot;
       
    }
    
})


generated?.querySelector("button")?.addEventListener('click',(event)=>{
    console.log(event.target);
    
    generated.parentElement?.classList.remove("active");
})
