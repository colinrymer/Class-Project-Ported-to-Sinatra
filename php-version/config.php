<?php
/****************************************
 * --------     config.php     -------- *
 * -------- Created: 08/30/11  -------- *
 * -------- Modified: 09/19/11 -------- *
 * --------    Colin Rymer     -------- *
*****************************************/

header("Cache-Control: no-cache, must-revalidate"); // HTTP/1.1
header("Expires: Sat, 26 Jul 1997 05:00:00 GMT"); // Date in the past

// *** MISSING ADMIN INFO SECTION *** //

$con = mysql_connect($DB_HOST, $DB_USER, $DB_PASS);
mysql_select_db($DB_NAME, $con);

// Activity Titles
$Activity1 = "The Maze";
$Activity2 = "Round Pong";
$Activity3 = "Whack a Mole";
$Activity4 = "Hangman";

// Activity Links
$ActivityLink1 = "Activity 1";
$ActivityLink2 = "Activity 2";
$ActivityLink3 = "Activity 3";
$ActivityLink4 = "Activity 4";

$htmlIncludes = '	<!--[if lt IE 9]>
	  					<script src="http://html5shim.googlecode.com/svn/trunk/html5.js"></script>
					<![endif]-->

					<link rel="stylesheet" href="http://twitter.github.com/bootstrap/1.3.0/bootstrap.min.css">
					<link rel="stylesheet" href="styles/style.css">
					<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js"></script>
					<script type="text/javascript" src="scripts/jquery.simplemodal.1.4.1.min.js"></script>
					<script type="text/javascript" src="scripts/jquery.blockUI.js"></script>
					<script type="text/javascript" src="scripts/plugins.js"></script>
					<script type="text/javascript" src="scripts/application.js"></script>
				';


?>


