"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
	return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.S = void 0;

const { ATetrimino } = require("../ATetrimino");
const { Pos } = require("../Pos");
const SJson_json = __importDefault(require("./SJson.json"));


class S extends ATetrimino {

	constructor(rotationType, coordinates = new Pos(0, 0), texture = "S") {
		super(rotationType, "S", coordinates, texture);
	}

	getSpinSpecific(matrix, major, minor, rotationPointUsed) {
		if (rotationPointUsed === -1)
			return "-1";
		if (this.canFall(matrix))
			return "";
		if (this.canSlide(matrix) || !this.isColliding(matrix, new Pos(0, -1)))
			return "";
		return "Mini S-Spin";
	}

	getSize() { return _a.struct.size; }
}
exports.S = S;

_a = S;

S.SpinCheck = [[]]; // 2 major, 3 minor

// Load the JSON file and convert it to the pieceStruct
S.struct = (() => {
	return {
		size: SJson_json.default.size,
		nbBlocks: SJson_json.default.nbBlocks,
		north: _a.convertBlock(SJson_json.default.north),
		east: _a.convertBlock(SJson_json.default.east),
		south: _a.convertBlock(SJson_json.default.south),
		west: _a.convertBlock(SJson_json.default.west)
	};
})();
