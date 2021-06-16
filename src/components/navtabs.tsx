import m, { CVnode, Vnode } from "mithril";
import stream from "mithril/stream";
//import "./fragment-polyfix";
import { MitrhilTsxComponent } from "../JsxNamespace";

import * as top from "../TopLvlMsg";

//#region callbackstuff
type ClassAndCallback = [string, (e: Event) => void];

function changeToFolder(e: Event) {
    (e.currentTarget as HTMLElement)?.blur();
    m.route.set("/Folder");
}

function changeToPack(e: Event) {
    (e.currentTarget as HTMLElement)?.blur();
    m.route.set("/Pack");
}

function changeToLibrary(e: Event) {
    (e.currentTarget as HTMLElement)?.blur();
    m.route.set("/Library");
}

function dontRedraw(e: Event) {
    //@ts-ignore
    e.redraw = false;
}

function folderActive() : ClassAndCallback[] {
    return [
        ["activeNavTab", dontRedraw],
        ["inactiveNavTab", changeToPack],
        ["inactiveNavTab", changeToLibrary]
    ];
}

function packActive(): ClassAndCallback[] {
    return [
        ["inactiveNavTab", changeToFolder],
        ["activeNavTab", dontRedraw],
        ["inactiveNavTab", changeToLibrary]
    ];
}

function libraryActive(): ClassAndCallback[] {
    return [
        ["inactiveNavTab", changeToFolder],
        ["inactiveNavTab", changeToPack],
        ["activeNavTab", dontRedraw]
    ];
}
//#endregion callbackStuff

const noGroupNavTabMatcher = {
    Folder: folderActive,
    Pack: packActive,
    Library: libraryActive,
    GroupFolder: (_: string) => { throw new Error("Unreachable") },
}

export interface navTabProps {
    activeTab: top.TabName,
}

export class NavTabs extends MitrhilTsxComponent<navTabProps> {

    noGroupTabs(activeTab: top.TabName): JSX.Element {
        let [[fldrClass, fldrCallback], [packClass, packCallback], [libClass, libCallback]] = activeTab.match(noGroupNavTabMatcher);
        return (
            <>
            <div class="col-span-3 sm:col-span-4 md:col-span-5 pl-2 pr-6 nav-tab-group">
                <button onclick={fldrCallback} class={fldrClass}>Folder</button>
                <button onclick={packCallback} class={packClass}>Pack</button>
                <button onclick={libCallback} class={libClass}>Library</button>
            </div>
            <div class="col-span-1"/>
            </>
        );

    }

    view(vnode: m.CVnode<navTabProps>) {
        return this.noGroupTabs(vnode.attrs.activeTab);
    }
}