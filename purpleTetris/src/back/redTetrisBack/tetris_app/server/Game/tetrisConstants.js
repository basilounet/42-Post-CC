"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FIXED_GOAL_SYSTEM = exports.VARIABLE_GOAL_SYSTEM = exports.GARBAGE_CALCULUS = exports.MULTIPLIER_COMBO_GARBAGE_TABLE = exports.B2B_EXTRA_GARBAGE = exports.STANDARD_COMBO_TABLE = exports.STANDARD_COMBO_SCORING = exports.SCORE_CALCULUS = exports.SCORING = exports.HARD_DROP_SPEED = exports.SOFT_DROP_SPEED = exports.FALL_SPEED = exports.MIN_LEVEL = exports.MAX_LEVEL = exports.BUFFER_HEIGHT = exports.BUFFER_WIDTH = exports.TETRIS_HEIGHT = exports.TETRIS_WIDTH = exports.WEST = exports.SOUTH = exports.EAST = exports.NORTH = exports.ROTATIONS = void 0;

const utils = require("./utils");


exports.ROTATIONS = ["north", "east", "south", "west"];
exports.NORTH = 0;
exports.EAST = 1;
exports.SOUTH = 2;
exports.WEST = 3;
exports.TETRIS_WIDTH = 10;
exports.TETRIS_HEIGHT = 20;
exports.BUFFER_WIDTH = exports.TETRIS_WIDTH;
exports.BUFFER_HEIGHT = 20;
exports.MAX_LEVEL = 15;
exports.MIN_LEVEL = 1;

const FALL_SPEED = (level) => {
	return Math.round(Math.pow(0.8 - ((level - 1) * 0.007), level - 1) * 1000);
};
exports.FALL_SPEED = FALL_SPEED;

const SOFT_DROP_SPEED = (level) => {
	return utils.clamp(Math.round((0, exports.FALL_SPEED)(level) / 20), 1, 1000);
};
exports.SOFT_DROP_SPEED = SOFT_DROP_SPEED;

exports.HARD_DROP_SPEED = 0.1;
exports.SCORING = {
	"Zero": 0,
	"Single": 100,
	"Double": 300,
	"Triple": 500,
	"Quad": 800,
	"Spin Zero": 400,
	"Spin Single": 800,
	"Spin Double": 1200,
	"Spin Triple": 1600,
	"Spin Quad": 1600,
	"Mini Spin Zero": 100,
	"Mini Spin Single": 200,
	"Mini Spin Double": 400,
	"Mini Spin Triple": 800,
	"Mini Spin Quad": 1600,
	"Perfect Clear": 3500,
	"Back-to-Back Bonus": 1.5,
	"normal Drop": 0,
	"soft Drop": 1,
	"hard Drop": 2,
};

const SCORE_CALCULUS = (score, level, isB2B) => {
	// remove the "T-" / "Z-" / "L-" / "J-" / "S-" / "I-"
	if (score.includes("Spin"))
		score = score.substring(0, score.indexOf("Spin") - 2) + score.substring(score.indexOf("Spin"));
	if (exports.SCORING[score] === undefined || score === "Zero")
		return 0;
	if (score === "normal Drop" || score === "soft Drop" || score === "hard Drop")
		return exports.SCORING[score];
	if (isB2B)
		return exports.SCORING[score] * level * exports.SCORING["Back-to-Back Bonus"];
	return exports.SCORING[score] * level;
};
exports.SCORE_CALCULUS = SCORE_CALCULUS;

const STANDARD_COMBO_SCORING = (combo, level) => {
	return 50 * (utils.clamp(combo, -1, combo) + 1) * level;
};
exports.STANDARD_COMBO_SCORING = STANDARD_COMBO_SCORING;

exports.STANDARD_COMBO_TABLE = [
	0,
	0,
	1,
	1,
	2,
	2,
	3,
	3,
	4,
	4,
	4,
	5,
	5,
	5
];
const B2B_EXTRA_GARBAGE = (B2B) => {
	if (B2B < 2)
		return 0;
	if (B2B < 4)
		return 1;
	if (B2B < 9)
		return 2;
	if (B2B < 25)
		return 3;
	if (B2B < 68)
		return 4;
	if (B2B < 185)
		return 5;
	if (B2B < 505)
		return 6;
	if (B2B < 1371)
		return 7;
	return 8;
};
exports.B2B_EXTRA_GARBAGE = B2B_EXTRA_GARBAGE;

exports.MULTIPLIER_COMBO_GARBAGE_TABLE = {
	"Single": [0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3],
	"Double": [1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 6],
	"Triple": [2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12],
	"Quad": [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
	"Mini Spin Single": [0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3],
	"Mini Spin Double": [1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 6],
	"Mini Spin Triple": [2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12],
	"Mini Spin Quad": [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
	"T-Spin Single": [2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12],
	"T-Spin Double": [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
	"T-Spin Triple": [6, 7, 9, 10, 12, 13, 15, 16, 18, 19, 21, 23, 24, 25, 27, 28, 30, 31, 33, 34, 36],
};

const GARBAGE_CALCULUS = (clear, combo, B2B, table) => {
	if (clear.includes("Zero") || combo < 0)
		return 0;
	if (clear === "Perfect Clear")
		return 10;
	// remove the "Z-" / "L-" / "J-" / "S-" / "I-" / "Mini T-", not "T-Spin"
	if (clear.includes("Mini"))
		clear = clear.substring(0, clear.indexOf("Spin") - 2) + clear.substring(clear.indexOf("Spin"));
	if (!table[clear])
		return 0;
	return table[clear][utils.clamp(combo, 0, table[clear].length - 1)] + exports.B2B_EXTRA_GARBAGE(B2B);
};
exports.GARBAGE_CALCULUS = GARBAGE_CALCULUS;

exports.VARIABLE_GOAL_SYSTEM = [
	0, // start at level 1 so we can use 1 as the index
	5,
	15,
	30,
	50,
	75,
	105,
	140,
	180,
	225,
	275,
	330,
	390,
	455,
	525,
	600
];
exports.FIXED_GOAL_SYSTEM = [
	0, // start at level 1 so we can use 1 as the index
	10,
	20,
	30,
	40,
	50,
	60,
	70,
	80,
	90,
	100,
	110,
	120,
	130,
	140,
	150,
];
