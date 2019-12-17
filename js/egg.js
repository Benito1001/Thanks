import {randomInt, colliding} from "./utils.js";
import Vine from "./vine.js";
import Rect from "./rectangle.js";

export default class Egg {
	constructor(x, y, width, height, tile) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.texture = document.getElementById("egg");
		this.property = "solid";
		this.type = "egg";
		this.dead = false;
		this.colliding = true;
		this.activated = false;
		this.raid = false;
		this.n = 0;
		this.hitbox =[new Rect(this.x, this.y, this.width, this.height),
									new Rect(this.x, this.y, this.width, this.height)];
	}
	update(entities, ctx, dt) {
		this.updateX(entities, ctx, dt);
		this.updateY(entities, ctx, dt);
	}

	updateX(entities, ctx, dt) {
		if (this.activated) {
			if (!this.raid) {
				for (var i in entities) {
					if (colliding(this.x, 1, entities[i].x, entities[i].width,
						this.y+this.height+this.n, 1, entities[i].y, entities[i].height)) {
						if (entities[i].type == "solid") {
							this.toGround = this.n;
							this.raid = true;
							entities.push(new Vine(this.x, this.y+this.height-1500, this.width, this.toGround+1500));
							this.dead = true;
						}
					}
				}
				this.n += 40;
			}
		}
	}

	updateY(entities, ctx, dt) {

	}

	draw(ctx, dt) {
		ctx.drawImage(this.texture, this.x, this.y, this.width, this.height);
	}
}
