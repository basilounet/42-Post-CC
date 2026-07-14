"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ATetrimino = void 0;

const tc = require("./tetrisConstants");
const { Pos } = require("./Pos");
const utils = require("./utils");
const { Mino } = require("./Mino");
// const { dlog } = require("./../../../server/server");


class ATetrimino {

	constructor(rotationType, name = "None", coordinates = new Pos(0, 0), texture = "Empty") {
		if (new.target === ATetrimino)
			throw new TypeError("Cannot construct ATetrimino instances directly, use a subclass instead.");
		this.name = name;
		this.coordinates = coordinates;
		this.texture = texture;
		this.rotation = tc.NORTH;
		this.rotationType = rotationType;
	}

	toJSON() {
		return {
			name: this.name,
			rotation: this.rotation,
			texture: this.texture
		};
	}

	static convertBlock(jsonBlock) {
		let blocks = [];
		for (let i = 0; i < jsonBlock.blocks?.length || 0; ++i)
			blocks.push(new Pos(jsonBlock.blocks[i].x, jsonBlock.blocks[i].y));
		let original = [];
		for (let i = 0; i < jsonBlock.original?.length || 0; ++i)
			original.push(new Pos(jsonBlock.original[i].x, jsonBlock.original[i].y));
		let SRS = [];
		for (let i = 0; i < jsonBlock.SRS?.length || 0; ++i)
			SRS.push(new Pos(jsonBlock.SRS[i].x, jsonBlock.SRS[i].y));
		let SRSX = [];
		for (let i = 0; i < jsonBlock.SRSX?.length || 0; ++i)
			SRSX.push(new Pos(jsonBlock.SRSX[i].x, jsonBlock.SRSX[i].y));
		return ({
			blocks: blocks,
			original: original,
			SRS: SRS,
			SRSX: SRSX
		});
	}

	getStruct() {
		return this.constructor.struct;
	}

	getSpinCheck() {
		return this.constructor.SpinCheck;
	}

	place(matrix, isSolid = false, isShadow = false) {
		const struct = this.getStruct();
		const block = struct[tc.ROTATIONS[this.rotation]];
		for (let i = 0; i < struct.nbBlocks; ++i) {
			const pos = this.coordinates.add(block?.blocks[i]);
			if (pos.getY() < 0)
				return;
			if (!isShadow || (isShadow && matrix.at(pos).isEmpty())) {
				matrix.setAt(pos, new Mino(this.texture, isSolid));
				if (isShadow)
					matrix.at(pos).setShadow(true);
			}
		}
	}

	remove(matrix, isShadow = false) {
		const struct = this.getStruct();
		const block = struct[tc.ROTATIONS[this.rotation]];
		for (let i = 0; i < struct.nbBlocks; ++i) {
			const pos = this.coordinates.add(block?.blocks[i]);
			if (!isShadow || (isShadow && matrix.at(pos).getIsShadow()))
				matrix.setAt(pos, new Mino("EMPTY", false));
		}
	}

	rotate(direction, matrix) {
		let rotationPointUsed = -1;
		const struct = this.getStruct();
		let start = struct[tc.ROTATIONS[this.rotation]];
		let end = null;
		if (direction === "clockwise")
			end = struct[tc.ROTATIONS[utils.mod(this.rotation + 1, 4)]];
		else if (direction === "180")
			end = struct[tc.ROTATIONS[utils.mod(this.rotation + 2, 4)]];
		else
			end = struct[tc.ROTATIONS[utils.mod(this.rotation + 3, 4)]];
		if (!end)
			return "";
		// dlog("start : " + start);
		// dlog("end : " + end);
		let startRotations = ((direction !== "180" && this.rotationType !== "original") ? start["SRS"] : start[this.rotationType]);
		let endRotations = ((direction !== "180" && this.rotationType !== "original") ? end["SRS"] : end[this.rotationType]);
		// dlog("direction : " + direction + "rotationType " + this.rotationType);
		// dlog("startRotations :", startRotations);
		// dlog("endRotations :", endRotations);
		this.remove(matrix, false);

		for (let i = 0; i < startRotations.length; ++i) {
			const startPos = (direction === "180" ? new Pos(3, 3) : startRotations[i]);
			const endPos = endRotations[i];
			const dist = startPos.distanceToPos(endPos);
			const collides = () => {
				for (let j = 0; j < struct.nbBlocks; ++j)
					if (matrix.isMinoAt(this.coordinates.add(end.blocks[j]).add(dist)))
						return true;
				return false;
			};
			if (!collides()) {
				rotationPointUsed = i;
				this.coordinates = this.coordinates.add(dist);
				this.rotation = direction === "clockwise" ? utils.mod(this.rotation + 1, 4) :
					direction === "180" ? utils.mod(this.rotation + 2, 4) : utils.mod(this.rotation + 3, 4);
				break;
			}
		}
		this.place(matrix, false);
		return this.#getSpin(matrix, rotationPointUsed);
	}

	#getSpin(matrix, rotationPointUsed) {
		// dlog("rotationPointUsed", rotationPointUsed);
		if (rotationPointUsed === -1)
			return "-1";
		if (this.canFall(matrix))
			return "";
		let checks = this.getSpinCheck();
		if (checks.length > 1)
			for (let i = 0; i < this.rotation; ++i)
				checks = checks[0].map((val, index) => checks.map(row => row[index]).reverse());
		let major = 0;
		let minor = 0;
		for (let i = 0; i < checks.length; ++i) {
			for (let j = 0; j < checks[i].length; ++j) {
				if (checks[i][j] === 2 && matrix.isMinoAt(this.coordinates.add(j, i)))
					++major;
				if (checks[i][j] === 3 && matrix.isMinoAt(this.coordinates.add(j, i)))
					++minor;
			}
		}
		return this.getSpinSpecific(matrix, major, minor, rotationPointUsed);
	}

	isColliding(matrix, offset = new Pos(0, 0)) {
		const struct = this.getStruct();
		const block = struct[tc.ROTATIONS[this.rotation]];
		for (let i = 0; i < struct.nbBlocks; ++i) {
			const pos = this.coordinates.add(block?.blocks[i]).add(offset);
			if (matrix.isMinoAt(pos))
				return true;
		}
		return false;
	}

	canSlide(matrix) {
		return !this.isColliding(matrix, new Pos(1, 0)) || !this.isColliding(matrix, new Pos(-1, 0));
	}

	canFall(matrix) {
		return !this.isColliding(matrix, new Pos(0, 1));
	}

	getCoordinates() { return this.coordinates; }
	setCoordinates(pos) { this.coordinates = pos; }

	getTexture() { return this.texture; }
	setTexture(texture) { this.texture = texture; }

	getName() { return this.name; }
	setName(name) { this.name = name; }

	getRotation() { return this.rotation; }
	setRotation(rotation) { this.rotation = rotation; }
}
exports.ATetrimino = ATetrimino;
