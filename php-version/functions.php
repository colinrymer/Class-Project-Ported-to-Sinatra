<?php
/****************************************
 * --------    Functions.php   -------- *
 * -------- Created: 08/30/11  -------- *
 * -------- Modified: 09/19/11 -------- *
 * --------    Colin Rymer     -------- *
*****************************************/

include('config.php');

function clockOut()
{
	global $DB_TABLE;

	$time = (time() - $_SESSION['startTime']) + $_SESSION['loginTime'];

		if(!mysql_query("UPDATE ". $DB_TABLE ." SET `loginTime` = '$time' WHERE `username` = '$_SESSION[username]'"))
			echo mysql_error();
}

function genPassHash ($username, $password)
{
	$salt = substr(str_replace( '+', '.', base64_encode(sha1(sha1((microtime(true).mt_rand().$username.mt_rand().microtime(true).getmypid().$username)),true))), 0,22);
	return crypt($password, '$2a$12$' . $salt);
}

function getActivityPageBodyBottom()
{
	return getPageBodyBottom();
}

function getActivityPageBodyTop()
{
	return getPageBodyTop() . '<div id="mainContent" class="span14 offset1 columns">';
}

function getAdminLink()
{
	return '<li><a href="./admin">Admin</a></li>';
}

function getBlockDialog()
{
	return '<div class="alert-message warning">'
				.'<p><strong>Holy guacamole!</strong> You need to sign in or register before you can start having fun! You can do that to your left, so go on, do it. Well, what are you waiting for?</p>'
			.'</div>';
}

function getBlocker()
{
	return '$("#mainContent").block({ message: null, css: { cursor: "pointer"} });'
			.'showMessage(\''.getBlockDialog().'\');';
}

function getFooterText()
{
	return '<div class="page-header footer"></div>'
				.'<div id="footerText">Designed and built by Team Four Technology &copy;&nbsp;'.date("Y").'</div>';
}

function getLoginFormDiv()
{
	return '<div id="loginForm">
				<form class="form-stacked" name="formLogin">
					<fieldset id="formFieldset">
						<div class="clearfix">
							<label for="userNameField">Username: </label>
							<div>
								<input class="loginInput" name="userNameField" id="userNameField" type="text"/>
								<span id="usernameMark"></span>
							</div>
						</div><!-- /clearfix -->
						<div class="clearfix" id="passwordDiv">
							<label for="passwordField">Password: </label>
							<div>
								<input class="loginInput" name="passwordField" id="passwordField" type="password" onkeypress="watchKeyPress(event, this.id)"/>
								<span id="passwordMark"></span>
							</div>
						</div><!-- /clearfix -->
						<div class="clearfix" id="confirmPasswordDiv" style="display:none;">
							<label for="confirmPasswordField">Confirm Password: </label>
							<div>
								<input class="loginInput" name="confirmPasswordField" id="confirmPasswordField" type="password" onkeypress="watchKeyPress(event, this.id)"/>
								<span id="confirmMark"></span>
							</div>
							<span id="passwordHelp" class="help-block"> 
								<strong>Note:</strong> Passwords must be at least 4 characters long.
							</span>
						</div><!-- /clearfix -->
						<div id="loginButtons"> 
							<input id="signInButton" type="button" class="btn small primary" value="Sign In" onclick="logUserIn(event)" />
							<input  id="registerButton" type="button" class="btn small" value="Register" onclick="registerUser(event)"/>
						</div>
						<div class="clearfix" id="cancelRegisterDiv" style="display:none;">
							<br />
							<a id="cancelRegistration" onclick="cancelRegistration()">Cancel Registration</a>
						</div><!-- /clearfix -->
						<div class="clearfix" id="loginHelpDiv">
							<span id="loginHelp" class="help-block"> 
								<strong>Note:</strong> Users pre-enrolled can login using their UTC ID with all uppercase letters as their username and their first name with the first letter capitalized as their password.
							</span>
						</div><!-- /clearfix -->
					</fieldset>
				</form>
			</div>';
}

function getMessageDiv()
{
	return '<div class="row" id="messageRow">
					<div id="messageDiv" class="span12 offset1 columns" style="display:none;"></div>
			</div><!-- /row -->';
}

