var puzzlefighter = document.getElementById('puzzlefighter');
var ctx = puzzlefighter.getContext('2d');
puzzlefighter.width='240';
puzzlefighter.height='520';
ctx.scale(40,40);
//create a map cover all of the points
var map= createMatrix(6,14);
var blockColor = ['red','yellow','blue','green',];
function createMatrix (w,h){
	const matrix = [];
	while (h--){
		matrix.push(new Array(w).fill(0));
	}
	return matrix;
}
// use for pass object by value
function clone(obj){
    if(obj == null || typeof(obj) != 'object')
        return obj;

    var temp = new obj.constructor(); 
    for(var key in obj)
        temp[key] = clone(obj[key]);

    return temp;
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
				break;}
		}
	
	if (this.shape=='circ')
	{colorCode+=4;}
return colorCode;
}
}

class matrixBlock{
	constructor(){
		this.matrixBlock = this.createMatrix();
		this.dx = 0;
		this.dy = 0;
		this.timer =0;
		this.pos = [];
		}
//initialize the matrixBlock with Block 
	createMatrix(){
			var Matrix = 	[[0,1,0],
							[0,1,0],
							[0,0,0]];
	for (var y = Matrix.length - 1; y >= 0; y--) {
			for (var x = Matrix[y].length - 1;x >= 0; x--) {
				if (Matrix[y][x] !==0)
				{
				 Matrix[y][x]=new block();
				 }}}
	return Matrix;
	}
	//return current coordinate with two pair of value to array this.pos
	getPos(matrixBlock){
		if (this.pos.length ==4){
			this.pos = [];
		}
		for (var y = matrixBlock.length - 1; y >= 0; y--) {
		for (var x = matrixBlock[y].length - 1;x >= 0; x--) {
		if (matrixBlock[y][x]!==0)
				{
					this.pos.push(x,y);
			}
		}}
		this.pos[1]+=this.dy;
		this.pos[3]+=this.dy;
		this.pos[0]+=this.dx;
		this.pos[2]+=this.dx;
	}
//clear all the thing with block of matrix
	draw(){
		this.getPos(this.matrixBlock);

		
		for (var y = this.matrixBlock.length - 1; y >= 0; y--) {
		for (var x = this.matrixBlock[y].length - 1;x >= 0; x--) {
			var block = this.matrixBlock[y][x];
			ctx.fillStyle = block.color;
					if (block!==0)
				{
			if (block.shape == 'circ'){
				ctx.beginPath();
				ctx.arc(x+.5+this.dx,y+.5+this.dy,.5,0*Math.PI,2*Math.PI);
					ctx.fill();	
			}else {
				ctx.fillRect(x+this.dx,y+this.dy,1,1);
				}}}}}
				
				//the exception of 
	autoFall(){
		this.timer+=1;
		if (this.timer==35){
			this.timer=0;
			this.dy+=1;
			}}
	renew(){
		this.matrixBlock = this.createMatrix();
		this.dx = 0;
		this.dy = 0;
		this.pos = [];
		}
		//copy blocks' colorcode into map
	printCode(){
		for (var y = this.matrixBlock.length - 1; y >= 0; y--) {
						for (var x = this.matrixBlock[y].length - 1; x >= 0; x--) {
							if (this.matrixBlock[y][x]!==0){
							map[this.dy+y][this.dx+x]=this.matrixBlock[y][x].colorCode;
								}}}}
	erase(x,y,eraser){
    //use one local variable to save the value incase the value being reset
    //check the surrounding block  => up(x,y+1),right(x+1,y), left(x-1,y),down(x,y-1)
     var b = [[1,0],
              [-1,0],
              [0,-1],
              [0,1]];
        for(var i = 0 ; i < b.length;i++){
            //if surrounding === any || surrounding +4 === any 
                       if(eraser === map[y+b[i][0]][x+b[i][1]] ||
                eraser === map[y+b[i][0]][x+b[i][1]]+4||
                eraser  === map[y+b[i][0]][x+b[i][1]]-4){
                map[y][x]= 0;
                map[y+b[i][0]][x+b[i][1]]=0;
                this.erase(x+b[i][1],y+b[i][0],eraser);
}
}
}


