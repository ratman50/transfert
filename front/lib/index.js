"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let phones = document.querySelectorAll(".phone");
const URL_API = "http://127.0.0.1:8000/api/";
const ClassFournisseur = document.querySelector(".fournisseurs");
const ValMontant = document.getElementById("montant");
const valider = document.getElementById("valider");
const transaction = document.getElementById("transaction");
const compte_info = document.getElementById("compte_info");
const detail = document.querySelector(".detail");
let fournisseurAuthorized;
var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");
myHeaders.append("Accept", "application/json");
;
let dataSend = {
    user: "",
    compte: "",
    montant: "",
    type: "",
    date: new Date()
};
const fournisseurs = [
    "OM",
    "WV",
    "CB",
    "WR",
];
const montantMin = [
    500,
    500,
    10000,
    1000
];
const tabExpediteur = new Map([
    ["OM", "#f77500"],
    ["WV", "#48CBF2"],
    ["CB", "#8D8B95"],
    ["WR", "#21AC49"],
]);
let getUser = (url) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield fetch(url)
        .then(response => response.json())
        .then(data => data)
        .catch(error => null);
    return data;
});
function fillDetail(data, container) {
    container.querySelector(".name>span").innerHTML = data.name;
    container.querySelector(".numero>span").innerHTML = data.numero;
    const body = container.querySelector("table>tbody");
    body.innerHTML = "";
    data.historique.forEach(hist => {
        body.innerHTML +=
            `<tr>
        <td>${hist.compte}</td>
        <td>${hist.montant}</td>
        <td>${hist.type}</td>
        <td>${hist.date}</td>
    </tr>`;
    });
}
let user;
let sender;
phones.forEach((phone) => {
    phone.addEventListener("input", (event) => __awaiter(void 0, void 0, void 0, function* () {
        const element = event.target;
        const value = element.value;
        const sibling = element.parentElement.nextElementSibling;
        const expediteur = document.querySelector(".variant");
        let valueInput = "";
        const reg = /^(\d{9}|\w{2}_\d{9})$/;
        if (reg.test(value)) {
            user = (yield getUser(`${URL_API}user/${value}`));
            valueInput = "non definie";
            if (user) {
                valueInput = user.name;
                dataSend.user = user.id;
                fillDetail(user, detail);
                const fournisseur = user.fournisseur;
                if (fournisseur && element.classList.contains("expide")) {
                    sender = user;
                    const color = tabExpediteur.get(fournisseur.toUpperCase()) || "transparent";
                    expediteur.style.backgroundColor = color;
                }
                // else if(!element.classList.contains("expide")){
                //     dataSend.compte=element.value;
                // }
                // else
                // expediteur.innerHTML=epx;
            }
            else
                expediteur.style.backgroundColor = "transparent";
        }
        sibling.querySelector("input").value = valueInput;
    }));
});
ClassFournisseur === null || ClassFournisseur === void 0 ? void 0 : ClassFournisseur.addEventListener("change", () => {
    const val = +ClassFournisseur.value;
    const blues = document.querySelectorAll(".blue");
    blues.forEach((blue) => {
        const color = tabExpediteur.get(fournisseurs[val - 1]) || "transparent";
        blue.style.backgroundColor = color;
    });
    const numero = document.getElementById("numero");
    ValMontant.classList.remove("active");
    const minIndice = montantMin[val - 1];
    const not_montant = document.querySelector(".not_montant");
    not_montant.textContent = "Le montant minimum est de";
    not_montant.classList.remove("active");
    if (+ValMontant.value < minIndice) {
        not_montant.textContent += " " + minIndice;
        not_montant.classList.add("active");
        console.log(minIndice);
        console.log(not_montant);
        ValMontant.classList.add("active");
    }
});
ValMontant.addEventListener("input", () => {
    const val = +ClassFournisseur.value;
    const minIndice = montantMin[val - 1];
    const not_montant = document.querySelector(".not_montant");
    not_montant.textContent = "Le montant minimum est de";
    not_montant.classList.remove("active");
    if (+ValMontant.value < minIndice) {
        not_montant.textContent += " " + minIndice;
        not_montant.classList.add("active");
        ValMontant.classList.add("active");
    }
});
valider === null || valider === void 0 ? void 0 : valider.addEventListener("click", () => {
    var _a;
    const type = transaction.options[transaction.options.selectedIndex].textContent || "";
    dataSend.type = type == "depot" ? "1" : "2";
    dataSend.montant = ValMontant.value;
    dataSend.date = new Date();
    dataSend.compte = (_a = document.querySelector("#recep")) === null || _a === void 0 ? void 0 : _a.value;
    dataSend.user = sender.id;
    let raw = JSON.stringify(dataSend);
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
});
compte_info === null || compte_info === void 0 ? void 0 : compte_info.addEventListener('click', (event) => {
    if (user) {
        detail === null || detail === void 0 ? void 0 : detail.classList.toggle("active");
    }
});
transaction.addEventListener("change", (event) => {
    const element = event.target;
    const dest = document.querySelector(".dest");
    dest === null || dest === void 0 ? void 0 : dest.classList.remove("disabled");
    if (element.value == "2") {
        dest === null || dest === void 0 ? void 0 : dest.classList.add("disabled");
    }
    if (ClassFournisseur.value) {
        const posFourni = +ClassFournisseur.value - 1;
        fournisseurAuthorized = fournisseurs[posFourni];
        console.log(fournisseurAuthorized);
    }
});
