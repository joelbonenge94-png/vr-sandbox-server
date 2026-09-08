import { schema, t } from "@colyseus/schema";

export const Player = schema({
    name: t.string().default("Player"),
    x: t.number().default(0),
    y: t.number().default(0),
    z: t.number().default(0),
    rotY: t.number().default(0),
    lx: t.number().default(0),
    ly: t.number().default(0),
    lz: t.number().default(0),
    rx: t.number().default(0),
    ry: t.number().default(0),
    rz: t.number().default(0)
}, "Player");

export const Item = schema({
    heldBy: t.string().default(""),
    x: t.number().default(0),
    y: t.number().default(0),
    z: t.number().default(0),
    rotX: t.number().default(0),
    rotY: t.number().default(0),
    rotZ: t.number().default(0),
    rotW: t.number().default(1)
}, "Item");

export const MyRoomState = schema({
    players: t.map(Player),
    items: t.map(Item)
}, "MyRoomState");
