import Rect from "./rectangle.js";

export default class Wine {
	constructor(x, y, width, height) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.property = "transparent";
		this.type = "vine";
		this.wine = document.getElementById('vine');
		this.dead = false;
		this.colliding = true;
		this.hitbox =[new Rect(this.x, this.y, this.width, this.height),
									new Rect(this.x, this.y, this.width, this.height)];
	}
	update(entities, ctx, dt) {
	}

	draw(ctx) {
		ctx.drawImage(this.wine, this.x, this.y, this.width, this.height);
	}
}
