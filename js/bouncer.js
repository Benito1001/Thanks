import {randomInt} from "./utils.js";
import Rect from "./rectangle.js";

export default class Bouncer {
	constructor(x, y, width, height) {
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
		this.tile = document.getElementById("bouncer")
		this.property = "bounce";
		this.type = "bouncer";
		this.dead = false;
		this.colliding = true;
		this.hitbox = [new Rect(this.x, this.y, this.width, this.height),
									 new Rect(this.x, this.y, this.width, this.height)];
		//draw
		for (var i = 0; i < this.tileHeight; i++) {
			for (var n = 0; n < this.tileWidth; n++) {
				fakeCtx.drawImage(this.tile, (n*15), (i*15), 16, 16);
			}
		}
	}
	update(entities, ctx, dt) {
	}

	draw(ctx, dt) {
		ctx.drawImage(this.fakeCanvas, this.x, this.y, this.fakeCanvas.width, this.fakeCanvas.height);
	}
}
