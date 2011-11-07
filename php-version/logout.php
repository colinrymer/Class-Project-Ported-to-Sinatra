<?php
	session_start();

	header("Cache-Control: no-cache, must-revalidate"); // HTTP/1.1
	header("Expires: Sat, 26 Jul 1997 05:00:00 GMT"); // Date in the past

	session_regenerate_id();
	session_unset();
	session_destroy();
	$_SESSION = array(); 
?> 
<html>
<meta http-equiv="refresh" content="0; URL=index.php">
<body>
<script>location.href="./";</script>
<a href="./index">Return to the home page.</a>
</body>
</html>