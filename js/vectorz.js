export default class Vecc {

	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
	normalize() {
		this.x = this.x/this.absolute();
		this.y = this.y/this.absolute();
	}
	multiply(num) {
		this.x *= num;
		this.y *= num;
	}
	add(x, y) {
		this.x += x;
		this.y += y;
	}
	absolute() {
		return (Math.sqrt(Math.pow(this.x, 2)+Math.pow(this.y, 2)));
	}
	set(x, y) {
		this.x = x;
		this.y = y;
	}
	rotate(β) {
		let newX = Math.cos(β*(Math.PI/180))*this.x-Math.sin(β*(Math.PI/180))*this.y;
		this.y = Math.cos(β*(Math.PI/180))*this.y+Math.sin(β*(Math.PI/180))*this.x;
		this.x = newX;
	}
}
