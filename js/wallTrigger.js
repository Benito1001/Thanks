import {randomInt} from "./utils.js";
import Rect from "./rectangle.js";
import Wall from "./wall.js";

export default class WallTrigger {
	constructor(entities, id, x, y, width, height, wx, wy, wWidth, wHeight) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.wx = wx;
		this.wy = wy;
		this.wWidth = wWidth;
		this.wHeight = wHeight;
		this.id = id;
		this.texture = document.getElementById('button');
		this.property = "solid";
		this.type = "trigger";
		this.dead = false;
		this.colliding = true;
		this.hitbox =[new Rect(this.x, this.y, this.width, this.height),
									new Rect(this.x, this.y, this.width, this.height)];
		entities.push(new Wall(this.wx, this.wy, this.wWidth, this.wHeight, id));
	}

	update(entities, ctx, dt) {
	}

	draw(ctx, dt) {
		ctx.drawImage(this.texture, this.x, this.y, this.width, this.height);
	}

	trigger(entities, enemyId) {
		for (var i in entities) {
			if (entities[i].type == "wall") {
				if (entities[i].id == this.id) {
					entities[i].dead = true;
				}
			}
		}
		this.dead = true;
	}
}
