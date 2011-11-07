var hangman = function (div)
{
	var answer = [];
	var blanks = [];
	var guesses = [];
	var badGuesses = [];
	var numWrongGuesses = 0;
	var maxWrongGuesses = 0;
	var win = false;
	var loss = false;
	var easy = 7;
	var medium = 5;
	var hard = 3;
	var hangDiv = div;
	var imageDiv = "hangmanImageDiv";
	var lettersDiv = "hangmanLetters";
	var badGuessesDiv = "hangmanBadGuesses";
	var stats = {
		numGames: 0,
		easyGames: 0,
		mediumGames: 0,
		hardGames: 0,
		wins: 0,
		losses: 0
	}

	function checkWin()
	{
		if (numWrongGuesses == maxWrongGuesses) // game over
		{
			loss = true;
			stats.losses++;
			$("#"+ lettersDiv).html("<h1>" + answer.join(" ") + "</h1>")
		}

		if(blanks.join("") == answer.join(""))
		{
			win = true;
			stats.wins++;
			alert("winner");
		}
	}

	function clearVals()
	{
		answer = [];
		blanks = [];
		guesses = [];
		badGuesses = [];
		numWrongGuesses = 0;
		maxWrongGuesses = 0;
		win = false;
		loss = false;
	}

	function createDivs()
	{
		$("#"+ hangDiv).html(
			'<div id="'+ imageDiv +'"></div>' +
			'<div id="'+ lettersDiv +'"></div>' +
			'<div class="error" id="'+ badGuessesDiv +'"></div>'
		);
		updateDrawing();
	}

	function makeMessage(type,title,body)
	{
		$("#messageDiv").css("display","none");
		$("#messageDiv").html(
			'<div class="alert-message '+type+'"> ' +
					'<a id="hangmanFinishedMessage" class="close" href="#" onclick="hideMessage()">&times;</a> ' +
					' <p><strong>'+title+'</strong> '+body+'</p> ' +
				' </div> '
			);
		$("#messageDiv").fadeIn("slow", "linear");
	}

	function updateBlanks()
	{
		$("#"+ lettersDiv).html("<h1>" + blanks.join(" ") + "</h1>")
	}

	function updateDrawing()
	{
		var imageId = "image";
		var i = $("#" + imageId);

		var wrong = 0;

		if (numWrongGuesses == 1)
			wrong = 1;

		else if (numWrongGuesses > 1)
		{
			if (maxWrongGuesses == easy)
				wrong = numWrongGuesses;

			else 
			{
				if (numWrongGuesses == 2)
					wrong = 3;

				else 
				{
					if (maxWrongGuesses == medium)
						wrong = numWrongGuesses + 2;

					if (maxWrongGuesses == hard)
						wrong = 7;
				}
			}
		}

		switch (wrong)
		{
			case 1:
				i.attr("src", "/img/hangman/hangman2.png");
				break;
			
			case 2:
				i.attr("src", "/img/hangman/hangman3.png");
				break;
			
			case 3:
				i.attr("src", "/img/hangman/hangman4.png");
				break;
			
			case 4:
				i.attr("src", "/img/hangman/hangman5.png");
				break;
			
			case 5:
				i.attr("src", "/img/hangman/hangman6.png");
				break;
			
			case 6:
				i.attr("src", "/img/hangman/hangman7.png");
				break;
			
			case 7:
				i.attr("src", "/img/hangman/hangman8.png");
				break;

			default:
				$("#" + imageDiv).html('<img id="'+imageId+'" class="hangmanImage" src="/img/hangman/hangman1.png" />')
		}
	}

	function updateGuesses()
	{
		$("#"+ badGuessesDiv).html('<h1 class="badGuess">' + badGuesses.join(" ") + "</h1>")
	}

	return {

		checkGuess: function(id) // Public method hangman.checkGuess(id)
		{
			if (win || loss)
			{
				makeMessage("warning","Yo!","You've already finished this game. Start a new game to play again.");
				timer = setTimeout(function(){hideMessage();}, 3000);
				return;
			}

			var guess = $("#" + String(id)).val().toLowerCase();

			$("#" + String(id)).val("");

			if ((guess.length != 1) || (guess.match(/[a-z]/) == null))
			{
				makeMessage("error", "Uh oh!", "Please enter a valid guess.")
				timer = setTimeout(function(){hideMessage();}, 3000);
				return;
			}

			if (guesses.indexOf(guess) != -1)
			{
				makeMessage("error", "Whoops!", "You've already guessed the letter "+ guess);
				timer = setTimeout(function(){hideMessage();}, 3000);
			}

			else // check guess
			{
				guesses.push(guess); // Add guess to previous guesses array

				var index = answer.indexOf(guess); // Search for guess in answer

				if(index > -1) //If guess is in answer, check for extra instances of guess in answer.
				{
					for (var i = index; i < answer.length; i++)
					{
						if (guess == answer[i])
							blanks[i] = answer[i];
					}
					updateBlanks(); // Guess was in answer, so update blanks
				}

				else // guess was wrong
				{
					numWrongGuesses++;
					badGuesses.push(guess);
					updateDrawing(); // wrong guess means changing the drawing
					updateGuesses();
				}

				checkWin()
			}
		},

		startNewGame: function() // Public method hangman.startNewGame()
		{
			stats.numGames++;

			$("#messageDiv").html("");

			$("#guess").val("");

			clearVals();

			if ($("input[name=difficulty]:checked").val() == "easy")
			{
				maxWrongGuesses = easy;
				stats.easyGames++;
			}
			if ($("input[name=difficulty]:checked").val() == "medium")
			{
				maxWrongGuesses = medium;
				stats.mediumGames++;
			}
			if ($("input[name=difficulty]:checked").val() == "hard")
			{
				maxWrongGuesses = hard;
				stats.hardGames++;
			}

			$.get("/hangman/word",
				function(data) {
					answer = $.trim(data).split("");
					for (var i = 0; i < answer.length; i++)
						blanks.push("_");
					createDivs();
					updateBlanks();
			});
		}
	};
};

var game = hangman("hangmanDiv");

function showHangmanHelp()
{
	var hangmanHelp = '<div class="modal" style="position: relative; top: auto; left: auto; margin: 0 auto; z-index: 1">'
          +'<div class="modal-header">'
            +'<h3>Hangman Help</h3>'
            +'<a onclick="$.modal.close()" class="close">&times;</a>'
          +'</div>'
          +'<div class="modal-body">'
            +'<p>To play Hangman, set the cursor focus on the text field next to the "Submit Guess" button and begin typing letters. The blanks below the hangman image represent the letters of the word to guess, and as they are correctly guessed, they will be revealed. Incorrect guesses will show up below the blanks in red.</p>'
            +'<p>You can change the difficulty be selecting a different radio button and the clicking the "New Game" button. The "easy" difficulty game ends on the 7th wrong guess, the "medium" on the 5th wrong guess, and the "hard" on the 3rd wrong guess.</p>'
          +'</div>'
          +'<div class="modal-footer">'
            +'<a onclick="$.modal.close()" class="btn primary">Close</a>' 
          +'</div>'
        +'</div>'
	$.modal(hangmanHelp)
}

function submitGuess(id)
{
	if (event.keyCode == 13 && (document.getElementById(id).value.length == 1))
		game.checkGuess(id);
}

$(document).ready(function(){
	game.startNewGame();
});