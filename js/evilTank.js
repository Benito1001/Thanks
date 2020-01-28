import {randomInt, colliding} from "./utils.js";
import Rect from "./rectangle.js";
import Vecc from "./vectorz.js";
import Bullet from "./bullet.js";
import Level from "./level.js";
import HealthPack from "./healthPack.js";

export default class EvilTank {
	constructor(x, y, hp, isArena) {
		this.collide = true;
		this.x = x;
		this.y = y;
		this.maxHp = hp;
		this.isArena = isArena;
		this.vel = new Vecc(0, 0);
		this.toTank = new Vecc(0, 0);
		this.width = 100;
		this.texture = document.getElementById('tank');
		this.gunTexture = document.getElementById('tankGun');
		this.boosterTexture = document.getElementById('booster');
		this.animationTimer = 0;
		this.animationSpeed = 20;
		this.animationFrames = 20;
		this.animate;
		this.height = this.width * (this.texture.height/this.texture.width);
		this.gunWidth = 100 * (this.gunTexture.height/this.gunTexture.width);
		this.gunHeight = this.gunWidth * (this.gunTexture.height/this.gunTexture.width);
		this.type = "evilTank";
		this.mass = 500;
		this.motorPower = 120;
		this.motorForce = 0;
		this.frictionForce = 0;
		this.reload = false;
		this.reloading = 0;
		this.rotate = 0;
		this.dead = false;
		this.colliding = true;
		this.dragCoefficient = 0.82;
		this.onGround = false;
		this.hp = this.maxHp;
		this.hpBarHeight = 10;
		this.setup = false;
		this.timerLength = 2000;
		this.timer = this.timerLength;
		this.arenaPos1 = 0;
		this.arenaPos2 = 0;
		this.text = "";
		this.textSize = 0;
		this.hitbox = [
			new Rect(this.x, this.y, this.width, this.height),
			new Rect(this.x, this.y, this.width, this.height)
		];
		this.inWallLogic = {toOut: 0, movedOut: 0};
	}
	update(entities, ctx, dt) {
		this.updateX(entities, ctx, dt);
		this.updateY(entities, ctx, dt);
	}

	updateX(entities, ctx, dt) {
		this.moveX(dt);
		this.collidesWithX(entities, dt);
		this.ai(entities, ctx, dt);
		if (this.isArena) {
			this.arenafy(entities, ctx, dt);
		}
	}

	updateY(entities, ctx, dt) {
		this.moveY(dt);
		this.collidesWithY(entities, dt);
		if (this.hp == 0) {
			this.dead = true;
		}
	}

	draw(ctx, dt) {
		//HpBar
		ctx.beginPath();
		ctx.moveTo(this.x-this.width, this.y-this.hpBarHeight*2);
		ctx.lineTo(this.x-this.width, this.y-this.hpBarHeight*2+this.hpBarHeight);
		ctx.lineTo(this.x-(this.width*(this.maxHp-this.hp))/this.maxHp, this.y-this.hpBarHeight*2+this.hpBarHeight);
		ctx.lineTo(this.x-(this.width*(this.maxHp-this.hp))/this.maxHp, this.y-this.hpBarHeight*2);
		ctx.lineTo(this.x-this.width, this.y-this.hpBarHeight*2);
		if (this.maxHp > 1000) {
			ctx.fillStyle = "rgb(0, 0, 0)";
		} else {
			ctx.fillStyle = "rgb(255, 0, 0)";
		}
		ctx.fill();
		//explosion
		if (this.animate) {
			this.animationTimer += 1 *dt;
			ctx.drawImage(
				this.boosterTexture,
				Math.floor(this.animationTimer/(this.animationSpeed/this.animationFrames))*96,
				0, 96, 96, this.x, this.y+20, 96, 96
			);
			if (this.animationTimer > this.animationSpeed) {
				this.animate = false;
				this.animationTimer = 0;
			}
		}
		//tanks
		ctx.save()
		ctx.translate(this.x+this.width, this.y);
		ctx.scale(-1, 1);
		ctx.drawImage(this.texture, 0, 0, this.width, this.height);
		ctx.restore();
		ctx.save();
		ctx.translate(this.x+23, this.y-this.height+78);
		ctx.scale(-1, 1);
		ctx.rotate(-this.rotate*(Math.PI/180));
		ctx.drawImage(this.gunTexture, -3, -8, this.gunWidth, this.gunHeight);
		ctx.restore();
	}

	moveX(dt) {
		this.x += this.vel.x * dt;
		//F_d = 1/2*p*v^2*C_d*A
		if (this.motorForce != 0) {
			this.dragForce = 0.5 * 1.2 * Math.pow(this.vel.x, 2) * 0.82 * Math.pow(this.height/25, 2);
		}
		else {
			this.dragForce = 0.5 * 1.2 * Math.pow(this.vel.x, 2) * 0.82 * Math.pow(this.height/25, 2) + 50;
		}
		//movement
		if (this.vel.x < 0) {
			this.vel.x += ((this.motorForce+this.dragForce)/this.mass) * dt;
		}
		if (this.vel.x > 0) {
			this.vel.x += ((this.motorForce-this.dragForce)/this.mass) * dt;
		}
		if (this.vel.x == 0) {
			this.vel.x += (this.motorForce)/this.mass * dt;
		}
		if (this.vel.x > 0 && this.vel.x < 0.1) {this.vel.x = 0;}
		if (this.vel.x > -0.1 && this.vel.x < 0) {this.vel.x = 0;}
	}

