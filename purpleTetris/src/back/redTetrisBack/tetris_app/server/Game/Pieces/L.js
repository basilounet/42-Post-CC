"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
	return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.L = void 0;

const { ATetrimino } = require("../ATetrimino");
const { Pos } = require("../Pos");
const LJson_json = __importDefault(require("./LJson.json"));


class L extends ATetrimino {

	constructor(rotationType, coordinates = new Pos(0, 0), texture = "L") {
		super(rotationType, "L", coordinates, texture);
	}

	getSpinSpecific(matrix, major, minor, rotationPointUsed) {
		if (rotationPointUsed === -1)
			return "-1";
		if (this.canFall(matrix))
			return "";
		if (this.canSlide(matrix) || !this.isColliding(matrix, new Pos(0, -1)))
			return "";
		return "Mini L-Spin";
	}

	getSize() { return _a.struct.size; }
}
exports.L = L;

_a = L;

L.SpinCheck = [[]]; // 2 major, 3 minor

// Load the JSON file and convert it to the pieceStruct
L.struct = (() => {
	return {
		size: LJson_json.default.size,
		nbBlocks: LJson_json.default.nbBlocks,
		north: _a.convertBlock(LJson_json.default.north),
		east: _a.convertBlock(LJson_json.default.east),
		south: _a.convertBlock(LJson_json.default.south),
		west: _a.convertBlock(LJson_json.default.west)
	};
})();
