var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");
myHeaders.append("Accept", "application/json");
export const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: "",
};
export const URL_API = 'http://127.0.0.1:8000/api';
export const reg = /^(\d{9}|\w{2}_\d{9})$/;
export const fieldFilters = {
    montant: (value) => +value >= 1000,
    numero: (value) => reg.test(value),
    date: (value) => Boolean(value)
};
export const filtre = {
    "montant": "",
    "date": "",
    "numero": ""
};
