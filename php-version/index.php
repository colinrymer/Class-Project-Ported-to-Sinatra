<?php
/****************************************
 * --------     index.php      -------- *
 * -------- Created: 08/30/11  -------- *
 * -------- Modified: 09/19/11 -------- *
 * --------    Colin Rymer     -------- *
*****************************************/

session_start();

include('functions.php');

?>

<!DOCTYPE html>
<html lang="en">
<html>
<head>
	<title>Assignment 1</title>

<?=$htmlIncludes?>

<script>
isLoggedIn = <?= (($_SESSION['username']) ? "true" : "false" ) ?>;

$(document).ready(function(){
	$("#menuLinkHome").addClass("active");
	showWelcome();
});
</script>
	
</head>
<body onload="loginFocus()">
	<?= getPageBodyTop() ?>
		<div class="span6 offset1 columns" >
			<a href="<?=$ActivityLink1?>">
				<img src="img/maze/0.gif" height="300px" width="300px">
				<p><?=$Activity1?></p>
			</a>
		</div><!-- /col -->
		<div class="span6 columns" >
			<a href="<?=$ActivityLink2?>">
				<img src="img/round_pong/table.png" height="300px" width="300px">
				<p><?=$Activity2?></p>
			</a>
		</div><!-- /col -->
	</div><!-- /row -->
	<div class="row">
		<div class="span6 offset1 columns" >
			<a href="<?=$ActivityLink3?>">
				<img src="img/whackamole/mole.gif" height="300px" width="300px">
				<p><?=$Activity3?></p>
			</a>
		</div><!-- /col -->
		<div class="span6 columns" >
			<a href="<?=$ActivityLink4?>">
				<img src="img/hangman/hangman8.png" height="300px" width="300px">
				<p><?=$Activity4?></p>
			</a>
	<?= getPageBodyBottom() ?>	
</body>
</html>