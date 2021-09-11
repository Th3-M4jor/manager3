import { Socket, Channel } from "phoenix";
import { throttle } from "throttle-debounce";

const throttle_update = throttle(3000, update);

let socket: Socket | null = null;
let channel: Channel | null = null;

let folder: FolderChipTuple[] = [];

self.onmessage = function (e) {
    const [msg, data] = e.data;

    switch (msg) {
        case "connect":
            connect(data.group, data.name);
            break;
        case "disconnect":
            socket?.disconnect();
            socket = null;
            channel = null;
            break;
        case "ready":
            folder = data;
            send_ready(data);
            break;
        case "update":
            folder = data;
            throttle_update();
            break;
        default:
            throw new Error("Unknown message");
    }
}

type chipName = string;
type chipUsed = boolean;

type FolderChipTuple = [chipName, chipUsed];

function connect(group: string, name: string): void {
    if (socket !== null) {
        throw new Error("Already connected");
    }
    let url: string;
    if (process.env.NODE_ENV === "production") {
        url = process.env.BASE_URL + "socket";
    } else {
        url = "wss://jin-tengai.dev/bnb/backend/dev/socket";
    }

    socket = new Socket(url);
    socket.connect();

    socket.onOpen(() => {
        if (!socket) throw new Error("Socket is null");
        doLog("Connected to socket");
        channel = socket.channel(`room:${group}`, { name: name });
        channel.on("new_msg", msg => doLog("Got message", msg));
        channel.on("updated", msg => { doLog("Updated", msg.body); postMessage(["updated", msg.body]); });
        channel.on("force_close", msg => { doLog("Force close", msg); postMessage(["closed", msg]); });

        channel.join(5000)
            .receive("ok", resp => { doLog("Joined successfully", resp); postMessage(["ready"]); })
            .receive("error", ({ reason }) => doLog("failed join", reason))
            .receive("timeout", () => doLog("Networking issue. Still waiting..."));
    });

    socket.onError(() => {
        doLog("Socket error");
        postMessage(["error"]);
    });

    socket.onClose(() => {
        doLog("Socket closed");
        postMessage(["closed"]);
        socket = null;
    });

}

function send_ready(data: FolderChipTuple[]): void {
    if (!channel) {
        throw new Error("Not connected");
    }

   
    channel.push("ready", { body: data })
        .receive("ok", (msg) => doLog("created message", msg))
        .receive("error", (reasons) => doLog("create failed", reasons))
        .receive("timeout", () => doLog("Networking issue..."));

}

function update(): void {
    if (!channel) {
        throw new Error("Not connected");
    }

    
    channel.push("update", { body: folder })
        .receive("ok", (msg) => doLog("updated message", msg))
        .receive("error", (reasons) => doLog("update failed", reasons))
        .receive("timeout", () => doLog("Networking issue..."));
    
}

function doLog(msg: string, ...args : unknown[]): void {
    
    if (process.env.NODE_ENV !== "production") {
        //eslint-disable-next-line no-console
        console.log(msg, ...args);
    }
    
}