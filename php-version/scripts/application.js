/****************************************
 * --------   application.js   -------- *
 * -------- Created: 08/31/11  -------- *
 * -------- Modified: 09/19/11 -------- *
 * --------    Colin Rymer     -------- *
*****************************************/

var MIN_PASS_LENGTH = 4;
var UPDATE_INTERVAL = 10000 // in milliseconds
var checkmark = '<span class="checkmark">&#10004;</span>';
var xmark = '<span class="xmark">&#10008;</span>';

var userName = null;
var timer = null;
var updateIntervalTimer = null;
var page = null;

var isLoggedIn = false;

var usernameOptions = {
	callback: checkUsername,
	wait: 750,
	captureLength:0
}

var loginPasswordOptions = {
	callback: checkLoginPassword,
	wait: 750,
	captureLength:2
}

var newPasswordOptions = {
	callback: checkNewPassword,
	wait: 750,
	captureLength:2
}

function cancelPassword()
{
	$.modal.close();
}

function cancelRegistration()
{
	$("#usernameMark").html("");
	$("#passwordMark").html("");
	$("#confirmPasswordField").attr("value", "");
	$("#confirmPasswordDiv").fadeToggle("fast", "linear");
	$("#cancelRegisterDiv").fadeToggle("fast", "linear");
	$("#signInButton").removeAttr("disabled");
	$("#registerButton").removeClass("primary");
	$("#signInButton").addClass("primary");
	$("#registerButton").attr("value","Register");
	$("#loginHelpDiv").fadeToggle("slow", "linear");
}

function changePassword()
{
	$.post("ajax.php",
			{changePassword: "1"},
			function (data) {
				$.modal(data);
				$("#newPassword").typeWatch( newPasswordOptions );
				$("#confirmNewPassword").typeWatch( newPasswordOptions );
			});
}

function checkLoginPassword()
{
	if ($("#passwordField").attr("value").length >= MIN_PASS_LENGTH)
	{
		$("#passwordMark").html(checkmark);

		if($("#passwordField").attr("value") != $("#confirmPasswordField").attr("value"))
		{
			showPassNoMatch();
		}
		else
		{
			$("#confirmMark").html(checkmark);
		}
	}
	else
	{
		showMinPassMsg();
	}
}

function checkNewPassword()
{
	var result = false;
	if ($("#newPassword").attr("value").length >= MIN_PASS_LENGTH)
	{
		$("#changePasswordNewMark").html(checkmark);

		if($("#newPassword").attr("value") != $("#confirmNewPassword").attr("value"))
		{
			$("#changePasswordConfirmMark").html(xmark + '<span class="help-inline errorMsg">The passwords do not match.</span>');
		}
		else
		{
			$("#changePasswordConfirmMark").html(checkmark);
			result = true;
		}
	}
	else
	{
		$("#changePasswordNewMark").html(xmark + '<span class="help-inline errorMsg">Password must be at least 4 characters long.</span>');
	}

	return result;
}

function checkUsername()
{
	if ($("#userNameField").attr("value").length > 0)
	{
		var params = {
				checkUsername: "1",
				username: $("#userNameField").attr("value")
			}

			$.post("ajax.php",
					params,
					function (data) {
						if ($.trim(data) == "1")
						{
							$("#usernameMark").html(checkmark).addClass("checkmark");
						}
						else
						{
							var usernameTakenMsg = '<div class="alert-message error">'
												+ '		<a id="usernameTakenMessage" class="close" onclick="hideMessage()">&times;</a>'
												+ '		<p><strong>Whoops!</strong> That username is already taken.</p>' 
												+ '</div>';
							$("#usernameMark").html(xmark);
							showMessage(usernameTakenMsg);
							timer = setTimeout(function(){hideMessage();}, 3000);
						}
					});
	}
}

function hideMessage(e)
{
	event = e || null;
	timer = null;
	if (event)
		event.preventDefault;
	$("#messageDiv").fadeToggle("slow", "linear");
}

function loginFocus()
{
	if (document.formLogin)
		document.formLogin.userNameField.focus()
}

function loginSuccess(params, data)
{
	$("#userNameField").attr("value","");
	userName = params.username;
	isLoggedIn = true;
	timer = setTimeout(function(){hideMessage();}, 3000);
	$(".sidebar").html("").html(data.sidebar);
	$("#navbar").append(data.navbar);
	$("#menuLinks").append(data.admin)
	$("a.menu").click(function (e) {
		var $li = $(this).parent("li").toggleClass('open');
		return false;
	});
	$("#mainContent").unblock();

	if (page != null)
	{
		$.post("ajax.php",
				{startActivityTime: page}
		);
	}
}

function logUserIn(event)
{
	event.preventDefault();

	if (($("#userNameField").attr("value").length > 0) && ($("#passwordField").attr("value").length > 0))
	{
		var params = {
					login: "1", 
					username: $("#userNameField").attr("value"),
					password: $("#passwordField").attr("value")
				}

			$.post("ajax.php",
					params, 
					function (data) {
						$("#passwordField").attr("value","");
						showMessage(data.result);
						if($("#messageDiv > div > a#loginSuccessMessage").length == 1)
						{
							loginSuccess(params, data);
						}
						else
						{
							document.formLogin.passwordField.focus()
						}
					},
					"json"
				);
	}
	else
	{
		var usernameAndPasswordMsg = '<div class="alert-message error">'
								+ '		<a id="usernameAndPasswordMessage" class="close" onclick="hideMessage()">&times;</a>'
								+ '		<p><strong>Yikes!</strong> You have to enter a username and a password to login.</p>' 
								+ '</div>';
		$("#confirmMark").html(xmark);
		showMessage(usernameAndPasswordMsg);
		timer = setTimeout(function(){hideMessage();}, 3000);
	}
	
}

