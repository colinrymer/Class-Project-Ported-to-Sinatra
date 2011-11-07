<?php
/****************************************
 * --------      ajax.php      -------- *
 * -------- Created: 08/30/11  -------- *
 * -------- Modified: 09/05/11 -------- *
 * --------    Colin Rymer     -------- *
*****************************************/
include ('config.php');
include ('functions.php');

$loginSuccess = '<div class="alert-message success"> 
        			<a id="loginSuccessMessage" class="close" onclick="hideMessage()">&times;</a> 
       				<p><strong>Congrats!</strong> You successfully logged in to the system.</p> 
     			 </div> ';

$loginFailure = '<div class="alert-message error"> 
      				<a id="loginFailureMessage" class="close" onclick="hideMessage()">&times;</a> 
      				<p><strong>Oh snap!</strong> No combination of that username and password exists.</p> 
      			 </div> ';

$registerSuccess = '<div class="alert-message success"> 
        			<a id="registerSuccessMessage" class="close" onclick="hideMessage()">&times;</a> 
       				<p><strong>Congrats!</strong> You successfully registered with the system.</p> 
     			 </div> ';

if ($_POST['changePassword'])
{
	echo getChangePassword();

	exit();
}

if($_POST['checkUsername'])
{
	$result = "1";
	$q = "SELECT * FROM ". $DB_TABLE ." WHERE `username` = '$_POST[username]'";
	$r = mysql_query($q);
	while ($row = mysql_fetch_array($r))
	{
		$result = "0";
	}
	echo $result;
	exit();
}

if ($_POST['login'])
{
	$username = mysql_real_escape_string($_POST['username']);
	$q = "SELECT * FROM ". $DB_TABLE . " WHERE `username` = '$username'";

	$r = mysql_query($q);

	$result = "";

	while ($row = mysql_fetch_array($r))
	{
		if ($row['password'] == crypt($_POST['password'],$row['password']))
		{
			$result = $loginSuccess;
			$_SESSION['username'] = $row['username'];
			$_SESSION['time1'] = $row['time1'];
			$_SESSION['time2'] = $row['time2'];
			$_SESSION['time3'] = $row['time3'];
			$_SESSION['time4'] = $row['time4'];
			$_SESSION['loginTime'] = $row['loginTime'];
			$_SESSION['logins'] = $row['logins'] + 1;
			$_SESSION['admin'] = $row['admin'];
			$_SESSION['startTime'] = time();
			$sidebar = getUserInfoDiv();
			$navbar = getNavDropdown();
			$admin = (($row['admin'] == "1") ? getAdminLink() : "");

			mysql_query("UPDATE ". $DB_TABLE ." SET `logins` = '$_SESSION[logins]' WHERE `username` = '$row[username]'");
		}
	}

	if ($result == "")
		$result = $loginFailure;
	echo json_encode(array('result' => $result, 'sidebar' => $sidebar, 'navbar' => $navbar, 'admin' => $admin ));
	mysql_free_result($r);
	exit();
}

if ($_POST['register'])
{
	if ($_POST['password'] == $_POST['confirm'])
	{
		$result = "";
		$username = mysql_real_escape_string($_POST['username']);
		$password = genPassHash($_POST['username'], $_POST['password']);
		$q = "INSERT INTO ". $DB_TABLE ." (username, password) VALUES ('$username', '$password')";

		if(mysql_query($q))
		{
			$result = $registerSuccess;
			$_SESSION['username'] = $_POST['username'];
			$_SESSION['time1'] = 0;
			$_SESSION['time2'] = 0;
			$_SESSION['time3'] = 0;
			$_SESSION['time4'] = 0;
			$_SESSION['logins'] = 1;
			$_SESSION['loginTime'] = 0;
			$_SESSION['startTime'] = time();
			$sidebar = getUserInfoDiv();
			$navbar = getNavDropdown();
			$result = $registerSuccess;

		}
		echo json_encode(array('result' => $result, 'sidebar' => $sidebar, 'navbar' => $navbar, 'admin' => $admin ));
	}
	else
	{
		echo "passwords do not match";
	}
	exit();
}

if ($_POST['startActivityTime'])
{
	startTime($_POST['startActivityTime']);
}

if ($_POST['updateActivityTime'])
{
	$activityTime = "0";

	if ($_POST['activity'] != "null")
	{
		$activityTime = updateTime($_POST['activity'], "update");
	}

	$time = time();

	$_SESSION['loginTime'] = ($time - $_SESSION['startTime']) + $_SESSION['loginTime'];

	$_SESSION['startTime'] = $time;

	mysql_query("UPDATE ". $DB_TABLE ." SET `loginTime` = '$_SESSION[loginTime]' WHERE `username` = '$_SESSION[username]'");

	echo json_encode(array('activity' => $activityTime, 'login' => $_SESSION['loginTime']));

	exit();
}

if ($_POST['updatePassword'])
{
	$result = "0";

	$q = "SELECT * FROM ". $DB_TABLE . " WHERE `username` = '$_SESSION[username]'";

	$r = mysql_query($q);

	while ($row = mysql_fetch_array($r))
	{
		if ($row['password'] == crypt($_POST['oldPassword'],$row['password']))
		{
			$password = genPassHash($_SESSION['username'], $_POST['newPassword']);
			$uq = "UPDATE ". $DB_TABLE ." SET `password` = '$password' WHERE `username` = '$_SESSION[username]'";
			if(mysql_query($uq))
				$result = "1";
		}
	}
	echo $result;
	exit();
}

?>