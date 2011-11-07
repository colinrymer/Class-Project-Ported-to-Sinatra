<?php
/****************************************
 * --------   activity2.php    -------- *
 * -------- Created: 09/06/11  -------- *
 * -------- Modified: 09/19/11 -------- *
 * --------    Colin Rymer     -------- *
*****************************************/

session_start();

include('functions.php');

if($_SESSION['username'])
	startTime("2");
?>
<!DOCTYPE html>
<html>
<head>
	<title><?=$Activity2?></title>

	<?=$htmlIncludes?>
	<link rel="stylesheet" type="text/css" href="styles/round_pong.css" />
	<script type="text/javascript">
		isLoggedIn = <?= (($_SESSION['username']) ? "true" : "false" ) ?>;
		page = "2";

		$(document).ready(function(){
			<?= (($_SESSION['username']) ? "" : getBlocker() ) ?>
			$("#menuLinkActivity2").addClass("active");

			init();
		});
	</script>
	<script src="scripts/round_pong.js"></script>
</head>
<body>
	<?= getActivityPageBodyTop() ?>
		<?php include('round_pong.php'); ?>
	<?= getActivityPageBodyBottom() ?>
</body>
</html>