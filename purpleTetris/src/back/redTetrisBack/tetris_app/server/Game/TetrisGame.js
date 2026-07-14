"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TetrisGame = void 0;

const tc = require("./tetrisConstants");
const { Pos } = require("./Pos");
const { Matrix } = require("./Matrix");
const { S } = require("./Pieces/S");
const { T } = require("./Pieces/T");
const { Z } = require("./Pieces/Z");
const { L } = require("./Pieces/L");
const { J } = require("./Pieces/J");
const { O } = require("./Pieces/O");
const { I } = require("./Pieces/I");
const utils_1 = require("./utils");
const seedRandom = require("seedrandom");
const { dlog } = require("./../../../server/server");


class 	TetrisGame {

	constructor(socket, username = "nameless", settings = {}) {
		this.player = socket;
		this.username = username;
		this.size = new Pos(tc.TETRIS_WIDTH, tc.TETRIS_HEIGHT);
		this.matrix = new Matrix(this.size.add(0, tc.BUFFER_HEIGHT));
		this.bags = [];
		this.currentPiece = undefined;
		this.shadowPiece = undefined;
		this.hold = undefined;
		this.level = tc.MIN_LEVEL;
		this.dropType = "normal";
		this.lineClearGoal = tc.FIXED_GOAL_SYSTEM[this.level];
		this.spinType = "";
		this.lastClear = "";
		this.combo = -1;
		this.B2B = -1;
		this.canSwap = true;
		this.holdPhase = false;
		this.shouldSpawn = false;
		this.fallSpeed = tc.FALL_SPEED(this.level);
		this.over = false;
		this.hasForfeit = false;
		this.shouldLock = false;
		this.isInLockPhase = false;
		this.lockFrame = false;
		this.nbMoves = 0;
		this.lowestReached = 0;
		this.msSinceLockPhase = 0;
		this.fallInterval = -1;
		this.lockInterval = -1;
		this.sendInterval = -1;
		this.gameId = socket.id;

		// multiplayer

		this.opponent = undefined;
		this.awaitingGarbage = [];
		this.garbageRespite = false;
		this.isInRoom = false;

		// statistics

		this.beginningTime = Date.now();
		this.placement = 1;
		this.totalTime = this.beginningTime;
		this.gameTime = 0;
		this.maxCombo = 0;
		this.piecesPlaced = 0;
		this.piecesPerSecond = 0;
		this.attacksSent = 0;
		this.attacksSentPerMinute = 0;
		this.attacksReceived = 0;
		this.attacksReceivedPerMinute = 0;
		this.keysPressed = 0;
		this.keysPerPiece = 0;
		this.keysPerSecond = 0;
		this.holds = 0;
		this.score = 0;
		this.linesCleared = 0;
		this.linesPerMinute = 0;
		this.maxB2B = 0;
		this.perfectClears = 0;
		this.allLinesClear = {
			"Single": 0,
			"Double": 0,
			"Triple": 0,
			"Quad": 0,
			"T-Spin Zero": 0,
			"T-Spin Single": 0,
			"T-Spin Double": 0,
			"T-Spin Triple": 0,
			"T-Spin Quad": 0,
			"Mini T-Spin Zero": 0,
			"Mini T-Spin Single": 0,
			"Mini Spin Zero": 0,
			"Mini Spin Single": 0,
			"Mini Spin Double": 0,
			"Mini Spin Triple": 0,
			"Mini Spin Quad": 0,
		};

		// settings

		this.resetSeedOnRetry = true;
		this.seed = Date.now().toString();
		this.rng = seedRandom(this.seed);
		this.rotationType = "SRSX";
		this.showShadowPiece = true;
		this.showBags = true;
		this.holdAllowed = true;
		this.showHold = true;
		this.infiniteHold = false;
		this.infiniteMovement = false;
		this.lockTime = 500; // Amount of time in ms in between a piece reaching the ground and locking down
		this.spawnARE = 0; // Amount of time in ms in between the piece spawning and starting to move // 250 in the guideline
		this.softDropAmp = 1;
		this.isLevelling = true;
		this.canRetry = true;
		this.setSettings(settings);
		this.initialState = this.#clone();
	}

