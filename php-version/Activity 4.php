<?php
/****************************************
 * --------   activity4.php    -------- *
 * -------- Created: 09/06/11  -------- *
 * -------- Modified: 09/19/11 -------- *
 * --------    Colin Rymer     -------- *
*****************************************/

session_start();

include('functions.php');

if($_SESSION['username'])
	startTime("4");
?>

<!DOCTYPE html>
<html lang="en">
<html>
<head>
	<title><?=$Activity4?></title>

<?=$htmlIncludes?>
	<link rel="stylesheet" type="text/css" href="styles/hangman.css" />
	<script type="text/javascript" src="scripts/hangman.js"></script>

	<script type="text/javascript">
		isLoggedIn = <?= (($_SESSION['username']) ? "true" : "false" ) ?>;
		page = "4";

		$(document).ready(function(){
			<?= (($_SESSION['username']) ? "" : getBlocker() ) ?>
			$("#menuLinkActivity4").addClass("active");
		});
	</script>

</head>
<body>
	<?= getActivityPageBodyTop() ?>
		<?php include('hangman.php'); ?>
	<?= getActivityPageBodyBottom() ?>
</body>
</html>