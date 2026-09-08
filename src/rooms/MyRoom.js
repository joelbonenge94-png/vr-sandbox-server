import { Room } from "colyseus";
import { MyRoomState, Player, Item } from "./schema/MyRoomState.js";

export class MyRoom extends Room {
    maxClients = 8;
    state = new MyRoomState();

    onCreate(options) {
        this.onMessage("move", (client, data) => {
            const player = this.state.players.get(client.sessionId);
            if (!player) return;
            player.x = data.x;
            player.y = data.y;
            player.z = data.z;
            player.rotY = data.rotY;
            player.lx = data.lx;
            player.ly = data.ly;
            player.lz = data.lz;
            player.rx = data.rx;
            player.ry = data.ry;
            player.rz = data.rz;
        });

        this.onMessage("grab", (client, data) => {
            let item = this.state.items.get(data.itemId);
            if (!item) {
                item = new Item();
                this.state.items.set(data.itemId, item);
            }
            item.heldBy = client.sessionId;
        });

        this.onMessage("release", (client, data) => {
            const item = this.state.items.get(data.itemId);
            if (item && item.heldBy === client.sessionId) {
                item.heldBy = "";
            }
        });

        this.onMessage("itemUpdate", (client, data) => {
            const item = this.state.items.get(data.itemId);
            if (!item || item.heldBy !== client.sessionId) return;
            item.x = data.x;
            item.y = data.y;
            item.z = data.z;
            item.rotX = data.rotX;
            item.rotY = data.rotY;
            item.rotZ = data.rotZ;
            item.rotW = data.rotW;
        });

        this.onMessage("hit", (client, data) => {
            const targetClient = this.clients.getById(data.targetSessionId);
            const attacker = this.state.players.get(client.sessionId);
            const killerName = attacker ? attacker.name : "Unknown";
            if (targetClient) {
                targetClient.send("tookDamage", { damage: data.damage, killerName });
            }
        });
    }

    onJoin(client, options) {
        const player = new Player();
        player.name = (options && options.name) ? String(options.name).slice(0, 20) : "Player";
        this.state.players.set(client.sessionId, player);
        console.log(client.sessionId, player.name, "joined!");
    }

    onLeave(client, consented) {
        this.state.players.delete(client.sessionId);
        console.log(client.sessionId, "left!");
    }

    onDispose() {
        console.log("room", this.roomId, "disposing...");
    }
}
