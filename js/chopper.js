import {randomInt, getRandomInt, hitboxCollideX, hitboxCollideY} from "./utils.js";
import Vecc from "./vectorz.js";
import Rect from "./rectangle.js";
import Wall from "./wall.js";
import Bomb from "./bomb.js";

export default class Chopper {
	constructor(x, y, type, entities) {
		this.chopperType = type;
		this.origin = new Vecc(x, y);
		this.x = x;
		this.y = y;
		this.vel = new Vecc(0, 0);
		this.toTank = new Vecc(0, 0);
		this.width = 300;
		this.texture = document.getElementById('chopper');
		this.rotor = document.getElementById('chopperBlade');
		this.shield = document.getElementById('chopperShield');
		this.rotorRotation = 0;
		this.height = this.width * (this.texture.height/this.texture.width);
		this.tileSize = this.width/47;
		if (this.chopperType == "cutscene") {
			this.property = "transparent";
			this.colliding = false;
		} else {
			this.property = "solid";
			this.colliding = true;
		}
		this.type = "chopper";
		this.dead = false;
		this.maxHp = 20;
		this.hp =  this.maxHp;
		this.hpBarHeight = 20;
		this.deathTimer = 0;
		this.animationSpeed = 20;
		this.animationFrames = 5;
		this.onGround = false;
		this.dying = false;
		this.fighting = false;
		this.drawGrabber = false;
		this.hitbox = [new Rect(this.x, this.y, this.width, this.height),
									 new Rect(this.x, this.y, this.width, this.height)];
		//moving
		this.moving = true;
		for (var i in entities) {
			if (entities[i].type == "female") {
				this.moveToPoint = entities[i].x+entities[i].width/2;
			}
		}
		this.movingLength = this.x+this.width/2-this.moveToPoint;
		//pickUp
		this.toFemale = 0;
		this.hasSucc = false;

		this.sinceBombed = 50;
		this.inWallLogic = {toOut: 0, movedOut: 0};
	}
	update(entities, ctx, dt, scaleFactor) {
		if (this.chopperType == "cutscene") {
			this.cutsceneAi(entities, ctx, dt, scaleFactor);
		} else {
			this.bossAi(entities, ctx, dt)
		}
		this.updateX(entities, ctx, dt);
		this.updateY(entities, ctx, dt);
		this.damage(entities, ctx);
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

	draw(ctx) {
		var rotorLength = this.tileSize*21
		var tilt = this.vel.x;
		this.rotorRotation = this.rotorRotation%360 + 45;
		ctx.save();
		ctx.translate(this.x, this.y);
		ctx.rotate(tilt*(Math.PI/180));
		ctx.drawImage(this.texture, 0, 0, this.width, this.height);
		ctx.drawImage(
			this.rotor, this.tileSize*2+rotorLength*(Math.cos((this.rotorRotation+180)*(Math.PI/180))+1)/4,
			this.tileSize*3, rotorLength*(Math.cos(this.rotorRotation*(Math.PI/180))+1)/2, this.tileSize
		);
		ctx.drawImage(
			this.rotor, this.tileSize*22+rotorLength*(Math.cos((this.rotorRotation+180)*(Math.PI/180))+1)/4,
			0, rotorLength*(Math.cos(this.rotorRotation*(Math.PI/180))+1)/2, this.tileSize
		);
		if (this.chopperType == "boss" && this.fighting) {
			ctx.beginPath();
			ctx.moveTo(-5, -5-this.hpBarHeight*2);
			ctx.lineTo(-5, 5-this.hpBarHeight*2+this.hpBarHeight);
			ctx.lineTo(5+this.width, 5-this.hpBarHeight*2+this.hpBarHeight);
			ctx.lineTo(5+this.width, -5-this.hpBarHeight*2);
			ctx.lineTo(-5, -5-this.hpBarHeight*2);
			ctx.fillStyle = "rgb(0, 0, 0)";
			ctx.fill();
			ctx.beginPath();
			ctx.moveTo(0, -this.hpBarHeight*2);
			ctx.lineTo(0, -this.hpBarHeight*2+this.hpBarHeight);
			ctx.lineTo(0+this.width-(this.width*(this.maxHp-this.hp))/this.maxHp, -this.hpBarHeight*2+this.hpBarHeight);
			ctx.lineTo(0+this.width-(this.width*(this.maxHp-this.hp))/this.maxHp, -this.hpBarHeight*2);
			ctx.lineTo(0, -this.hpBarHeight*2);
			ctx.fillStyle = "rgb(255, 0, 0)";
			ctx.fill();
		}
		ctx.restore();
		if (this.chopperType == "boss" && !this.fighting) {
			ctx.drawImage(this.shield, this.x-9*this.tileSize, this.y-7*this.tileSize, this.shield.width, this.shield.height);
		}
		if (this.drawGrabber) {
			ctx.fillRect(this.x+this.width/2-5, this.y+this.height-7*this.tileSize, 10, this.toFemale)
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
			}
		}
	}

