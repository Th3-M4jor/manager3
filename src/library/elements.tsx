import { makeTaggedUnion, none, MemberType } from "safety-match";

export const Element = makeTaggedUnion({
    Fire: none,
    Aqua: none,
    Elec: none,
    Wood: none,
    Wind: none,
    Sword: none,
    Break: none,
    Cursor: none,
    Recov: none,
    Invis: none,
    Obj: none,
    Null: none,
});

export type Element = MemberType<typeof Element>;

export function elementFromStr(val: string): Element {
    val = val.toLowerCase();
    switch(val) {
        case "fire":
            return Element.Fire;
        case "aqua":
            return Element.Aqua;
        case "elec":
            return Element.Elec;
        case "wood":
            return Element.Wood;
        case "wind":
            return Element.Wind;
        case "sword":
            return Element.Sword;
        case "break":
            return Element.Break;
        case "cursor":
            return Element.Cursor;
        case "recovery":
        case "recov":
            return Element.Recov;
        case "invis":
            return Element.Invis;
        case "object":
            return Element.Obj;
        case "null":
            return Element.Null;
        default:
            throw new TypeError("Bad element name");
    }
}

const elementToSortNumMatcher = {
    Fire: () => 0,
    Aqua: () => 1,
    Elec: () => 2,
    Wood: () => 3,
    Wind: () => 4,
    Sword: () => 5,
    Break: () => 6,
    Cursor: () => 7,
    Recov: () => 8,
    Invis: () => 9,
    Obj: () => 10,
    Null: () => 11,
};

export function elementToSortNum(val: Element): number {
    return val.match(elementToSortNumMatcher);
}


const elementToCssClassMatcher = {
    Fire: () => "fireChip",
    Aqua: () => "aquaChip",
    Elec: () => "elecChip",
    Wood: () => "woodChip",
    Wind: () => "windChip",
    Sword: () => "swordChip",
    Break: () => "breakChip",
    Cursor: () => "cursorChip",
    Recov: () => "recovChip",
    Invis: () => "invisChip",
    Obj: () => "objectChip",
    Null: () => "nullChip",
};

export function elementToCssClass(val: Element): string {
    return val.match(elementToCssClassMatcher);
}

export function elementArrToHtml(val: Element[]) {
    const arr = val.map((e) => {
        const elemClass = elementToCssClass(e);
        return (<span class={elemClass}/>);
    });

    return (
        <span class="chipImgBox">
            {arr}
        </span>
    );

}