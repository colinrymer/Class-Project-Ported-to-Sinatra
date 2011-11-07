<div id="rp_content">
	<div id="rp_container" class="rp_container">
		<img id="rp_table" class="rp_table" src="img/round_pong/table.png" alt="" />
		<img id="rp_paddle_red" class="rp_paddle" src="img/round_pong/paddle_red.png" alt="" />
		<img id="rp_paddle_blue" class="rp_paddle" src="img/round_pong/paddle_blue.png" alt="" />
		<img id="rp_ball" class="rp_ball" src="img/round_pong/ball.png" alt="" />
	</div>
	<div id="rp_info" class="rp_pane">
		<p class="rp_heading">Score</p>
		<p class="rp_score_label">RED:&nbsp; <span id="rp_score_red" class="rp_score"></span></p>
		<p class="rp_score_label">BLUE: <span id="rp_score_blue" class="rp_score"></span></p>
		<p class="rp_heading">Control</p>
		<input class="btn small primary" type="button" id="rp_new_game" value=" New Game " />
		<fieldset>
			<legend>Mode</legend>
			<label><input id="rp_is_single" type="radio" checked="checked" name="mode" />Single</label>
			<label><input id="rp_is_versus" type="radio" name="mode"/>Versus</label>
		</fieldset>
		<fieldset id="rp_difficulty">
			<legend>Difficulty</legend>
			<label><input id="rp_difficulty_easy" type="radio" name="difficulty" />Easy</label>
			<label><input id="rp_difficulty_medium" type="radio" checked="checked" name="difficulty" />Medium</label>
			<label><input id="rp_difficulty_hard" type="radio" name="difficulty" />Hard</label>
		</fieldset>
		<div id="rp_msg" class="rp_msg"></div>
		<p id="rp_show_instructions" class="rp_clickable">Instructions</p>
	</div>
	<div id="rp_instructions" class="rp_popup" style="display: none;">
		<p id="rp_hide_instructions" class="rp_clickable" style="float:right;">[CLOSE]</p>
		<h2 style="display:inline;">Instructions</h2>
		<p class="rp_heading">Movement</p>
		<p>Use the left and right arrow keys (A and D keys for player two in versus mode) to move the paddle.</p>
		<p class="rp_heading">Gameplay</p>
		<p>Press space to begin. Do not let the ball out of the ring, if it does get out, and it's on your side of the table, you lose. If it gets out of the ring on the other side, you win. The ball is constantly moving faster and faster!</p>
		<p>If at any point you are unable to control the game, be sure to click on the table to return focus to it. You should be able to see a light blue glow around the table when it is in focus.</p>
	</div>
</div>