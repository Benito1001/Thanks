import Tank from "./tank.js";
import FemaleTank from "./femaleTank.js";
import Level from "./level.js";
import Chopper from "./chopper.js";
import Rock from "./rock.js";
import Zebra from "./zebra.js";
import Tree from "./tree.js";
import Giraffe from "./giraffe.js";
import Slope from "./slope.js";
import Wall from "./wall.js";
import Teleporter from "./teleporter.js";
import { colliding } from "./utils.js";

var bodyDiv = document.getElementsByClassName('bodyDiv')[0];
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var scaleFactor = 0;


resize();
window.addEventListener("resize", resize);
function resize() {
	canvas.width = bodyDiv.offsetWidth;
	canvas.height = bodyDiv.offsetHeight;
	scaleFactor = innerHeight/891
}

var dt = 1;
var previousTime = 0;
var run = true;

var entities = [];
var tank;
var dead = false;
var c = 0;
var r = 0;

var addLength = 200;

var backgroundWidth = 7700+1100;
var plainsBackground;
var backgroundHeight;

var hpBarStart = 0;
var hpBarWidth = 0;
var checkpoints = [];
var tutpos = 10;

window.addEventListener("load", event => {
	plainsBackground = document.getElementById('plainsBackground');
	backgroundHeight = backgroundWidth*(plainsBackground.height/plainsBackground.width);

	//Initialize Entities

	//Start
	tank = new Tank();
	entities.push(tank);
	entities.push(new FemaleTank(300, 127));
	entities.push(new Chopper(700, -180, "cutscene", entities));

	//Turtorial
	entities.push(new Level(0, 200, 5500, 600, "grassTile"));
	var currentX = addLength;
	checkpoints.push({x: currentX+150, y: 139});
	entities.push(new Rock(currentX + 350, 140, 100, 60));
	entities.push(new Zebra(currentX + 550, 0))
	entities.push(new Rock(currentX + 950, 170, 80, 30));
	entities.push(new Rock(currentX + 1135, 124, 120, 80));
	currentX += 1135

	//Treetrap
	entities.push(new Tree(currentX + 185, 15, 140));
	entities.push(new Rock(currentX + 285, 155, 240, 50));
	entities.push(new Tree(currentX + 465, 15, 140));
	entities.push(new Zebra(currentX + 715, 0));
	entities.push(new Zebra(currentX + 915, 0));
	currentX += 915;

	//Arena
	checkpoints.push({x: currentX + 200, y: 139});
	entities.push(new Slope(currentX + 370, 161, 50, 50, "right"));
	entities.push(new Wall(currentX + 414, 161, 1050, 50));
	entities.push(new Slope(currentX + 1460, 161, 50, 50, "left"));
	entities.push(new Giraffe(currentX + 915, -290));
	currentX += 1510

	//Zebro
	checkpoints.push({x: currentX + 200, y: 139});
	entities.push(new Rock(currentX + 600, 140, 100, 60));
	entities.push(new Zebra(currentX + 700, 0))
	entities.push(new Zebra(currentX + 900, 0))
	entities.push(new Zebra(currentX + 1100, 0))
	entities.push(new Tree(currentX + 1300, 100, 80));
	entities.push(new Tree(currentX + 1500, -40, 180));

	//Bossu
	checkpoints.push({x: 5405, y: 120});
	entities.push(new Level(5505, 300, 2000, 500, "grassTile"));
	entities.push(new Slope(5505, 200, 100, 100, "left"));
	entities.push(new Chopper(6505-150, -200, "boss", entities));
	entities.push(new Slope(7405, 200, 100, 100, "Right"));
	entities.push(new Level(7500, 200, 500, 600, "grassTile"));
	entities.push(new Teleporter(7500, 200-288, "Desert"))
	checkpoints.push({x: 7600, y: 139});
	checkpoints.push({x: 80000, y: 139});

	//Start Game
	requestAnimationFrame(runGame);
});

function runGame(currentTime) {
	//dt
		dt = (currentTime - previousTime)/(1000/60);
		previousTime = currentTime;
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		if (dt >= 8) {
			dt = 8;
		}
	//Updates entities
		if (run) {
			for (var i in entities) {
				if (colliding(tank.x-(canvas.width)/scaleFactor, (canvas.width/scaleFactor)*2, entities[i].x, entities[i].width,
				tank.y-(canvas.height)/scaleFactor,( canvas.height/scaleFactor)*2, entities[i].y, entities[i].height,
				true)) {
					entities[i].update(entities, ctx, dt, scaleFactor);
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
	//background
		ctx.drawImage(plainsBackground, addLength-200, -950, backgroundWidth, backgroundHeight)
	//tutorial
		ctx.font = '50px serif';
		ctx.fillStyle = "rgb(255, 255, 255)";
		ctx.fillText("Kontroller:", tutpos+10, -150);
		ctx.strokeText("Kontroller:", tutpos+10, -150);
		ctx.fillText("A & D", tutpos+10, -100);
		ctx.strokeText("A & D", tutpos+10, -100);
			ctx.fillText("-> Forover og bakover", tutpos+170, -100);
			ctx.strokeText("-> Forover og bakover", tutpos+170, -100);
		ctx.fillText("W & S", tutpos+10, -50);
		ctx.strokeText("W & S", tutpos+10, -50);
			ctx.fillText("-> Sikt opp og ned", tutpos+170, -50);
			ctx.strokeText("-> Sikt opp og ned", tutpos+170, -50);
		ctx.fillText("Shift", tutpos+10, 0);
		ctx.strokeText("Shift", tutpos+10, 0);
			ctx.fillText("-> Hopp", tutpos+170, 0);
			ctx.strokeText("-> Hopp", tutpos+170, 0);
		ctx.fillText("Space", tutpos+10, 50);
		ctx.strokeText("Space", tutpos+10, 50);
			ctx.fillText("-> Skyt", tutpos+170, 50);
			ctx.strokeText("-> Skyt", tutpos+170, 50);
		if (run) {
			for (var i in entities) {
				if (colliding(tank.x-(canvas.width)/scaleFactor, (canvas.width/scaleFactor)*2, entities[i].x, entities[i].width,
											tank.y-(canvas.height)/scaleFactor,( canvas.height/scaleFactor)*2, entities[i].y, entities[i].height,
											true)) {
					entities[i].draw(ctx, dt, entities);
					if (entities[i].y > 1000) {
						entities[i].dead = true;
					}
					if (entities[i].y < -1000 && entities[i].type == "tank" && entities[i].x < 500 && window.location.href != "challenge.php") {
						window.location.href = "challenge.php";
						run = false;
					}
				}
				if (entities[i].dead == true) {
					if (entities[i].type == "chopper") {
						tank.start = true;
					}
					if (entities[i].type == "tank") {
						dead = true;
					}
					entities.splice(i, 1);
					i-=1;
				}
			}
		}
	//transform
		ctx.setTransform(1, 0, 0, 1, 0, 0);
	//rip
		if (dead) {
			if (tank.keys.KeyR) {
				for (var i in entities) {
					if (entities[i].type == "boss" || (entities[i].type == "chopper" && entities[i].chopperType == "boss")) {
						//var temp = entities[i];
						//entities.splice(i, 1)
						entities[i].reset(entities);
						//entities.push(temp);
					}
				}
				tank.reset(checkpoints);
				entities.push(tank)
				dead = false;
			}
			var txt = "You are dead, respawn by pressing r";
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

	requestAnimationFrame(runGame);
}

window.addEventListener('keydown', event => {
	tank.keys[event.code] = true;
});
window.addEventListener('keyup', event => {
	tank.keys[event.code] = false;
});
