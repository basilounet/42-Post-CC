"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = tetrisRoutes;

const controllers = require("./controllers");


async function tetrisRoutes(socket) {
    socket.on("arcadeStart", () => controllers.tetrisArcade(socket));
    socket.on("keydown", (key) => controllers.keyDown(key, socket));
    socket.on("keyup", (key) => controllers.keyUp(key, socket));
    socket.on("joinMultiplayerRoom", (roomCode, username) => controllers.joinMultiplayerRoom(socket, roomCode, username));
    socket.on("multiplayerRoomCommand", (command, data) => controllers.multiplayerRoomCommand(socket, command, data));
    socket.on("quitMultiplayerRoom", (roomCode) => controllers.quitMultiplayerRoom(socket, roomCode));
    socket.on("getMultiplayerRooms", () => controllers.getMultiplayerRooms(socket));
}
