
export function cmpN(a: number, b: number): number {
    return Math.sign(a - b);
}

export function cmpS(a: string, b: string): number {
    return a.localeCompare(b);
}