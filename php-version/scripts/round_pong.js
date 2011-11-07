/** @license Copyright 2011 Chad Schouggins - Team Four Technology

	Licensed under the Apache License, Version 2.0 (the "License");
	you may not use this file except in compliance with the License.
	You may obtain a copy of the License at

		http://www.apache.org/licenses/LICENSE-2.0

	Unless required by applicable law or agreed to in writing, software
	distributed under the License is distributed on an "AS IS" BASIS,
	WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	See the License for the specific language governing permissions and
	limitations under the License.
*/

// exported symbols
/** @ignore */ $ = $; // will be remove during compilation, avoids conflicts with jquery which otherwise may rename a function to $()
window["init"] = init;

// key codes
/** @const @type {number} */ var KEY_LEFT = 37;
/** @const @type {number} */ var KEY_RIGHT = 39;
/** @const @type {number} */ var KEY_A = 65;
/** @const @type {number} */ var KEY_D = 68;
/** @const @type {number} */ var KEY_SPACE = 32;

// table attributes
/** @const @type {number} */ var TABLE_HEIGHT = 600;
/** @const @type {number} */ var TABLE_WIDTH = 600;
/** @const @type {number} */ var TABLE_RADIUS = 225; // distance between center of table and paddles.
/** @const @type {Object.<string, number>} */ var TABLE_CENTER = {x:TABLE_WIDTH / 2, y:TABLE_HEIGHT / 2}; // stored to prevent constantly calculating the center coords.
/** @const @type {number} */ var TABLE_RING_RADIUS = 263; // radius to determine end game

//ball attributes
/** @const @type {number} */ var BALL_RADIUS = 9; // radius of actual ball (used for collision) 
/** @const @type {number} */ var BALL_RADIUS_GLOW = 16; // css value (actual image size) for use with display position
/** @const @type {number} */ var BALL_INIT_SPEED = 4;
/** @const @type {number} */ var BALL_ACCELERATION = 0.2;
/** @const @type {number} */ var BALL_MAX_SPEED = 10;

// paddle attributes
/** @const @type {number} */ var PADDLE_SPEED = 1.5; // default distance moved per game cycle. used to initialize paddles, not used in calculations
/** @const @type {number} */ var PADDLE_WIDTH = 108;
/** @const @type {number} */ var PADDLE_HEIGHT = 18;
/** @const @type {number} */ var PADDLE_OFFSET_X = PADDLE_WIDTH / 2;
/** @const @type {number} */ var PADDLE_OFFSET_Y = PADDLE_HEIGHT / 2;
/** @const @type {number} */ var PADDLE_SPREAD_ANGLE = toDegrees(Math.atan((PADDLE_OFFSET_X + BALL_RADIUS) / TABLE_RADIUS)); // used in "hittest".

// game attributes
/** @const @type {number} */ var GAME_SPEED = 20; // time in milliseconds of each game cycle.

// AI attributes
/** @const @type {number} */ var AI_ACCURACY = PADDLE_SPREAD_ANGLE * .5;

// components

/**
 * stores information about the table.
 * mostly unused as table properties are constant, escept to get the element.
 * @type {!Object}
 */
var table = {};

/**
 * stores information about the ball.
 * @type {!Object}
 */
var ball = {};

/**
 * stores information about the blue paddle.
 * @type {!Object}
 */
var paddleBlue = {};

/**
 * stores information about the red paddle.
 * @type {!Object}
 */
var paddleRed = {};

/**
 * holds the score for each player.
 * @type {!{blue:number, red:number}}
 */
var score = {blue:0, red:0};

/**
 * stores keystates by tracking keyevents.
 * @type {!Object}
 */
var keys = {};

/**
 * stores setInterval() id used in event "loop", also serves as "pause" test.
 * @type {number}
 */
var loopInterval = 0;

/**
 * store vendor specific css transform (set in init()).
 * @type {string}
 */
var styleTransform;

/**
 * prevents multiple hits.
 * @type {boolean}
 */
var ignoreHitTest = false;

/**
 * toggles ai control of red paddle.
 * @type {boolean}
 */
var isVersus = false;

/**
 * holds the current difficulty setting
 * @type {number}
 */
var difficulty;

/**
 * <p> element to post notices.
 * @type {Element}
 */
var msgElem;