function getChangePassword()
{
	return '<div id="modalPasswordChange" class="modal">'
				.'<div class="modal-header">'
					.'<h3>Change Password</h3>'
					.'<a onclick="cancelPassword();" class="close">&times;</a>'
				.'</div>'
				.'<div class="modal-body"> '
					.'<p>Please fill out the fields below to change your password.</p>'
					.'<form class="form-stacked" id="changePasswordForm">'
						.'<label for="oldPassword">Old Password:</label>'
						.'<input id="oldPassword" name="oldPassword" type="password">'
						.'<label for="newPassword">New Password:</label>'
						.'<input id="newPassword" name="newPassword" type="password"><span id="changePasswordNewMark"></span>'
						.'<label for="confirmNewPassword">Confirm New Password:</label>'
						.'<input id="confirmNewPassword" name="confirmNewPassword" type="password" onkeypress="watchKeyPress(event, this.id)"><span id="changePasswordConfirmMark"></span>'
						.'<span id="passwordHelp" class="help-block">'
							.'<strong>Note:</strong> Passwords must be at least 4 characters long.'
						.'</span>'
					.'</form>'
				.'</div> '
				.'<div class="modal-footer"> '
					.'<input id="saveChangePassword" type="button" class="btn  primary" value="Save" onclick="savePassword()" />'
					.'<input id="cancelChangePassword" type="button" class="btn " value="Cancel" onclick="cancelPassword()"/>'
				.'</div> '
			.'</div>';
}

function getNavDropdown()
{
	return '<ul class="nav secondary-nav"> 
				<li class="menu"> 
					<a href="#" class="menu">Sign out &amp; more...</a> 
					<ul class="menu-dropdown"> 
						<li><a onclick="changePassword()">Change Password</a></li> 
						<li><a href="./logout">Sign Out</a></li> 
					</ul> 
				</li> 
			</ul> ';
}

function getPageBodyBottom()
{
	return '			</div><!-- /col -->
					</div><!-- /row -->
				</div><!-- /content -->
				'.getFooterText().'
			</div>';
}

function getPageBodyTop()
{
	return getTopNavBar()
				.'<div id="content" class="container-fluid">
					'.getSideBar().'
					<div class="content">
						'.getMessageDiv().'
						<div class="row">';
}

function getSideBar()
{
	return '<div class="sidebar">
				'.( ( $_SESSION['username'] != null ) ? getUserInfoDiv() : getLoginFormDiv() ).'
			</div><!-- /sidebar -->';
}

function getTopNavBar()
{
	global $Activity1, $Activity2, $Activity3, $Activity4, $ActivityLink1, $ActivityLink2, $ActivityLink3, $ActivityLink4;

	return '<div id="topNav" class="topbar-wrapper""> 
		<div id="topbar" class="topbar"> 
		  <div class="fill"> 
			<div class="container" id="navbar"> 
			  <h3><a href="./">T4T Assignment 1</a></h3> 
			  <ul id="menuLinks"> 
				<li id="menuLinkHome"><a href="./">Home</a></li> 
				<li id="menuLinkActivity1"><a href="'.$ActivityLink1.'">'.$Activity1.'</a></li> 
				<li id="menuLinkActivity2"><a href="'.$ActivityLink2.'">'.$Activity2.'</a></li> 
				<li id="menuLinkActivity3"><a href="'.$ActivityLink3.'">'.$Activity3.'</a></li> 
				<li id="menuLinkActivity4"><a href="'.$ActivityLink4.'">'.$Activity4.'</a></li>
				 '.(($_SESSION['admin'] != "1") ? "" : getAdminLink()).'
			  </ul> 
			  '.(($_SESSION['username'] == null) ? "" : getNavDropdown()).'
			</div> 
		  </div><!-- /fill --> 
		</div><!-- /topbar --> 
	</div><!-- /topbar-wrapper --> ';
}

