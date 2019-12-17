import {randomInt} from "./utils.js";
import Rect from "./rectangle.js";

export default class Slope {
	constructor(x, y, width, height, direction) {
		this.fakeCanvas = document.createElement("canvas");
		var fakeCtx = this.fakeCanvas.getContext("2d");
		this.direction = direction;
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
		this.tile = document.getElementById("stoneTile");
		this.property = "solid";
		this.type = "rock";
		this.dead = false;
		this.colliding = true;
		this.hitbox = [new Rect(this.x, this.y, this.width, this.height)]
		//draw
		for (let i = 0; i < this.tileHeight; i++) {
			if (this.direction == "left") {
				this.hitbox.push(new Rect(this.x, this.y+i*15, (i+1)*15, 16));
			} else {
				this.hitbox.push(new Rect(this.x+this.width-(i+1)*15, this.y+i*15, (i+1)*15, 16));
			}
			for (let n = 0; n < i+1; n++) {
				if (this.direction == "left") {
					fakeCtx.drawImage(this.tile, n*15, i*15, 16, 16);
				} else {
					fakeCtx.drawImage(this.tile, this.width-(n+1)*15, i*15, 16, 16);
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
		ctx.fillStyle = "rgb(0, 0, 0)";
		ctx.drawImage(this.fakeCanvas, this.x, this.y, this.fakeCanvas.width, this.fakeCanvas.height);
	}
}