	moveY(dt) {
		this.y += this.vel.y *dt;
		this.vel.y += 15/60 * dt;
	}

	jump() {
		if (this.onGround) {
			this.vel.y -= 8;
			this.animate = true;
		}
	}

	ai(entities, ctx, dt) {
		for (var i in entities) {
			if (entities[i].type == "tank") {
				this.toTank.x = (this.x-this.width) - (entities[i].x);
				this.toTank.y = this.y - entities[i].y;
				this.tankWidth = entities[i].width;
			}
		}
		if (Math.pow(14-this.vel.x, 2)/((15/(60)*0.6)) > this.toTank.x) {
			this.rotate = (Math.PI+90*Math.asin(this.toTank.x*((15/(60))*0.6)/Math.pow(14-this.vel.x, 2)))/Math.PI;
		}
		else {
			this.rotate = 0;
		}
		this.rotate += (180*Math.atan(this.toTank.y/this.toTank.x))/Math.PI;
		if (this.toTank.x == -100) {
			this.rotate = 90;
		}
		if (randomInt(0, 100) > this.toTank.x/14) {
			this.motorForce = this.motorPower;
		}
		else {
			this.motorForce = -this.motorPower;
		}

		if (randomInt(0, 60) == 1) {
			this.shoot(entities, ctx, dt);
		}
	}

	collidesWithX(entities, dt) {
		if (this.x < 0) {
			this.x = 0;
			this.vel.x = 0;
		}
		for (var i in entities) {
			if (colliding(
				this.x - this.width, this.width, entities[i].x, entities[i].width,
				this.y, this.height, entities[i].y, entities[i].height,
				entities[i].colliding
			)) {
				if (entities[i].type == "level") {
					if (this.x-this.width/2 < entities[i].x+entities[i].width) {
						this.x = entities[i].x;
						this.vel.x = 0;
					}
					else if (this.x-this.width/2 > entities[i].x+entities[i].width/2) {
						this.x = entities[i].x+entities[i].width+this.width;
						this.vel.x = 0;
					}
				}
				else if (entities[i].type == "temp") {
					if (this.x-this.width/2 < entities[i].x+entities[i].width/2) {
						this.x = entities[i].x;
						this.vel.x = 0;
					}
					else if (this.x-this.width/2 > entities[i].x+entities[i].width/2) {
						this.x = entities[i].x+entities[i].width+this.width;
						this.vel.x = 0;
					}
				}
				else if (entities[i].type == "bullet") {
					entities[i].dead = true;
					this.hp -= 1;
				}
			}
		}
	}

	collidesWithY(entities, dt) {
		this.onGround = false;
		for (var i in entities) {
			if (colliding(
				this.x - this.width, this.width, entities[i].x, entities[i].width,
				this.y, this.height, entities[i].y, entities[i].height,
				entities[i].colliding
			)) {
				if (entities[i].type == "level") {
					this.onGround = true;
					this.y = entities[i].y - this.height;
					this.vel.y = 0;
				}
				else if (entities[i].type == "temp") {
					this.onGround = true;
					this.y = entities[i].y - this.height;
					this.vel.y = 0;
				}
			}
		}
	}

	shoot(entities, ctx, dt) {
		var aim = new Vecc(-Math.cos(this.rotate/(180/Math.PI)), -Math.sin(this.rotate/(180/Math.PI)));
		aim.multiply(14);
		aim.add(this.vel.x, this.vel.y);
		entities.push(new Bullet(this.x-this.width+25+aim.x*4, this.y+10+aim.y*4, aim));
		this.reload = true;
	}

	arenafy(entities, ctx, dt) {
		if (!this.setup) {
			var arenaRad = this.toTank.x+260;
			if (arenaRad < 760) {
				arenaRad = 760;
			}
			this.arenaPos1 = this.x-arenaRad;
			this.arenaPos2 = this.x+arenaRad;
			entities.push(new Level(this.x-arenaRad, this.y-800, 50, 1000, "gateTile"));
			entities.push(new Level(this.x+arenaRad, this.y-800, 50, 1000, "gateTile"));
			this.setup = true;
		}
		this.timer -= 1 * dt;
		var r = this.timer;
		var g = this.timerLength-this.timer;
		ctx.font = '50px serif';
		ctx.fillStyle = "rgb("+r+", "+g+", 0)";
		this.text = "survive: " + Math.round(this.timer/10);
		this.textSize = ctx.measureText(this.text);
		ctx.fillText(
			this.text, this.x-this.width-(this.toTank.x-this.tankWidth)/2-this.textSize.width/2, this.y-this.toTank.y/2
		);
		ctx.strokeText(
			this.text, this.x-this.width-(this.toTank.x-this.tankWidth)/2-this.textSize.width/2, this.y-this.toTank.y/2
		);
		if (this.timer <= 0) {
			entities.push(new HealthPack(this.x, this.y));
			this.dead = true;
			for (var i in entities) {
				if (entities[i].type == "level") {
					if (entities[i].x == this.arenaPos1 || entities[i].x == this.arenaPos2) {
						entities[i].dead = true;
					}
				}
			}
		}
	}
}