function registerUser(event)
{
	event.preventDefault;

	$("#registerButton").addClass("primary");
	$("#signInButton").attr("disabled","disabled");
	$("#signInButton").removeClass("primary");
	$("#registerButton").attr("value","Sign Up");
	$("#userNameField").typeWatch( usernameOptions );
	$("#loginHelpDiv").fadeToggle("slow", "linear");

	if ($("#confirmPasswordDiv").css("display") == "none")
	{
		$("#confirmPasswordDiv").fadeToggle("slow", "linear");
		$("#cancelRegisterDiv").fadeToggle("slow", "linear");
		checkUsername();
	}
	else
	{
		if ($("#passwordField").attr("value").length >= MIN_PASS_LENGTH)
		{
			if (($("#passwordField").attr("value") != "") && ($("#confirmPasswordField").attr("value") != "") && ($("#passwordField").attr("value") == $("#confirmPasswordField").attr("value")))
			{
				var params = {
						register: "1", 
						username: $("#userNameField").attr("value"),
						password: $("#passwordField").attr("value"),
						confirm:  $("#confirmPasswordField").attr("value")
					}
				
				$("#passwordField").attr("value","");
				$("#confirmPasswordField").attr("value","");

				$.post("ajax.php",
					params, 
					function (data) {
						showMessage(data.result);
						if($("#messageDiv > div > a#registerSuccessMessage").length == 1)
						{
							loginSuccess(params, data);
						}
					},
					"json"
				);
			}
			else
			{
				showPassNoMatch();
				document.formLogin.confirmPasswordField.focus()
			}

		}
		else
		{
			showMinPassMsg()
		}
	}
}

function savePassword()
{
	if (checkNewPassword())
	{
		var params = {
			updatePassword: "1",
			oldPassword: $("#oldPassword").attr("value"),
			newPassword: $("#newPassword").attr("value")
		}

		$.post("ajax.php",
				params,
				function (data) {
					if ($.trim(data) == "1")
					{
						$.modal.close();
						var passwordChangeSuccessMsg = '<div class="alert-message success">'
													+ '		<a id="usernameAndPasswordSuccessMessage" class="close" onclick="hideMessage()">&times;</a>'
													+ '		<p><strong>Hooray!</strong> Your password has been successfully changed.</p>' 
													+ '</div>';
						showMessage(passwordChangeSuccessMsg);
						timer = setTimeout(function(){hideMessage();}, 3000);
					}
					else
					{
						$.modal.close();
						var passwordChangeFailureMsg = '<div class="alert-message error">'
													+ '		<a id="usernameAndPasswordFailureMessage" class="close" onclick="hideMessage()">&times;</a>'
													+ '		<p><strong>Bummer!</strong> Your password was not changed.</p>' 
													+ '</div>';
						showMessage(passwordChangeFailureMsg);
						timer = setTimeout(function(){hideMessage();}, 3000);
					}
				});
	}
}

function showMessage(str)
{
	$("#messageDiv").css("display","none");
	$("#messageDiv").html(str);
	$("#messageDiv").fadeIn("slow", "linear");
}

function showMinPassMsg()
{
	var passwordMinimumMsg = '<div class="alert-message error">'
							+ '		<a id="passwordMinimumMessage" class="close" onclick="hideMessage()">&times;</a>'
							+ '		<p><strong>Hey-o!</strong> Your password must be at least four characters.</p>' 
							+ '</div>';
		$("#passwordMark").html(xmark);
		$("#confirmMark").html(xmark);
		showMessage(passwordMinimumMsg);
		timer = setTimeout(function(){hideMessage();}, 3000);
}

function showPassNoMatch()
{
	var passwordMismatchMsg = '<div class="alert-message error">'
							+ '		<a id="passwordMismatchMessage" class="close" onclick="hideMessage()">&times;</a>'
							+ '		<p><strong>Uh oh!</strong> Your passwords do not match.</p>' 
							+ '</div>';
	$("#confirmMark").html(xmark);
	showMessage(passwordMismatchMsg);
	timer = setTimeout(function(){hideMessage();}, 3000);
}

function showWelcome()
{
	var welcomeMsg = '<div class="alert-message info">'
        			+'<a class="close" onclick="hideMessage()">&times;</a>'
        			+'<p><strong>Howdy!</strong> If you want to get started playing a game, first sign in or register on your left. Once you are signed in, you can play a game by clicking on an image below or a link in the navigation bar.</p>'
      				+'</div>';
     if(!isLoggedIn)
    	showMessage(welcomeMsg);
     //timer = setTimeout(function(){hideMessage();}, 3000);
}

function updateTime()
{
	if(isLoggedIn)
	{
		var params = {
			updateActivityTime: 1,
			activity: page
		}

		$.post("ajax.php",
				params, 
				function (data) {
					//TODO possibly add live updating times on page
				},
				"json"
			);
	}
}

function watchKeyPress(e, id)
{
	if (e.keyCode == 13)
	{
		if (id == "confirmPasswordField")
			registerUser(e);

		if ((id == "passwordField") && ($("#confirmPasswordDiv").css("display") == "none"))
			logUserIn(e);
		
		if (id == "confirmNewPassword")
			savePassword();

		if (id == "guess")
			game.checkGuess(id);
	}
}

$(document).ready(function(){

	$("body").bind("click", function (e) {
		$('a.menu').parent("li").removeClass("open");
	});

	$("a.menu").click(function (e) {
	  var $li = $(this).parent("li").toggleClass('open');
	  return false;
	});

	$("#confirmPasswordField").typeWatch( loginPasswordOptions );

	updateTime();

	updateIntervalTimer = setInterval(function(){updateTime();}, UPDATE_INTERVAL);

});