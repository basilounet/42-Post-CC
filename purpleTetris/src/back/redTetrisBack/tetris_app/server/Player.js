"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = void 0;

const { TetrisGame } = require("./Game/TetrisGame");
const {clearInterval} = require("node:timers");


class Player {
	constructor(socket, username, owner = false) {
		this.socket = socket;
		this.username = username;
		this.owner = owner;
		this.game = undefined;
		this.sending = undefined;
		this.receiving = undefined;
		this.spec = false;
		this.watchInterval = -1;

		this.moveLeft = { timeout: null, firstMove: true };
		this.moveRight = { timeout: null, firstMove: true };

		this.keys = {};
		this.keys.moveLeft = "a";
		this.keys.moveRight = "d";
		this.keys.rotateClockwise = "arrowright";
		this.keys.rotateCounterClockwise = "arrowleft";
		this.keys.rotate180 = "w";
		this.keys.hardDrop = "arrowup";
		this.keys.softDrop = "arrowdown";
		this.keys.hold = "shift";
		this.keys.forfeit = "escape";
		this.keys.retry = "r";
	}
	getSocket() { return this.socket; }
	getUsername() { return this.username; }
	isOwner() { return this.owner; }
	setOwner(owner) { this.owner = owner; }
	getGame() { return this.game; }
	setGame(game) { this.game = game; }

	setupGame(settings) {
		this.game = new TetrisGame(this.socket, this.username);
		this.game.setSettings(settings);
		this.receiving = undefined;
		this.sending = undefined;
		this.socket.emit("MUSIC", JSON.stringify({ type: "BEGIN", argument: settings.music }));
		// dog("New game created for player " + this.socket.id);
	}

	async startInterval(toWatch) {
		return new Promise((resolve) => {
			if (!toWatch.getGame()) {
				resolve();
				return ;
			}
			if (this.watchInterval !== -1)
				clearInterval(this.watchInterval);
			this.watchInterval = setInterval(() => {
				if (!toWatch.getGame() || toWatch.getGame()?.isOver()) {
					clearInterval(this.watchInterval);
					this.watchInterval = -1;
					resolve();
					return ;
				}
				this.getSocket().emit("GAME", JSON.stringify({game: toWatch.getGame()?.toJSON()}));
			}, 1000 / 55); // 60 times per second
		});
	}

	toJSON() {
		return ({
			username: this.username,
			owner: this.owner,
			game: this.game ? this.game.toJSON() : undefined,
		});
	}
}
exports.Player = Player;
