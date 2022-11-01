let socket = io();

//adding confirmation that the connection was created
socket.on("connect", () => {
  console.log('connected to server via sockets')
})


//p5 code
var sym = 6;//number of reflections

let inputSym, button1, info1;//UI for change sym

let buttonLine, info2;//UI for change line color
let lineC = { r: 0, g: 0, b: 0 }

let buttonSC, info3;//UI for change shadow color
let SC = { r: 255, g: 0, b: 0 }

//set up background and UI
function setup() {
  createCanvas(windowWidth, 800);
  background(0);
  angleMode(DEGREES);

  //Creating the save button for the file
  saveButton = createButton('save');
  saveButton.mousePressed(saveFile);
  saveButton.position(20, 930);

  //creating input bar for sym
  inputSym = createInput();
  inputSym.position(20, 180);
  //creating button to apply sym
  button1 = createButton('GO!');
  button1.position(inputSym.x + inputSym.width, 180);
  button1.mousePressed(setSym);
  //creat text for set sym
  info1 = createElement('h1', 'Set Symmetry - Num Only');
  info1.position(20, 140);
  info1.style('color', '#ffffff');
  info1.style('font-size', '18px');

  //creating button to apply line color
  buttonLine = createButton('GO!');
  buttonLine.position(300, 185);
  buttonLine.mousePressed(randomColor);
  //creat text for set color
  info2 = createElement('h2', 'Random Line Color');
  info2.position(300, 140);
  info2.style('color', '#ffffff');
  info2.style('font-size', '18px');

  //creating button to apply shadow color
  buttonSC = createButton('GO!');
  buttonSC.position(530, 185);
  buttonSC.mousePressed(randomSC);
  //creat text for set color
  info2 = createElement('h3', 'Random shadow Color');
  info2.position(530, 140);
  info2.style('color', '#ffffff');
  info2.style('font-size', '18px');

}

//update sym to input number
function setSym() {
  sym = inputSym.value();
}

//update line color
function randomColor() {
  lineC.r = random(255);
  lineC.g = random(255);
  lineC.b = random(255);
}

//update shadow color
function randomSC() {
  SC.r = random(255);
  SC.g = random(255);
  SC.b = random(255);

}


//reset canvas
function keyPressed() {
  if (keyCode === BACKSPACE) {
    background(0);
  }
}

// Save File Function
function saveFile() {
  save('MyMagicMatrix.png');
}

//old P5
//dram when mouse pressed
function draw() {
  translate(width / 2, height / 2);

  let temp_y = mouseY - height / 2;
  let temp_x = mouseX - width / 2;
  let temp_px = pmouseX - width / 2;
  let temp_py = pmouseY - height / 2;
  let angle = 360 / sym;

  let dataObj = {
    x: temp_x, y: temp_y, px: temp_px, py: temp_py,
    ang: angle,
    lineR: lineC.r, lineG: lineC.g, lineB: lineC.b,
    shadowR: SC.r, shadowG: SC.g, shadowB: SC.b
  }

  if (mouseIsPressed) {
    drawPainting(dataObj);
    socket.emit("data", dataObj)
  }
}


//ON GETTING DATA FROM SERVER, draw the painting
socket.on('dataFromServer', (dataObj) => {
  //console.log(dataObj);
  drawPainting(dataObj);
})

function drawPainting(dataObj) {
  for (var i = 0; i < sym; i++) {
    //set shadow
    drawingContext.shadowColor = color(dataObj.shadowR, dataObj.shadowG, dataObj.shadowB);
    drawingContext.shadowBlur = 20;
    //draw lines
    rotate(dataObj.ang);
    stroke(dataObj.lineR, dataObj.lineG, dataObj.lineB);
    strokeWeight(random(1, 10));
    line(dataObj.x, dataObj.y, dataObj.px, dataObj.py);
    push();
    scale(1, -1);
    line(dataObj.x, dataObj.y, dataObj.px, dataObj.py);
    pop();
  }
}