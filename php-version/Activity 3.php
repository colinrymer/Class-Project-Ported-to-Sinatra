<?php
/****************************************
 * --------   activity3.php    -------- *
 * -------- Created: 09/06/11  -------- *
 * -------- Modified: 09/19/11 -------- *
 * --------    Colin Rymer     -------- *
*****************************************/

session_start();

include('functions.php');

if($_SESSION['username'])
	startTime("3");

?>
<!DOCTYPE html>
<html>
<head>
	<title><?=$Activity3?></title>

	<?=$htmlIncludes?>

	<?=$result?>

	<script type="text/javascript">
		isLoggedIn = <?= (($_SESSION['username']) ? "true" : "false" ) ?>;
		page = "3";

		$(document).ready(function(){
			<?= (($_SESSION['username']) ? "" : getBlocker() ) ?>
			$("#menuLinkActivity3").addClass("active");
		});
	</script>
</head>
<body>
	<?= getActivityPageBodyTop() ?>
		<?php include('whackamole.php'); ?>
	<?= getActivityPageBodyBottom() ?>
</body>
</html>