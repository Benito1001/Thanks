import {randomInt} from "./utils.js";
import Rect from "./rectangle.js";
import Vecc from "./vectorz.js";
import Level from "./level.js";

export default class Platform {
	constructor(x, y, width, height, tile, span, type) {
		this.collide = true;
		this.fakeCanvas = document.createElement("canvas");
		var fakeCtx = this.fakeCanvas.getContext("2d");
		this.x = x;
		this.origin =  new Vecc(x, y);
		this.y = y;
		this.width = width;
		this.height = height;
		this.span = span;
		this.travelDistance = span;
		this.platformType = type;
		this.vel = new Vecc(0, 0);
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
		this.type = "platform";
		this.dead = false;
		this.colliding = true;
		this.activated = false;
		this.dty = 0;
		this.prevY = 0;
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
		this.x += this.vel.x*dt;
		if (this.platformType == "slide") {
			this.slide(dt)
		}
		else if (this.platformType == "loop") {
			this.loop(entities, ctx, dt)
		}
	}

	updateY(entities, ctx, dt) {
		this.dty = this.y - this.prevY;
		if (this.dty < -15) {
			this.dty = -3;
		}
		this.y += this.vel.y*dt;
		this.prevY = this.y;
	}

	draw(ctx, dt) {
		ctx.drawImage(this.fakeCanvas, this.x, this.y, this.fakeCanvas.width, this.fakeCanvas.height);
	}

	platformify() {
		if (this.platformType == "slide") {
			this.vel.x = 20;
			this.vel.y = 0;
		}
		if (this.platformType == "loop") {
			this.vel.x = 0.05;
		}
	}

	slide(dt) {
		this.travelDistance -= this.vel.x*dt
		if (this.travelDistance <= 0) {
			this.vel.x = 0;
			this.vel.y = 0;
		}
	}

	loop(entities, ctx, dt) {
		ctx.beginPath();
		ctx.moveTo(this.x + this.width/2, this.y + this.height/2);
		ctx.lineTo(this.origin.x + this.width/2 + this.span/2, this.origin.y + this.height/2);
		ctx.lineWidth = 10;
		ctx.closePath();
		ctx.stroke();
		if (this.vel.x > 0 && this.travelDistance > this.span/2-this.span/355) {
			this.vel.x += 0.05*dt;
		}
		else if (this.travelDistance < this.span/2) {
			this.vel.x -= 0.05*dt;
		}
		if (this.span == 710) {
		}
		if (this.vel.x < 0) {
			this.vel.x = 0;
		}
		this.travelDistance -= this.vel.x*dt
		if (this.travelDistance <= 0) {
			this.travelDistance = 0;
			this.vel.x = 0;
			this.vel.y = 0;
		}
		this.y = this.origin.y+(Math.sqrt(-Math.pow((this.span-this.travelDistance)-this.span/2, 2) + Math.pow(this.span/2, 2)));
	}
}
