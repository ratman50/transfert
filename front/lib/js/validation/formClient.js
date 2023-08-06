export function validateFieldNumero(params) {
    const reg = /^(\d{9})$/;
    return reg.test(params.replace(' ', ''));
}
