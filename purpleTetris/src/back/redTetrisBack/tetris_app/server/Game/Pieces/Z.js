"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
	return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Z = void 0;

const { ATetrimino } = require("../ATetrimino");
const { Pos } = require("../Pos");
const ZJson_json = __importDefault(require("./ZJson.json"));


class Z extends ATetrimino {

	constructor(rotationType, coordinates = new Pos(0, 0), texture = "Z") {
		super(rotationType, "Z", coordinates, texture);
	}

	getSpinSpecific(matrix, major, minor, rotationPointUsed) {
		if (rotationPointUsed === -1)
			return "-1";
		if (this.canFall(matrix))
			return "";
		if (this.canSlide(matrix) || !this.isColliding(matrix, new Pos(0, -1)))
			return "";
		return "Mini Z-Spin";
	}

	getSize() { return _a.struct.size; }
}
exports.Z = Z;

_a = Z;

Z.SpinCheck = [[]]; // 2 major, 3 minor

// Load the JSON file and convert it to the pieceStruct
Z.struct = (() => {
	return {
		size: ZJson_json.default.size,
		nbBlocks: ZJson_json.default.nbBlocks,
		north: _a.convertBlock(ZJson_json.default.north),
		east: _a.convertBlock(ZJson_json.default.east),
		south: _a.convertBlock(ZJson_json.default.south),
		west: _a.convertBlock(ZJson_json.default.west)
	};
})();
