"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mino = void 0;


class Mino {

	constructor(texture = "EMPTY", isSolid = false) {
		this.texture = texture;
		this.solid = isSolid;
		if (this.texture === "EMPTY")
			this.solid = false;
		this.isShadow = false;
		this.shouldRemove = false;
	}

	toJSON() {
		return { texture: this.texture };
	}

	getTexture() { return this.texture; }
	setTexture(texture) {
		this.texture = texture;
		if (this.texture === "EMPTY")
			this.solid = false;
	}

	isSolid() { return this.solid; }
	setSolid(isSolid) { this.solid = isSolid; }

	getShouldRemove() { return this.shouldRemove; }
	setShouldRemove(shouldRemove) { this.shouldRemove = shouldRemove; }

	getIsShadow() { return this.isShadow; }
	setShadow(isShadow) { this.isShadow = isShadow; }

	isEmpty() { return this.texture === "EMPTY"; }

	reset() {
		this.texture = "EMPTY";
		this.solid = false;
		this.isShadow = false;
		this.shouldRemove = false;
	}
}
exports.Mino = Mino;
