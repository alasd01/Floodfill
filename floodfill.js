//------------ Canvas Initialization ------------//

var canvas = document.querySelector('canvas'); // goes through doc and grabs canvas element
canvas.width = 550;
canvas.height = 550;
document.querySelector("hr").style.width = "800px";
document.querySelector(".description").style.width = "800px";

let Stack = [];

var c = canvas.getContext('2d'); 

const randomColor = () => {
    let str = Math.round(Math.random() * 0x1000000).toString(16)
    while (str.length < 6) {
      str = '0' + str
    }
    return '#' + str
  }


//------------ Helper functions for Floodfill ------------//

//function getMousePosition
// gets the mouse position on the canvas 
function getMousePosition(canvas, event) { 
    let rect = canvas.getBoundingClientRect(); 
    let x = event.clientX - rect.left; 
    let y = event.clientY - rect.top; 
    return [x,y];
} 


// function colorMatch
// check to see if two pixels (a & b) are the same color
function colorMatch(a, b) {
    return a.r === b.r && a.g === b.g && a.b === b.b && a.a === b.a
    }
      
// function getColoratPixel
// gets the rgba value of a specified pixel
function getColorAtPixel(imageData, x, y) {
    const {width, data} = imageData
      
    return {
        r: data[4 * (width * y + x) + 0],
        g: data[4 * (width * y + x) + 1],
        b: data[4 * (width * y + x) + 2],
        a: data[4 * (width * y + x) + 3]
    }
}

//function setColorAtPixel
// sets the rgba value of a specified pixel to a new color
function setColorAtPixel(imageData, new_color, x, y) {
    const {width, data} = imageData
      
    data[4 * (width * y + x) + 0] = new_color.r & 0xff
    data[4 * (width * y + x) + 1] = new_color.g & 0xff
    data[4 * (width * y + x) + 2] = new_color.b & 0xff
    data[4 * (width * y + x) + 3] = new_color.a & 0xff
}


//------------ Floodfilll (Bucket fill) ------------//
// function floodfill
// uses forest fire algorithm, except checks eight neighbors instead of four
function floodfill(baseColor, new_color, row_num, col_num, numRows, numCols){
    if (colorMatch(baseColor, new_color)) {
        return;
      }
    if (row_num + 1 < numRows){
        if(colorMatch(getColorAtPixel(imageData,row_num+1,col_num),baseColor)){
            setColorAtPixel(imageData,new_color,row_num+1,col_num);
            Stack.push([row_num + 1, col_num]);
        
        }
        if(col_num+1 < numCols){
            if (colorMatch(getColorAtPixel(imageData,row_num+1,col_num+1),baseColor)) {
                setColorAtPixel(imageData,new_color,row_num+1,col_num+1);
                Stack.push([row_num + 1, col_num+1]);
            }
        }
        if(col_num-1 >= 0){
            if(colorMatch(getColorAtPixel(imageData,row_num+1,col_num-1),baseColor)){
                setColorAtPixel(imageData,new_color,row_num+1,col_num-1);
                Stack.push([row_num + 1, col_num-1]);
            }
        }

    }
    if(row_num - 1 >= 0){
    
        if(colorMatch(getColorAtPixel(imageData,row_num-1,col_num),baseColor)){
            setColorAtPixel(imageData,new_color,row_num-1,col_num);
            Stack.push([row_num - 1, col_num]);
        }
        if(col_num+1 < numCols){
            if (colorMatch(getColorAtPixel(imageData,row_num-1,col_num+1),baseColor)) {
                setColorAtPixel(imageData,new_color,row_num-1,col_num+1);
                Stack.push([row_num - 1, col_num+1]);
               
            }
        }
        if(col_num-1 >= 0){
            if(colorMatch(getColorAtPixel(imageData,row_num-1,col_num-1),baseColor)){
                setColorAtPixel(imageData,new_color,row_num-1,col_num-1);
                Stack.push([row_num - 1, col_num-1]);
            }
        }
    }
    if(col_num - 1 >= 0){
        if(colorMatch(getColorAtPixel(imageData,row_num,col_num-1),baseColor)){
            setColorAtPixel(imageData,new_color,row_num,col_num-1);
            Stack.push([row_num, col_num-1]);
        }
    }
    if(col_num + 1 < numCols){
        if(colorMatch(getColorAtPixel(imageData,row_num,col_num+1),baseColor)){
            setColorAtPixel(imageData,new_color,row_num,col_num+1);
            Stack.push([row_num, col_num+1]);
        }
    }

}

