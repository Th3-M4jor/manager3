import { makeTaggedUnion, none, MemberType } from "safety-match";
import { signal, Signal } from "@preact/signals";

import { setActiveDisplayItem, ChipDescDisplay } from "./components/chipdesc";

export const Tabs = makeTaggedUnion({
    Library: none,
    Pack: none,
    Folder: none,
    Glossary: none,
    GroupFolder: (name: string) => name,
});

export type TabName = MemberType<typeof Tabs>;

const topMsg = signal("");
let msgClearHandle: number | undefined;
const activeTab: Signal<TabName> = initActiveTab();

export function getTopMsg(): Signal<string> {
    return topMsg;
}

export function setTopMsg(msg: string): void {
    if (msg.length == 0) {
        msgClearHandle = undefined;
    } else {
        clearTimeout(msgClearHandle);
        msgClearHandle = setTimeout(() => { topMsg.value = ""; }, 15_000); //15 seconds
    }
    topMsg.value = msg;
}

export function getActiveTab(): TabName {
    return activeTab.value;
}

export function setActiveTab(tab: TabName): void {

    // Clear the chip description when switching tabs
    setActiveDisplayItem(ChipDescDisplay.None);
    activeTab.value = tab;
    const stateStr = tab.match({
        Library: () => "#!/Library",
        Pack: () => "#!/Pack",
        Folder: () => "#!/Folder",
        Glossary: () => "#!/Glossary",
        GroupFolder: (name) => `#!/GroupFolder/${name}`,
    });
    history.replaceState({}, "", stateStr);
}

function initActiveTab() {
    const hash = location.hash;
    switch (hash) {
        case "#!/Library":
            return signal(Tabs.Library);
        case "#!/Pack":
            return signal(Tabs.Pack);
        case "#!/Folder":
            return signal(Tabs.Folder);
        case "#!/Glossary":
            return signal(Tabs.Glossary);
        default:
            history.replaceState({}, "", "#!/Library");
            return signal(Tabs.Library);
    }
}