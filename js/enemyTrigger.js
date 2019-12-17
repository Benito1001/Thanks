import {randomInt} from "./utils.js";
import Rect from "./rectangle.js";
import Enemy from "./enemy.js";

export default class EnemyTrigger {
	constructor(x, y, width, height, enemy, enemyType, enemyX, enemyY, enemyAmount) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.enemy = enemy;
		this.enemyType = enemyType;
		this.enemyX = enemyX;
		this.enemyY = enemyY;
		this.enemyAmount = enemyAmount;
		this.texture = document.getElementById('button');
		this.type = "trigger";
		this.dead = false;
		this.colliding = true;
		this.hitbox = [new Rect(this.x, this.y, this.width, this.height),
									 new Rect(this.x, this.y, this.width, this.height)];
	}
	update(entities, ctx, dt) {
	}

	draw(ctx, dt) {
		ctx.drawImage(this.texture, this.x, this.y, this.width, this.height);
	}

	trigger(entities) {
		for (var i = 0; i < this.enemyAmount; i++) {
			if (this.enemyType === "evilTank") {
				entities.push(new this.enemy(this.enemyX+80*(i+1), this.enemyY, 9999, true));
			}
			else if (this.enemyType === "challengeTank") {
				entities.push(new this.enemy(this.enemyX+80*(i+1), this.enemyY, 2, 0, false));
			}
			else {
				entities.push(new this.enemy(this.enemyX+80*(i+1), this.enemyY));
			}
		}
		this.dead = true;
	}
}
