"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
	return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.T = void 0;

const { ATetrimino } = require("../ATetrimino");
const { Pos } = require("../Pos");
const TJson_json = __importDefault(require("./TJson.json"));


class T extends ATetrimino {

	constructor(rotationType, coordinates = new Pos(0, 0), texture = "T") {
		super(rotationType, "T", coordinates, texture);
	}

	getSpinSpecific(matrix, major, minor, rotationPointUsed) {
		if (rotationPointUsed === -1)
			return "-1";
		if (this.canFall(matrix))
			return "";
		if (major >= 2 && minor >= 1)
			return "T-Spin";
		if (minor >= 2 && minor >= 1 && rotationPointUsed === 4)
			return "T-Spin";
		if (minor >= 2 && major >= 1)
			return "Mini T-Spin";
		if (minor >= 1 && major >= 1 && !this.canSlide(matrix) && this.isColliding(matrix, new Pos(0, -1)))
			return "Mini T-Spin";
		return "";
	}

	getSize() { return _a.struct.size; }
}
exports.T = T;

_a = T;

T.SpinCheck = [
	[0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0],
	[0, 0, 2, 1, 2, 0, 0],
	[0, 0, 1, 1, 1, 0, 0],
	[0, 0, 3, 0, 3, 0, 0],
	[0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0],
]; // 2 : Major for T-Spin, 3 : Minor

// Load the JSON file and convert it to the pieceStruct
T.struct = (() => {
	return {
		size: TJson_json.default.size,
		nbBlocks: TJson_json.default.nbBlocks,
		north: _a.convertBlock(TJson_json.default.north),
		east: _a.convertBlock(TJson_json.default.east),
		south: _a.convertBlock(TJson_json.default.south),
		west: _a.convertBlock(TJson_json.default.west)
	};
})();
