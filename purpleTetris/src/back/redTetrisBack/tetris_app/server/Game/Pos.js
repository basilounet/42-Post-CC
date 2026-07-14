"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pos = void 0;

const utils = require("./utils");


class Pos {

	constructor(arg1, arg2) {
		if (arg1 instanceof Pos) {
			this.x = arg1.x;
			this.y = arg1.y;
		}
		else {
			this.x = arg1;
			this.y = (arg2 || 0);
		}
	}
	getX() { return this.x; }
	setX(x) { this.x = x; }

	getY() { return this.y; }
	setY(y) { this.y = y; }

	add(arg1, arg2) {
		if (arg1 instanceof Pos)
			return new Pos(this.x + arg1.x, this.y + arg1.y);
		return new Pos(this.x + arg1, this.y + (arg2 || 0));
	}

	subtract(arg1, arg2) {
		if (arg1 instanceof Pos)
			return new Pos(this.x - arg1.x, this.y - arg1.y);
		return new Pos(this.x - arg1, this.y - (arg2 || 0));
	}

	distanceTo(pos) {
		return Math.sqrt(Math.pow(this.x - pos.x, 2) + Math.pow(this.y - pos.y, 2));
	}

	distanceToPos(pos) {
		return new Pos(this.x - pos.x, this.y - pos.y);
	}

	up(y = 1) {
		return new Pos(this.x, this.y - y);
	}

	down(y = 1) {
		return new Pos(this.x, this.y + y);
	}

	left(x = 1) {

		return new Pos(this.x - x, this.y);
	}

	right(x = 1) {
		return new Pos(this.x + x, this.y);
	}

	clamp(min, max) {
		return new Pos((0, utils.clamp)(this.x, min.x, max.x), (0, utils.clamp)(this.y, min.y, max.y));
	}

	equals(pos) {
		return this.x === pos.x && this.y === pos.y;
	}
}
exports.Pos = Pos;
