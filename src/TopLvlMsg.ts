import m from "mithril";

import {makeTaggedUnion, none, MemberType} from "safety-match";

export const Tabs = makeTaggedUnion({
    Library: none,
    Pack: none,
    Folder: none,
    GroupFolder: (name: string) => name,
});

export type TabName = MemberType<typeof Tabs>;

let topMsg = "";
let msgClearHandle: number | undefined;

export function getTopMsg(): string {
    return topMsg;
}

export function setTopMsg(msg: string): void {
    if(msg.length == 0) {
        msgClearHandle = undefined;
    } else {
        window.clearTimeout(msgClearHandle);
        msgClearHandle = window.setTimeout(() => {topMsg = ""; m.redraw();}, 15_000); //15 seconds
    }
    topMsg = msg;
}