/*******************************************************************************
	event handlers
*///////////////////////////////////////////////////////////////////////////////
/**
 * keeps track of key states.
 * adds key code to an array with the value of 1. separate handeler will
 * remove the key from the array on key up.
 * @param {Object} e key event object
 * @return {boolean} key capture value for browser
 */
function onKeyDown(e)
{
	if (!e) e = window.event;
	var key = window.event ? window.event.keyCode : e.which; // ie
	
	keys[key] = 1;
	
	// pause on space
	if (key == KEY_SPACE)
		pause();
	
	// capture if focused
	if (table.hasFocus)
	{
		e.cancelBubble = true;
		if (e.stopPropagation) e.stopPropagation();
		if (e.preventDefault) e.preventDefault();
	}
	
	return !table.hasFocus
}

/**
 * keeps track of key states.
 * removes key code from an array. separate handeler should put keys
 * in the array on key down.
 * @param {Object} e key event object
 */
function onKeyUp(e)
{
	/** @type {number} */ var key = window.event ? window.event.keyCode : e.which; // ie
	
	delete keys[key];
}

/**
 * handles starting a new game
 * @param {Object} e event object
 */
function onNewGameClick(e)
// must be assigned on init as the element does not yet exist.
{
	if (loopInterval != 0) // only pause if not already paused
		pause();
		
	msg("New Game", "Press [SPACE] to begin"); // override pause message
	
	// reset scores
	score.blue = 0;
	score.red = 0;
	
	table.setFocus(true);
	
	// reset table
	reset();
	refresh();
}

/**
 * handles game mode changes.
 * @param {Object} e event object
 */
function onModeChange(e)
// must be assigned on init as the element does not yet exist.
{
	isVersus = !isVersus //  only two options available so no need to test which is checked.
	
	if (isVersus) // difficulty doesn't affect versus
	{
		document.getElementById("rp_difficulty").style.display = "none";
		paddleRed.speed = PADDLE_SPEED;
	}
	else // set difficulty to current setting
	{
		document.getElementById("rp_difficulty").style.display = "block";
		onDifficultyChange(); // let it set speed
	}
	
	table.setFocus(true);
}

/**
 * handles game difficulty changes.
 * must be assigned on init as the element does not yet exist.
 * may be called as non-event, so param e is not to be used
 * difficulty adjusts red paddle speed and AI method
 * medium is equal speed, red is 5% slower and hard is 5% faster
 * @param {Object=} e event object
 */
function onDifficultyChange(e)
{
	if (document.getElementById("rp_difficulty_easy").checked)
	{
		difficulty = 1;
		paddleRed.speed = PADDLE_SPEED * .95;
	}
	else if (document.getElementById("rp_difficulty_medium").checked)
	{
		difficulty = 2;
		paddleRed.speed = PADDLE_SPEED;
	}
	else if (document.getElementById("rp_difficulty_hard").checked)
	{
		difficulty = 3;
		paddleRed.speed = PADDLE_SPEED * 1.05;
	}
	else
	 alert("An internal error has occurred.");
	
	table.setFocus(true);
}

/**
 * 
 * @param e
 * @returns
 */
function onClick(e)
{
	if (e.currentTarget == table.elem ||
		e.currentTarget == ball.elem ||
		e.currentTarget == paddleRed.elem ||
		e.currentTarget == paddleBlue.elem)
	{
		table.setFocus(true);
		
		// prevent event from hitting document
		e.cancelBubble = true;
		if (e.stopPropagation) e.stopPropagation();
		if (e.preventDefault) e.preventDefault();
	}
	else
	{
		table.setFocus(false);
		if (loopInterval)
		{
			pause();
			msg("Interrupted", "Please click on the table and press [SPACE] to continue")
		}
	}
	
	return !table.hasFocus;
}

/**
 * sets or removes focus from the table
 * when focus is removed form the table, key events will no longer be captured
 * @param {boolean} value set to true to focus, false to blur
 */
function setTableFocus(value)
{
	if (value && !table.hasFocus) // show focus
		table.elem.style.boxShadow = "0 0 8px 4px #6699cc";
	else if (!value && table.hasFocus) // hide focus
		table.elem.style.boxShadow = "none";
	
	table.hasFocus = value;
}

