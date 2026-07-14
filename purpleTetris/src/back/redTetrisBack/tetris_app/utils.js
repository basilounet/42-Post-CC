"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

exports.isUpperCase = exports.codeNameExists = exports.getTetrisRoom = exports.deleteTetrisGame = exports.getTetrisGame = exports.getTetrisUser = void 0;

const controllers = require("./socket/controllers");
const { MultiplayerRoom } = require("./server/MultiplayerRoom");

const waitForFallInterval = async (game, timeout = 1800) => {
	return new Promise((resolve) => {
		if (!game)
			return resolve();
		const start = Date.now();
		const interval = setInterval(() => {
			if (game.fallInterval === -1 || Date.now() - start > timeout) {
				clearInterval(interval);
				resolve();
			}
		}, 10);
	});
}

const getTetrisUser = (socketId) => {
	if (controllers.arcadeGames[socketId])
		return controllers.arcadeGames[socketId];
	return controllers.multiplayerRoomLst.find((room => room.getPlayers()[socketId]))?.getPlayers()[socketId];
};
exports.getTetrisUser = getTetrisUser;


const getTetrisGame = (socketId) => {
	if (controllers.arcadeGames[socketId]?.game)
		return controllers.arcadeGames[socketId].game;
	return controllers.multiplayerRoomLst.find((room => room.getGameById(socketId)))?.getGameById(socketId);
};
exports.getTetrisGame = getTetrisGame;


const deleteTetrisGame = async (socketId) => {
	// console.log("Quitting game for socketId: " + socketId);
	exports.getTetrisGame(socketId)?.setOver(true);
	await waitForFallInterval(exports.getTetrisGame(socketId));
	if (controllers.arcadeGames[socketId]) {
		delete controllers.arcadeGames[socketId].game;
		delete controllers.arcadeGames[socketId];
	}
};
exports.deleteTetrisGame = deleteTetrisGame;


const getTetrisRoom = (roomCode, socket = null) => {
	if (!roomCode && !socket)
		return undefined;
	if (!roomCode)
		for (const room of controllers.multiplayerRoomLst)
			if (room.isPlayerInRoom(socket.id))
				return room;
	return controllers.multiplayerRoomLst.find((room) => room.getCode() === roomCode);
};
exports.getTetrisRoom = getTetrisRoom;


const codeNameExists = (code) => {
	return !!(controllers.multiplayerRoomLst.find((room) => room.getCode() === code ));
};
exports.codeNameExists = codeNameExists;


const isUpperCase = (str) => {
	return /^[A-Z]+$/.test(str);
};
exports.isUpperCase = isUpperCase;


class    TimeoutKey {

	constructor(callback, delay) {
		this.start = Date.now();
		this.timer = setTimeout(callback, delay);
		this.remaining = delay;
		this.callback = callback;
	}
	pause() {
		clearTimeout(this.timer);
		this.timer = 0;
		this.remaining -= Date.now() - this.start;
	}
	resume() {
		if (this.timer !== 0) {
			return ;
		}
		this.start = Date.now();
		this.timer = setTimeout(this.callback, this.remaining);
	}
	clear() {
		clearTimeout(this.timer);
		this.timer = 0;
		this.remaining = 0;
		this.start = 0;
		this.callback = () => {};
	}
}
exports.TimeoutKey = TimeoutKey;
