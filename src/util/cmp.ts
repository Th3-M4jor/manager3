
export function cmp(a: string, b: string): number;
export function cmp(a: number, b: number): number;
export function cmp(a: any, b: any): number {
    if (a > b) return +1;
    if (a < b) return -1;
    return 0;
}