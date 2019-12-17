import {randomInt, getRandomInt, hitboxCollideX, hitboxCollideY} from "./utils.js";
import Vecc from "./vectorz.js";
import Rect from "./rectangle.js";

export default class Enemy {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.vel = new Vecc(-1, 0);
		this.width = 50;
		this.texture = document.getElementById('man');
		this.height = this.width * (this.texture.height/this.texture.width);
		this.property = "solid";
		this.type = "enemy";
		this.mass = 10;
		this.dead = false;
		this.hp =  2;
		this.colliding = true;
		this.deathTimer = 0;
		this.animationSpeed = 40;
		this.animationFrames = 5;
		this.onGround = false;
		this.dying = false;
		this.hitbox = [new Rect(this.x, this.y, this.width, this.height),
									 new Rect(this.x, this.y, this.width, this.height)];
		this.inWallLogic = {toOut: 0, movedOut: 0};
	}
	update(entities, ctx, dt) {
		this.updateX(entities, ctx, dt);
		this.updateY(entities, ctx, dt);
	}

	updateX(entities, ctx, dt) {
		if (!this.dying) {
			this.moveX(dt);
		}
		this.hitbox[0].x = this.x;
		this.hitbox[1].x = this.x;
		this.collidesWithX(entities, dt);
		this.damage(ctx)
	}
	updateY(entities, ctx, dt) {
		if (randomInt(0, 80) == 3 && this.onGround && this.hp == 2) {
			this.vel.y -= 10;
		}
		if (!this.dying) {
			this.moveY(dt);
		}
		this.hitbox[0].y = this.y;
		this.hitbox[1].y = this.y;
		this.collidesWithY(entities, dt);
	}

	draw(ctx) {
		if (!this.dying) {
			ctx.drawImage(this.texture, this.x, this.y, this.width, this.height);
		}
	}

	moveX(dt) {
		this.x += this.vel.x * dt;
	}
	moveY(dt) {
		this.vel.y += 1 * dt;
		this.y += this.vel.y * dt;
	}

	collidesWithX(entities, dt) {
		for (var i in entities) {
			if (hitboxCollideX(this, entities[i])) {
				if (entities[i].type == "tank") {
					entities[i].dead = true;
				}
			}
		}
	}
	collidesWithY(entities, dt) {
		this.onGround = false;
		for (var i in entities) {
			if (hitboxCollideY(this, entities[i])) {
				if (entities[i].type == "tank") {
					if (this.y+this.height/2 >= entities[i].y+entities[i].height/2) {
						this.dead = true;
					} else {
						entities[i].dead = true;
					}
				}
			}
		}
	}

	damage(ctx) {
		if (this.hp == 1) {
			this.texture =  document.getElementById('man-au');
		}
		else if (this.hp == 0) {
			this.texture =  document.getElementById('man-rip');
			this.dying = true;
			this.colliding = false;
		}
		if (this.dying) {
			this.deathTimer += 1;
			ctx.drawImage(this.texture, 0,
										Math.floor(this.deathTimer/(this.animationSpeed/this.animationFrames))*(this.texture.height/this.animationFrames),
										this.texture.width, (this.texture.height/this.animationFrames), this.x, this.y, this.width, this.height);
			if (this.deathTimer > this.animationSpeed) {
				this.dead = true;
			}
		}
	}
}
