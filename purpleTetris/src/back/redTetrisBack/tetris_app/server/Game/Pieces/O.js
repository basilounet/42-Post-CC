"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
	return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.O = void 0;

const { ATetrimino } = require("../ATetrimino");
const { Pos } = require("../Pos");
const OJson_json = __importDefault(require("./OJson.json"));


class O extends ATetrimino {

	constructor(rotationType, coordinates = new Pos(0, 0), texture = "O") {
		super(rotationType, "O", coordinates, texture);
	}

	getSpinSpecific(matrix, major, minor, rotationPointUsed) {
		return "";
	}

	getSize() { return _a.struct.size; }
}
exports.O = O;

_a = O;

O.SpinCheck = [[]]; // 2 major, 3 minor
// Load the JSON file and convert it to the pieceStruct

O.struct = (() => {
	return {
		size: OJson_json.default.size,
		nbBlocks: OJson_json.default.nbBlocks,
		north: _a.convertBlock(OJson_json.default.north),
		east: _a.convertBlock(OJson_json.default.east),
		south: _a.convertBlock(OJson_json.default.south),
		west: _a.convertBlock(OJson_json.default.west)
	};
})();
