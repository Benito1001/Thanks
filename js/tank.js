import {hitboxCollideX, hitboxCollideY} from "./utils.js";
import Vecc from "./vectorz.js";
import Bullet from "./bullet.js";
import Rect from "./rectangle.js";

export default class Tank {
	constructor(x = 20) {
		this.test = false;
		this.start = this.test;
		this.collide = true;
		this.keys = {};
		this.x = x;
		this.y = 139;
		this.vel = new Vecc(0, 0);
		this.width = 100;
		this.texture = document.getElementById('tank');
		this.gunTexture = document.getElementById('tankGun');
		this.boosterTexture = document.getElementById('booster');
		this.animationTimer = 0;
		this.animationSpeed = 20;
		this.animationFrames = 20;
		this.animate = false;
		this.height = this.width * (this.texture.height/this.texture.width);
		this.gunWidth = 100 * (this.gunTexture.height/this.gunTexture.width);
		this.gunHeight = this.gunWidth * (this.gunTexture.height/this.gunTexture.width);
		this.tileHeight = 22;
		this.tileWidth = 37;
		this.tileSize = this.width/this.tileWidth;
		this.property = "solid";
		this.type = "tank";
		this.mass = 500;
		this.motorPower = 50;
		this.frictionForce = 0;
		this.reload = false;
		this.reloading = 0;
		this.rotate = 0;
		this.dead = false;
		this.colliding = true;
		this.dragCoefficient = 0.82;
		this.onGround = false;
		this.maxHp = 10;
		this.hp = this.maxHp;
		this.hpMargin = 20;
		this.hpBarHeight = 20;
		this.onPlatform = false;
		this.platVel = new Vecc(0, 0);
		this.hitbox = [];
		this.makeHitbox();
		this.stepSize = 7*this.tileSize;
		this.inWallLogic = {toOut: 0, movedOut: 0};
	}

