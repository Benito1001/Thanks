import {randomInt, getRandomInt, hitboxCollideX, hitboxCollideY} from "./utils.js";
import Vecc from "./vectorz.js";
import Rect from "./rectangle.js";
import Wall from "./wall.js";

export default class Giraffe {
	constructor(x, y) {
		this.origin = new Vecc(x, y)
		this.x = x;
		this.y = y;
		this.animationX = 0;
		this.animationY = 0;
		this.vel = new Vecc(0, 0);
		this.toTank = new Vecc(0, 0);
		this.point = new Vecc(0, 0);
		this.width = 300;
		this.neckTexture = 'giraffeNeck';
		this.bodyTexture = 'giraffeBody';
		this.tileSize = (this.width)/33;
		this.height = this.width*(
			(document.getElementById(this.bodyTexture).height+document.getElementById(this.neckTexture).height)
			/(document.getElementById(this.bodyTexture).width+document.getElementById(this.neckTexture).width-4.4*this.tileSize)
		);
		this.neckLength = this.tileSize*21;
		this.property = "solid";
		this.type = "boss";
		this.mass = 10;
		this.dead = false;
		this.maxHp = 20;
		this.hp =  this.maxHp;
		this.hpBarHeight = 20;
		this.rotate = 103;
		this.rotateVel = 0;
		this.rotateDirection = "left";
		this.colliding = true;
		this.animate = false;
		this.animationTimer = 0;
		this.animationSpeed = 14*3.5;
		this.animationFrames = 14;
		this.animationTexture = document.getElementById('lightning');
		this.onGround = false;
		this.dying = false;
		this.activated = false;
		this.hitbox = [
			new Rect(this.x, this.y, this.width+10*this.tileSize, this.height-4*this.tileSize),
			new Rect(0, 0, 21*this.tileSize, 17*this.tileSize),
			new Rect(0, 0, 0, 0),
			new Rect(0, 0, 0, 0)
		];
		this.bonking = false;
		this.retractBonk = false;
		this.bonkTimer = 0;
		this.timeSinceBonked = 0;
		this.inWallLogic = {toOut: 0, movedOut: 0};
	}

	update(entities, ctx, dt) {
		if (this.activated) {
			this.ai(entities, dt);
			this.updateX(entities, ctx, dt);
			this.updateY(entities, ctx, dt);
			this.damage(entities, ctx);
		}
		if (!this.activated || this.animate) {
			this.activate(entities, ctx, dt);
		}
	}

	updateX(entities, ctx, dt) {
		if (!this.bonking) {
			this.moveX(dt);
		}
		this.updateHitbox("x");
		this.collidesWithX(entities, dt);
		this.updateHitbox("x");
	}

	updateY(entities, ctx, dt) {
		if (!this.dying) {
			this.moveY(dt);
		}
		this.updateHitbox("y");
		this.collidesWithY(entities, dt);
		this.updateHitbox("y");
	}

