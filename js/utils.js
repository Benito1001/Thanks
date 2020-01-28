export function randomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getRandomInt(max) {
	return Math.floor(Math.random() * Math.floor(max));
}

export function colliding(ob1x, ob1width, ob2x, ob2width, ob1y, ob1height, ob2y, ob2height, colliding = true) {
	if (
		ob1x + ob1width > ob2x && ob1x < ob2x + ob2width &&
		ob1y + ob1height > ob2y && ob1y < ob2y + ob2height && colliding
	) {
		return true
	}
}

var maxInWall = 5;
export function hitboxCollideX(entity1, entity2) {
	if (entity1 == entity2) {
		return false;
	}
	if (!entity1.colliding || !entity2.colliding) {
		return false;
	}
	if (colliding(
		entity1.hitbox[0].x, entity1.hitbox[0].width, entity2.hitbox[0].x, entity2.hitbox[0].width,
		entity1.hitbox[0].y, entity1.hitbox[0].height, entity2.hitbox[0].y, entity2.hitbox[0].height
	)) {
		for (let n = 1; n < entity1.hitbox.length; n++) {
			var entBox1 = entity1.hitbox[n];
			for (let m = 1; m < entity2.hitbox.length; m++) {
				var entBox2 = entity2.hitbox[m];
				if (colliding(
					entBox1.x, entBox1.width, entBox2.x, entBox2.width,
					entBox1.y, entBox1.height, entBox2.y, entBox2.height
				)) {
					if (entity1.property == "transparent" || entity2.property == "transparent") {
						return true;
					}
					if (entity1.type == "tank" && entity2.type == "teleporter" && m == 5) {
						window.location.href = "thanks.html";
					}
					//Går høyre
					if (entBox1.x+entBox1.width/2 <= entBox2.x+entBox2.width/2) {
						var inWall = entity1.x
							- (entity2.x
							- entity1.width
							+ (entBox2.x-entity2.x)
							+ ((entity1.x+entity1.width)-(entBox1.x+entBox1.width)));
						if ((inWall < maxInWall) && (inWall > 0)) {
							entity1.x -= inWall;
						} else {
							entity1.x -= maxInWall;
							entity1.inWallLogic.movedOut = -maxInWall;
							entity1.inWallLogic.toOut = (entity1.x+entity1.width) - entity2.x;
						}
					}
					//Går venstre
					else if (entBox1.x+entBox1.width/2 >= entBox2.x+entBox2.width/2) {
						var inWall = -(entity1.x
							- (entity2.x
							- (entBox1.x-entity1.x)
							+ entBox2.x-entity2.x
							+ entBox2.width));
						if ((inWall < maxInWall) && (inWall > 0)) {
							entity1.x += inWall;
						} else {
							entity1.x += maxInWall;
							entity1.inWallLogic.movedOut = maxInWall;
							entity1.inWallLogic.toOut = (entity2.x+entity2.width) - entity1.x;
						}
					}
					if (entity1.type == "tank" && entBox2.height < entity1.stepSize) {
						entity1.y -= entBox1.height;
					} else {
						if (entity1.property == "solid") {
							entity1.vel.x = 0;
						}
					}
					return true;
				}
			}
		}
	}
}

var maxInGround = 10;
export function hitboxCollideY(entity1, entity2) {
	if (entity1 == entity2) {
		return false;
	}
	if (!entity1.colliding || !entity2.colliding) {
		return false;
	}
	if (colliding(
		entity1.hitbox[0].x, entity1.hitbox[0].width, entity2.hitbox[0].x, entity2.hitbox[0].width,
		entity1.hitbox[0].y, entity1.hitbox[0].height, entity2.hitbox[0].y, entity2.hitbox[0].height
	)) {
		for (let n = 1; n < entity1.hitbox.length; n++) {
			var entBox1 = entity1.hitbox[n];
			for (let m = 1; m < entity2.hitbox.length; m++) {
				var entBox2 = entity2.hitbox[m];
				if (colliding(
					entBox1.x, entBox1.width, entBox2.x, entBox2.width,
					entBox1.y, entBox1.height, entBox2.y, entBox2.height
				)) {
					if (entity1.property == "transparent" || entity2.property == "transparent") {
						return true;
					}
					//Går ned
					if (entBox1.y+entBox1.height/2 <= entBox2.y+entBox2.height/2) {
						var inGround = entity1.y
							- (entity2.y
							- entity1.height
							+ (entBox2.y-entity2.y)
							+ ((entity1.y+entity1.height)-(entBox1.y+entBox1.height)));
						inGround = Math.ceil(inGround);
						if ((inGround < maxInGround) && (inGround > 0)) {
							entity1.y -= inGround;
						} else {
							if (entity1.inWallLogic.toOut > (entity1.y+entity1.height) - entity2.y) {
								entity1.y -= maxInGround;
								entity1.x += entity1.inWallLogic.movedOut;
								entity1.inWallLogic.movedOut = 0;
							}
						}
					}
					//Går opp
					else if (entBox1.y+entBox1.height/2 >= entBox2.y+entBox2.height/2) {
						var inGround = entity1.y
							- ((entBox1.y-entity1.y)
							+ entBox2.y-entity2.y
							+ entBox2.height);
						if ((inGround < maxInGround) && (inGround > 0)) {
							entity1.y += inGround;
						} else {
							if (entity1.inWallLogic.toOut > (entity2.y+entity2.height) - entity1.y) {
								entity1.y += maxInGround;
								entity1.x += entity1.inWallLogic.movedOut;
								entity1.inWallLogic.movedOut = 0;
							}
						}
					}
					if (entity2.property == "solid") {
						if (entity1.y+entity1.height/2 < entity2.y+entity2.height) {
							entity1.onGround = true;
						}
						entity1.vel.y = 0;
					}
					return true;
				}
			}
		}
	}
}
