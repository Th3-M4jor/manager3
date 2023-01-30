import { makeTaggedUnion, none, MemberType } from "safety-match";
import { signal, Signal } from "@preact/signals";

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

export function getTopMsg(): string {
    return topMsg.value;
}

export function setTopMsg(msg: string): void {
    if(msg.length == 0) {
        msgClearHandle = undefined;
    } else {
        window.clearTimeout(msgClearHandle);
        msgClearHandle = window.setTimeout(() => {topMsg.value = "";}, 15_000); //15 seconds
    }
    topMsg.value = msg;
}

export function getActiveTab(): TabName {
    return activeTab.value;
}

export function setActiveTab(tab: TabName): void {
    activeTab.value = tab;
    const stateStr = tab.match({
        Library: () => "#!/Library",
        Pack: () => "#!/Pack",
        Folder: () => "#!/Folder",
        Glossary: () => "#!/Glossary",
        GroupFolder: (name) => `#!/GroupFolder/${name}`,
    });
    window.history.replaceState({}, "", stateStr);
}

function initActiveTab() {
    const hash = window.location.hash;
    switch(hash) {
        case "#!/Library":
            return signal(Tabs.Library);
        case "#!/Pack":
            return signal(Tabs.Pack);
        case "#!/Folder":
            return signal(Tabs.Folder);
        case "#!/Glossary":
            return signal(Tabs.Glossary);
        default:
            window.history.replaceState({}, "", "#!/Library");
            return signal(Tabs.Library);
    }
}