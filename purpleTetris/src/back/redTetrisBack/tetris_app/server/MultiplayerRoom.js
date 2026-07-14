"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MultiplayerRoom = void 0;

const utils = require("../utils");
const { Player } = require("./Player");
const { dlog } = require("./../../server/server");
const controllers = require("../socket/controllers");
const { mod } = require("./Game/utils");
const { clearInterval } = require("node:timers");


class MultiplayerRoom {

	constructor(socket, isPrivate = true, codeName = undefined, username = "nameless") {
		this.players = {}; // { socketId: Player }
		this.opponentsOrder = [] // [Player] The player sends garbage to the next player in the array and thus receives garbage from the previous player
		this.noLoserList = []; // [Player]
		this.isInGame = false;
		if (codeName && codeName.length === 4 && utils.isUpperCase(codeName) && !utils.codeNameExists(codeName))
			this.code = codeName;
		else
			this.code = this.#generateInviteCode();
		dlog("The code of the new Room is " + this.code);
		this.playersRemaining = 0;
		this.settings = {
			"isPrivate": true,
			"isVersus": false,
			"showShadowPiece": true,
			"showBags": true,
			"holdAllowed": true,
			"showHold": true,
			"infiniteHold": false,
			"infiniteMovement": false,
			"rotationType": "SRSX",
			"lockTime": 500,
			"spawnARE": 0,
			"softDropAmp": 1.5,
			"level": 4,
			"isLevelling": false,
			"canRetry": true,
			"music": "none",
			"seed": Date.now().toString(),
			"resetSeedOnRetry": true,
			"nbPlayers": 1,
		};
		this.addPlayer(socket, username);
	}

	getIsInGame() { return this.isInGame; }
	getPlayers() { return this.players; }
	isPrivate() { return this.settings.isPrivate == undefined ? false : this.settings.isPrivate; }
	getIsVersus() { return this.settings.isVersus == undefined ? false : this.settings.isVersus; }
	getCode() { return this.code; }

	changeCode() { this.code = this.#generateInviteCode(); }
	setSettings(settings) { this.settings = settings; this.sendSettingsToPlayers(); }
	addSetting(key, value) { this.settings[key] = value; this.sendSettingsToPlayers(); }
	addSettings(settings) {
		for (const key in settings)
			this.settings[key] = settings[key];
		this.sendSettingsToPlayers();
	}

	addPlayer(socket, username) {
		if (this.players[socket.id]) {
			socket.emit("MULTIPLAYER_LEAVE");
			return dlog("Player " + socket.id + " already exists in Room " + this.code);
		}
		socket.emit("MULTIPLAYER_JOIN", JSON.stringify({ argument: this.code }));
		if (Object.values(this.players).length <= 0) {
			this.players[socket.id] = new Player(socket, username, true);
			socket.emit("MULTIPLAYER_OWNER", JSON.stringify(true))
		}
		else {
			this.players[socket.id] = new Player(socket, username);
			if (Object.values(this.players).length === 2)
				this.settings.canRetry = false;
		}
		if (this.isInGame) {
			this.opponentsOrder.push(this.players[socket.id]);
			this.#setSpecGame(this.players[socket.id]);
			this.#assignOpponents();
			socket.emit("MULTIPLAYER_SPEC_JOIN");
		}
		this.sendSettingsToPlayers();
	}

	removePlayer(socket) {
		const player = this.players[socket.id];
		if (!player)
			return ;
		player.getGame()?.forfeit();
		player.getSocket()?.emit("MULTIPLAYER_LEAVE");
		dlog("Player " + player.getUsername() + " left Room " + this.code);
		const nonOwner = Object.values(this.players).find((aPlayer => !aPlayer.isOwner()));
		if (player.isOwner() && nonOwner !== undefined) {
			nonOwner.setOwner(true);
			nonOwner.getSocket()?.emit("MULTIPLAYER_OWNER", JSON.stringify(true));
		}
		if (this.isInGame)
			this.opponentsOrder.slice(this.opponentsOrder.indexOf(player), 1);
		delete this.players[socket.id];
		if (Object.values(this.players).length <= 1 && !this.settings.canRetry)
			this.settings.canRetry = true;
		this.sendSettingsToPlayers();
	}

	isPlayerInRoom(socketId) {
		return !!this.players[socketId];
	}

	isEmpty() {
		return Object.values(this.players).length <= 0;
	}

	getGameById(socketId) {
		return this.players[socketId]?.getGame() || undefined;
	}

	#generateInviteCode() {
		const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
		const length = 4;
		let result = "";
		for (let i = 0; i < length; i++)
			result += characters.charAt(Math.floor(Math.random() * characters.length));
		if (utils.codeNameExists(result))
			return this.#generateInviteCode();
		for (const player of Object.values(this.players))
			player.getSocket().emit("MULTIPLAYER_JOIN", JSON.stringify({ argument: result }));
		return result;
	}