/*******************************************************************************
	gamplay functions
*///////////////////////////////////////////////////////////////////////////////

/**
 * initialized global values on first load.
 * not to be called in-game, call reset.
 * must be "exported" for closure compiler
 */
function init()
{
	// init table
	table.elem = document.getElementById("rp_table");
	table.hasFocus = false // for setTableFocus below
	table.setFocus = setTableFocus;
	table.setFocus(true);
	
	// init ball
	ball.elem = document.getElementById("rp_ball");

	// init paddles
	paddleBlue.elem = document.getElementById("rp_paddle_blue");
	paddleBlue.speed = PADDLE_SPEED;
	paddleRed.elem = document.getElementById("rp_paddle_red");
	paddleRed.speed = PADDLE_SPEED;
	
	// init UI
	msgElem = document.getElementById("rp_msg");
	score.blueElem = document.getElementById("rp_score_blue");
	score.redElem = document.getElementById("rp_score_red");
	
	// detect browser for vendor specific rotation style
	// uses msg as arbitrary DOM element
	if (typeof msgElem.style.transform != "undefined")
		styleTransform = "transform";
	else if (typeof msgElem.style.WebkitTransform != "undefined")
		styleTransform = "WebkitTransform";
	else if (typeof msgElem.style.MozTransform != "undefined")
		styleTransform = "MozTransform";
	else if (typeof msgElem.style.OTransform != "undefined")
		styleTransform = "OTransform";
	else if (typeof msgElem.style.msTransform != "undefined")
		styleTransform = "msTransform";
	else
		alert("This game will not operate properly in this browser, please update to a current version.", "Unsupported Browser");
	
	// assign event handlers
	document.onkeydown = function (e) {isLoggedIn && table.hasFocus && onKeyDown(e)};
	document.onkeyup = function (e) {isLoggedIn && table.hasFocus && onKeyUp(e)};
	
	document.getElementById("rp_is_single").onchange = 
	document.getElementById("rp_is_versus").onchange = onModeChange; // onchange only fires when checked
	
	document.getElementById("rp_new_game").onclick = onNewGameClick;
	
	document.getElementById("rp_difficulty_easy").onchange =
	document.getElementById("rp_difficulty_medium").onchange =
	document.getElementById("rp_difficulty_hard").onchange = onDifficultyChange;

	document.getElementById("rp_show_instructions").onclick =
	document.getElementById("rp_hide_instructions").onclick = toggleInstructions;

	document.onclick =
	document.getElementById("rp_table").onclick =
	document.getElementById("rp_ball").onclick =
	document.getElementById("rp_paddle_blue").onclick =
	document.getElementById("rp_paddle_red").onclick = onClick;
	
	// start game
	reset();
	// don't update(), all components are placed in reset()
	refresh();
	msg("Welcome to Round Pong", "Press [SPACE] to begin");
}

/**
 * resets global values and executes main "loop".
 * called by init() and after every score. sets all component positions to
 * prevent problems with update().
 */
function reset()
{	
	// reset ball
	ball.x = TABLE_CENTER.x;
	ball.y = TABLE_CENTER.y;
	ball.speed = BALL_INIT_SPEED;
	ball.direction = 90;
	ball.objective = 90;
	
	// explicitly place components with coordinates here rather than using update() as it will move the ball.
	// reset blue paddle
	paddleBlue.x = TABLE_CENTER.x;
	paddleBlue.y = TABLE_CENTER.y + TABLE_RADIUS;
	paddleBlue.angle = 90;
	
	// reset red paddle
	paddleRed.x = TABLE_CENTER.x;
	paddleRed.y = TABLE_CENTER.y - TABLE_RADIUS;
	paddleRed.angle = 270;
	
	// update score
	score.blueElem.textContent = score.blue;
	score.redElem.textContent = score.red;
}

/**
 * displays message tp user
 * if called with no arguments, will hide the message box completely.
 * @param {string=} text the message to be displayed, omit to hide message box
 * @param {string=} more extra information to be displayed
 */
function msg(text, more)
{
	if (typeof text == "undefined") // no arguments
		msgElem.style.display = "none"; // hide message box
	else // message argument given
	{
		
		if (typeof more != "undefined")
			msgElem.innerHTML = "<p class='text'>" + text + "</p><hr /><p class='more'>" + more + "</p>";
		else
			msgElem.textContent = text; // change text
		
		msgElem.style.display = "block"; // show message box
	}
}

