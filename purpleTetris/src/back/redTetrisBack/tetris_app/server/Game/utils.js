"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.delay = exports.clamp = exports.mod = void 0;

const mod = (x, n) => {
	if (x < 0)
		return (n - (-x % n)) % n;
	return x % n;
};
exports.mod = mod;

const clamp = (value, min, max) => {
	return Math.max(min, Math.min(value, max));
};
exports.clamp = clamp;

const delay = async (ms) => {
	return new Promise(res => setTimeout(res, ms));
};
exports.delay = delay;
