import {randomInt, getRandomInt, colliding} from "./utils.js";
import Rect from "./rectangle.js";
import Vecc from "./vectorz.js";

export default class HealthPack {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.vel = new Vecc(0, 0);
		this.texture = document.getElementById('healthPack');
		this.width = this.texture.width;
		this.height = this.texture.height;
		this.type = "healthPack";
		this.dead = false;
		this.colliding = true;
		this.hitbox = [new Rect(this.x, this.y, this.width, this.height),
									 new Rect(this.x, this.y, this.width, this.height)];
	}
	update(entities, ctx, dt) {
		this.updateX(entities, ctx, dt);
		this.updateY(entities, ctx, dt);
	}

	updateX(entities, ctx, dt) {
	}

	updateY(entities, ctx, dt) {
		this.vel.y += 1 * dt;
		this.y += this.vel.y * dt;
		this.collidesWithY(entities, dt);
	}

	draw(ctx, dt) {
		ctx.drawImage(this.texture, this.x, this.y, this.width, this.height);
	}

	collidesWithY(entities, dt) {
		for (var i in entities) {
			if (colliding(this.x, this.width, entities[i].x, entities[i].width,
										this.y, this.height, entities[i].y, entities[i].height,
										entities[i].colliding)) {
				if (entities[i].type == "level") {
					if (this.y+this.height/2 < entities[i].y+entities[i].height) {
						this.y = entities[i].y - this.height;
						this.vel.y = 0;
					}
					else if (this.y+this.height/2 > entities[i].y+entities[i].height) {
						this.y = entities[i].y + entities[i].height;
						this.vel.y = 0;
					}
				}
			}
		}
	}
}
