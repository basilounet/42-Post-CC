"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
	return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.I = void 0;

const { ATetrimino } = require("../ATetrimino");
const { Pos } = require("../Pos");
const IJson_json = __importDefault(require("./IJson.json"));


class I extends ATetrimino {

	constructor(rotationType, coordinates = new Pos(0, 0), texture = "I") {
		super(rotationType, "I", coordinates, texture);
	}

	getSpinSpecific(matrix, major, minor, rotationPointUsed) {
		if (rotationPointUsed === -1)
			return "-1";
		if (this.canFall(matrix))
			return "";
		if (this.canSlide(matrix) || !this.isColliding(matrix, new Pos(0, -1)))
			return "";
		return "Mini I-Spin";
	}

	getSize() { return _a.struct.size; }
}
exports.I = I;

_a = I;

I.SpinCheck = [[]]; // 2 major, 3 minor

// Load the JSON file and convert it to the pieceStruct
I.struct = (() => {
	return {
		size: IJson_json.default.size,
		nbBlocks: IJson_json.default.nbBlocks,
		north: _a.convertBlock(IJson_json.default.north),
		east: _a.convertBlock(IJson_json.default.east),
		south: _a.convertBlock(IJson_json.default.south),
		west: _a.convertBlock(IJson_json.default.west)
	};
})();