function getUserInfoDiv()
{
	$time1 = number_format(($_SESSION['time1']/60));
	$time2 = number_format(($_SESSION['time2']/60));
	$time3 = number_format(($_SESSION['time3']/60));
	$time4 = number_format(($_SESSION['time4']/60));
	$timeTotal = number_format(($_SESSION['time1'] + $_SESSION['time2'] + $_SESSION['time3'] + $_SESSION['time4'])/60);
	$loginTime = number_format(($_SESSION['loginTime']/60));

	return '<div id="userInfo">
				<h3><strong>'. $_SESSION['username'] .'</strong></h3>
				<div class="page-header">
					<h4>Time spent on games:</h4>
				</div>
				<p><strong>Activity 1: </strong><span id="activity1Time">'.$time1.(($time1 == "1") ? " minute": " minutes").'</span></p>
				<p><strong>Activity 2: </strong><span id="activity2Time">'.$time2.(($time2 == "1") ? " minute": " minutes").'</span></p>
				<p><strong>Activity 3: </strong><span id="activity3Time">'.$time3.(($time3 == "1") ? " minute": " minutes").'</span></p>
				<p><strong>Activity 4: </strong><span id="activity4Time">'.$time4.(($time4 == "1") ? " minute": " minutes").'</span></p>
				<p><strong>Total Time: </strong><span id="activityTotalTime">'.$timeTotal.(($timeTotal == "1") ? " minute": " minutes").'</span></p>
				<div class="page-header">
					<h4>Logins:</h4>
				</div>
				<p><strong>Total Time Logged In: </strong><span id="totalTime">'.$loginTime.(($loginTime == "1") ? " minute": " minutes").'</span></p>
				<p><strong>Total Logins: </strong>'.$_SESSION['logins'].'</p>
			</div>';
}

function inMinutes($time)
{
	return number_format($time/60);
}

function startTime($activity)
{
	updateTime($activity, "start");
}

