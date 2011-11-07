<?php
/****************************************
 * --------  technologies.php  -------- *
 * -------- Created: 09/19/11  -------- *
 * -------- Modified: 09/19/11 -------- *
 * --------    Colin Rymer     -------- *
*****************************************/

include('functions.php');

?>

<!DOCTYPE html>
<html lang="en">
<html>
<head>
	<title>Technologies</title>

<?=$htmlIncludes?>

<script>
$(document).ready(function(){

});
</script>
	
</head>
<body>
	<?=getTopNavBar()?>
		<div id="content" class="container-fluid">
			<div class="content">
					<div class="row">
						<div class="span6 offset1 columns" >
							<h4>Built on:</h4>
							<ul>
								<li>HTML5/CSS3</li>
								<li>Javascript</li>
								<li>PHP</li>
								<li>Apache</li>
								<li>MySQL</li>
							</ul>
							<h4>Libraries</h4>
							<ul>
								<li>jQuery</li>
								<li>Twitter Bootstrap</li>
								<li>HTML5 Shim</li>
							</ul>
							<br />
							<h4></h4>
						</div><!-- /col -->
					</div><!-- /row -->
				</div><!-- /content -->
			<?= getFooterText() ?>
		</div>
</body>
</html>