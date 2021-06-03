import m, { CVnode, Vnode } from "mithril";
import stream from "mithril/stream";
//import "./fragment-polyfix";
import { MitrhilTsxComponent } from "../JsxNamespace";

import * as top from "../TopLvlMsg";

//#region callbackstuff
type ClassAndCallback = [string, (e: any) => void];

function changeToFolder(_: any) {
    let topStream = top.getTopStream();
    topStream(top.TopLvlMsg.ChangeTab(top.Tabs.Folder));
    topStream(top.TopLvlMsg.ChangeChipDesc(undefined));
}

function changeToPack(_: any) {
    let topStream = top.getTopStream();
    topStream(top.TopLvlMsg.ChangeTab(top.Tabs.Pack));
    topStream(top.TopLvlMsg.ChangeChipDesc(undefined));
}

function changeToLibrary(_: any) {
    let topStream = top.getTopStream();
    topStream(top.TopLvlMsg.ChangeTab(top.Tabs.Library));
    topStream(top.TopLvlMsg.ChangeChipDesc(undefined));
}

function dontRedraw(e: any) {
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
            <div class="nav-tab-group">
                <button onclick={fldrCallback} class={fldrClass}>Folder</button>
                <button onclick={packCallback} class={packClass}>Pack</button>
                <button onclick={libCallback} class={libClass}>Library</button>
            </div>
        );

    }

    view(vnode: m.CVnode<navTabProps>) {
        return this.noGroupTabs(vnode.attrs.activeTab);
    }
}