let row_num, col_num;
var numRows = canvas.height;
var numCols = canvas.width;

// function getfloodfill
// runs floodfill function, initializes new color and mouse coords, sets base color and stack array
function getfloodfill(e){ 
    let coords = getMousePosition(canvas, e); 
    col_num = parseInt(coords[1]);
    row_num = parseInt(coords[0]);
    var new_color = {r: 0x0, g: 0x0, b: 0x0, a: 0xff};
    var baseColor = getColorAtPixel(imageData,row_num,col_num);
    Stack.push([row_num, col_num]);
    while(Stack.length){
        floodfill(baseColor, new_color, row_num, col_num, numRows, numCols);
        let newPos = Stack.pop();
        row_num = newPos[0];
        col_num = newPos[1];
    }
    c.putImageData(imageData, 0, 0);
    
}

//------------ Drawing using Mouse ------------//e
    let painting = false;

//draw function helper endPosition
//stops drawing
function endPosition(){
    painting = false; 
    c.beginPath();
}

//draw function helper startPostion
// starts drawing
function startPosition(){
    painting = true;
}

// function draw
// draws and sets the lineWidth 
function draw(e){
    if(!painting) {
        return;
    }
c.lineWidth = Math.random() * 20;
c.lineCap = "round";
c.strokeStyle= randomColor();

let xy = getMousePosition(canvas,e);
var x = xy[0];
var y = xy[1];

c.lineTo(x, y);
c.stroke();
c.beginPath();
c.moveTo(x,y);
    }

//------------ Events ------------//
var btn2 = document.getElementById('clear');

btn2.onmousedown = function(){
    c.clearRect(0, 0, canvas.width, canvas.height);
    imageData = c.getImageData(0, 0, canvas.width, canvas.height);
    btn2.style.backgroundColor = "red";
}

btn2.onmouseup = function(){
    btn2.style.backgroundColor = "green";
}

var btn = document.getElementById('fill');
var toggle = false;
var btn1 = document.getElementById('draw');
var toggle1 = false;
btn1.onclick = function(){
    if(!toggle1){
        toggle = false;
        toggle1 = true;
        canvas.addEventListener('mousedown', startPosition);
        canvas.addEventListener('mouseup', endPosition);
        canvas.addEventListener('mousemove', draw);
        canvas.removeEventListener("mousedown", getfloodfill);
        btn.style.backgroundColor = "green";
        btn1.style.backgroundColor = "red";
    }
}

btn.onclick = function(){
    if(!toggle){
        toggle = true;
        toggle1 = false;
        imageData = c.getImageData(0, 0, canvas.width, canvas.height);
        canvas.removeEventListener('mousedown', startPosition);
        canvas.removeEventListener('mouseup', endPosition);
        canvas.removeEventListener('mousemove', draw);
        btn1.style.backgroundColor = "green";
        canvas.addEventListener("mousedown", getfloodfill);
        btn.style.backgroundColor = "red";
    }
} 

var rando_rec = document.getElementById('rando');

rando_rec.onmousedown = function(){
    rando_rec.style.backgroundColor = "red";
    for (let i = 0; i < 30; i++) {
        c.fillStyle = randomColor();
        c.fillRect(
          Math.round(Math.random() * canvas.width),
          Math.round(Math.random() * canvas.height),
          Math.round(Math.random() * 450),
          Math.round(Math.random() * 450)
        )
      }
      imageData = c.getImageData(0, 0, canvas.width, canvas.height);

}

rando_rec.onmouseup = function(){
    rando_rec.style.backgroundColor = "green";
}





