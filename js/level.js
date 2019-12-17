import {randomInt} from "./utils.js";
import Rect from "./rectangle.js";

export default class Level {
	constructor(x, y, width, height, tile) {
		if (tile == "skyTile") {
			this.collide = false;
		}
		else {
			this.collide = true;
		}
		this.fakeCanvas = document.createElement("canvas");
		var fakeCtx = this.fakeCanvas.getContext("2d");
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.tileWidth = Math.round(this.width/15);
		this.tileHeight = Math.round(this.height/15);
		this.width = this.tileWidth*15;
		this.height = this.tileHeight*15;
		this.fakeCanvas.width = this.width;
		this.fakeCanvas.height = this.height;
		this.tile2 = false;
		this.tile = document.getElementById(tile);
		if (tile == "grassTile") {
			this.tile2 = document.getElementById("groundTile");
		}
		this.property = "solid";
		this.type = "solid";
		this.dead = false;
		this.colliding = true;
		this.hitbox = [new Rect(this.x, this.y, this.width, this.height),
									 new Rect(this.x, this.y, this.width, this.height)];
		//draw
		for (var i = 0; i < this.tileHeight; i++) {
			for (var n = 0; n < this.tileWidth; n++) {
				if (i > 0 && this.tile2) {
					fakeCtx.drawImage(this.tile2, (n*15), (i*15), 16, 16);
				}
				else {
					fakeCtx.drawImage(this.tile, (n*15), (i*15), 16, 16);
				}
			}
		}
	}
	update(entities, ctx, dt) {
		this.updateX(entities, ctx, dt);
		this.updateY(entities, ctx, dt);
	}

	updateX(entities, ctx, dt) {
	}

	updateY(entities, ctx, dt) {
	}

	draw(ctx, dt) {
		ctx.drawImage(this.fakeCanvas, this.x, this.y, this.fakeCanvas.width, this.fakeCanvas.height);
	}
}