	update(entities, ctx, dt) {
		if (this.start) {
			this.updateX(entities, ctx, dt);
			this.updateY(entities, ctx, dt);
			this.shoot(entities, ctx, dt);
			if (this.hp <= 0) {
				this.dead = true;
			}
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
		this.jump();
	}

	draw(ctx, dt) {
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
		ctx.drawImage(this.texture, this.x, this.y, this.width, this.height);
		ctx.save();
		ctx.translate(this.x+this.width-23, this.y-this.height+78);
		ctx.rotate(-this.rotate*(Math.PI/180));
		ctx.drawImage(this.gunTexture, -3, -8, this.gunWidth, this.gunHeight);
		ctx.restore();
		ctx.fillStyle = "rgb(0, 0, 0)";
	}

	moveX(dt) {
		if (this.onPlatform) {
			this.x += this.platVel.x;
		}
		if (this.keys.KeyA) {
			this.motorForce = -this.motorPower;
		}
		else if (this.keys.KeyD) {
			this.motorForce = this.motorPower;
		}
		else {
			this.motorForce = 0;
		}
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
		if (this.vel.x > 0 && this.vel.x < 0.01) {this.vel.x = 0;}
		if (this.vel.x > -0.01 && this.vel.x < 0) {this.vel.x = 0;}
		this.x += this.vel.x * dt;
	}

	moveY(dt) {
		this.vel.y += 15/60 * dt;
		this.y += this.vel.y * dt;
		if (this.onPlatform) {
			this.y += this.platVel.y * dt;
		}
	}

	jump() {
		if (this.keys.ShiftLeft && this.onGround) {
			this.vel.y -= 8;
			this.animate = true;
		}
	}

	collidesWithX(entities, dt) {
		if (this.x < 0) {
			this.x = 0;
			this.vel.x = 0;
		}
		if (this.test) {
			if (this.keys.Digit1) {
				this.x = 20;
			}
			if (this.keys.Digit2) {
				this.x = 2800;
				this.y = 100;
			}
			if (this.keys.Digit3) {
				this.x = 6000;
				this.y = 300;
			}
			if (this.keys.Digit4) {
				this.x = 7700;
				this.y = -100;
			}
		}
		for (var i in entities) {
			if (hitboxCollideX(this, entities[i])) {
				if (entities[i].type == "enemy" && !entities[i].dying) {
					this.dead = true;
				}
				else if (entities[i].type == "boss") {
					this.dead = true;
				}
				else if (entities[i].type == "trigger") {
					entities[i].trigger(entities);
				}
				else if (entities[i].type == "healthPack") {
					this.hp = this.maxHp;
					entities[i].dead = true;
				}
			}
		}
	}

	collidesWithY(entities, dt) {
		this.onGround = false;
		for (var i in entities) {
			if (hitboxCollideY(this, entities[i])) {
				if (entities[i].type == "platform") {
					if (!entities[i].activated) {
						entities[i].platformify();
						entities[i].activated = true;
						if (entities[i].platformType == "loop") {
							this.vel.y += 10;
						}
					}
					this.onPlatform = true;
					this.platVel = entities[i].vel;
					//this.platVel.y = entities[i].dty;
				}
				else if (entities[i].type == "enemy" && !entities[i].dying) {
					if (this.y+this.height/2 < entities[i].y+entities[i].height/2) {
						entities[i].hp = 0;
					}
				}
				else if (entities[i].type == "boss") {
					this.dead = true;
				}
				else if (entities[i].property == "bounce") {
					this.vel.y *= -1.1;
				}
				else if (entities[i].type == "vine" && this.keys.ShiftLeft) {
					this.vel.y = 0;
					this.y -= 10*dt;
				}
			}
		}
	}

	shoot(entities, ctx, dt) {
		if (this.keys.Space && !this.reload) {
			var aim = new Vecc(Math.cos(this.rotate/(180/Math.PI)), -Math.sin(this.rotate/(180/Math.PI)));
			aim.multiply(14);
			aim.add(this.vel.x, this.vel.y);
			entities.push(new Bullet(this.x+this.width-25+aim.x*2, this.y+10+aim.y*2, aim));
			this.reload = true;
		}
		if (this.reload) {
			this.reloading += 1 *dt;
			if (this.reloading > 40) {
				this.reload = false;
				this.reloading = 0;
			}
		}
		if (this.keys.KeyW) {
			this.rotate += 1 *dt;
		}
		if (this.keys.KeyS) {
			this.rotate -= 1 *dt;
		}

		if (this.rotate > 90) {
			this.rotate = 90;
		}
		else if (this.rotate < 0) {
			this.rotate = 0;
		}
	}

	makeHitbox() {
		//BoundingBox
		this.hitbox.push(new Rect(this.x, this.y, this.width, this.height));
		//Belts
		this.hitbox.push(new Rect(this.x+this.tileSize*5, this.y+this.tileSize*21, this.width-this.tileSize*11, this.tileSize));
		this.hitbox.push(new Rect(this.x+this.tileSize*4, this.y+this.tileSize*20, this.width-this.tileSize*9, this.tileSize));
		this.hitbox.push(new Rect(this.x+this.tileSize*3, this.y+this.tileSize*19, this.width-this.tileSize*7, this.tileSize));
		this.hitbox.push(new Rect(this.x+this.tileSize*2, this.y+this.tileSize*18, this.width-this.tileSize*5, this.tileSize));
		this.hitbox.push(new Rect(this.x+this.tileSize*1, this.y+this.tileSize*17, this.width-this.tileSize*3, this.tileSize));
		//Body
		this.hitbox.push(new Rect(this.x+this.tileSize*0, this.y+this.tileSize*15, this.width-this.tileSize*1, this.tileSize*2));
		this.hitbox.push(new Rect(this.x+this.tileSize*0, this.y+this.tileSize*12, this.width-this.tileSize*0, this.tileSize*3));
		this.hitbox.push(new Rect(this.x+this.tileSize*0, this.y+this.tileSize*11, this.width-this.tileSize*1, this.tileSize));
		this.hitbox.push(new Rect(this.x+this.tileSize*0, this.y+this.tileSize*10, this.width-this.tileSize*2, this.tileSize));
		this.hitbox.push(new Rect(this.x+this.tileSize*1, this.y+this.tileSize*9, this.width-this.tileSize*5, this.tileSize));
		this.hitbox.push(new Rect(this.x+this.tileSize*2, this.y+this.tileSize*8, this.width-this.tileSize*7, this.tileSize));
		//Head
		this.hitbox.push(new Rect(this.x+this.tileSize*12, this.y+this.tileSize*4, this.width-this.tileSize*17, this.tileSize*4));
		this.hitbox.push(new Rect(this.x+this.tileSize*12, this.y+this.tileSize*3, this.width-this.tileSize*21, this.tileSize));
		this.hitbox.push(new Rect(this.x+this.tileSize*15, this.y+this.tileSize*1, this.width-this.tileSize*29, this.tileSize*2));
		this.hitbox.push(new Rect(this.x+this.tileSize*16, this.y+this.tileSize*0, this.width-this.tileSize*31, this.tileSize));
	}
	updateHitbox(type) {
		if (type == "y") {
			//BoundingBox
			this.hitbox[0].y = this.y;
			//Belts
			this.hitbox[1].y = this.y+this.tileSize*21;
			this.hitbox[2].y = this.y+this.tileSize*20;
			this.hitbox[3].y = this.y+this.tileSize*19;
			this.hitbox[4].y = this.y+this.tileSize*18;
			this.hitbox[5].y = this.y+this.tileSize*17;
			//Body
			this.hitbox[6].y = this.y+this.tileSize*15;
			this.hitbox[7].y = this.y+this.tileSize*12;
			this.hitbox[8].y = this.y+this.tileSize*11;
			this.hitbox[9].y = this.y+this.tileSize*10;
			this.hitbox[10].y = this.y+this.tileSize*9;
			this.hitbox[11].y = this.y+this.tileSize*8;
			//Head
			this.hitbox[12].y = this.y+this.tileSize*4;
			this.hitbox[13].y = this.y+this.tileSize*3;
			this.hitbox[14].y = this.y+this.tileSize*1;
			this.hitbox[15].y = this.y+this.tileSize*0;
		} else {
			//BoundingBox
			this.hitbox[0].x = this.x;
			//Belts
			this.hitbox[1].x = this.x+this.tileSize*5;
			this.hitbox[2].x = this.x+this.tileSize*4;
			this.hitbox[3].x = this.x+this.tileSize*3;
			this.hitbox[4].x = this.x+this.tileSize*2;
			this.hitbox[5].x = this.x+this.tileSize*1;
			//Body
			this.hitbox[6].x = this.x+this.tileSize*0;
			this.hitbox[7].x = this.x+this.tileSize*0;
			this.hitbox[8].x = this.x+this.tileSize*0;
			this.hitbox[9].x = this.x+this.tileSize*0;
			this.hitbox[10].x = this.x+this.tileSize*1;
			this.hitbox[11].x = this.x+this.tileSize*2;
			//Head
			this.hitbox[12].x = this.x+this.tileSize*12;
			this.hitbox[13].x = this.x+this.tileSize*12;
			this.hitbox[14].x = this.x+this.tileSize*15;
			this.hitbox[15].x = this.x+this.tileSize*16;
		}
	}

	reset(checkpoints) {
		var checkpointPos = this.checkPos(checkpoints);
		this.x = checkpointPos.x;
		this.y = checkpointPos.y;
		this.vel.x = 0;
		this.vel.y = 0;
		this.dead = false;
		this.hp = this.maxHp;
		this.animate = false;
		this.animationTimer = 0;
	}

	checkPos(checkpoints) {
		for (var i = 0; i < checkpoints.length; i++) {
			if (this.x < checkpoints[i].x) {
				return checkpoints[i-1];
			}
		}
	}
}
