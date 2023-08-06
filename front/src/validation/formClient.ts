
export function validateFieldNumero(params:string):boolean {
    const reg=/^(\d{9})$/;
    return reg.test(params.replace(' ',''));
}