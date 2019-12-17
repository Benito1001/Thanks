import {randomInt, getRandomInt, hitboxCollideX, hitboxCollideY, colliding} from "./utils.js";
import Vecc from "./vectorz.js";
import Rect from "./rectangle.js";

export default class Bomb {
	constructor(x, y, vecc, damage) {
		this.x = x;
		this.y = y;
		this.vel = new Vecc(vecc.x, vecc.y);
		this.damage = damage;
		this.width = 60;
		this.height = 60;
		this.property = "transparent";
		this.type = "bomb";
		this.mass = 5;
		this.dead = false;
		this.colliding = true;
		this.dragCoefficient = 0.47;
		this.hitbox = [new Rect(this.x, this.y, this.width, this.height),
									 new Rect(this.x, this.y, this.width, this.height)];
		this.animationTimer = 0;
		this.animationSpeed = 60;
		this.animationFrames = 20;
		this.boomed = false;
		this.inWallLogic = {toOut: 0, movedOut: 0};
	}
	update(entities, ctx, dt) {
		if (!this.dying) {
			this.updateX(entities, ctx, dt);
			this.updateY(entities, ctx, dt);
		}
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

	draw(ctx, dt, entities) {
		if (!this.dying) {
			ctx.drawImage(document.getElementById('bomb'), this.x, this.y, this.width, this.height);
		}
		//explode
		if (this.dying) {
			var explosionRad = 80;
			this.animationTimer += 1 *dt;
			ctx.drawImage(document.getElementById('booster'),
										Math.floor(this.animationTimer/(this.animationSpeed/this.animationFrames))*96,
										0, 96, 96, this.x+this.width/2-96, this.y+this.height/2-96, explosionRad*2, explosionRad*2);
			if (this.animationTimer > 2 && !this.boomed) {
				for (var i in entities) {
					if (colliding(this.hitbox[0].x-explosionRad, this.hitbox[0].width+explosionRad*2, entities[i].hitbox[0].x, entities[i].hitbox[0].width,
												this.hitbox[0].y-explosionRad, this.hitbox[0].height+explosionRad*2, entities[i].hitbox[0].y, entities[i].hitbox[0].height)) {
						if (entities[i].type == "tank") {
							entities[i].hp -= 1;
						}
					}
				}
				this.boomed = true;
			}
			if (this.animationTimer > this.animationSpeed) {
				this.dead = true;
				this.animationTimer = 0;
			}
		}
	}

	explode(entities, ctx, dt) {

	}

	moveX(dt) {
		this.x += this.vel.x * dt;
	}
	moveY(dt) {
		this.y += this.vel.y * dt;
		this.vel.y += 9.81/40;
	}

	collidesWithX(entities, dt) {
		for (var i in entities) {
			if (hitboxCollideX(this, entities[i])) {
			}
		}
	}
	collidesWithY(entities, dt) {
		for (var i in entities) {
			if (hitboxCollideY(this, entities[i])) {
				if (entities[i].property == "solid" && entities[i].type != "chopper") {
					this.dying = true;
					this.vel.set(0, 0);
					this.colliding = false;
				}
				if (entities[i].type == "tank") {
					entities[i].hp -= this.damage;
				}
			}
		}
	}
}
