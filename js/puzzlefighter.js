var puzzlefighter = document.getElementById('puzzlefighter');
var ctx = puzzlefighter.getContext('2d');
puzzlefighter.width='240';
puzzlefighter.height='520';
ctx.scale(40,40);
const map= createMatrix(6,14);
var blockColor = ['red','yellow','blue','green',];
function createMatrix (w,h){
	const matrix = [];
	while (h--){
		matrix.push(new Array(w).fill(0));
	}
	return matrix;
}

class block{
constructor(){
	this.color = this.blockColor();
	this.shape = this.blockShape();
	this.colorCode = this.colorCode();


}
//block's color ['red','yellow','blue','green',];
blockColor(){
	var i = Math.floor(Math.random()*4)

	return blockColor[i];
}
//block's shape 1/5 circle 4/5 rectangle
blockShape(){
	var i = Math.floor(Math.random()*10);
	if (i ==1 || i ==0){
		return 'circ';
	}
	else 
		return 'rect';
}
//block's colorCode		 Rect 1-4=>['red','yellow','blue','green',]
//use for print on map   Circ 5-8=>['red','yellow','blue','green',]
colorCode(){
	var colorCode = 0;
		for (var i = blockColor.length - 1; i >= 0; i--) {
			switch(this.color){
				case blockColor[i]:
				colorCode = i+1;
				break;
}
		}
	
	if (this.shape=='circ')
	{colorCode+=4;}
return colorCode;
}



autoFall(){
this.y+=this.dy;
	this.draw();
}
move(x){
	if ((x>0&&this.x<5&&map[Math.floor(this.y)][Math.floor(this.x+x)]==0)
		||(x<0&&this.x>0&&map[Math.floor(this.y)][Math.floor(this.x+x)]==0)){
	this.x +=x;}
}
renew(){
	this.y = 0;
	this.color = this.blockColor();
	this.shape = this.blockShape();
}

}

class matrixBlock{
	constructor(){
		this.matrixBlock = this.createMatrix();
		this.dx = 0;
		this.dy = 0;
		this.timer =0;
		
	}
	createMatrix(){
			var Matrix = 	[[0,1,0],
							[0,1,0],
							[0,0,0]];
	for (var y = Matrix.length - 1; y >= 0; y--) {
			for (var x = Matrix[y].length - 1;x >= 0; x--) {
				if (Matrix[y][x] !==0)
				{
				 Matrix[y][x]=new block();
				}
			}
		}
	return Matrix;
	}

	draw(){
		for (var y = this.matrixBlock.length - 1; y >= 0; y--) {
		for (var x = this.matrixBlock[y].length - 1;x >= 0; x--) {
		if (this.matrixBlock[y][x]!==0)
				{

				//	if (this.pos.length==4){
				//		this.pos=[];
			//		}
//this.pos.push(x,y);
			var block = this.matrixBlock[y][x];
ctx.fillStyle = block.color;
			
			if (block.shape == 'circ'){
				ctx.beginPath();
				ctx.arc(x+.5+this.dx,y+.5+this.dy,.5,0*Math.PI,2*Math.PI);
					ctx.fill();	
			}else {
				ctx.fillRect(x+this.dx,y+this.dy,1,1);
				}
				
				}
			}
		}
		}

	autoFall(){
		this.timer+=1;
		if (this.timer==5){
			this.timer=0;
			this.dy+=1;
			console.log(map[this.dy][this.dx]);
			}}
	renew(){
	this.dy = 0;
	this.matrixBlock = this.createMatrix();
		}
	printCode(){
		for (var y = this.matrixBlock.length - 1; y >= 0; y--) {
						for (var x = this.matrixBlock[y].length - 1; x >= 0; x--) {
							if (this.matrixBlock[y][x]!==0){
							map[this.dy+y][this.dx+x]=this.matrixBlock[y][x].colorCode;
								}}}
	}
 reset(){
for (var y = this.matrixBlock.length - 1; y >= 0; y--) {
	for (var x = this.matrixBlock[y].length - 1; x >= 0; x--) {
					if (this.matrixBlock[y][x]!==0){

					if(map[this.dy+y+1][this.dx+x] !==0){
					this.printCode();
					this.renew();
				}
							
//console.log(map);
//this.renew();
					
						if (this.dy + y == 12 ){
										this.printCode();
										this.renew();

						}
					}
	}
}
					
					 
 }
}
function clearElement(map){
	if (this.map[y][x]-4 == this.map[y][x+1] ||
		this.map[y][x]-4 == this.map[y][x-1] ||
		this.map[y][x]-4 == this.map[y+1][x] ){
		this.map[y][x] = 0;
		console.log(map);
		return clearElement(this.map[y][x+1]);
	}
}
function check(map){
	for (var y = map.length-1; y >= 0; y--) {
		for (var x = map[y].length-1 ; x >= 0; x--) {
			if (map[y][x]!==0){
				if(map[y][x]>4){
					clearElement(map[y][x]);
					}}}}}

function draw(map){
	for (var y = map.length-1; y >= 0; y--) {
		for (var x = map[y].length-1 ; x >= 0; x--) {
			if (map[y][x]!==0){
							if (map[y][x]>4)
								{ctx.fillStyle=blockColor[map[y][x]-4-1];
									ctx.beginPath();
						ctx.arc(x+.5,y+.5,.5,0*Math.PI,2*Math.PI);
					ctx.fill();	}else {
						ctx.fillStyle=blockColor[map[y][x]-1];
						ctx.fillRect(x,y,1,1);
				}	
			}
		}
	}
}	

block1 = new block(3,0);
Game = new matrixBlock();



function update() {
    	    ctx.fillStyle = '#000';
    	    ctx.fillRect(0,0,puzzlefighter.height,puzzlefighter.width);
 draw(map);
Game.draw();
Game.autoFall();
Game.reset();

        requestAnimationFrame(update);
}

document.addEventListener('keydown', event => {
    if (event.keyCode === 37) {
        block1.move(-1);
    } else if (event.keyCode === 39) {
        block1.move(1);
    } else if (event.keyCode === 40) {
    		block1.y+=1;
    } 
});

update();
console.log(map);