/**
 * pauses the game, stopping the main "loop".
 * called by init() and after every score.
 */
function pause()
{
	if (loopInterval == 0) // paused, unpause.
	{
		// restart main "loop"
		loopInterval = setInterval(run, GAME_SPEED);
		
		// clear paused message
		msg();
	}
	else // unpaused, pause.
	{
		// stop main "loop"
		clearInterval(loopInterval);
		loopInterval = 0;
		
		// set paused message
		msg("Paused", "Press [SPACE] to unpause");
	}
}

/**
 * displays or hides the instructions popup
 */
function toggleInstructions()
{
	/** @type {Object} */ var style = document.getElementById("rp_instructions").style;
	if (style.display == "none")
		style.display = "block";
	else
	{
		style.display = "none";
		table.setFocus(true);
	}
}

/*******************************************************************************
	Main program "loop"
*///////////////////////////////////////////////////////////////////////////////

/**
 * main "loop"
 * javascript does not allow for a true event loop, so here one is emulated
 * by calling this function repeatedly with a short interval.
 */
function run()
{
	update(); // updates object values
	autoPlay(); // control red paddle in single player mode
	refresh(); // updates components on screen
	win(detectWin()); // detect if there was a win and perform appropiate action
}

/**
 * cycles the game.
 * updates values based on key states and events.
 * does not move (redraw) components on screen, call refresh() after update()
 */
function update()
// does not move components on the screen. this is deferred to refresh().
{
	// update ball
	move = getCoords(ball.speed, ball.direction);
	ball.x += move.x;
	ball.y += move.y;
	
	// bounce
	doHitTest();
		
	// update paddle angles
	if (keys[KEY_LEFT] && paddleBlue.angle < 180 - PADDLE_SPREAD_ANGLE)
		paddleBlue.angle = (paddleBlue.angle + paddleBlue.speed);
	if (keys[KEY_RIGHT] && paddleBlue.angle > 0 + PADDLE_SPREAD_ANGLE)
		paddleBlue.angle = (paddleBlue.angle - paddleBlue.speed);
	
	if (isVersus) // do not allow red paddle movement in versus mode
	{
		if (keys[KEY_A] && paddleRed.angle > 180 + PADDLE_SPREAD_ANGLE)
			paddleRed.angle = (paddleRed.angle - paddleRed.speed);
		if (keys[KEY_D] && paddleRed.angle < 360 - PADDLE_SPREAD_ANGLE)
			paddleRed.angle = (paddleRed.angle + paddleRed.speed);
	}
	
	// compute and update paddle positions
	paddleBlue.x = Math.cos(toRadians(paddleBlue.angle)) * TABLE_RADIUS + TABLE_CENTER.x;
	paddleBlue.y = Math.sin(toRadians(paddleBlue.angle)) * TABLE_RADIUS + TABLE_CENTER.y;
		
	paddleRed.x = Math.cos(toRadians(paddleRed.angle)) * TABLE_RADIUS + TABLE_CENTER.x;
	paddleRed.y = Math.sin(toRadians(paddleRed.angle)) * TABLE_RADIUS + TABLE_CENTER.y;
}

/**
 * moves (redraws) components based on current values.
 * to be called after a call to update().
 */
function refresh()
{
	// refresh ball
	ball.elem.style.left = ball.x - BALL_RADIUS_GLOW + "px";
	ball.elem.style.top = ball.y - BALL_RADIUS_GLOW + "px";
	
	// refresh paddles
	paddleBlue.elem.style.left = paddleBlue.x - PADDLE_OFFSET_X + "px";
	paddleBlue.elem.style.top = paddleBlue.y - PADDLE_OFFSET_Y + "px";
	paddleBlue.elem.style[styleTransform] = "rotate(" + (paddleBlue.angle + 90) + "deg)";
	
	paddleRed.elem.style.left = paddleRed.x - PADDLE_OFFSET_X + "px";
	paddleRed.elem.style.top = paddleRed.y - PADDLE_OFFSET_Y + "px";
	paddleRed.elem.style[styleTransform] = "rotate(" + (paddleRed.angle + 90) + "deg)";
}

