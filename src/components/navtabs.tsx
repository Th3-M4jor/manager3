import m from "mithril";
//import "./fragment-polyfix";
import { MitrhilTsxComponent } from "../JsxNamespace";
import { ChipLibrary } from "../library/library";

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

function makeChangeToPlayerFn(name: string) : (e: Event) => void {
    return (e: Event) => {
        (e.currentTarget as HTMLElement)?.blur();
        m.route.set("/Group/:playerName", {playerName: name});
    };
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

function noneActive() : ClassAndCallback[] {
    return [
        ["inactiveNavTab", changeToFolder],
        ["inactiveNavTab", changeToPack],
        ["inactiveNavTab", changeToLibrary]
    ];
}

//#endregion callbackStuff

const baseNavTabMatcher = {
    Folder: folderActive,
    Pack: packActive,
    Library: libraryActive,
    GroupFolder: noneActive,
}

export interface navTabProps {
    activeTab: top.TabName,
}

export class NavTabs extends MitrhilTsxComponent<navTabProps> {

    noGroupTabs(activeTab: top.TabName): JSX.Element {
        const [[fldrClass, fldrCallback], [packClass, packCallback], [libClass, libCallback]] = activeTab.match(baseNavTabMatcher);
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

    withGroupTabs(activeTab: top.TabName): JSX.Element {
        const folders = ChipLibrary.GroupFolders || [];

        const buttons = folders.map(f => {
            const name = f[0];
            
            //@ts-ignore
            const [cssClass, callback]: ClassAndCallback = activeTab.match({
                GroupFolder: (playerName) => playerName == name ? ["activeNavTab", dontRedraw] : ["inactiveNavTab" ,makeChangeToPlayerFn(name)],
                _: () => ["inactiveNavTab", makeChangeToPlayerFn(name)],
            });
            return <button onclick={callback} class={cssClass}>{name.trim().charAt(0).toLocaleUpperCase()}</button>;
        });

        const [[fldrClass, fldrCallback], [packClass, packCallback], [libClass, libCallback]] = activeTab.match(baseNavTabMatcher);        

        return (
            <>
            <div class="col-span-3 sm:col-span-4 md:col-span-5 pl-2 pr-6 nav-tab-group">
                <button onclick={fldrCallback} class={fldrClass}>F</button>
                <button onclick={packCallback} class={packClass}>P</button>
                <button onclick={libCallback} class={libClass}>L</button>
                {buttons}
            </div>
            <div class="col-span-1"/>
            </>
        );

    }

    view(vnode: m.CVnode<navTabProps>): JSX.Element {
        const folders = ChipLibrary.GroupFolders;

        if(!folders || folders.length == 0) {
            return this.noGroupTabs(vnode.attrs.activeTab);
        } else {
            return this.withGroupTabs(vnode.attrs.activeTab);
        }

    }
}