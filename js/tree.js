import Rect from "./rectangle.js";

export default class Tree {
	constructor(x, y, size) {
		this.x = x;
		this.y = y;
		this.width = size;
		this.texture = document.getElementById('treeShort');
		this.height = this.width * (this.texture.height/this.texture.width);
		this.tileSize = this.width/31;
		this.property = "solid";
		this.type = "tree";
		this.dead = false;
		this.colliding = true;
		this.onGround = false;
		this.dying = false;
		this.hitbox = [];
		this.makeHitbox();
	}
	update(entities, ctx, dt) {
		this.updateX(entities, ctx, dt);
		this.updateY(entities, ctx, dt);
	}

	updateX(entities, ctx, dt) {
	}

	updateY(entities, ctx, dt) {
	}

	draw(ctx) {
		ctx.drawImage(this.texture, this.x, this.y, this.width, this.height);
	}

	makeHitbox() {
		//BoundingBox
		this.hitbox.push(new Rect(this.x, this.y, this.width, this.height));
		//treetop
		this.hitbox.push(new Rect(this.x+8*this.tileSize, this.y, this.width-18*this.tileSize, this.tileSize));
		this.hitbox.push(new Rect(this.x+7*this.tileSize, this.y+this.tileSize*1, this.width-15*this.tileSize, this.tileSize));
		this.hitbox.push(new Rect(this.x+5*this.tileSize, this.y+this.tileSize*2, this.width-11*this.tileSize, this.tileSize));
		this.hitbox.push(new Rect(this.x+4*this.tileSize, this.y+this.tileSize*3, this.width-9*this.tileSize, this.tileSize));
		this.hitbox.push(new Rect(this.x+3*this.tileSize, this.y+this.tileSize*4, this.width-7*this.tileSize, this.tileSize));
		this.hitbox.push(new Rect(this.x+3*this.tileSize, this.y+this.tileSize*5, this.width-6*this.tileSize, this.tileSize));
		this.hitbox.push(new Rect(this.x+2*this.tileSize, this.y+this.tileSize*6, this.width-5*this.tileSize, this.tileSize));
		this.hitbox.push(new Rect(this.x+1*this.tileSize, this.y+this.tileSize*7, this.width-3*this.tileSize, this.tileSize));
		this.hitbox.push(new Rect(this.x+1*this.tileSize, this.y+this.tileSize*8, this.width-2*this.tileSize, this.tileSize*2));
		//treebottom
		this.hitbox.push(new Rect(this.x, this.y+10*this.tileSize, this.width, 17*this.tileSize));
		//stump
		this.hitbox.push(new Rect(this.x+14*this.tileSize, this.y+27*this.tileSize, this.width-23*this.tileSize, this.height-27*this.tileSize));
	}
}