/**
 * checks if the ball impacts one of the paddles and adjusts the ball's angle.
 * ball speed must not increase after call to this function as it may cause ball
 * to "jump over" a paddle.
 */
function doHitTest()
{
	// calculate distance from center
	var radius = Math.sqrt(Math.pow(ball.x - TABLE_CENTER.x, 2) + Math.pow(ball.y - TABLE_CENTER.y, 2));
	
	if (radius + BALL_RADIUS >= TABLE_RADIUS && radius < TABLE_RADIUS + ball.speed) // preliminary check to reduce hittests
	{
		var ballAngle; // not direction, angle from center
		
		if (ball.x == TABLE_CENTER.x)
			ballAngle = ball.y < TABLE_CENTER.y ? 270 : 90;
		else
			ballAngle = toDegrees(Math.atan((ball.y - TABLE_CENTER.y) / (ball.x - TABLE_CENTER.x)));
			
		
		if (ball.x < TABLE_CENTER.x) // fix tan for quadrants 2 and 3
			ballAngle += 180;
		else if (ballAngle < 0) // fix tan for negative angles (cannot be negative for comparison during "hittest"
			ballAngle += 360;	
		
		// blue test
		if (!ignoreHitTest &&
			ballAngle < paddleBlue.angle + PADDLE_SPREAD_ANGLE &&
			ballAngle > paddleBlue.angle - PADDLE_SPREAD_ANGLE)
		{
			ball.direction = (paddleBlue.angle - 180 - (2 * (ballAngle - paddleBlue.angle))) % 360;
			
			// prevent ball from overshooting for proper "bounce" effect
			ball.x = (TABLE_RADIUS - BALL_RADIUS) * Math.cos(toRadians(ballAngle)) + TABLE_CENTER.x;
			ball.y = (TABLE_RADIUS - BALL_RADIUS) * Math.sin(toRadians(ballAngle)) + TABLE_CENTER.y;
			
			updateBallObjective();
		}
		
		// red test
		if (!ignoreHitTest &&
			ballAngle < paddleRed.angle + PADDLE_SPREAD_ANGLE &&
			ballAngle > paddleRed.angle - PADDLE_SPREAD_ANGLE)
		{
			ball.direction = (paddleRed.angle - 180 - (2 * (ballAngle - paddleRed.angle))) % 360;
			
			// prevent ball from overshooting for proper "bounce" effect
			ball.x = (TABLE_RADIUS - BALL_RADIUS) * Math.cos(toRadians(ballAngle)) + TABLE_CENTER.x;
			ball.y = (TABLE_RADIUS - BALL_RADIUS) * Math.sin(toRadians(ballAngle)) + TABLE_CENTER.y;
			
			updateBallObjective();
		}
		
		// increase ball speed after each hit
		if (!ignoreHitTest)
			ball.speed += BALL_ACCELERATION;
		
		if (ball.speed > BALL_MAX_SPEED)
			ball.speed = BALL_MAX_SPEED
		
		ignoreHitTest = true;
	}
	else
		ignoreHitTest = false;
}

/**
 * predicts the angle at which the ball will intersect the ring for ai.
 * calculates the angle from the center, not the direction of the ball.
 * called after each impact of the ball with a paddle.
 */
function updateBallObjective()
{
	/** @type {number} */ var x = ball.x - TABLE_CENTER.x;
	/** @type {number} */ var y = ball.y - TABLE_CENTER.y;
	
	/** @const @type {number} */ var dx = Math.cos(toRadians(ball.direction));
	/** @const @type {number} */ var dy = Math.sin(toRadians(ball.direction));
	
	// quadratic stuff
	/** @const @type {number} */ var a = dx * dx + dy * dy;
	/** @const @type {number} */ var b = 2 * (dx * (ball.x - TABLE_CENTER.x) + dy * (ball.y - TABLE_CENTER.y));
	/** @const @type {number} */ var c = x * x + y * y - TABLE_RADIUS * TABLE_RADIUS;
	
	/** @const @type {number} */ var d = b * b - 4 * a * c; // discriminant
	
	// assume discriminant is positive
	/** @type {number} */ var t = (-b + Math.sqrt(d)) / (2 * a);
	x += dx * t;
	y += dy * t;

	ball.objective = toDegrees(Math.atan(y / x)) % 360; // angle of ball's predicted intersection with ring
		
	if (x < 0) // atan fix
		ball.objective = (ball.objective + 180) % 360;
	else if (ball.objective < 0) // nomalize to 0 - 359
		ball.objective += 360;
}

