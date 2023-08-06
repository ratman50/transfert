import { bodyClient, bodyHistorique } from "./dom.js";
import { getClient } from "./service/ClientService.js";
import { getHistorique } from "./service/TransactionService.js";
export function activePage(key) {
    const menu = document.querySelectorAll(`.card_user > div`);
    menu.forEach(men => {
        if (men.classList.contains('active')) {
            men.classList.remove("active");
        }
        men.classList.add("hidden");
    });
    const container = document.querySelector(`.card_user div[data-key="${key}"]`);
    container === null || container === void 0 ? void 0 : container.classList.add('active');
    container === null || container === void 0 ? void 0 : container.classList.remove('hidden');
}
export function fillTableClient(datas, tbody) {
    tbody.innerHTML = "";
    let html = "";
    datas.forEach(data => {
        html += `<tr>
            <td>${data.numero}</td>
            <td>${data.name}</td>
            <td>
                <select>
            `;
        // let html:string="<select>";
        data.fournisseurs.forEach((fournisseur, index) => {
            html += `<option value=${index}>${fournisseur}</option>`;
        });
        html += "</select> </td>";
        tbody.innerHTML = html;
    });
}
export function fillTableHistorique(datas, tbody) {
    let html = "";
    datas.forEach(data => {
        html += `<tr>
            <td>${data.expediteur}</td>
            <td>${data.date}</td>
            <td>${data.destinataire}</td>
            <td>${data.type}</td>
            <td>${data.fournisseur}</td>
            <td>${data.montant}</td>
            `;
    });
    tbody.innerHTML = html;
}
let histo;
let client;
export async function fill() {
    client = await getClient();
    if (client.data)
        fillTableClient(client.data, bodyClient);
}
export async function fillHisto(params) {
    histo = await getHistorique(params);
    console.log(histo);
    if (histo.data)
        fillTableHistorique(histo.data, bodyHistorique);
    else
        bodyHistorique.innerHTML = "";
}
export const apiClient = {
    get: async (url) => {
        const data = await fetch(url)
            .then(response => response.json())
            .then(data => data)
            .catch(error => null);
        return data;
    },
    post: async (url, requestOption) => {
        const data = await fetch(url, requestOption)
            .then(response => response.json())
            .then(data => data)
            .catch(error => null);
        return data;
    }
};
