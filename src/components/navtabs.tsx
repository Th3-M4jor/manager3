import { ChipLibrary } from "../library/library";

import * as top from "../TopLvlMsg";

//#region callbackstuff
type ClassAndCallback = [string, (e: Event) => void];

function changeToFolder(e: Event) {
    (e.currentTarget as HTMLElement)?.blur();
    top.setActiveTab(top.Tabs.Folder);
}

function changeToPack(e: Event) {
    (e.currentTarget as HTMLElement)?.blur();
    top.setActiveTab(top.Tabs.Pack);
}

function changeToLibrary(e: Event) {
    (e.currentTarget as HTMLElement)?.blur();
    top.setActiveTab(top.Tabs.Library);
}

function changeToGlossary(e: Event) {
    (e.currentTarget as HTMLElement)?.blur();
    top.setActiveTab(top.Tabs.Glossary);
}

function makeChangeToPlayerFn(name: string): (e: Event) => void {
    return (e: Event) => {
        (e.currentTarget as HTMLElement)?.blur();
        top.setActiveTab(top.Tabs.GroupFolder(name));
    };
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
function dontRedraw(_e: Event) { }

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

function noGroupTabs(activeTab: top.TabName) {
    const [[fldrClass, fldrCallback], [packClass, packCallback], [libClass, libCallback], [glossaryClass, glossaryCallback]] = activeTab.match(baseNavTabMatcher);
    return (
        <>
            <div class="col-span-3 sm:col-span-4 md:col-span-5 pl-2 pr-6 nav-tab-group">
                <button onClick={fldrCallback} class={fldrClass}>{ChipLibrary.FolderName}</button>
                <button onClick={packCallback} class={packClass}>Pack</button>
                <button onClick={libCallback} class={libClass}>Library</button>
            </div>
            <div class="col-span-1 glossary-tab-group">
                <button onClick={glossaryCallback} class={glossaryClass + " w-19/24"}>Glossary</button>
            </div>
        </>
    );
}

function withGroupTabs(activeTab: top.TabName) {
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

        const [cssClass, callback]: ClassAndCallback = activeTab.match({
            GroupFolder: (playerName) => playerName == name ? (["activeNavTab", dontRedraw] as ClassAndCallback) : (["inactiveNavTab", makeChangeToPlayerFn(name)] as ClassAndCallback),
            _: () => (["inactiveNavTab", makeChangeToPlayerFn(name)] as ClassAndCallback),
        });

        return (
            <button onClick={callback} class={cssClass}>
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
                <button onClick={fldrCallback} class={fldrClass}>{fldr}</button>
                <button onClick={packCallback} class={packClass}>{pack}</button>
                <button onClick={libCallback} class={libClass}>{lib}</button>
                {buttons}
            </div>
            <div class="col-span-1 glossary-tab-group">
                <button onClick={glossaryCallback} class={glossaryClass + " w-19/24"}>Glossary</button>
            </div>
        </>
    );
}

export function NavTabs() {
    const folders = ChipLibrary.GroupFolders;

    if (!folders?.length) {
        return noGroupTabs(top.getActiveTab());
    }

    return withGroupTabs(top.getActiveTab());
}