	toJSON() {
		let jsonBags;
		this.showBags ? jsonBags = this.bags.map((bag) => bag.map((piece) => piece.toJSON())) :
			jsonBags = [[], []];
		return {
			username: this.username,
			matrix: this.matrix.toJSON(),
			bags: jsonBags,
			hold: this.showHold ? this.hold?.toJSON() : undefined,
			canSwap: this.canSwap,
			gameId: this.gameId,
			score: this.score,
			level: this.level,
			time: this.gameTime,
			awaitingGarbage: this.awaitingGarbage,
			linesCleared: this.linesCleared,
			lineClearGoal: this.lineClearGoal,
			piecesPlaced: this.piecesPlaced,
			piecesPerSecond: this.piecesPerSecond,
		};
	}

	#clone() {
		if (this.fallInterval !== -1)
			return this.initialState;
		return ({
			currentPiece: this.currentPiece,
			shadowPiece: this.shadowPiece,
			hold: this.hold,
			level: this.level,
			dropType: this.dropType,
			lineCleared: this.linesCleared,
			lineClearGoal: this.lineClearGoal = tc.FIXED_GOAL_SYSTEM[this.level],
			combo: this.combo,
			B2B: this.B2B,
			canSwap: this.canSwap,
			holdPhase: this.holdPhase,
			shouldSpawn: this.shouldSpawn,
			fallSpeed: this.fallSpeed,
			over: this.over,
			hasForfeit: this.hasForfeit,
			shouldLock: this.shouldLock,
			isInLockPhase: this.isInLockPhase,
			lockFrame: this.lockFrame,
			nbMoves: this.nbMoves,
			lowestReached: this.lowestReached,
			msSinceLockPhase: this.msSinceLockPhase,
			opponent: this.opponent,
			awaitingGarbage: this.awaitingGarbage,
			garbageRespite: this.garbageRespite,
			isInRoom: this.isInRoom,
			beginningTime: this.beginningTime,
			totalTime: this.totalTime,
			gameTime: this.gameTime,
			maxCombo: this.maxCombo,
			piecesPlaced: this.piecesPlaced,
			piecesPerSecond: this.piecesPerSecond,
			attacksSent: this.attacksSent,
			attacksSentPerMinute: this.attacksSentPerMinute,
			attacksReceived: this.attacksReceived,
			attacksReceivedPerMinute: this.attacksReceivedPerMinute,
			keysPressed: this.keysPressed,
			keysPerPiece: this.keysPerPiece,
			keysPerSecond: this.keysPerSecond,
			holds: this.holds,
			score: this.score,
			linesCleared: this.linesCleared,
			linesPerMinute: this.linesPerMinute,
			maxB2B: this.maxB2B,
			perfectClears: this.perfectClears,
			allLinesClear: JSON.parse(JSON.stringify(this.allLinesClear)),
			placement: this.placement,
			resetSeedOnRetry: this.resetSeedOnRetry,
			seed: this.seed,
			rng: this.rng,
			rotationType: this.rotationType,
			showShadowPiece: this.showShadowPiece,
			showBags: this.showBags,
			holdAllowed: this.holdAllowed,
			showHold: this.showHold,
			infiniteHold: this.infiniteHold,
			infiniteMovement: this.infiniteMovement,
			lockTime: this.lockTime,
			spawnARE: this.spawnARE,
			softDropAmp: this.softDropAmp,
			isLevelling: this.isLevelling,
			canRetry: this.canRetry,
		});
	}

	getGameId() { return this.gameId; }
	isOver() { return this.over; }
	getUsername() { return this.username; }
	getHasForfeit() { return this.hasForfeit; }

	setOver(over) { this.over = over; }
	setOpponent(opponent) { this.opponent = opponent; }
	setPlacement(placement) { this.placement = placement; }
	setSettings(settings) {
		if (!settings || this.fallInterval !== -1)
			return;
		Object.keys(settings).forEach((key) => {
			if (key.toString() === "over")
			dlog("Setting " + key + " to " + settings[key]);
			if (key in this && settings[key] !== undefined)
				this[key] = settings[key];
		});
		this.initialState = this.#clone();
	}

	#shuffleBag() {
		const pieces = [
			new S(this.rotationType),
			new Z(this.rotationType),
			new L(this.rotationType),
			new J(this.rotationType),
			new T(this.rotationType),
			new O(this.rotationType),
			new I(this.rotationType)
		];
		return pieces.sort(() => this.rng() - 0.5);
	}

	trySetInterval(interval = this.fallSpeed) {
		if (this.over)
			return dlog("Game is over, not launching fall interval");
		if (this.fallInterval !== -1)
			return dlog("Fall interval already set, not launching another one");
		if (interval < 0)
			return dlog("interval is negative, not launching");
		this.fallInterval = setInterval(() => this.#fallPiece(), interval);
	}

	#getNextPiece() {
		const piece = this.bags[0].shift();
		if (this.bags[0].length === 0) {
			this.bags[0] = this.bags[1];
			this.bags[1] = this.#shuffleBag();
		}
		return piece;
	}

	async spawnPiece() {
		// dlog("spawnPiece, currentPiece: ", this.currentPiece);
		// dlog("Spawning new piece");
		clearInterval(this.fallInterval);
		this.fallInterval = -1;
		this.shouldLock = false;
		this.shouldSpawn = false;
		this.spinType = "";
		if (this.holdPhase) { // If swap was called, we are in hold phase
			// dlog("Hold phase");
			this.holdPhase = false;
			this.currentPiece?.remove(this.matrix);
			this.currentPiece?.setRotation(tc.NORTH);
			if (this.hold && this.currentPiece) {
				const temp = this.currentPiece;
				this.currentPiece = this.hold;
				this.hold = temp;
			}
			else if (!this.hold && this.currentPiece) {
				this.hold = this.currentPiece;
				this.currentPiece = this.#getNextPiece();
			}
		}
		else {
			this.canSwap = true;
			this.currentPiece = this.#getNextPiece();
		}
		if (!this.currentPiece)
			return;
		this.currentPiece.setCoordinates(new Pos(3 - 2, tc.BUFFER_HEIGHT - 3 - 2)); // -2 to take piece inner size into account
		if (this.currentPiece.isColliding(this.matrix)) {
			dlog("Piece is colliding at spawn, game over");
			this.over = true;
			return;
		}
		this.currentPiece.place(this.matrix);
		this.#placeShadow();
		this.dropType === "hard" ? this.dropType = "normal" : true;
		this.dropType === "normal" ? this.fallSpeed = tc.FALL_SPEED(this.level) : tc.SOFT_DROP_SPEED(this.level);
		await utils_1.delay(this.spawnARE);
	}

	#resetLockPhase() {
		clearInterval(this.lockInterval);
		this.lockInterval = -1;
		this.isInLockPhase = false;
		this.shouldLock = false;
		this.msSinceLockPhase = 0;
		this.nbMoves = 0;
		this.lowestReached = this.currentPiece?.getCoordinates().getY() || 0;
		// dlog("Stopping countdown for lock phase");
	}

	async #extendedLockDown(lowestReached) {
		++this.msSinceLockPhase;
		// dlog("msSinceLockPhase: ", this.msSinceLockPhase);
		if (lowestReached < this.lowestReached)
			return this.#resetLockPhase();
		if ((!this.infiniteMovement && this.nbMoves > 14) ||
			(this.lockTime >= 0 && this.msSinceLockPhase >= this.lockTime)) {
			// dlog("Lock phase reached, locking piece at " + this.msSinceLockPhase + " ms");
			// this.lockTime >= 500 ? dlog("Max time reached") : dlog("Max moves reached");
			this.#resetLockPhase();
			this.shouldLock = true;
			clearInterval(this.fallInterval);
			this.fallInterval = -1;
			this.trySetInterval(1);
		}
	}

	async #fallPiece() {
		if (!this.currentPiece)
			return;
		if (this.currentPiece.canFall(this.matrix)) {
			if (this.dropType === "soft")
				this.player.emit("EFFECT", JSON.stringify({ type: "USER_EFFECT", value: "softdrop" }));
			this.spinType = "";
			this.currentPiece.remove(this.matrix);
			this.currentPiece.setCoordinates(this.currentPiece.getCoordinates().down());
			this.currentPiece.place(this.matrix);
			if (this.currentPiece.getCoordinates().getY() > this.lowestReached) {
				if (this.isInLockPhase)
					this.#resetLockPhase();
				this.lowestReached = this.currentPiece.getCoordinates().getY();
			}
			if (this.dropType !== "hard" && !this.currentPiece.canFall(this.matrix))
				this.player.emit("EFFECT", JSON.stringify({ type: "BOARD", value: "floor" }));
		}
		else {
			if (this.shouldLock) {
				clearInterval(this.fallInterval);
				if (this.dropType === "hard")
					this.player.emit("EFFECT", JSON.stringify({ type: "USER_EFFECT", value: "harddrop" }));
				this.fallInterval = -1;
				this.currentPiece.remove(this.matrix);
				// this.currentPiece.setTexture(this.currentPiece.getTexture() + "_LOCKED")
				this.currentPiece.place(this.matrix, true);
				this.currentPiece = undefined;
				this.lockFrame = true;
				this.shouldSpawn = true;
				this.isInLockPhase = false;
				++this.piecesPlaced;
			}
			else if (!this.isInLockPhase) {
				this.isInLockPhase = true;
				if (this.lockInterval === -1) {
					this.lockInterval = setInterval(() => this.#extendedLockDown(this.lowestReached), 1);
				}
			}
		}
		this.#patternPhase();
	}

	#patternPhase() {
		for (let y = this.matrix.getSize().getY() - 1; y >= 0; --y)
			if (this.matrix.isRowFull(y))
				this.matrix.markRow(y);
		return this.#iteratePhase();
	}

	#iteratePhase() {
		return this.#animatePhase();
	}

	#animatePhase() {
		return this.#eliminatePhase();
	}

	#eliminatePhase() {
		if (this.lockFrame) {
			const nbClear = this.matrix.shiftDown();
			if (nbClear >= 1)
				this.garbageRespite = true;
			this.lastClear = this.#scoreName(nbClear);
			this.linesCleared += nbClear;
			this.#updateB2B();
			if (this.lastClear.includes("Zero")) {
				if (this.combo >= 3)
					this.player.emit("EFFECT", JSON.stringify({ type: "COMBO", value: "break" }));
				this.combo = -1;
			}
			else
				++this.combo;
			if (this.lastClear !== "Zero") {
				if (this.lastClear.includes("-Spin") && !this.lastClear.includes("T")) // Register T-Spin and Mini T-Spin uniquely
					// remove the "Z-" / "L-" / "J-" / "S-" / "I-". Not "T-"
					++this.allLinesClear[this.lastClear.substring(0, this.lastClear.indexOf("Spin") - 2) + this.lastClear.substring(this.lastClear.indexOf("Spin"))];
				else
					++this.allLinesClear[this.lastClear];
				if (this.lastClear.includes("Spin Zero"))
					this.player.emit("EFFECT", JSON.stringify({ type: "LOCK", value: "spinend" }));
				else if (this.lastClear.includes("Spin"))
					this.player.emit("EFFECT", JSON.stringify({ type: "CLEAR", value: "spin" }));
				else if (this.B2B > 0)
					this.player.emit("EFFECT", JSON.stringify({ type: "CLEAR", value: "btb" }));
				else if (this.lastClear.includes("Quad"))
					this.player.emit("EFFECT", JSON.stringify({ type: "CLEAR", value: "quad" }));
				else
					this.player.emit("EFFECT", JSON.stringify({ type: "CLEAR", value: "line" }));
				if (this.combo >= 1) {
					this.score += tc.STANDARD_COMBO_SCORING(this.combo, this.level);
					this.player.emit("EFFECT", JSON.stringify({ type: "COMBO", value: this.combo }));
				}
				if (this.combo > this.maxCombo)
					this.maxCombo = this.combo;
			}
			else
				this.player.emit("EFFECT", JSON.stringify({ type: "LOCK", value: "lock" }));
		}
		this.#completionPhase();
		return;
	}

	async #completionPhase() {
		if (this.currentPiece?.canFall(this.matrix))
			this.score += tc.SCORE_CALCULUS(this.dropType + " Drop", 0, false);
		if (this.lockFrame) {
			this.#sendGarbage(this.lastClear);
			if (this.matrix.isEmpty()) {
				++this.perfectClears;
				this.#sendGarbage("Perfect Clear");
				this.player.emit("EFFECT", JSON.stringify({ type: "CLEAR", value: "all" }));
			}
			if (this.lastClear !== "Zero" && this.B2B > 0)
				this.player.emit("EFFECT", JSON.stringify({ type: "BTB", value: this.B2B }));
			if (!this.garbageRespite && this.awaitingGarbage.length > 0) {
				if (this.matrix.addGarbage(this.awaitingGarbage[0]) === "Top Out") {
					this.player.emit("EFFECT", JSON.stringify({ type: "BOARD", value: "topout" }));
					this.over = true;
					return;
				}
				if (this.awaitingGarbage[0] <= 2)
					this.player.emit("EFFECT", JSON.stringify({ type: "GARBAGE", value: "damage_small" }));
				else if (this.awaitingGarbage[0] <= 4)
					this.player.emit("EFFECT", JSON.stringify({ type: "GARBAGE", value: "damage_medium" }));
				else
					this.player.emit("EFFECT", JSON.stringify({ type: "GARBAGE", value: "damage_large" }));
				this.awaitingGarbage.shift();
			}
			this.garbageRespite = false;
			this.lockFrame = false;
		}
		if (this.isLevelling && this.level < tc.MAX_LEVEL && this.linesCleared >= this.lineClearGoal) {
			++this.level;
			this.lineClearGoal = tc.FIXED_GOAL_SYSTEM[this.level];
			if (this.level % 5 === 0)
				this.player.emit("EFFECT", JSON.stringify({ type: "LEVEL", value: this.level.toString() }));
			else
				this.player.emit("EFFECT", JSON.stringify({ type: "LEVEL", value: "up" }));
		}
		if (this.shouldSpawn) {
			await this.spawnPiece();
			this.trySetInterval();
			// ^^^ restart the loop starting in #fallPiece
		}
		this.#placeShadow();
		// this.player.emit("GAME", JSON.stringify({ game: this.toJSON() }));
	}

	#placeShadow() {
		if (!this.currentPiece || !this.showShadowPiece)
			return;
		this.shadowPiece?.remove(this.matrix, true);
		this.shadowPiece = new this.currentPiece.constructor(this.rotationType, "SHADOW", this.currentPiece.getCoordinates(), "SHADOW");
		this.shadowPiece.setName("SHADOW");
		this.shadowPiece.setTexture("SHADOW");
		this.shadowPiece.setCoordinates(this.currentPiece.getCoordinates());
		this.shadowPiece.setRotation(this.currentPiece.getRotation());
		while (this.shadowPiece.canFall(this.matrix))
			this.shadowPiece.setCoordinates(this.shadowPiece.getCoordinates().down());
		this.shadowPiece.place(this.matrix, false, true);
	}

	#scoreName(nbClear, withSpin = true) {
		let name = "";
		if (withSpin && this.spinType !== "")
			name = this.spinType + " ";
		switch (nbClear) {
			case 1:
				name += "Single";
				break;
			case 2:
				name += "Double";
				break;
			case 3:
				name += "Triple";
				break;
			case 4:
				name += "Quad";
				break;
			default:
				name += "Zero";
				break;
		}
		return name;
	}

	#updateB2B() {
		if (this.lastClear.includes("Zero") || this.lastClear === "Perfect Clear")
			return;
		if (this.lastClear.includes("Quad") || this.lastClear.includes("Spin"))
			++this.B2B;
		else {
			if (this.B2B >= 4)
				this.player.emit("EFFECT", JSON.stringify({ type: "BTB", value: "break" }));
			this.B2B = -1;
		}
		if (this.B2B > this.maxB2B)
			this.maxB2B = this.B2B;
	}

	#sendGarbage(clear) {
		let sendSound = false;
		let sending = tc.GARBAGE_CALCULUS(clear, this.combo, this.B2B, tc.MULTIPLIER_COMBO_GARBAGE_TABLE);
		this.score += tc.SCORE_CALCULUS(clear, this.level, this.B2B > 0);
		sending = Math.floor(sending);
		while (this.awaitingGarbage.length > 0 && sending > 0) {
			sendSound = true;
			if (this.awaitingGarbage[0] > sending) {
				this.awaitingGarbage[0] -= sending;
				sending = 0;
			}
			else
				sending -= this.awaitingGarbage.shift();
		}
		if (sendSound)
			this.player.emit("EFFECT", JSON.stringify({ type: "GARBAGE", value: "counter" }));
		if (sending <= 0 || !this.opponent)
			return;
		else if (sending <= 2)
			this.player.emit("EFFECT", JSON.stringify({ type: "GARBAGE", value: "garbage_out_small" }));
		else if (sending <= 4)
			this.player.emit("EFFECT", JSON.stringify({ type: "GARBAGE", value: "garbage_out_medium" }));
		else
			this.player.emit("EFFECT", JSON.stringify({ type: "GARBAGE", value: "garbage_out_large" }));
		this.attacksSent += sending;
		this.opponent?.#receiveGarbage(sending);
	}

	#receiveGarbage(lines) {
		if (this.over || lines <= 0)
			return;
		else if (lines <= 2)
			this.player.emit("EFFECT", JSON.stringify({ type: "GARBAGE", value: "garbage_in_small" }));
		else if (lines <= 4)
			this.player.emit("EFFECT", JSON.stringify({ type: "GARBAGE", value: "garbage_in_medium" }));
		else
			this.player.emit("EFFECT", JSON.stringify({ type: "GARBAGE", value: "garbage_in_large" }));
		this.attacksReceived += lines;
		this.awaitingGarbage.push(lines);
	}

	async changeFallSpeed(type) {
		if (this.over || type === this.dropType || this.fallInterval === -1)
			return;
		if (type !== "normal") {
			++this.nbMoves;
			++this.keysPressed;
		}
		clearInterval(this.fallInterval);
		this.fallInterval = -1;
		this.#resetLockPhase();
		this.dropType = type;
		switch (type) {
			case "normal":
				this.fallSpeed = tc.FALL_SPEED(this.level);
				// dlog("Changing fall speed to Normal: " + this.fallSpeed);
				break;
			case "soft":
				this.fallSpeed = tc.SOFT_DROP_SPEED(this.level) / this.softDropAmp;
				// dlog("soft drop speed: " + tc.SOFT_DROP_SPEED(this.level) + " / " + this.softDropAmp + " = " + this.fallSpeed);
				break;
			case "hard":
				this.fallSpeed = tc.HARD_DROP_SPEED;
				this.shouldLock = true;
				break;
		}
		this.trySetInterval();
	}

	rotate(direction) {
		if (!this.currentPiece)
			return;
		let rotation = this.currentPiece.rotate(direction, this.matrix);
		// dlog("rotation: " + rotation);
		if (rotation !== "-1") {
			++this.keysPressed;
			if (this.isInLockPhase) {
				if (!this.infiniteMovement)
					++this.nbMoves;
				// dlog("nbMoves: " + this.nbMoves);
				this.msSinceLockPhase = 0;
			}
			this.spinType = rotation;
			if (this.spinType !== "") {
				// dlog("Spin type: '" + this.spinType + "'");
				this.player.emit("EFFECT", JSON.stringify({ type: "SPIN", value: this.spinType }));
			}
			else
				this.player.emit("EFFECT", JSON.stringify({ type: "USER_EFFECT", value: "rotate" }));
		}
		this.#placeShadow();
		// this.player.emit("GAME", JSON.stringify({ game: this.toJSON() }));
	}

	move(direction) {
		if (!this.currentPiece)
			return;
		++this.keysPressed;
		const offset = direction === "left" ? new Pos(-1, 0) : new Pos(1, 0);
		if (this.currentPiece.isColliding(this.matrix, offset))
			return;
		if (this.isInLockPhase) {
			if (!this.infiniteMovement)
				++this.nbMoves;
			// dlog("nbMoves: " + this.nbMoves);
			this.msSinceLockPhase = 0;
		}
		this.currentPiece.remove(this.matrix);
		this.currentPiece.setCoordinates(this.currentPiece.getCoordinates().add(offset));
		this.currentPiece.place(this.matrix);
		if (this.currentPiece.isColliding(this.matrix, offset))
			this.player.emit("EFFECT", JSON.stringify({ type: "BOARD", value: "sidehit" }));
		else
			this.player.emit("EFFECT", JSON.stringify({ type: "USER_EFFECT", value: "move" }));
		this.#placeShadow();
		// this.player.emit("GAME", JSON.stringify({ game: this.toJSON() }));
	}

	async swap() {
		// console.log("holdAllowed: " + this.holdAllowed + ", canSwap: " + this.canSwap + ", over: " + this.over + ", fallInterval: " + this.fallInterval);
		// dlog("Swapping piece");
		if (!this.holdAllowed || !this.canSwap || this.over || this.fallInterval === -1) {
			return;
		}
		this.player.emit("EFFECT", JSON.stringify({ type: "USER_EFFECT", value: "hold" }));
		++this.keysPressed;
		++this.holds;
		this.holdPhase = true;
		if (!this.infiniteHold)
			this.canSwap = false;
		clearInterval(this.fallInterval);
		this.fallInterval = -1;
		this.#resetLockPhase();
		await this.spawnPiece();
		this.trySetInterval();
		// this.player.emit("GAME", JSON.stringify({ game: this.toJSON() }));
	}

	async #gameLoopIteration() {
		return new Promise((resolve) => {
			const Iteration = async () => {
				if (!this.over) {
					this.gameTime = Date.now() - this.beginningTime;
					this.piecesPerSecond = parseFloat((this.piecesPlaced / (this.gameTime / 1000)).toFixed(2));
					setTimeout(Iteration, 10); // Schedule the next iteration
					return ;
				}
				this.keysPerSecond = parseFloat((this.keysPressed / (this.gameTime / 1000)).toFixed(2));
				this.keysPerPiece = parseFloat((this.keysPressed / this.piecesPlaced).toFixed(2));
				this.linesPerMinute = parseFloat((this.linesCleared / (this.gameTime / 1000 / 60)).toFixed(2));
				this.attacksSentPerMinute = parseFloat((this.attacksSent / (this.gameTime / 1000 / 60)).toFixed(2));
				this.attacksReceivedPerMinute = parseFloat((this.attacksReceived / (this.gameTime / 1000 / 60)).toFixed(2));
				this.totalTime = Date.now() - this.beginningTime;
				resolve();
			};
			Iteration();
		});
	}

	async gameLoop() {
		// dlog("Starting game loop");
		this.sendInterval = setInterval(() => {
			this.player.emit("GAME", JSON.stringify({game: this.toJSON()}));
		}, 1000 / 55); // 60 times per second
		this.rng = seedRandom(this.seed);
		this.bags = [this.#shuffleBag(), this.#shuffleBag()];
		await this.spawnPiece();
		this.#placeShadow();
		this.trySetInterval();
		this.player.emit("GAME_START", JSON.stringify({ game: this.toJSON() }));
		await this.#gameLoopIteration();
		clearInterval(this.fallInterval);
		this.fallInterval = -1;
		clearInterval(this.sendInterval);
		this.sendInterval = -1;
		if (this.isInRoom && this.placement === 1)
			this.player.emit("EFFECT", JSON.stringify({ type: "BOARD", value: "victory" }));
		else
			this.player.emit("EFFECT", JSON.stringify({ type: "BOARD", value: "gameover" }));
		this.player.emit("GAME", JSON.stringify({ game: this.toJSON() }));
		this.player.emit("STATS", JSON.stringify({ stats: this.#getStats() }));
		this.player.emit("GAME_FINISH");
	}

	async 	retry() {
		if (this.over || !this.canRetry)
			return ;
		clearInterval(this.fallInterval);
		this.fallInterval = -1;
		clearInterval(this.lockInterval);
		this.lockInterval = -1;
		await Object.assign(this, JSON.parse(JSON.stringify(this.initialState)));
		if (this.resetSeedOnRetry)
			this.seed = Date.now().toString();
		this.size = new Pos(tc.TETRIS_WIDTH, tc.TETRIS_HEIGHT);
		this.matrix = new Matrix(this.size.add(0, tc.BUFFER_HEIGHT));
		this.rng = seedRandom(this.seed);
		this.bags = [this.#shuffleBag(), this.#shuffleBag()];
		await this.spawnPiece();
		this.#placeShadow();
		this.trySetInterval();
		this.hold = undefined;
		this.beginningTime = Date.now();
		this.player.emit("GAME", JSON.stringify({ game: this.toJSON() }));
	}

	#getStats() {
		return {
			placement: this.placement,
			level: this.level,
			isInRoom: this.isInRoom,
			gameTime: this.gameTime,
			totalTime: (new Date(this.totalTime || 0).toISOString().substring(14, 23)),
			maxCombo: this.maxCombo,
			piecesPlaced: this.piecesPlaced,
			piecesPerSecond: this.piecesPerSecond,
			attacksSent: this.attacksSent,
			attacksSentPerMinute: this.attacksSentPerMinute,
			attacksReceived: this.attacksReceived,
			attacksReceivedPerMinute: this.attacksReceivedPerMinute,
			keysPressed: this.keysPressed,
			keysPerPiece: this.keysPerPiece,
			keysPerSecond: this.keysPerSecond,
			holds: this.holds,
			score: this.score,
			linesCleared: this.linesCleared,
			linesPerMinute: this.linesPerMinute,
			maxB2B: this.maxB2B,
			perfectClears: this.perfectClears,
			single: this.allLinesClear.Single,
			double: this.allLinesClear.Double,
			triple: this.allLinesClear.Triple,
			quad: this.allLinesClear.Quad,
			tspinZero: this.allLinesClear["T-Spin Zero"],
			tspinSingle: this.allLinesClear["T-Spin Single"],
			tspinDouble: this.allLinesClear["T-Spin Double"],
			tspinTriple: this.allLinesClear["T-Spin Triple"],
			miniTspinZero: this.allLinesClear["Mini T-Spin Zero"],
			miniTspinSingle: this.allLinesClear["Mini T-Spin Single"],
			miniSpinZero: this.allLinesClear["Mini Spin Zero"],
			miniSpinSingle: this.allLinesClear["Mini Spin Single"],
			miniSpinDouble: this.allLinesClear["Mini Spin Double"],
			miniSpinTriple: this.allLinesClear["Mini Spin Triple"],
			miniSpinQuad: this.allLinesClear["Mini Spin Quad"],
		};
	}

	forfeit() {
		this.over = true;
		this.hasForfeit = true;
	}
}
exports.TetrisGame = TetrisGame;
