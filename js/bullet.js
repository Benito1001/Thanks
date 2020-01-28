import {randomInt, getRandomInt, hitboxCollideX, hitboxCollideY} from "./utils.js";
import Vecc from "./vectorz.js";
import Rect from "./rectangle.js";

export default class Bullet {
	constructor(x, y, vecc) {
		this.x = x;
		this.y = y;
		this.vel = vecc;
		this.width = 10;
		this.height = 10;
		this.property = "transparent";
		this.type = "bullet";
		this.mass = 5;
		this.dead = false;
		this.colliding = true;
		this.dragCoefficient = 0.47;
		this.hitbox = [new Rect(this.x, this.y, this.width, this.height),
									 new Rect(this.x, this.y, this.width, this.height)];
		this.inWallLogic = {toOut: 0, movedOut: 0};
	}
	update(entities, ctx, dt) {
		this.updateX(entities, ctx, dt);
		this.updateY(entities, ctx, dt);
	}

	updateX(entities, ctx, dt) {
		this.hitbox[0].x = this.x;
		this.hitbox[1].x = this.x;
		this.moveX(dt);
		this.collidesWithX(entities, dt);
	}

	updateY(entities, ctx, dt) {
		this.hitbox[0].y = this.y;
		this.hitbox[1].y = this.y;
		this.moveY(dt);
		this.collidesWithY(entities, dt);
	}

	draw(ctx) {
		ctx.drawImage(document.getElementById('bullet'), this.x, this.y, this.width, this.height);
	}

	moveX(dt) {
		this.x += this.vel.x * dt;
	}
	moveY(dt) {
		this.y += this.vel.y * dt;
		this.vel.y += 9.81/50 * dt;
	}

	collidesWithX(entities, dt) {
		for (var i in entities) {
			if (hitboxCollideX(this, entities[i])) {
				if (entities[i].property == "solid") {
					this.dead = true;
				}
				if (entities[i].type == "enemy" || entities[i].type == "boss" || entities[i].type == "chopper") {
					entities[i].hp -= 1;
				}
				else if (entities[i].type == "trigger") {
					entities[i].trigger(entities);
				}
				else if (entities[i].type == "tank") {
					entities[i].hp -= 1;
				}
				else if (entities[i].type == "egg") {
					entities[i].activated = true;
				}
			}
		}
	}
	collidesWithY(entities, dt) {
		for (var i in entities) {
			if (hitboxCollideY(this, entities[i])) {
			}
		}
	}
}
