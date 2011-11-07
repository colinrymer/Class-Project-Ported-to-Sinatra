var score=0;
var moles=0;
var count=document.getElementById("scoreCount");
var field= new Array();
var t;
var b;
var flag=0;
var currentRow;
var currentCol;

function displayInstruction()
{
	alert("The object of the game is to hit the mole as he comes up.\nUse the mouse to click on the mole when he pops up.\nTo pause and display the score, press the Check Score button.");
}
function random3()
{
	return Math.floor(Math.random()*3);
}
function start()
{
	field[0]=document.getElementById("excitingTable").rows[0].cells;
	field[1]=document.getElementById("excitingTable").rows[1].cells;
	field[2]=document.getElementById("excitingTable").rows[2].cells;
	
	t=setTimeout("cont()",Math.floor(Math.random()*1000));
}
function cont()
{
	currentRow=Math.floor(Math.random()*3);
	currentCol=Math.floor(Math.random()*3);
	t=setTimeout("moleUp()",Math.floor(Math.random()*1000));
}	
function moleUp()
{
	field[currentRow][currentCol].innerHTML='<img src="img/whackamole/mole.gif" onclick="hit()" height="175" width="175" />';
	moles++;
	t=setTimeout("ifStatements()",1000);
}
function ifStatements()
{
	if(flag==0)		//if no hit
	{
		clear();
		cont();
	}
	if(flag==1)		//if hit
	{
		cont()
		flag=0;
	}
}
function clear()		//clears the board, sets all holes
{
	var i; var j;
	for(i=0;i<3;i++)
	{
		for(j=0;j<3;j++)
		{
			field[i][j].innerHTML='<img src="img/whackamole/hole.jpg" height="175" width="175" />';
		}
	}
}
function hit()			//if mole is clicked
{
	score++;
	flag=1;
	clear();
}
function checkScore()		//displays score in a popup, pauses game
{
	var misses = moles-score;
	var ratio = (score/moles)*100;
	var temp = ratio%1;
	ratio = ratio-temp;
	alert('Score = ' + score + '\nMisses = ' + misses + '\nHit Ratio = ' + ratio + '%');
}