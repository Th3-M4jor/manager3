import m from "mithril";
import { $enum } from "ts-enum-util";

export enum Element {
    Fire,
    Aqua,
    Elec,
    Wood,
    Wind,
    Sword,
    Break,
    Cursor,
    Recovery,
    Invis,
    Object,
    Null,
}

const wrappedElement = $enum(Element);

export function elementFromStr(val: string): Element {
    return wrappedElement.getValueOrThrow(val);
}

export function elementToCssClass(val: Element): string {
    switch (val) {
        case Element.Fire:
            return "fireChip";
        case Element.Aqua:
            return "aquaChip";
        case Element.Elec:
            return "elecChip";
        case Element.Wood:
            return "woodChip";
        case Element.Wind:
            return "windChip";
        case Element.Sword:
            return "swordChip";
        case Element.Break:
            return "breakChip";
        case Element.Cursor:
            return "cursorChip";
        case Element.Recovery:
            return "recovChip";
        case Element.Invis:
            return "invisChip";
        case Element.Object:
            return "objectChip";
        case Element.Null:
            return "nullChip";
    }
}

export function elementArrToHtml(val: Element[]): JSX.Element {
    let arr = val.map((e) => {
        let elemClass = elementToCssClass(e);
        return <span class={elemClass}/>
    });
    
    return (
        <span class="chipImgBox">
            {arr}
        </span>
    );
}