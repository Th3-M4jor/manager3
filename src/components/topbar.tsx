import { useComputed } from "@preact/signals";

import * as top from "../TopLvlMsg";
import { ChipLibrary } from "../library/library";

export function TopBar() {
  const tabname = useComputed(() => {
    console.debug("TopBar: useComputed");
    return top.getActiveTab().match({
      Folder: () => ChipLibrary.FolderName,
      Library: () => "Library",
      Pack: () => "Pack",
      Glossary: () => "Glossary",
      GroupFolder: (name) =>
        (name.length > 15 ? name.substring(0, 12) : name) + "'s Folder",
    });
  });

  const topMsg = top.getTopMsg();

  return (
    <div class="topStatusBar">
      <span class="pl-1">{tabname}</span>
      <span class="topMsgSpan">{topMsg}</span>
    </div>
  );
}
