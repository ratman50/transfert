import { URL_API } from "../const.js";
import { apiClient } from "../fonction.js";
export async function getClient() {
    const data = await apiClient.get(`${URL_API}/users`);
    return data;
}
export async function postClient(request) {
    const data = apiClient.post(`${URL_API}/user`, request);
    return data;
}
