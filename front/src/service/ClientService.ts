import { URL_API } from "../const.js";
import { apiClient } from "../fonction.js";
import { IClient, IData } from "../interface.js";

export async function getClient():Promise<IData<IClient>> {
  
  const data= await apiClient.get<IData<IClient>>(`${URL_API}/users`) ;
  
  return data;
}
export async function postClient(request:RequestInit):Promise<IData<IClient>> {
  const data= apiClient.post<IData<IClient>>(`${URL_API}/user`, request);
  return data;
}