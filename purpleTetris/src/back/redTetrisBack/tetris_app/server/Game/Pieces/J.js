"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
	return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.J = void 0;

const { ATetrimino } = require("../ATetrimino");
const { Pos } = require("../Pos");
const JJson_json = __importDefault(require("./JJson.json"));


class J extends ATetrimino {

	constructor(rotationType, coordinates = new Pos(0, 0), texture = "J") {
		super(rotationType, "J", coordinates, texture);
	}

	getSpinSpecific(matrix, major, minor, rotationPointUsed) {
		if (rotationPointUsed === -1)
			return "-1";
		if (this.canFall(matrix))
			return "";
		if (this.canSlide(matrix) || !this.isColliding(matrix, new Pos(0, -1)))
			return "";
		return "Mini J-Spin";
	}

	getSize() { return _a.struct.size; }
}
exports.J = J;

_a = J;

J.SpinCheck = [[]]; // 2 major, 3 minor

// Load the JSON file and convert it to the pieceStruct
J.struct = (() => {
	return {
		size: JJson_json.default.size,
		nbBlocks: JJson_json.default.nbBlocks,
		north: _a.convertBlock(JJson_json.default.north),
		east: _a.convertBlock(JJson_json.default.east),
		south: _a.convertBlock(JJson_json.default.south),
		west: _a.convertBlock(JJson_json.default.west)
	};
})();
