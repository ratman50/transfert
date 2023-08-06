import {fieldFilters, filtre, requestOptions } from "./const.js";
import { menuBtn,dropdown_items, numClient, addUser, nameClient, filters } from "./dom.js";
import { activePage,fill, fillHisto } from "./fonction.js";
import { ISendClient } from "./interface.js";
import { postClient } from "./service/ClientService.js";
import { validateFieldNumero } from "./validation/formClient.js";

const dataUser:ISendClient={
     name:"",
     numero:""
}

fill();
fillHisto((<any>Object).entries(filtre));
menuBtn?.addEventListener("click",()=>{
     menuBtn?.classList.toggle("open");
     document.querySelector(".dropdown")?.classList.toggle('active');

});
dropdown_items.forEach((dropdown_item, pos)=>{
     dropdown_item.style.cssText=`
     transform-origin: top center;
     animation: translateX 300ms ${(pos+1) * 60}ms ease-in-out forwards
     `;
     dropdown_item.addEventListener("click",()=>{
          activePage(dropdown_item.dataset.key);
          
     });
});
let okNumber=false;
let okName=false;

numClient.addEventListener("input",()=>{
     const valNumClient=numClient.value;
     numClient.style.color="black";
     addUser.classList.add("disabled");        
     
     if(valNumClient.length==9 && validateFieldNumero(valNumClient))
     {
          okNumber=true;
          
          if(okName)
          {
               addUser.classList.remove("disabled"); 
               dataUser.numero=valNumClient;       
          }
     }
     else if(valNumClient.length>9 ){
          numClient.style.color="brown";
          okNumber=false;
          
     }
});
nameClient.addEventListener("change",()=>{
     addUser.classList.add("disabled");  
     okName=false;      
     if(nameClient.value && nameClient.value.length>4 ){
          okName=true;          
          dataUser.name=nameClient.value;
          if(okNumber){
               addUser.classList.remove("disabled");        
          }
     }
});
addUser.addEventListener("click",()=>{
     if(!addUser.classList.contains("disabled")){
          requestOptions.body=JSON.stringify(dataUser);
          const user=postClient(requestOptions)
     }
});

filters.forEach(filter=>{
     filter.addEventListener("change",()=>{
          const field=filter.classList[1] ;
          if(fieldFilters[field](filter.value)){
             filtre[field]=  filter.value;
             
          }
          else{
               
               filtre[field]="";
          }
          fillHisto((<any>Object).entries(filtre));
       
     })
})