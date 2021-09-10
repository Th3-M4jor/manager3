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

    /* eslint-disable */

    socket.onOpen(() => {
        if (!socket) throw new Error("Socket is null");
        console.log("Connected to socket");
        channel = socket.channel(`room:${group}`, { name: name });
        channel.on("new_msg", msg => console.log("Got message", msg));
        channel.on("updated", msg => { console.log("Updated", msg.body); postMessage(["updated", msg.body]); });
        channel.on("force_close", msg => { console.log("Force close", msg); postMessage(["closed", msg]); });

        channel.join(5000)
            .receive("ok", resp => { console.log("Joined successfully", resp); postMessage(["ready"]); })
            .receive("error", ({ reason }) => console.log("failed join", reason))
            .receive("timeout", () => console.log("Networking issue. Still waiting..."));
    });

    socket.onError(() => {
        console.log("Socket error");
        postMessage(["error"]);
    });

    socket.onClose(() => {
        console.log("Socket closed");
        postMessage(["closed"]);
        socket = null;
    });

    /* eslint-enable */
}

function send_ready(data: FolderChipTuple[]): void {
    if (!channel) {
        throw new Error("Not connected");
    }

    /* eslint-disable */
    channel.push("ready", { body: data })
        .receive("ok", (msg) => console.log("created message", msg))
        .receive("error", (reasons) => console.log("create failed", reasons))
        .receive("timeout", () => console.log("Networking issue..."));
    /* eslint-enable */

}

function update(): void {
    if (!channel) {
        throw new Error("Not connected");
    }

    /* eslint-disable */
    channel.push("update", { body: folder })
        .receive("ok", (msg) => console.log("updated message", msg))
        .receive("error", (reasons) => console.log("update failed", reasons))
        .receive("timeout", () => console.log("Networking issue..."));
    /* eslint-enable */
}