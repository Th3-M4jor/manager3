import m from "mithril";

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

function changeToGlossary(e: Event) {
    (e.currentTarget as HTMLElement)?.blur();
    m.route.set("/Glossary");
}

function makeChangeToPlayerFn(name: string): (e: Event) => void {
    return (e: Event) => {
        (e.currentTarget as HTMLElement)?.blur();
        m.route.set("/Group/:playerName", { playerName: name });
    };
}

function dontRedraw(e: Event) {
    //@ts-ignore
    e.redraw = false;
}

function folderActive(): ClassAndCallback[] {
    return [
        ["activeNavTab", dontRedraw],
        ["inactiveNavTab", changeToPack],
        ["inactiveNavTab", changeToLibrary],
        ["inactiveNavTab", changeToGlossary]
    ];
}

function packActive(): ClassAndCallback[] {
    return [
        ["inactiveNavTab", changeToFolder],
        ["activeNavTab", dontRedraw],
        ["inactiveNavTab", changeToLibrary],
        ["inactiveNavTab", changeToGlossary]
    ];
}

function libraryActive(): ClassAndCallback[] {
    return [
        ["inactiveNavTab", changeToFolder],
        ["inactiveNavTab", changeToPack],
        ["activeNavTab", dontRedraw],
        ["inactiveNavTab", changeToGlossary]
    ];
}

function glossaryActive(): ClassAndCallback[] {
    return [
        ["inactiveNavTab", changeToFolder],
        ["inactiveNavTab", changeToPack],
        ["inactiveNavTab", changeToLibrary],
        ["activeNavTab", dontRedraw]
    ];
}

function noneActive(): ClassAndCallback[] {
    return [
        ["inactiveNavTab", changeToFolder],
        ["inactiveNavTab", changeToPack],
        ["inactiveNavTab", changeToLibrary],
        ["inactiveNavTab", changeToGlossary]
    ];
}

//#endregion callbackStuff

const baseNavTabMatcher = {
    Folder: folderActive,
    Pack: packActive,
    Library: libraryActive,
    Glossary: glossaryActive,
    GroupFolder: noneActive,
}

export interface navTabProps {
    activeTab: top.TabName,
}

export class NavTabs extends MitrhilTsxComponent<navTabProps> {

    noGroupTabs(activeTab: top.TabName): JSX.Element {
        const [[fldrClass, fldrCallback], [packClass, packCallback], [libClass, libCallback], [glossaryClass, glossaryCallback]] = activeTab.match(baseNavTabMatcher);
        return (
            <>
                <div class="col-span-3 sm:col-span-4 md:col-span-5 pl-2 pr-6 nav-tab-group">
                    <button onclick={fldrCallback} class={fldrClass}>{ChipLibrary.FolderName}</button>
                    <button onclick={packCallback} class={packClass}>Pack</button>
                    <button onclick={libCallback} class={libClass}>Library</button>
                </div>
                <div class="col-span-1 glossary-tab-group">
                    <button onclick={glossaryCallback} class={glossaryClass + " w-19/24"}>Glossary</button>
                </div>
            </>
        );

    }

    withGroupTabs(activeTab: top.TabName): JSX.Element {
        const folders = ChipLibrary.GroupFolders || [];

        let maxNameLen = 30;

        if (folders.length >= 5) {
            maxNameLen = 1;
        } else if (folders.length >= 2) {
            maxNameLen = 3;
        }

        const buttons = folders.map(f => {
            const name = f[0];
            const shortName = name.trim().charAt(0).toUpperCase() + name.trim().slice(1, maxNameLen - 1);

            //@ts-ignore
            const [cssClass, callback]: ClassAndCallback = activeTab.match({
                GroupFolder: (playerName) => playerName == name ? ["activeNavTab", dontRedraw] : ["inactiveNavTab", makeChangeToPlayerFn(name)],
                _: () => ["inactiveNavTab", makeChangeToPlayerFn(name)],
            });

            return (
                <button onclick={callback} class={cssClass}>
                    {shortName}
                </button>
            );
        });

        const [[fldrClass, fldrCallback], [packClass, packCallback], [libClass, libCallback], [glossaryClass, glossaryCallback]] = activeTab.match(baseNavTabMatcher);
        const fldr = "Folder".slice(0, maxNameLen);
        const pack = "Pack".slice(0, maxNameLen);
        const lib = "Library".slice(0, maxNameLen);
        return (
            <>
                <div class="col-span-3 sm:col-span-4 md:col-span-5 pl-2 pr-6 nav-tab-group">
                    <button onclick={fldrCallback} class={fldrClass}>{fldr}</button>
                    <button onclick={packCallback} class={packClass}>{pack}</button>
                    <button onclick={libCallback} class={libClass}>{lib}</button>
                    {buttons}
                </div>
                <div class="col-span-1 glossary-tab-group">
                    <button onclick={glossaryCallback} class={glossaryClass + " w-19/24"}>Glossary</button>
                </div>
            </>
        );

    }

    view(vnode: m.CVnode<navTabProps>): JSX.Element {
        const folders = ChipLibrary.GroupFolders;

        if (!folders || folders.length == 0) {
            return this.noGroupTabs(vnode.attrs.activeTab);
        }

        return this.withGroupTabs(vnode.attrs.activeTab);
    }
}