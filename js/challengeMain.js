import Level from "./level.js";
import Egg from "./egg.js";
import Tank from "./tank.js";
import Enemy from "./enemy.js";
import WallTrigger from "./wallTrigger.js";
import EnemyTrigger from "./enemyTrigger.js";
import ChallengeTank from "./challengeTank.js";
import Bouncer from "./bouncer.js";
import HealthPack from "./healthPack.js";
import Platform from "./platform.js";
import {randomInt, getRandomInt, colliding} from "./utils.js";

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var scaleFactor = 0.7;

var form = document.getElementById('form');
var inputScore = document.getElementById('inputScore');
var inputName = document.getElementById('inputName');
var formFlex = document.getElementById('formFlex');
var scoreP = document.getElementById('scoreP');
var niceDiv = document.getElementById('niceDiv');

function resize() {
	canvas.width = innerWidth-20;
	canvas.height = innerHeight-25;
	scaleFactor = innerHeight/891
	formFlex.style.right = innerWidth/2-formFlex.offsetWidth/2 + "px";
	formFlex.style.top = innerHeight/2-formFlex.offsetHeight/2 + "px";
}
resize();
window.addEventListener("resize",resize);

var ticksSpent = 0;
var fps = 60;
var dt = 1;
var previousTime = 0;
var survived = 0;
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
entities.push(new Egg(60, -330, 64, 64))
entities.push(new Level(0, 200, 5000, 600, "grassTile"));
//DeathArena
entities.push(new EnemyTrigger(1000, 160, 40, 40, ChallengeTank, "challengeTank", 1000, 40, 1));
//Swingy Thingy

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
	//time
	ticksSpent += 1;
	//camera
	if (tank.x > ((canvas.width/2)/scaleFactor)-tank.width/2) {
		ctx.translate(-(tank.x+tank.width/2)*scaleFactor + canvas.width/2,
								-(tank.y+tank.height/2)*scaleFactor + canvas.height/2);
	}
	else {
		ctx.translate(0, -(tank.y+tank.height/2)*scaleFactor + canvas.height/2);
	}
	ctx.scale(scaleFactor, scaleFactor);
	//tutorial
	ctx.fillStyle = "rgb(50, 50, 50)";
	ctx.fillText("Kontroller:", 10, -50);
	ctx.fillText("A & D", 10, 0);
		ctx.fillText("-> Forover og bakover", 100, 0);
	ctx.fillText("W & S", 10, 50);
		ctx.fillText("-> Sikt opp og ned", 100, 50);
	ctx.fillText("Shift", 10, 100);
		ctx.fillText("-> Hopp", 100, 100);
	ctx.fillText("Space", 10, 150);
		ctx.fillText("-> Skyt", 100, 150);
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
			if (entities[i].y < -1000 && entities[i].type == "tank" && window.location.href != "index.html") {
				window.location.href = "index.html";
				run = false;
			}
		}
		if (entities[i].dead == true) {
			if (entities[i].type == "tank") {
				end = true;
			} else if (entities[i].type == "challengeTank" && end) {
				survived = entities[i].score;
				formFlex.style.display = "flex";
				resize();
				inputScore.value = Math.round(survived/10);
				scoreP.innerHTML = "Score: " + Math.round(survived/10);
			}
			entities.splice(i, 1);
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
	//HUD
		//spedometer
		var ometerRad = 70 * scaleFactor;
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
			spedomNum += 7;
		}
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

/* TODO:
Speedometer faktisk et spedometer?
Bomber som faller?

*/
