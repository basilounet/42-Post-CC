"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Matrix = void 0;

const { Pos } = require("./Pos");
const { Mino } = require("./Mino");
const { clamp } = require("./utils");


class Matrix {

	constructor(arg) {
		if (arg instanceof Matrix)
			this.size = arg.size;
		else
			this.size = arg;
		this.matrix = this.#createEmptyMatrix();
		if (arg instanceof Matrix)
			this.matrix = arg.matrix.map((row) => row.map((mino) => new Mino(mino.getTexture(), mino.isSolid())));
	}

	toJSON() {
		let newMatrix;
		newMatrix = this.matrix.map((row) => row.map((mino) => mino.toJSON()));
		return newMatrix;
	}

	#createEmptyMatrix() {
		const matrix = [[]];
		for (let y = 0; y < this.size.getY(); y++) {
			for (let x = 0; x < this.size.getX(); x++)
				matrix[y].push(new Mino("EMPTY"));
			matrix.push([]);
		}
		return matrix;
	}

	at(arg1, arg2) {
		let pos;
		if (arg1 instanceof Pos)
			pos = arg1;
		else
			pos = new Pos(arg1, arg2);
		if (!pos.equals(pos.clamp(new Pos(0, 0), this.size.subtract(1, 1))))
			return Matrix.full;
		return this.matrix[pos.getY()][pos.getX()];
	}

	setAt(arg1, arg2, arg3) {
		let pos;
		if (arg1 instanceof Pos)
			pos = arg1;
		else
			pos = new Pos(arg1, arg2);
		if (!pos.equals(pos.clamp(new Pos(0, 0), this.size.subtract(1, 1))))
			return;
		this.matrix[pos.getY()][pos.getX()] = arg1 instanceof Pos ? arg2 : arg3;
	}

	isMinoAt(arg1, arg2) {
		let pos;
		if (arg1 instanceof Pos)
			pos = new Pos(arg1);
		else
			pos = new Pos(arg1, arg2);
		if (pos.getX() < 0 || pos.getX() >= this.size.getX() ||
			pos.getY() < 0 || pos.getY() >= this.size.getY())
			return true;
		return (!this.matrix[pos.getY()][pos.getX()].isEmpty() && this.matrix[pos.getY()][pos.getX()].isSolid());
	}

	getSize() { return this.size; }

	reset() {
		for (let y = this.size.getY() - 1; y >= 0; --y) {
			for (let x = this.size.getX() - 1; x >= 0; --x)
				this.matrix[y][x].reset();
		}
	}

	isRowFull(row) {
		if (row < 0 || row >= this.size.getY())
			return true;
		for (let x = this.size.getX() - 1; x >= 0; --x) {
			if (!this.isMinoAt(x, row))
				return false;
		}
		return true;
	}

	isRowEmpty(row) {
		if (row < 0 || row >= this.size.getY())
			return true;
		for (let x = this.size.getX() - 1; x >= 0; --x) {
			if (this.isMinoAt(x, row))
				return false;
		}
		return true;
	}

	markRow(row) {
		if (row < 0 || row >= this.size.getY())
			return ;
		for (let x = this.size.getX() - 1; x >= 0; --x)
			this.matrix[row][x].setShouldRemove(true);
	}

	shiftDown() {
		let lineRemoved = 0;
		for (let y = 0; y < this.size.getY(); ++y) {
			if (this.matrix[y][0].getShouldRemove()) {
				for (let x = 0; x < this.size.getX(); ++x) {
					for (let i = y; i > 0; --i)
						this.matrix[i][x] = this.matrix[i - 1][x];
					this.matrix[0][x] = new Mino("EMPTY");
				}
				++lineRemoved;
			}
		}
		return lineRemoved;
	}

	#shiftUp(lines = 1) {
		let ret = "";
		if (lines < 1)
			return "";
		if (lines >= this.size.getY())
			ret = "Top Out";
		for (let i = 0; i < lines; ++i)
			if (!this.isRowEmpty(i))
				ret = "Top Out";
		for (let x = 0; x < this.size.getX(); ++x)
			for (let y = clamp(lines, 0, this.size.getY() - 1); y < this.size.getY(); ++y)
				this.matrix[y - lines][x] = this.matrix[y][x];
		return ret;
	}

	addGarbage(lines) {
		if (this.#shiftUp(lines) === "Top Out")
			return "Top Out";
		const hole = Math.floor(Math.random() * this.size.getX());
		for (let y = this.size.getY() - lines; y < this.size.getY(); ++y) {
			for (let x = 0; x < this.size.getX(); ++x) {
				if (x === hole)
					this.matrix[y][x] = new Mino("EMPTY");
				else
					this.matrix[y][x] = new Mino("GARBAGE", true);
			}
		}
		return "";
	}

	isEmpty() {
		for (let y = 0; y < this.size.getY(); ++y) {
			for (let x = 0; x < this.size.getX(); ++x) {
				if (!this.matrix[y][x].isEmpty())
					return false;
			}
		}
		return true;
	}

	print() {
		for (let y = 0; y < this.size.getY(); ++y) {
			for (let x = 0; x < this.size.getX(); ++x) {
				process.stdout.write("[" + (this.matrix[y][x].getTexture() === "EMPTY" ? " " : this.matrix[y][x].getTexture()) + "] ");
			}
			process.stdout.write("\n");
		}
		process.stdout.write("\n");
	}
}
exports.Matrix = Matrix;

Matrix.full = new Mino("Full", true);
