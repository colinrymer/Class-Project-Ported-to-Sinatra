<?php
/****************************************
 * --------    hangman.php     -------- *
 * -------- Created: 09/06/11  -------- *
 * -------- Modified: 09/06/11 -------- *
 * --------    Colin Rymer     -------- *
*****************************************/
?>

<div class="row">
	<div class="span8 columns">
		<div id="hangmanDiv"></div>
		<br />
		<input type="text" id="guess" name="guess" maxlength="1" onkeypress="submitGuess(this.id)" />
		<input type="button" class="btn primary" id="guessSubmit" name="guessSubmit" value="Submit Guess" onclick="game.checkGuess('guess')"/>
	</div><!-- /column -->
	<div class="span4 columns">
		<form action="" class="form-stacked">
			<fieldset>
				<div class="clearfix">
					<label id="optionsCheckboxes"><h3>Difficulty</h3></label>
					<div class="page-header"></div>
					<div class="input">
						<ul class="inputs-list">
							<li>
								<label>
									<input type="radio" id="easyDifficulty" name="difficulty" value="easy" />
									<span>Easy</span>
								</label> 
							</li>
							<li>
								<label>
									<input type="radio" id="mediumDifficulty" checked name="difficulty" value="medium" />
									<span>Medium</span>
								</label>
							</li>
							<li>
								<label>
									<input type="radio" id="hardDifficulty" name="difficulty" value="hard" />
									<span>Hard</span>
								</label>
							</li>
						</ul>
					</div>
			  </div><!-- /clearfix -->
			</fieldset>
		<div class="page-header"></div>
		<br />
		<div> 
			<input type="button" class="btn success" id="newGame" name="newGame" value="New Game" onclick="game.startNewGame()"/>
			<input type="button" class="btn info" id="help" name="help" value="Help" onclick="showHangmanHelp()"/>
		</div> 
		</form> 
	</div><!-- /column -->

</div><!-- /row -->