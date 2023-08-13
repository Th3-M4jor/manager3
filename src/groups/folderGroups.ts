import { Socket, Channel } from "phoenix";
import { throttle } from "throttle-debounce";

interface GroupData {
  group: string;
  name: string;
}
type chipName = string;
type chipUsed = boolean;
type FolderChipTuple = [chipName, chipUsed];

type ConnectMsg = ["connect", GroupData];
type DisconnectMsg = ["disconnect"];
type ReadyMsg = ["ready", FolderChipTuple[]];
type UpdateMsg = ["update", FolderChipTuple[]];
type SpectateMsg = ["spectate", FolderChipTuple[]];

type GroupFldrMsg =
  | ConnectMsg
  | DisconnectMsg
  | ReadyMsg
  | UpdateMsg
  | SpectateMsg;

const throttle_update = throttle(3000, update);

let socket: Socket | null = null;
let channel: Channel | null = null;
let spectator = false;

let folder: FolderChipTuple[] = [];

self.onmessage = function (e: MessageEvent<GroupFldrMsg>): void {
  switch (e.data[0]) {
    case "connect":
      connect(e.data[1].group, e.data[1].name);
      break;
    case "disconnect":
      socket?.disconnect();
      socket = null;
      channel = null;
      break;
    case "ready":
      spectator = false;
      folder = e.data[1];
      send_ready(folder);
      break;
    case "spectate":
      spectator = true;
      spectate();
      break;
    case "update":
      folder = e.data[1];
      throttle_update();
      break;
    default:
      throw new Error("Unknown message");
  }
};

function connect(group: string, name: string): void {
  if (socket !== null) {
    throw new Error("Already connected");
  }

  const url = import.meta.env.VITE_SOCKET_URL;

  socket = new Socket(url);
  socket.connect();

  socket.onOpen(() => {
    if (!socket) throw new Error("Socket is null");
    doLog("Connected to socket");
    channel = socket.channel(`room:${group}`, { name: name });
    channel.on("new_msg", (msg) => doLog("Got message", msg));
    channel.on("updated", (msg) => {
      doLog("Updated", msg.body);
      postMessage(["updated", msg.body]);
    });
    channel.on("force_close", (msg) => {
      doLog("Force close", msg);
      postMessage(["closed", msg]);
    });

    channel
      .join(5000)
      .receive("ok", (resp) => {
        doLog("Joined successfully", resp);
        postMessage(["ready"]);
      })
      .receive("error", ({ reason }) => doLog("failed join", reason))
      .receive("timeout", () => doLog("Networking issue. Still waiting..."));
  });

  socket.onError(() => {
    doLog("Socket error");
    postMessage(["error", "Socket error"]);
  });

  socket.onClose(() => {
    doLog("Socket closed");
    postMessage(["closed"]);
    socket = null;
  });
}

function spectate(): void {
  if (!channel) {
    throw new Error("Not connected");
  }

  channel
    .push("spectate", { body: null })
    .receive("ok", (msg) => doLog("created message", msg))
    .receive("error", (reasons) => doLog("create failed", reasons))
    .receive("timeout", () => doLog("Networking issue..."));
}

function send_ready(data: FolderChipTuple[]): void {
  if (!channel) {
    throw new Error("Not connected");
  }

  channel
    .push("ready", { body: data })
    .receive("ok", (msg) => doLog("created message", msg))
    .receive("error", (reasons) => doLog("create failed", reasons))
    .receive("timeout", () => doLog("Networking issue..."));
}

function update(): void {
  if (!channel) {
    throw new Error("Not connected");
  }

  if (spectator) return; //user is a spectator, don't update their folder

  channel
    .push("update", { body: folder })
    .receive("ok", (msg) => doLog("updated message", msg))
    .receive("error", (reasons) => doLog("update failed", reasons))
    .receive("timeout", () => doLog("Networking issue..."));
}

function doLog(msg: string, ...args: unknown[]): void {
  if (import.meta.env.PROD) {
    console.log(msg, ...args);
  }
}
