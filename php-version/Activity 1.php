<?php
/****************************************
 * --------   activity1.php    -------- *
 * -------- Created: 09/06/11  -------- *
 * -------- Modified: 09/19/11 -------- *
 * --------    Colin Rymer     -------- *
*****************************************/

session_start();

include('functions.php');

if($_SESSION['username'])
	startTime("1");
?>

<!DOCTYPE html>
<html>
<head>
	<title><?=$Activity1?></title>

	<?=$htmlIncludes?>

	<script type="text/javascript" src="scripts/maze.js"></script>

	<script type="text/javascript">
		isLoggedIn = <?= (($_SESSION['username']) ? "true" : "false" ) ?>;
		page = "1";

		$(document).ready(function(){
			<?= (($_SESSION['username']) ? "" : getBlocker() ) ?>
			$("#menuLinkActivity1").addClass("active");

			init();
			window.addEventListener('keydown',doKeyDown,true);
		});
	</script>
</head>
<body>
	<?= getActivityPageBodyTop() ?>
		<?php include('maze.php'); ?>
	<?= getActivityPageBodyBottom() ?>
</body>
</html>