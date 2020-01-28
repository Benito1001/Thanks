import Rect from "./rectangle.js";

export default class Teleporter {
	constructor(x, y, tpTo) {
		this.x = x;
		this.y = y;
		this.tpTo = tpTo;
		this.form = document.getElementById('tpForm');
		this.texture = document.getElementById('tp'+tpTo);
		this.width = 500;
		this.height = this.width * (this.form.height/this.form.width);
		this.textureSize = this.height*0.75
		this.property = "solid";
		this.type = "teleporter";
		this.dead = false;
		this.colliding = true;
		this.rotate = 0;
		this.hitbox = [
			new Rect(this.x, this.y, this.width, this.height),
			new Rect(this.x, this.y+this.height*0.95, this.width, this.height*0.05),
			new Rect(this.x+this.width*0.15, this.y+this.height*0.9, this.width*0.7, this.height*0.05),
			new Rect(this.x+this.width*0.225, this.y+this.height*0.85, this.width*0.55, this.height*0.05),
			new Rect(this.x+this.width*0.26, this.y+this.height*0.8, this.width*0.48, this.height*0.05),
			new Rect(this.x+this.width*0.4, this.y, this.width*0.2, this.height*0.8)
		];
	}
	update(entities, ctx, dt) {
		this.rotate = this.rotate%360 + 5;
	}

	draw(ctx) {
		ctx.save();
		ctx.translate(this.x+this.width/2, this.y+this.height*0.445);
		ctx.beginPath();
		ctx.moveTo(-0.12*this.width, this.textureSize/2);
		ctx.lineTo(-0.12*this.width, -this.textureSize/2);
		ctx.lineTo(0.12*this.width, -this.textureSize/2);
		ctx.lineTo(0.12*this.width, this.textureSize/2);
		ctx.clip();
		ctx.rotate((this.rotate)*(Math.PI/180));
		ctx.drawImage(this.texture, -this.textureSize/2, -this.textureSize/2, this.textureSize, this.textureSize);
		ctx.restore();
		ctx.drawImage(this.form, this.x, this.y, this.width, this.height);
	}
}
