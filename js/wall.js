import Rect from "./rectangle.js";

export default class Wall {
	constructor(x, y, width, height, id = -1) {
		this.fakeCanvas = document.createElement("canvas");
		var fakeCtx = this.fakeCanvas.getContext("2d");
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.id = id;
		this.tileWidth = Math.round(this.width/15);
		this.tileHeight = Math.round(this.height/15);
		this.width = this.tileWidth*15;
		this.height = this.tileHeight*15;
		this.fakeCanvas.width = this.width;
		this.fakeCanvas.height = this.height;
		this.tile = document.getElementById('stoneTile');
		this.property = "solid";
		this.type = "wall";
		this.dead = false;
		this.colliding = true;
		this.hitbox = [new Rect(this.x, this.y, this.width, this.height),
									 new Rect(this.x, this.y, this.width, this.height)];
		for (var i = 0; i < this.tileHeight; i++) {
			for (var n = 0; n < this.tileWidth; n++) {
				fakeCtx.drawImage(this.tile, n*15, i*15, 16, 16);
			}
		}
	}
	update(entities, ctx, dt) {
	}

	draw(ctx, dt) {
		ctx.drawImage(this.fakeCanvas, this.x, this.y, this.fakeCanvas.width, this.fakeCanvas.height);
	}
}
