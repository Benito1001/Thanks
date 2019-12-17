import Level from "./level.js";
import Egg from "./egg.js";
import Tank from "./tank.js";
import Enemy from "./enemy.js";
import WallTrigger from "./wallTrigger.js";
import EnemyTrigger from "./enemyTrigger.js";
import EvilTank from "./evilTank.js";
import Bouncer from "./bouncer.js";
import HealthPack from "./healthPack.js";
import Platform from "./platform.js";
import {randomInt, getRandomInt, colliding} from "./utils.js";

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var scaleFactor = 0.7;

function resize(){canvas.width = innerWidth-20; canvas.height = innerHeight-25; scaleFactor = innerHeight/891}
resize();
window.addEventListener("resize",resize);

var ticksSpent = 0;
var fps = 60;
var dt = 1;
var previousTime = 0;
var run = true;

var entities = [];
var tank = new Tank()
var end = false;
var c = 0;
var r = 0;

var addLength = 0;

var hpBarStart = 0;
var hpBarWidth = 0;

entities.push(tank);
//
entities.push(new Egg(60, -330, 64, 64))
entities.push(new Level(0, 200, 5000, 600, "grassTile"));
entities.push(new WallTrigger(entities, 0, 660, 20, 40, 40, 700, -400, 40, 600));
entities.push(new EnemyTrigger(660, -20, 40, 40, Enemy, "enemy", 800, 50, 3));
//
entities.push(new Level(1100, 114, 200, 100, "grassTile"));
entities.push(new Bouncer(1295, 170, 205, 30));
entities.push(new Level(1500, 14, 200, 210, "grassTile"));
entities.push(new Bouncer(1696, 170, 205, 30));
entities.push(new Level(1900, -86, 200, 310, "grassTile"));
entities.push(new WallTrigger(entities, 1, 2890, -250, 40, 40, 2100, -86, 810, 40));
for (var i = 0; i < 5; i++) {
	entities.push(new Enemy(2095+140*(i+1), 50));
	addLength += 140;
}
entities.push(new Level(2106 + addLength, 114, 50, 100, "grassTile"));
entities.push(new Level(2150 + addLength, 14, 50, 210, "grassTile"));
entities.push(new Level(2194 + addLength, -86, 310, 310, "grassTile"));
//Arena
entities.push(new EvilTank(3100 + addLength, 100, 5, false));
entities.push(new Level(4100 + addLength, 80, 200, 150, "grassTile"));
//Boing
var temp = 4300 + addLength
for (var i = 0; i < 5; i++) {
	entities.push(new Level((temp)+(268-100)*(i+1)+100*i, 200, 100, 60, "grassTile"));
	addLength += 168+100
}
addLength -= 100;
entities.push(new Level(4568 + addLength, 200, 3000, 600, "grassTile"));
//Platformin
entities.push(new Level(4860 + addLength, 80, 205, 20, "grassTile"));
for (var i = 0; i < 7; i++) {
	entities.push(new Level((4620 + addLength)+120*(Math.cos(i*Math.PI)+1), 80-120*i, 205, 20, "stoneTile"));
}
entities.push(new Level(5060 + addLength, 110-128*6, 50, 100+128*6, "stoneTile"));
entities.push(new Bouncer(5105 + addLength, 170, 205, 30));
//DeathArena
entities.push(new HealthPack(5500 + addLength, 40));
entities.push(new EnemyTrigger(6000 + addLength, 160, 40, 40, EvilTank, "evilTank", 6000 + addLength, 40, 1));
//Swingy Thingy
entities.push(new Platform(7568 + addLength, 200, 100, 40, "bridgeTile", 710, "slide"));
addLength += 100 + 710;
entities.push(new Level(7575 + addLength, 200, 200, 800, "grassTile"));
addLength += 200;
entities.push(new Platform(7570 + addLength, 200, 250, 40, "bridgeTile", 710, "loop"));
addLength += 250 + 710;
entities.push(new Level(7574 + addLength, 200, 200, 1000, "grassTile"));
addLength += 200;
entities.push(new Platform(7570 + addLength, 200, 350, 40, "bridgeTile", 1010, "loop"));
addLength += 350 + 1010;
entities.push(new Platform(7560 + addLength, 200, 500, 40, "bridgeTile", 1310, "loop"));
addLength += 500 + 1310;
entities.push(new Level(7555 + addLength, 200, 1000, 1000, "grassTile"));