	damage(entities, ctx) {
		if (this.hp == 0) {
			this.dead = true;
			for (var i in entities) {
				if (entities[i].type == "wall" && entities[i].id == "cw") {
					entities[i].dead = true;
				}
			}
		}
	}

	cutsceneAi(entities, ctx, dt, scaleFactor) {
		if (this.moving) {
			this.move(dt);
			this.drawGrabber = false;
		} else if (!this.hasSucc){
			for (var i in entities) {
				if (entities[i].type == "female") {
					this.toFemale = entities[i].y-(this.y+this.height)+7*this.tileSize;
					if (this.toFemale > 8*this.tileSize) {
						entities[i].y -= 2*dt;
					} else {
						this.hasSucc = true;
					}
				}
			}
			this.drawGrabber = true;
		} else {
			this.vel.x += 0.05*dt;
			this.x += this.vel.x*dt;
			this.y -= 1*dt;
			for (var i in entities) {
				if (entities[i].type == "female") {
					this.toFemale = entities[i].y-(this.y+this.height)+7*this.tileSize;
					entities[i].y -= 0.9*dt;
					entities[i].vel.x += 0.1*dt;
					if (this.x > canvas.width/scaleFactor) {
						this.dead = true;
						entities[i].dead = true;
					}
				}
			}
		}
	}
	bossAi(entities, ctx, dt) {
		for (var i in entities) {
			if (entities[i].type == "tank") {
				this.toTank.x = (this.x+this.width/2) - (entities[i].x+entities[i].width/2);
				this.toTank.y = entities[i].y - this.y;
			}
		}
		if (this.toTank.x < 0 && !this.fighting) {
			entities.push(new Wall(this.x+this.width/2+900, -300, 100, 615, "cw"));
			entities.push(new Wall(this.x+this.width/2-1000, -300, 100, 615, "cw"));
			this.fighting = true;
		}
		if (this.fighting) {
			//MoveY
			if (this.toTank.y > 280) {
				this.vel.y += 0.1 * dt;
			} else if (this.toTank.y < 250) {
				this.vel.y -= 0.1 * dt;
			} else {
				this.vel.y = 0;
			}
			//MoveX
			this.vel.x += (-0.1*this.toTank.x/100) * dt;
			let fRatio = 1 / (1 + (dt * 0.01));
			this.vel.x *= fRatio;

			//Bombz
			var bombrate = 40/dt;
			if (randomInt(0, bombrate) == 3 && this.sinceBombed > bombrate) {
				this.sinceBombed = 0;
				entities.push(new Bomb(this.x+this.width/2, this.y+this.height-5*this.tileSize, this.vel, 1));
			}
			this.sinceBombed += 1 * dt;
		} else {
			this.hp = this.maxHp;
		}
	}

	move(dt) {
		if (this.x+this.width/2 > this.moveToPoint) {
			if ((this.x+this.width/2-this.moveToPoint) > this.movingLength/2) {
				this.vel.x -= 0.1 * dt;
				this.x += this.vel.x * dt;
			} else {
				if (this.vel.x < 0) {
					this.vel.x += 0.1 * dt;
					this.x += this.vel.x * dt;
				} else {
					this.vel.x -= 0.1;
					this.x += this.vel.x * dt;
				}
			}
		} else {
			this.moving = false;
			this.vel.x = 0;
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

	reset(entities) {
		this.x = this.origin.x;
		this.y = this.origin.y;
		this.vel.set(0, 0);
		for (var i in entities) {
			if (entities[i].type == "wall" && entities[i].id == "cw") {
				entities[i].dead = true;
			}
		}
		this.hp =  this.maxHp;
		this.fighting = false;
	}
}
