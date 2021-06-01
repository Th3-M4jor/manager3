import m from "mithril";
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
    switch(val) {
        case "Fire":
            return Element.Fire;
        case "Aqua":
            return Element.Aqua;
        case "Elec":
            return Element.Elec;
        case "Wood":
            return Element.Wood;
        case "Wind":
            return Element.Wind;
        case "Sword":
            return Element.Sword;
        case "Break":
            return Element.Break;
        case "Cursor":
            return Element.Cursor;
        case "Recovery":
            return Element.Recov;
        case "Invis":
            return Element.Invis;
        case "Object":
            return Element.Obj;
        case "Null":
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

export function elementArrToHtml(val: Element[]): JSX.Element {
    let arr = val.map((e) => {
        let elemClass = elementToCssClass(e);
        return (<span class={elemClass}/>);
    });

    return (
        <span class="chipImgBox">
            {arr}
        </span>
    );

}