requestAnimationFrame(runGame);

function runGame(currentTime) {
	//dt
	dt = (currentTime - previousTime)/(1000/60);
	previousTime = currentTime;
	ctx.setTransform(1, 0, 0, 1, 0, 0);
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	if (dt >= 8) {
		dt = 8;
	}
	//fps
	if (ticksSpent % 5 === 0) {
		fps = Math.round(60/dt);
	}
	ticksSpent += 1;
	ctx.font = '30px serif';
	ctx.fillStyle = "rgb(50, 50, 50)";
	ctx.fillText(fps + " fps", canvas.width-100, 50);
	//camera
	if (tank.x > ((canvas.width/2)/scaleFactor)-tank.width/2) {
		ctx.translate(-(tank.x+tank.width/2)*scaleFactor + canvas.width/2,
								-(tank.y+tank.height/2)*scaleFactor + canvas.height/2);
	}
	else {
		ctx.translate(0, -(tank.y+tank.height/2)*scaleFactor + canvas.height/2);
	}
	ctx.scale(scaleFactor, scaleFactor);
	//Updates entities
	if (run) {
	for (var i in entities) {
		if (colliding(tank.x-(canvas.width)/scaleFactor, (canvas.width/scaleFactor)*2, entities[i].x, entities[i].width,
									tank.y-(canvas.height)/scaleFactor,( canvas.height/scaleFactor)*2, entities[i].y, entities[i].height,
									true)) {
			entities[i].update(entities, ctx, dt);
			entities[i].draw(ctx, dt);
			if (entities[i].y > 1000) {
				entities[i].dead = true;
			}
			if (entities[i].y < -1000 && entities[i].type == "tank" && entities[i].x < 500 && window.location.href != "challenge.php") {
				window.location.href = "challenge.php";
				run = false;
			}
		}
		if (entities[i].dead == true) {
			if (entities[i].type == "tank") {
				end = true;
			}
			entities.splice(i, 1);
			i-=1;
		}
	}
	}
	//camera
	if (tank.x > ((canvas.width/2)/scaleFactor)-tank.width/2) {
		ctx.translate(-(tank.x+tank.width/2)*scaleFactor + canvas.width/2,
								-(tank.y+tank.height/2)*scaleFactor + canvas.height/2);
	}
	else {
		ctx.translate(0, -(tank.y+tank.height/2)*scaleFactor + canvas.height/2);
	}
	ctx.scale(scaleFactor, scaleFactor);
	//
	ctx.setTransform(1, 0, 0, 1, 0, 0);
	if (end) {
		//
		var txt = "You are dead, respawn by pressing ctrl + r";
		ctx.font = "50px sans-serif";
		//Square
		var rad = 50;
		var margin = 30;
		var x = (canvas.width-ctx.measureText(txt).width)/2 - margin;
		var width = ctx.measureText(txt).width + margin*2;
		var y = (canvas.height-100)/2 - margin;
		var height = 50 + margin*2;
		ctx.fillStyle = "rgb(0, 0, 0)";
		ctx.beginPath();
		ctx.moveTo(x + rad, y);
		ctx.lineTo(x + width - rad, y);
		ctx.quadraticCurveTo(x + width, y, x + width, y + rad);
		ctx.lineTo(x + width, y + height - rad);
		ctx.quadraticCurveTo(x + width, y + height, x + width - rad, y + height);
		ctx.lineTo(x + rad, y + height);
		ctx.quadraticCurveTo(x, y + height, x, y + height - rad);
		ctx.lineTo(x, y + rad);
		ctx.quadraticCurveTo(x, y, x + rad, y);
		ctx.closePath();
		ctx.fill();
		var margin = 25
		var x = (canvas.width-ctx.measureText(txt).width)/2 - margin;
		var width = ctx.measureText(txt).width + margin*2;
		var y = (canvas.height-100)/2 - margin;
		var height = 50 + margin*2;
		ctx.fillStyle = "rgb(250, 250, 250)";
		ctx.beginPath();
		ctx.moveTo(x + rad, y);
		ctx.lineTo(x + width - rad, y);
		ctx.quadraticCurveTo(x + width, y, x + width, y + rad);
		ctx.lineTo(x + width, y + height - rad);
		ctx.quadraticCurveTo(x + width, y + height, x + width - rad, y + height);
		ctx.lineTo(x + rad, y + height);
		ctx.quadraticCurveTo(x, y + height, x, y + height - rad);
		ctx.lineTo(x, y + rad);
		ctx.quadraticCurveTo(x, y, x + rad, y);
		ctx.closePath();
		ctx.fill();
		//Text
		ctx.beginPath();
		c += 1
		r = Math.floor(Math.abs(Math.sin(c/40)) * 255);
		ctx.fillStyle = "rgb("+r+", 0, 0)";
		ctx.fillText(txt, (canvas.width-ctx.measureText(txt).width)/2, (canvas.height-30)/2);
	}
	//HUD
		//spedometer
		var ometerRad = 50;
		var speed = Math.abs(Math.round(tank.vel.x*10));
		ctx.beginPath();
		ctx.arc(canvas.width/2, canvas.height-tank.hpMargin-ometerRad, ometerRad, 0, 2*Math.PI);
		ctx.fillStyle = "rgb(0, 0, 0)";
		ctx.fill();
		ctx.save();
		ctx.translate(canvas.width/2, canvas.height-tank.hpMargin-ometerRad);
		ctx.rotate((90+(speed*4.3))*(Math.PI/180));
		ctx.fillStyle = "rgb(255, 0, 0)";
		ctx.fillRect(-5, 0, 10, ometerRad);
		ctx.restore();
		ctx.font = ometerRad/4+"px sans-serif";
		ctx.fillStyle = "rgb(255, 255, 255)";
		var spedomNum = 0;
		while (spedomNum <= 42) {
			ctx.fillText(spedomNum,
									canvas.width/2 - Math.cos((spedomNum*4.3)*(Math.PI/180))*(ometerRad/1.2) - ctx.measureText(spedomNum).width/2,
									canvas.height-tank.hpMargin-ometerRad-Math.sin((spedomNum*4.3)*(Math.PI/180))*(ometerRad/1.2) + 6);
			spedomNum += 6;
		}
		//ctx.font = ometerRad+"px sans-serif";
		//ctx.fillStyle = "rgb(255, 255, 255)";
		//ctx.fillText(speed, canvas.width/2-ctx.measureText(speed).width/2, canvas.height-tank.hpMargin-(ometerRad*1.4)/2);
		//hpBar
		ctx.fillStyle = "rgb(0, 0, 0)";
		ctx.font = "30px sans-serif";
		ctx.fillText("HP:", tank.hpMargin, -tank.hpMargin+canvas.height-tank.hpBarHeight+17);
		ctx.fillRect(70+tank.hpMargin-5, -tank.hpMargin+canvas.height-tank.hpBarHeight-5, canvas.width-tank.hpMargin*2+10-70, tank.hpBarHeight+10);
		ctx.beginPath();
		hpBarStart = 70+tank.hpMargin;
		hpBarWidth = (canvas.width-70-tank.hpMargin*2)*((tank.hp)/tank.maxHp);
		ctx.moveTo(hpBarStart, -tank.hpMargin+canvas.height-tank.hpBarHeight);
		ctx.lineTo(hpBarStart, -tank.hpMargin+canvas.height);
		ctx.lineTo(hpBarStart + hpBarWidth, -tank.hpMargin+canvas.height);
		ctx.lineTo(hpBarStart + hpBarWidth, -tank.hpMargin+canvas.height-tank.hpBarHeight);
		ctx.lineTo(hpBarStart, -tank.hpMargin+canvas.height-tank.hpBarHeight);
		ctx.fillStyle = "rgb(255, 0, 0)";
		ctx.fill();
	//
	requestAnimationFrame(runGame);
}

window.addEventListener('keydown', function (e) {
	tank.keys = (tank.keys || {});
	tank.keys[e.code] = true;
});
window.addEventListener('keyup', function (e) {
	tank.keys[e.code] = false;
});
