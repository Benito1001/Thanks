import {randomInt, getRandomInt, hitboxCollideX, hitboxCollideY} from "./utils.js";
import Vecc from "./vectorz.js";
import Rect from "./rectangle.js";

export default class Zebra {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.vel = new Vecc(0, 0);
		this.width = 200;
		this.texture = document.getElementById('zebra');
		this.height = this.width * (this.texture.height/this.texture.width);
		this.tileSize = this.width/47;
		this.property = "solid";
		this.type = "enemy";
		this.direction = "";
		this.moving = "left";
		this.timeSinceMoved = 0;
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
									 new Rect(this.x+11*this.tileSize, this.y+10*this.tileSize,
														this.width-17*this.tileSize, this.height-10*this.tileSize),
									 new Rect(this.x, this.y, 18*this.tileSize, 15*this.tileSize)];
		this.inWallLogic = {toOut: 0, movedOut: 0};
	}
	update(entities, ctx, dt) {
		this.ai();
		this.updateX(entities, ctx, dt);
		this.updateY(entities, ctx, dt);
		this.damage();
	}

	updateX(entities, ctx, dt) {
		if (this.vel.x <= 0) {
			this.direction = "left";
		} else {
			this.direction = "right";
		}
		this.moveX(dt);
		this.updateHitbox("x");
		this.collidesWithX(entities, dt);
		this.updateHitbox("x");
	}
	updateY(entities, ctx, dt) {
		this.moveY(dt);
		this.updateHitbox("y");
		this.collidesWithY(entities, dt);
		this.updateHitbox("y");
	}

	draw(ctx) {
		if (!this.dying) {
			if (this.direction == "left") {
				ctx.drawImage(this.texture, this.x, this.y, this.width, this.height);
			} else {
				ctx.save()
				ctx.translate(this.x+this.width, this.y);
				ctx.scale(-1, 1);
				ctx.drawImage(this.texture, 0, 0, this.width, this.height);
				ctx.restore();
			}
		}
		/*
		ctx.fillStyle = "rgb(0, 0, 0)";
		for (var i = 0; i < this.hitbox.length; i++) {
			ctx.strokeRect(this.hitbox[i].x, this.hitbox[i].y, this.hitbox[i].width, this.hitbox[i].height);
		}
		*/
	}

	moveX(dt) {
		this.x += this.vel.x * dt;
	}
	moveY(dt) {
		this.y += this.vel.y * dt;
		this.vel.y += 1 * dt;
	}

	collidesWithX(entities, dt) {
		for (var i in entities) {
			if (hitboxCollideX(this, entities[i])) {
			}
		}
	}
	collidesWithY(entities, dt) {
		this.onGround = false;
		for (var i in entities) {
			if (hitboxCollideY(this, entities[i])) {
				if (entities[i].type == "tank") {
					if (entities[i].y+entities[i].height/2 < this.y+this.height/2) {
						this.hp = 0;
					}
				}
			}
		}
	}

	damage(ctx) {
		if (this.hp == 1 && this.texture == document.getElementById('zebra')) {
			this.texture = document.getElementById('zebraHurt');
		}
		if (this.hp == 0) {
			this.dead = true;
		}
	}

	ai() {
		var turnTime = 400;
		var speed = 0.1;
		if (this.moving == "left") {
			if (this.vel.x < 0) {
				if (randomInt(turnTime/16, turnTime) > this.timeSinceMoved) {
					this.vel.x -= speed;
					this.timeSinceMoved += 1;
				} else {
					this.moving = "right";
					this.timeSinceMoved = 0;
				}
			} else {
				this.vel.x -= speed;
			}
		} else {
			if (this.vel.x > 0) {
				if (randomInt(turnTime/16, turnTime) > this.timeSinceMoved) {
					this.vel.x += speed;
					this.timeSinceMoved += 1;
				} else {
					this.moving = "left"
					this.timeSinceMoved = 0;
				}
			} else {
				this.vel.x += speed;
			}
		}

		if (randomInt(0, 80) == 3 && this.onGround && this.hp == 2) {
			this.vel.y -= 13;
		}
	}

	updateHitbox(type) {
		if (type == "x") {
			this.hitbox[0].x = this.x;
			if (this.direction == "left") {
				this.hitbox[1].x = this.x+11*this.tileSize
				this.hitbox[2].x = this.x;
			} else {
				this.hitbox[1].x = this.x+7*this.tileSize
				this.hitbox[2].x = this.x+28*this.tileSize;
			}
		} else {
			this.hitbox[0].y = this.y;
			this.hitbox[1].y = this.y+10*this.tileSize;
			this.hitbox[2].y = this.y;
		}
	}
}
