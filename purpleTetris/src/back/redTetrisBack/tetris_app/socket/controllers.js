"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.holdPiece = exports.forfeitGame = exports.retryGame = exports.tetrisArcade = exports.multiplayerRoomLst = exports.arcadeGames = exports.getMultiplayerRooms = void 0;

const MultiplayerRoom = require("../server/MultiplayerRoom");
const utils = require("../utils");
const { TetrisGame } = require("../server/Game/TetrisGame");
const { Player } = require("../server/Player");
const { dlog } = require("../../server/server");

exports.arcadeGames = {}; // { socketId: Player }
exports.multiplayerRoomLst = []; // [MultiplayerRoom]

const tetrisArcade = async (socket, settings = {}) => {
	const tetrisGame = new TetrisGame(socket, "Player", settings);
	exports.arcadeGames[socket.id] = new Player(socket, "Player", true);
	exports.arcadeGames[socket.id].setGame(tetrisGame);
	tetrisGame.gameLoop().then(() => { utils.deleteTetrisGame(socket.id) });
	dlog("Arcade Game started for " + socket.id);
};
exports.tetrisArcade = tetrisArcade;

const joinMultiplayerRoom = async (socket, roomCode, username) => {
	const room = utils.getTetrisRoom(roomCode);
	if (!room)
		return exports.multiplayerRoomLst.push(new MultiplayerRoom.MultiplayerRoom(socket, true, roomCode, username));
	// if (room.getIsVersus() && Object.values(room.getPlayers()).length >= 2)
	// 	return dlog("Room " + room.getCode() + " is full, cannot join.");
	dlog("Join Room with code : " + room.getCode() + " for player : " + socket.id);
	room.addPlayer(socket, username);
}
exports.joinMultiplayerRoom = joinMultiplayerRoom;

const multiplayerRoomCommand = async (socket, command, data) => {
	const room = utils.getTetrisRoom(data.roomCode);
	if (!room) {
		dlog("Invalid tetris Room im roomCommand : " + data.roomCode);
		return ;
	}
	if (command === "settings") {
		return room.addSettings(data.settings);
	}
	else if (command === "start") {
		if (room.getIsInGame()) {
			dlog("Room " + room.getCode() + " is already in game, cannot start again.");
			return ;
		}
		room.startGames();
		dlog("Room " + room.getCode() + " started games for players : " + Object.values(room.getPlayers()).map(p => p.username).join(", "));
	}
}
exports.multiplayerRoomCommand = multiplayerRoomCommand;

const quitMultiplayerRoom = async (socket, roomCode) => {
	await utils.deleteTetrisGame(socket.id);
	const room = utils.getTetrisRoom(roomCode, socket);
	if (room) {
		dlog("Quit Room with code : " + room.getCode() + " for player : " + socket.id);
		socket.emit("MUSIC", JSON.stringify({ type: "END" }));
		room.removePlayer(socket);
		if (room.isEmpty())
			exports.multiplayerRoomLst.splice(exports.multiplayerRoomLst.indexOf(room), 1);
	}
}
exports.quitMultiplayerRoom = quitMultiplayerRoom;


const dropPiece = async (key, user, keyType) => {
	const game = user.game;
	if (!game)
		return ;
	let dropType = (key === user.keys.hardDrop ? "hard" : "soft");
	if (dropType === "soft" && keyType === "keyUp")
		dropType = "normal";
	// console.log("So drop type is : " + dropType);
	await game?.changeFallSpeed(dropType);
};


const   movePiece = (direction, user, keyType) => {
	const   arg = direction === user.keys.moveLeft ? user.moveLeft : user.moveRight;
	const   opposite = direction === user.keys.moveLeft ? user.moveRight : user.moveLeft;

	if (keyType === "keyUp") {
		arg.firstMove = true;
		arg.timeout?.clear();
		if (opposite.timeout != null)
			opposite.timeout.resume();
		return ;
	}
	if (opposite.timeout != null && !opposite.firstMove) {
		opposite.timeout?.pause();
	}
	const   repeat = async () => {
		user.game?.move(direction === user.keys.moveLeft ? "left" : "right");
		if (arg.firstMove) {
			arg.firstMove = false;
			arg.timeout = new utils.TimeoutKey(repeat, 150);
		}
		else {
			arg.timeout?.clear();
			arg.timeout = new utils.TimeoutKey(repeat, 40);
		}
	}
	repeat();
}


const keyDown = async (key, socket) => {
	const user = utils.getTetrisUser(socket.id);
	if (!user || !user.game)
		return ;
	key = key.toLowerCase();

	switch (key) {
		case user.keys.rotateClockwise:
		case user.keys.rotateCounterClockwise:
		case user.keys.rotate180:
			const direction = (key === user.keys.rotateClockwise ? "clockwise" :
				(key === user.keys.rotateCounterClockwise ? "counter-clockwise" : "180"));
			user.game?.rotate(direction);
			// rotatePiece(key, user, "keyDown");
			break ;
		case user.keys.moveLeft:
		case user.keys.moveRight:
			movePiece(key, user, "keyDown");
			break ;
		case user.keys.hardDrop:
		case user.keys.softDrop:
			await (dropPiece(key, user, "keyDown"));
			break ;
		case user.keys.hold:
			await (user.game?.swap());
			break ;
		case user.keys.forfeit:
			user.game?.forfeit();
			break ;
		case user.keys.retry:
			await user.game?.retry();
			break ;
	}
}
exports.keyDown = keyDown;


const keyUp = async (key, socket) => {
	const user = utils.getTetrisUser(socket.id);
	if (!user || !user.game)
		return ;
	key = key.toLowerCase();

	switch (key) {
		case user.keys.moveLeft:
		case user.keys.moveRight:
			movePiece(key, user, "keyUp");
			break;
		case user.keys.softDrop:
			await (dropPiece(key, user, "keyUp"));
			break;
	}
}
exports.keyUp = keyUp;

const getMultiplayerRooms = async (socket) => {
	const rooms = [];

	for (const room of exports.multiplayerRoomLst) {
		if (room.isPrivate() || (room.getIsVersus() && Object.values(room.getPlayers()).length >= 2))
			continue ;
		rooms.push({code: room.code, nbPlayers: room.settings?.nbPlayers});
	}
	socket.emit("GET_MULTIPLAYER_ROOMS", JSON.stringify(rooms));
}
exports.getMultiplayerRooms = getMultiplayerRooms;