	draw(ctx, dt) {
		// lightning
		if (this.animate) {
			this.animationTimer += 1*dt;
			ctx.drawImage(
				this.animationTexture, 0,
				Math.floor(this.animationTimer/(this.animationSpeed/this.animationFrames))*288,
				164, 288, this.animationX, this.animationY+this.width-200*2, 164*2, 288*2
			);
			if (Math.floor(this.animationTimer/(this.animationSpeed/this.animationFrames)) >= 9) {
				this.activated = true;
			}
			if (this.animationTimer > this.animationSpeed) {
				this.animate = false;
				this.animationTimer = 0;
			}
		}

		if (this.activated) {
			//HPbar
			ctx.beginPath();
			ctx.moveTo(-5+this.x, -5+this.y-this.hpBarHeight*2);
			ctx.lineTo(-5+this.x, 5+this.y-this.hpBarHeight*2+this.hpBarHeight);
			ctx.lineTo(5+this.x+this.width, 5+this.y-this.hpBarHeight*2+this.hpBarHeight);
			ctx.lineTo(5+this.x+this.width, -5+this.y-this.hpBarHeight*2);
			ctx.lineTo(-5+this.x, -5+this.y-this.hpBarHeight*2);
			ctx.fillStyle = "rgb(0, 0, 0)";
			ctx.fill();
			ctx.beginPath();
			ctx.moveTo(this.x, this.y-this.hpBarHeight*2);
			ctx.lineTo(this.x, this.y-this.hpBarHeight*2+this.hpBarHeight);
			ctx.lineTo(this.x+this.width-(this.width*(this.maxHp-this.hp))/this.maxHp, this.y-this.hpBarHeight*2+this.hpBarHeight);
			ctx.lineTo(this.x+this.width-(this.width*(this.maxHp-this.hp))/this.maxHp, this.y-this.hpBarHeight*2);
			ctx.lineTo(this.x, this.y-this.hpBarHeight*2);
			ctx.fillStyle = "rgb(255, 0, 0)";
			ctx.fill();

			ctx.drawImage(document.getElementById(this.bodyTexture), this.x+9*this.tileSize, this.y+this.tileSize*26, 24*this.tileSize, 17*this.tileSize);
			ctx.save();
			ctx.translate(this.x+this.tileSize*12, this.y+this.tileSize*26);
			ctx.rotate((90-this.rotate+13)*(Math.PI/180));
			ctx.drawImage(document.getElementById(this.neckTexture), -this.tileSize*12, -this.tileSize*26, this.tileSize*14, this.tileSize*26);
			ctx.restore();

			let x = this.x+this.tileSize*12+this.neckLength*Math.cos(this.rotate*(Math.PI/180));
			let y = this.y+this.tileSize*26-this.neckLength*Math.sin(this.rotate*(Math.PI/180));
			let rotateAmount = -this.rotate-77;
			/*
			//Head
			ctx.beginPath();
			ctx.moveTo(x, y);
			this.point.set(0, -this.tileSize*6);
			this.point.rotate(rotateAmount);
			ctx.lineTo(x+this.point.x, y+this.point.y);
			this.point.set(this.tileSize*7, -this.tileSize*6);
			this.point.rotate(rotateAmount);
			ctx.lineTo(x+this.point.x, y+this.point.y);
			this.point.set(this.tileSize*7, 0);
			this.point.rotate(rotateAmount);
			ctx.lineTo(x+this.point.x, y+this.point.y);
			ctx.lineTo(x, y);
			ctx.fill();
			//Neck
			ctx.beginPath();
			ctx.moveTo(x, y);
			this.point.set(0, -this.neckLength);
			this.point.rotate(rotateAmount);
			ctx.lineTo(x+this.point.x, y+this.point.y);
			this.point.set(-this.tileSize*6, -this.neckLength);
			this.point.rotate(rotateAmount);
			ctx.lineTo(x+this.point.x, y+this.point.y);
			this.point.set(-this.tileSize*6, 0);
			this.point.rotate(rotateAmount);
			ctx.lineTo(x+this.point.x, y+this.point.y);
			ctx.lineTo(x, y);
			ctx.fill();
			//Line
			ctx.beginPath();
			ctx.moveTo(this.x+this.tileSize*12, this.y+this.tileSize*26);
			ctx.lineTo(this.x+this.tileSize*12+this.neckLength*Math.cos(this.rotate*(Math.PI/180)), this.y+this.tileSize*26-this.neckLength*Math.sin(this.rotate*(Math.PI/180)));
			ctx.stroke()
			ctx.fillStyle = "rgb(0, 0, 0)";
			for (let i = 0; i < this.hitbox.length; i++) {
				ctx.strokeRect(this.hitbox[i].x, this.hitbox[i].y, this.hitbox[i].width, this.hitbox[i].height);
			}
			*/
		}
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
					entities[i].dead = true;
				}
			}
		}
	}

	ai(entities, dt) {
		for (var i in entities) {
			if (entities[i].type == "tank") {
				this.toTank.x = (this.x+this.width/4) - (entities[i].x+entities[i].width/2);
				this.toTank.y = (this.y+this.height/2) - (entities[i].y+entities[i].height/2);
			}
		}
		if (!this.bonking) {
			if (randomInt(0, 100) > this.toTank.x/5) {
				this.vel.x += 0.25 * dt;
			} else {
				this.vel.x -= 0.25 * dt;
			}
			if (randomInt(0, 80) == 3 && this.onGround && this.hp == 2) {
				this.vel.y -= 13 * dt;
			}
		}
		if ((this.toTank.x <= this.neckLength) && !this.bonking && this.timeSinceBonked > 60) {
			this.bonking = true;
			this.neckTexture += "Bonk";
		}
		this.bonk(dt);
	}
	bonk(dt) {
		if (this.bonking && this.bonkTimer > (Math.ceil(2*this.hp/this.maxHp)*30)) {
			if (!this.retractBonk) {
				this.rotateVel += 0.5 * dt;
				this.rotate += this.rotateVel * dt;
				if (this.rotate >= 210) {
					this.rotateVel = 0;
					this.retractBonk = true;
				}
			}
			else {
				this.rotateVel -= 0.5 * dt;
				this.rotate += this.rotateVel;
				if (this.rotate <= 103) {
					this.rotate = 103;
					this.rotateVel = 0;
					this.bonking = false;
					this.retractBonk = false;
					this.bonkTimer = 0;
					this.neckTexture = this.neckTexture.replace("Bonk", "");
					this.timeSinceBonked = 0;
					this.vel.x = 0;
				}
			}
		}
		if (this.bonking) {
			this.bonkTimer += 1 * dt;
		} else {
			this.timeSinceBonked += 1 * dt;
		}
	}

	activate(entities, ctx, dt) {
		for (var i in entities) {
			if (entities[i].type == "tank") {
				this.toTank.x = (this.x-this.width) - (entities[i].x);
				this.toTank.y = this.y - entities[i].y;
			}
		}
		if (this.toTank.x < 100 && !this.animate) {
			entities.push(new Wall(this.x-500, -300, 50, 500, "gw"));
			entities.push(new Wall(this.x+500, -300, 50, 500, "gw"));
			this.animate = true;
			this.animationX = this.x;
			this.animationY = this.y;
		}
	}

	damage(entities, ctx) {
		if (this.hp <= this.maxHp/2 && this.neckTexture == 'giraffeNeck') {
			this.neckTexture = 'giraffeNeckHurt';
			this.bodyTexture = 'giraffeBodyHurt';
		}
		if (this.hp == 0) {
			for (var i in entities) {
				if (entities[i].type == "wall" && entities[i].id == "gw") {
					entities[i].dead = true;
				}
			}
			this.dead = true;
		}
	}

	updateHitbox(type) {
		let x = this.x+this.tileSize*12+this.neckLength*Math.cos(this.rotate*(Math.PI/180));
		let y = this.y+this.tileSize*26-this.neckLength*Math.sin(this.rotate*(Math.PI/180));
		let rotateAmount = -this.rotate-77;
		//HeadHitbox
			let box3pos = {};
			//BottomLeft
			box3pos.bottomLeft = {x: x, y: y};
			//TopLeft
			this.point.set(0, -this.tileSize*6);
			this.point.rotate(rotateAmount);
			box3pos.topLeft = {x: x+this.point.x, y: y+this.point.y};
			//TopRight
			this.point.set(this.tileSize*7, -this.tileSize*6);
			this.point.rotate(rotateAmount);
			box3pos.topRight = {x: x+this.point.x, y: y+this.point.y};
			//BottomRight
			this.point.set(this.tileSize*7, 0);
			this.point.rotate(rotateAmount);
			box3pos.bottomRight = {x: x+this.point.x, y: y+this.point.y};

		//NeckHitbox
			let box2pos = {};
			//BottomLeft
			box2pos.bottomLeft = {x: x, y: y};
			//TopLeft
			this.point.set(0, -this.neckLength);
			this.point.rotate(rotateAmount);
			box2pos.topLeft = {x: x+this.point.x, y: y+this.point.y};
			//TopRight
			this.point.set(-this.tileSize*6, -this.neckLength);
			this.point.rotate(rotateAmount);
			box2pos.topRight = {x: x+this.point.x, y: y+this.point.y};
			//BottomRight
			this.point.set(-this.tileSize*6, 0);
			this.point.rotate(rotateAmount);
			box2pos.bottomRight = {x: x+this.point.x, y: y+this.point.y};

		if (type == "x") {
			this.hitbox[1].x = this.x+9*this.tileSize;
			//If in q2 or q4
			if (this.rotate >= 103 && this.rotate <= 103+90 || this.rotate >= 103+90*2 && this.rotate <= 103+90*3) {
				this.hitbox[0].x =  box3pos.topLeft.x+(box3pos.bottomRight.x-box3pos.topLeft.x);
				this.hitbox[2].x = box2pos.bottomLeft.x;
				this.hitbox[2].width = box2pos.topRight.x-box2pos.bottomLeft.x;
				this.hitbox[3].width = box3pos.topLeft.x-box3pos.bottomRight.x;
				this.hitbox[3].x = box3pos.topLeft.x-this.hitbox[3].width;
			} else {
				this.hitbox[0].x = box3pos.bottomLeft.x;
				this.hitbox[2].width = box2pos.topLeft.x-box2pos.bottomRight.x;
				this.hitbox[2].x = box2pos.topLeft.x-this.hitbox[2].width;
				this.hitbox[3].x = box3pos.bottomLeft.x;
				this.hitbox[3].width = box3pos.topRight.x-box3pos.bottomLeft.x;
			}
			this.hitbox[0].width = (this.hitbox[1].x+this.hitbox[1].width)-this.hitbox[0].x;
		} else {
			this.hitbox[1].y = this.y+26*this.tileSize;
			//If in q2 or q4
			if (this.rotate >= 103 && this.rotate <= 103+90 || this.rotate >= 103+90*2 && this.rotate <= 103+90*3) {
				this.hitbox[0].y = box2pos.bottomRight.y;
				this.hitbox[2].y = box2pos.bottomRight.y;
				this.hitbox[2].height = box2pos.topLeft.y-box2pos.bottomRight.y;
				this.hitbox[3].y = box3pos.bottomLeft.y;
				this.hitbox[3].height = box3pos.topRight.y-box3pos.bottomLeft.y;
			} else {
				this.hitbox[0].y = box2pos.bottomLeft.y+(box2pos.topRight.y-box2pos.bottomLeft.y);
				this.hitbox[2].height = box2pos.bottomLeft.y-box2pos.topRight.y;
				this.hitbox[2].y = box2pos.bottomLeft.y-this.hitbox[2].height;
				this.hitbox[3].y = box3pos.bottomRight.y+(box3pos.topLeft.y-box3pos.bottomRight.y);
				this.hitbox[3].height = -(box3pos.topLeft.y-box3pos.bottomRight.y);
			}
			this.hitbox[0].height = (this.hitbox[1].y+this.hitbox[1].height)-this.hitbox[0].y;
		}
	}

	reset(entities) {
		this.x = this.origin.x;
		this.y = this.origin.y;
		for (var i in entities) {
			if (entities[i].type == "wall" && entities[i].id == "gw") {
				entities[i].dead = true;
			}
		}
		this.hp =  this.maxHp;
		this.rotate = 103;
		this.rotateVel = 0;
		this.neckTexture = 'giraffeNeck';
		this.bodyTexture = 'giraffeBody';
		this.rotateDirection = "left";
		this.colliding = true;
		this.animate = false;
		this.animationTimer = 0;
		this.dying = false;
		this.activated = false;
		this.bonking = false;
		this.retractBonk = false;
		this.bonkTimer = 0;
		this.timeSinceBonked = 0;
	}
}
