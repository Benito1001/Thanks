export default class Rect {
	constructor(x, y, width, height) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}
	get left() {
		return this.x;
	}
	get right() {
		return this.x + this.width;
	}
	get top() {
		return this.y;
	}
	get bottom() {
		return this.y + this.height;
	}
	get midX() {
	return this.x-this.width/2;
	}
	get midY() {
		return this.y + this.height/2;
	}
}
