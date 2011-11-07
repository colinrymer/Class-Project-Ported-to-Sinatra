var canvas;  
var cursor;
var dx = 5;
var dy = 5;
var x = null;
var y = null;
var WIDTH = 482;
var HEIGHT = 482; 
var img = new Image();
var collision = 0;
var msToMinutes=1000*60;
var startDate=new Date();
var startTime=startDate.getTime();
var timeToWin=0;
var minutesToWin = 0;
var secondsToWin = 0;

var level = null;
var winXleft = null;
var winXright = null;
var winYtop = null;
var winYbottom = null;

function rect(x,y,w,h) {
	cursor.beginPath();
	cursor.rect(x,y,w,h);
	cursor.closePath();
	cursor.fill();
}
 
function clear() {
	cursor.clearRect(0, 0, WIDTH, HEIGHT);
	cursor.drawImage(img, 0, 0);
}

function init() {
	canvas = document.getElementById("canvas");
	cursor = canvas.getContext("2d");
	img.src = "../img/maze/"+(level-1)+".gif";
	return setInterval(draw, 10);
}

function doKeyDown(evt){
	if ((x >= winXleft) && (x <= winXright) && (y >= winYtop) && (y <= winYbottom)) {
		startDate=new Date();	
		timeToWin=startDate.getTime() - startTime;
		minutesToWin=timeToWin/msToMinutes;
		secondsToWin=(minutesToWin-Math.floor(minutesToWin))*60;
		alert("You solved the Level "+ level +" in " + Math.floor(minutesToWin) + " minutes and " + Math.round(secondsToWin) + " seconds!");
		location.href="?level=" + (level + 1) + "";
	} 
	
	if (isLoggedIn == true)
	{
		switch (evt.keyCode)
		{
			case 87:  /* Up */
				if (y - dy > 0){ 
					y -= dy;
					clear();
					checkcollision();
					if (collision == 1){
						y += dy;
						collision = 0;
					} 
				}
			break;
			
			case 83:  /* Down  */
				if (y + dy < HEIGHT ){ 
					y += dy;
					clear();
					checkcollision();
						if (collision == 1){
							y -= dy;
							collision = 0;
						}
				}
			break;
			
			case 65:  /* Left  */
				if (x - dx > 0){ 
					x -= dx;
					clear();
					checkcollision();
					if (collision == 1){
						x += dx;
						collision = 0;
					}
				}
			 break;
			 
			case 68:  /* Right  */
				if ((x + dx < WIDTH)){ 
					x += dx;
					clear();
					checkcollision();
					if (collision == 1){
						x -= dx;
						collision = 0;
					}
				}
			break;

		}
	}
}

function checkcollision() {
	var imgd = cursor.getImageData(x, y, 15, 15);
	var pix = imgd.data;
	for (var i = 0; n = pix.length, i < n; i += 4) {
		if (pix[i] == 0) {
			collision = 1;
		}
	}
}

function draw() {
	clear();          
	cursor.fillStyle = "blue";
	rect(x, y, 15,15);
}