	clearBlock(){
		for (var y = 0; y <map.length-1; y++) {
	for (var x = 0; x <map[y].length; x++) {
			if (map[y][x]>4){
				this.erase(x,y,map[y][x]);
			}
			}
	}
}	
//after this 
	resize(){
	for (var x = 0;x< map[0].length;x++){
	    var arr = [];
	    for (var y = map.length-1; y >= 0; y--){
	       if (map[y][x]!=0){
	              arr.push(map[y][x]);
	              }        
	  }
	     var arrCurLength = arr.length;
	        if (arr.length !==map.length-1){
	         arr.length=map.length-1;
	     arr.fill(0,arrCurLength);
	    }
	     arr.reverse();
	  arr.push(0);
	 for (var a =0; a < map.length; a++){
	      map[a][x]=arr[a];
	   }
	 }
	}
 reset(){
for (var y = this.matrixBlock.length - 1; y >= 0; y--) {
	for (var x = this.matrixBlock[y].length - 1; x >= 0; x--) {
					if (this.matrixBlock[y][x]!==0){
							this.getPos(this.matrixBlock);

					if(map[this.pos[1]+1][this.pos[0]] !==0 ||
						map[this.pos[1]+1][this.pos[0]] !==0 ||
						this.dy + y >= 12){
					this.printCode();
		  			this.renew();
				
					}}}}}
	change(clockwise){
	
				 var matrix = clone(this.matrixBlock);
				if(clockwise ===1 ){
				  matrix.reverse();}
				  else{  matrix = matrix.map(function(row) {
				    return row.reverse();
				  });
				}
				  // swap the symmetric elements
				  for (var i = 0; i < matrix.length; i++) {
				    for (var j = 0; j < i; j++) {
				      var temp = matrix[i][j];
				      matrix[i][j] = matrix[j][i];
				      matrix[j][i] = temp;
				    }

				  }
				return matrix;
				}

	rotate(direction){
		var temp = this.change(direction);
		this.getPos(temp);
		// check the after one is 
		if(map[this.pos[1]][this.pos[0]]>=0 &&
			map[this.pos[1]][this.pos[0]]<map[map.length-1].length &&
			map[this.pos[1]][this.pos[0]]==0&&
			map[this.pos[3]][this.pos[2]]>=0 &&
			map[this.pos[3]][this.pos[2]]<map[map.length-1].length  &&
			map[this.pos[3]][this.pos[2]]==0){
			this.matrixBlock = temp;
		}
		
	}
		
	
	move(x){
			this.getPos(this.matrixBlock);
		if(map[this.pos[1]][this.pos[0]+x]>=0 &&
			map[this.pos[1]][this.pos[0]+x]<map[map.length-1].length &&
			map[this.pos[1]][this.pos[0]+x]==0&&
			map[this.pos[3]][this.pos[2]+x]>=0 &&
			map[this.pos[3]][this.pos[2]+x]<map[map.length-1].length  &&
			map[this.pos[3]][this.pos[2]+x]==0){
			
		this.dx+=x;}}
	
	fallFast(y){
			this.getPos(this.matrixBlock);
		if(map[this.pos[1]+y][this.pos[0]]<map.length-2 &&
			map[this.pos[1]+y][this.pos[0]]==0&&
			map[this.pos[3]+y][this.pos[2]]<map.length-2  &&
			map[this.pos[3]+y][this.pos[2]]==0){
			console.log(this.pos);
		this.dy+=y;}}
	

	}
function draw(map){

	for (var y = map.length-1; y >= 0; y--) {
		for (var x = map[y].length-1 ; x >= 0; x--) {

				if (map[y][x] !==0){
							if (map[y][x]>4)
								{ctx.fillStyle=blockColor[map[y][x]-4-1];
									ctx.beginPath();
						ctx.arc(x+.5,y+.5,.5,0*Math.PI,2*Math.PI);
					ctx.fill();	}
					else {
						ctx.fillStyle=blockColor[map[y][x]-1];
						ctx.fillRect(x,y,1,1);
						}}}}}	


Game = new matrixBlock();



function update() {
    	    	    ctx.fillStyle = '#000';
    	    ctx.fillRect(0,0,puzzlefighter.height,puzzlefighter.width);
 draw(map);
Game.draw();
Game.autoFall();
Game.reset();
Game.clearBlock();
Game.resize();
requestAnimationFrame(update);
}

document.addEventListener('keydown', event => {
    if (event.keyCode == 37) {
        Game.move(-1);

    } else if (event.keyCode == 39) {
        Game.move(1);

    } else if (event.keyCode == 81) {
    		Game.rotate(-1);
    } 
    else if (event.keyCode == 69){
    	Game.rotate(1);
    }
        else if (event.keyCode == 40){
    	Game.fallFast(1);
    }
  
});

update();
