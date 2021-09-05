import { makeTaggedUnion, none, MemberType } from "safety-match";

export const ChipEffect = makeTaggedUnion({
    Stagger: none,
    Blind: none,
    Confuse: none,
    Lock: none,
    Shield: none,
    Barrier: none,
    Aura: none,
    ACPierce: none,
    ACDown: none,
    Weakness: none,
    Invisible: none,
    Paralysis: none,
    Panic: none,
    Heal: none,
    DmgBoost: none,
    Move: none,
});

const chipEffShortStrMatcher = {
    Stagger: () => "STGR",
    Blind: () => "BLIND",
    Confuse: () => "CONF",
    Lock: () => "LCK",
    Shield: () => "SHLD",
    Barrier: () => "BARR",
    Aura: () => "AURA",
    ACPierce: () => "AC PRC",
    ACDown: () => "AC DN",
    Weakness: () => "WEAKN",
    Invisible: () => "INVIS",
    Paralysis: () => "PARA",
    Panic: () => "PANIC",
    Heal: () => "HEAL",
    DmgBoost: () => "DMG+",
    Move: () => "MOVE",
};

export function chipEffectToShortStr(val: ChipEffect): string {
    return val.match(chipEffShortStrMatcher);
}

export type ChipEffect = MemberType<typeof ChipEffect>;

export function chipEffectFromStr(val: string): ChipEffect {
    val = val.toLowerCase();
    switch(val) {
        case 'stagger':
            return ChipEffect.Stagger;
        case 'blind':
            return ChipEffect.Blind;
        case 'confuse':
            return ChipEffect.Confuse;
        case 'lock':
            return ChipEffect.Lock;
        case 'shield':
            return ChipEffect.Shield;
        case 'barrier':
            return ChipEffect.Barrier;
        case 'aura':
            return ChipEffect.Aura;
        case 'ac pierce':
            return ChipEffect.ACPierce;
        case 'ac down':
            return ChipEffect.ACDown;
        case 'weakness':
            return ChipEffect.Weakness; 
        case 'invisible':
            return ChipEffect.Invisible;
        case 'paralysis':
            return ChipEffect.Paralysis;
        case 'panic':
            return ChipEffect.Panic;
        case 'heal':
            return ChipEffect.Heal;
        case 'dmg boost':
            return ChipEffect.DmgBoost;
        case 'move':
            return ChipEffect.Move;
        default:
            throw new TypeError(`No ChipEffect with the name ${val}`);
    }
}