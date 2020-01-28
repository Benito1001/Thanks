import Rect from "./rectangle.js";

export default class Rock {
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
		this.tile = document.getElementById("stoneTile");
		this.property = "solid";
		this.type = "rock";
		this.dead = false;
		this.colliding = true;
		this.hitbox = [new Rect(this.x, this.y, this.width, this.height)]
		//draw
		for (let i = 0; i < this.tileHeight; i++) {
			let fromEdge = this.width/2-(this.width/2)/(this.tileHeight/(i+1));
			let trueWidth = (this.width-(this.width-(this.width)/(this.tileHeight/(i+1))));
			this.hitbox.push(new Rect(this.x+fromEdge, this.y+i*15, trueWidth, 16));
			for (let n = 0; n < (Math.floor(trueWidth/15) == 0 ? 1 : Math.floor(trueWidth/15)); n++) {
				fakeCtx.drawImage(this.tile, fromEdge+n*15, i*15, 15*((Math.floor(trueWidth/15) == 0 ? 0 : 1)+((trueWidth/15))-Math.floor(trueWidth/15)), 16);
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