	async startGames() {
		if (this.isInGame)
			return;

		return new Promise((resolve) => {
		const playersArray = Object.values(this.players);
		this.playersRemaining = playersArray.length;
		this.isInGame = true;
		this.settings.isInRoom = true;
		this.settings.placement = this.playersRemaining;

		// Deep copy of the array (not the players)
		this.opponentsOrder = playersArray.concat([]).sort(() => Math.random() - 0.5);

		for (const player of playersArray)
			player.setupGame(this.settings);
		this.#assignOpponents();
		for (const player of playersArray)
			player.getGame()?.gameLoop().then(() => endOfGame(player));

		const sendOpponentsGames = () => {
			if (this.noLoserList.length <= 1)
				return ;
			for (let i = 0; i < this.opponentsOrder.length; ++i) {
				const player = this.opponentsOrder[i];
				let games = [player.receiving];
				if (this.noLoserList.length > 2)
					games.push(player.sending);
				player.getSocket().emit("MULTIPLAYER_OPPONENTS_GAMES", JSON.stringify({ argument: games }));
			}
		};
		const interval = setInterval(sendOpponentsGames, 1000 / 10);

		const endOfGame = (player) => {
			const playerArrayEnd = Object.values(this.players);
			// dlog("End of game for player " + player.getUsername() + " is at place " + this.playersRemaining + " in Room " + this.code);
			this.#setSpecGame(player);
			player.getGame().place = this.playersRemaining;
			player.getSocket().emit("MULTIPLAYER_FINISH", JSON.stringify({ argument: this.playersRemaining }));
			controllers.keyUp(player.keys.moveLeft, player.getSocket());
			controllers.keyUp(player.keys.moveRight, player.getSocket());
			controllers.keyUp(player.keys.softDrop, player.getSocket());
			--this.playersRemaining;
			if (player.getGame()?.getHasForfeit())
				this.removePlayer(player.getSocket());
			if (this.playersRemaining === 1)
				playerArrayEnd.find((player) => !player.getGame()?.isOver())?.getGame()?.setOver(true);
			this.#assignOpponents();
			if (this.playersRemaining >= 1)
				return ;
			this.isInGame = false;
			playerArrayEnd.forEach((player) => {
				player.getSocket().emit("GAME_FINISH");
				player.getSocket().emit("MUSIC", JSON.stringify({ type: "END" }));
				if (!!player.getGame()?.getHasForfeit())
					player.getSocket().emit("MULTIPLAYER_JOIN", JSON.stringify({ argument: this.code }));
				if (player.spec) {
					player.spec = false;
					clearInterval(player.watchInterval);
					player.watchInterval = -1;
					if (!player.getGame())
						player.getSocket().emit("MULTIPLAYER_SPEC_LEAVE");
				}
				player.setGame(undefined);
			});
			this.settings.seed = Date.now().toString();
			this.sendSettingsToPlayers();
			clearInterval(interval);
			resolve();
		};
		});
	}

	// Assign opponents is called when a player loses or joins as a spectator
	#assignOpponents() {
		this.noLoserList = this.opponentsOrder.filter(player => player.getGame() && !player.getGame()?.isOver());
		// if (this.noLoserList.length <= 1)
		// 	return ;
		for (let i = 0; i < this.opponentsOrder.length; ++i) {
			let player = this.opponentsOrder[i];
			player.getGame()?.setPlacement(this.playersRemaining);
			let newPlayer = undefined;
			if (!player.getGame() || player.getGame()?.isOver()) {
				for (let j = 1; j < this.opponentsOrder.length; ++j) {
					newPlayer = this.opponentsOrder[mod(i + j, this.opponentsOrder.length)];
					if (newPlayer?.getGame() && !newPlayer.getGame()?.isOver())
						break ;
					newPlayer = undefined;
				}
			}
			const pos = this.noLoserList.indexOf(newPlayer || player);
			player.receiving = this.noLoserList[mod(pos - 1, this.noLoserList.length)];
			player.sending = this.noLoserList[mod(pos + 1,this.noLoserList.length)];
			// dlog("Player " + player.getUsername() + " is sending to " + player.sending.getUsername() + " and receiving from " + player.receiving.getUsername());
			if (player !== player.sending)
				player.getGame()?.setOpponent(player.sending?.getGame());
		}
	}

	sendSettingsToPlayers() {
		const playersArray = Object.values(this.players);
		this.settings.nbPlayers = playersArray.length;
		for (const player of playersArray)
			player.getSocket().emit("MULTIPLAYER_SETTINGS", JSON.stringify(this.settings));
	}

	#setSpecGame(player) {
		if (!this.isInGame || this.noLoserList.length <= 0)
			return ;
		player.spec = true;
		const pos = this.opponentsOrder.indexOf(player);
		for (let i = 1; i < this.opponentsOrder.length; ++i) {
			const newPlayer = this.opponentsOrder[mod(i + pos, this.opponentsOrder.length)];
			if (!newPlayer.getGame() || newPlayer.getGame().isOver())
				continue ;
			player.startInterval(newPlayer).then(() => {
				// dlog("Respec (player " + player.getUsername() + ")");
				this.#setSpecGame(player)
			});
			break ;
		}
	}
}
exports.MultiplayerRoom = MultiplayerRoom;
