
export const MONEYFY_PACKAGE = 'com.monefy.app.lite';

export function monefyId(resource: string): string {
    return `id=${MONEYFY_PACKAGE}:id/${resource}`;
}

export function monefyResourceId(resource: string): string {
    return `${MONEYFY_PACKAGE}:id/${resource}`;
}
