import {cmpN} from "./cmp";

export function arrCmp<T>(a: T[], b: T[], toNumFn: (val: T) => number): number {
    //find which has shortest length
    const len = Math.min(a.length, b.length);

    // check each element in order
    for(let i = 0; i < len; i++) {
        const aSortNum = toNumFn(a[i]);
        const bSortNum = toNumFn(b[i]);

        const pos = cmpN(aSortNum, bSortNum);
        if(pos != 0) {
            return pos;
        }
    }
    
    //elements that can be compared are all equal, test length next
    return cmpN(a.length, b.length);
}