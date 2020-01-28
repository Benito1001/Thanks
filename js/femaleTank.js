import {hitboxCollideX, hitboxCollideY} from "./utils.js";
import Vecc from "./vectorz.js";
import Rect from "./rectangle.js";

export default class FemaleTank {
	constructor(x, y) {
		this.collide = true;
		this.x = x;
		this.y = y;
		this.vel = new Vecc(0, 0);
		this.width = 140;
		this.texture = document.getElementById('femaleTank');
		this.height = this.width * (this.texture.height/this.texture.width);
		this.tileHeight = 22;
		this.tileWidth = 37;
		this.tileSize = this.width/this.tileWidth;
		this.property = "transparent";
		this.type = "female";
		this.dead = false;
		this.colliding = true;
		this.maxHp = 10;
		this.hp = this.maxHp;
		this.hpMargin = 20;
		this.hpBarHeight = 20;
		this.hitbox = [
			new Rect(this.x, this.y, this.width, this.height),
			new Rect(this.x, this.y, this.width, this.height)
		];
	}

	update(entities, ctx, dt) {
		this.updateX(entities, ctx, dt);
		this.updateY(entities, ctx, dt);
		if (this.hp == 0) {
			this.dead = true;
		}
	}

	updateX(entities, ctx, dt) {
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

	draw(ctx, dt) {
		ctx.drawImage(this.texture, this.x, this.y, this.width, this.height);
	}

	moveX(dt) {
		this.x += this.vel.x * dt;
	}
	moveY(dt) {
		this.y += this.vel.y * dt;
	}

	collidesWithX(entities, dt) {
		if (this.x < 0) {
			this.x = 0;
			this.vel.x = 0;
		}
		for (var i in entities) {
			if (hitboxCollideX(this, entities[i])) {
			}
		}
	}
	collidesWithY(entities, dt) {
		this.onGround = false;
		for (var i in entities) {
			if (hitboxCollideY(this, entities[i])) {
			}
		}
	}

	updateHitbox(type) {
		if (type == "x") {
			this.hitbox[0].x = this.x;
			this.hitbox[1].x = this.x;
		} else {
			this.hitbox[0].y = this.y;
			this.hitbox[1].y = this.y;
		}
	}
}