function updateTime($activity, $action)
{
	global $DB_TABLE;

	switch ($activity)
	{
		case "1":
			$activityTime = "activityTime1";
			$activityField = "time1";
			break;

		case "2":
			$activityTime = "activityTime2";
			$activityField = "time2";
			break;

		case "3":
			$activityTime = "activityTime3";
			$activityField = "time3";
			break;

		case "4":
			$activityTime = "activityTime4";
			$activityField = "time4";
			break;
	}

	if ($action == "start")
	{
		if (!$_SESSION[$activityTime])
			$_SESSION[$activityTime] = time();

		$result = null;
	}

	if ($action == "update" && $_SESSION[$activityTime])
	{
		$time = time();
		$_SESSION[$activityField] = ($time - $_SESSION[$activityTime]) + $_SESSION[$activityField];
		$_SESSION[$activityTime] = $time;
		$result = $_SESSION[$activityField];

		mysql_query("UPDATE ". $DB_TABLE ." SET `". $activityField ."` = '$result' WHERE `username` = '$_SESSION[username]'");
	}

	return $result;
}
/* ONLY USED TO INITIALIZE DB TABLE
function addUsers()
{
	global $DB_TABLE;

	$username = 'BJV371';
	$password = genPassHash($username, 'Wendy');
	mysql_query("INSERT INTO ". $DB_TABLE ." (`username`, `password`) VALUES ('$username', '$password')"); echo mysql_error();

	$username = 'QYR343';
	$password = genPassHash($username, 'Zane');
	mysql_query("INSERT INTO ". $DB_TABLE ." (`username`, `password`) VALUES ('$username', '$password')"); echo mysql_error();

	$username = 'GGF786';
	$password = genPassHash($username, 'Michael');
	mysql_query("INSERT INTO ". $DB_TABLE ." (`username`, `password`) VALUES ('$username', '$password')"); echo mysql_error();

	$username = 'BGK928';
	$password = genPassHash($username, 'Alexander');
	mysql_query("INSERT INTO ". $DB_TABLE ." (`username`, `password`) VALUES ('$username', '$password')"); echo mysql_error();

	$username = 'CSP252';
	$password = genPassHash($username, 'Robert');
	mysql_query("INSERT INTO ". $DB_TABLE ." (`username`, `password`) VALUES ('$username', '$password')"); echo mysql_error();

	$username = 'TLG354';
	$password = genPassHash($username, 'Brianna');
	mysql_query("INSERT INTO ". $DB_TABLE ." (`username`, `password`) VALUES ('$username', '$password')"); echo mysql_error();

	$username = 'JGG529';
	$password = genPassHash($username, 'Sarah');
	mysql_query("INSERT INTO ". $DB_TABLE ." (`username`, `password`) VALUES ('$username', '$password')"); echo mysql_error();

	$username = 'TRN425';
	$password = genPassHash($username, 'James');
	mysql_query("INSERT INTO ". $DB_TABLE ." (`username`, `password`) VALUES ('$username', '$password')"); echo mysql_error();

	$username = 'NBC118';
	$password = genPassHash($username, 'Donald');
	mysql_query("INSERT INTO ". $DB_TABLE ." (`username`, `password`) VALUES ('$username', '$password')"); echo mysql_error();

	$username = 'HZS186';
	$password = genPassHash($username, 'Christopher');
	mysql_query("INSERT INTO ". $DB_TABLE ." (`username`, `password`) VALUES ('$username', '$password')"); echo mysql_error();

	$username = 'CPN273';
	$password = genPassHash($username, 'Vijay');
	mysql_query("INSERT INTO ". $DB_TABLE ." (`username`, `password`) VALUES ('$username', '$password')"); echo mysql_error();

	$username = 'BNW628';
	$password = genPassHash($username, 'James');
	mysql_query("INSERT INTO ". $DB_TABLE ." (`username`, `password`) VALUES ('$username', '$password')"); echo mysql_error();

	$username = 'SPR837';
	$password = genPassHash($username, 'Patrick');
	mysql_query("INSERT INTO ". $DB_TABLE ." (`username`, `password`) VALUES ('$username', '$password')"); echo mysql_error();

	$username = 'CDB923';
	$password = genPassHash($username, 'Chris');
	mysql_query("INSERT INTO ". $DB_TABLE ." (`username`, `password`) VALUES ('$username', '$password')"); echo mysql_error();

	$username = 'JRC188';
	$password = genPassHash($username, 'Scott');
	mysql_query("INSERT INTO ". $DB_TABLE ." (`username`, `password`) VALUES ('$username', '$password')"); echo mysql_error();

	$username = 'LXR888';
	$password = genPassHash($username, 'Corbin');
	mysql_query("INSERT INTO ". $DB_TABLE ." (`username`, `password`) VALUES ('$username', '$password')"); echo mysql_error();

	$username = 'FDJ534';
	$password = genPassHash($username, 'Samuel');
	mysql_query("INSERT INTO ". $DB_TABLE ." (`username`, `password`) VALUES ('$username', '$password')"); echo mysql_error();

	$username = 'FVV585';
	$password = genPassHash($username, 'William');
	mysql_query("INSERT INTO ". $DB_TABLE ." (`username`, `password`) VALUES ('$username', '$password')"); echo mysql_error();

	$username = 'DRY576';
	$password = genPassHash($username, 'Richard');
	mysql_query("INSERT INTO ". $DB_TABLE ." (`username`, `password`) VALUES ('$username', '$password')"); echo mysql_error();

	$username = 'VJB133';
	$password = genPassHash($username, 'Aaron');
	mysql_query("INSERT INTO ". $DB_TABLE ." (`username`, `password`) VALUES ('$username', '$password')"); echo mysql_error();

	$username = 'CMG311';
	$password = genPassHash($username, 'Jacob');
	mysql_query("INSERT INTO ". $DB_TABLE ." (`username`, `password`) VALUES ('$username', '$password')"); echo mysql_error();

	$username = 'YGV312';
	$password = genPassHash($username, 'Daryl');
	mysql_query("INSERT INTO ". $DB_TABLE ." (`username`, `password`) VALUES ('$username', '$password')"); echo mysql_error();

	$username = 'PPY159';
	$password = genPassHash($username, 'Christopher');
	mysql_query("INSERT INTO ". $DB_TABLE ." (`username`, `password`) VALUES ('$username', '$password')"); echo mysql_error();

	$username = 'NJT957';
	$password = genPassHash($username, 'Andrew');
	mysql_query("INSERT INTO ". $DB_TABLE ." (`username`, `password`) VALUES ('$username', '$password')"); echo mysql_error();

	$username = 'WFY639';
	$password = genPassHash($username, 'Robert');
	mysql_query("INSERT INTO ". $DB_TABLE ." (`username`, `password`) VALUES ('$username', '$password')"); echo mysql_error();

}
*/
?>