/**
 * plays the part of the red player in single player mode.
 * two ai techniques: one for easy and one for medium and hard.
 * basic method compares the x-coordinate of the red paddle to the x-coordinate
 * of the ball and moves accordingly.
 * advanced method predicts the angle at which the ball will impact the ring and
 * moves accordingly
 */
function autoPlay()
{
	if (!isVersus)
	{
		if (difficulty == 1) // use basic ai
		{
			if (paddleRed.x + PADDLE_SPREAD_ANGLE < ball.x && paddleRed.angle < 360 - PADDLE_SPREAD_ANGLE)
				paddleRed.angle += paddleRed.speed;
			else if (paddleRed.x - PADDLE_SPREAD_ANGLE > ball.x && paddleRed.angle > 180 + PADDLE_SPREAD_ANGLE)
				paddleRed.angle -= paddleRed.speed;
		}
		else // use advanced ai
		{
			if (ball.objective < 180) // blue's turn, return to center to prepare
			{
				if (paddleRed.angle < 270 - AI_ACCURACY)
					paddleRed.angle += paddleRed.speed;
				else if (paddleRed.angle > 270 + AI_ACCURACY)
					paddleRed.angle -= paddleRed.speed;
			}
			else // need to act
			{
				if (paddleRed.angle + AI_ACCURACY < ball.objective && paddleRed.angle < 360 - PADDLE_SPREAD_ANGLE)
					paddleRed.angle += paddleRed.speed;
				else if (paddleRed.angle - AI_ACCURACY > ball.objective && paddleRed.angle > 180 + PADDLE_SPREAD_ANGLE)
					paddleRed.angle -= paddleRed.speed;
			}
		}
	}
}

/**
 * detects a win
 * checks the ball's distance from the center and checks if it's y-coordinate
 * is positive or negative.
 * does not alter game flow based on result, any actions deferred to win(). 
 * @return {string} winning color, or empty string if no winner.
 */
function detectWin() 
{
	/** @type {string} */ var r = "";
	/** @type {number} */ var radius = Math.sqrt(Math.pow(ball.x - TABLE_CENTER.x, 2) + Math.pow(ball.y - TABLE_CENTER.y, 2));
	if (radius > TABLE_RING_RADIUS)
	{
		if (ball.y > TABLE_CENTER.y)
			r = "red";
		if (ball.y <= TABLE_CENTER.y) // advantage blue
			r = "blue";
	}
	
	return r;
}

/**
 * performs appropriate actions when a win is detected
 * does not detect winner, only performs actions based on winner parameter
 * @param {String} winner string containing winning color ("red" or "blue). else call is ignored.
 */
function win(winner)
{
	if (winner == "blue")
	{
		pause();
		msg("BLUE Wins", "Press [SPACE] to begin a new round");
		++score.blue;
		reset();
	}
	else if (winner == "red")
	{
		pause();
		msg("RED Wins", "Press [SPACE] to begin a new round");
		++score.red;
		reset();
	}
}

/*******************************************************************************
	Trig helpers
*///////////////////////////////////////////////////////////////////////////////

/**
 * calculates x and y coordinates from the given vector.
 * @param {number} length the length of the vector
 * @param {number} angle the angle of the vector in degrees
 * @return {Object} a point object containing the calculated coordinates
 */
function getCoords(length, angle)
{
	return {x:length * Math.cos(toRadians(angle)), y:length * Math.sin(toRadians(angle))};
}

/**
 * calculates a vector from the given coords 
 * @param {Object|number} x an x value or an object with 'x' and 'y' fields
 * @param {number=} y a y value or omit if x is an object
 */
function getAngle(x, y)
{
}

/**
 * converts degrees to radians.
 * @param {number} degrees angle in degrees
 * @return {number} angle in radians
 */
function toRadians(degrees)
{
	return degrees * (Math.PI / 180);
}

/**
 * converts randians to degrees.
 * @param {number} radians angle in radians
 * @return {number} angle in degrees
 */
function toDegrees(radians)
{
	return radians * (180 / Math.PI);
}
