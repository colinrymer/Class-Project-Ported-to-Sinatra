<?php
/****************************************
 * --------     admin.php      -------- *
 * -------- Created: 09/02/11  -------- *
 * -------- Modified: 09/02/11 -------- *
 * --------    Colin Rymer     -------- *
*****************************************/

session_start();

include('functions.php');
include('config.php');

$userTableContents = "";
$activity1Time = 0;
$activity2Time = 0;
$activity3Time = 0;
$activity4Time = 0;
$totalActivityTime = 0;
$totalLogins = 0;
$totalLoginTime = 0;

$q = "SELECT * FROM ". $DB_TABLE . "";
$r = mysql_query($q);

while ($row = mysql_fetch_array($r))
{
	$activity1Time += $row['time1'];
	$activity2Time += $row['time2'];
	$activity3Time += $row['time3'];
	$activity4Time += $row['time4'];
	$tempSum = $row['time1'] + $row['time2'] + $row['time3'] + $row['time4'];
	$totalActivityTime += $tempSum;
	$totalLogins += $row['logins'];
	$totalLoginTime += $row['loginTime'];

	$userTableContents .= '<tr><td>'.$row['id'].'</td><td>'.$row['username'].'</td><td>'.$row['logins'].'</td><td>'.(inMinutes($row['loginTime'])).'</td><td>'.(inMinutes($row['time1'])).'</td><td>'.(inMinutes($row['time2'])).'</td><td>'.(inMinutes($row['time3'])).'</td><td>'.(inMinutes($row['time4'])).'</td><td>'.(inMinutes($tempSum)).'</td></tr>';
}

?>
<html>
<head>
	<title>Admin</title>

	<?=$htmlIncludes?>

	<script type="text/javascript" src="scripts/jquery.tablesorter.min.js"></script>

	<script type="text/javascript">
		isLoggedIn = <?= (($_SESSION['username']) ? "true" : "false" ) ?>;
		$(document).ready(function(){ 
			$("#userTable").tablesorter();
		});
	</script>

</head>
<body>
	<?= getTopNavBar() ?>

	<div id="content" class="container-fluid">
		<div class="sidebar">
			<h3>Admin</h3>
			<p>All times displayed are in minutes.</p>
			<p>The total number of minutes may be different than the sum of the minutes for each activity due to rounding.</p>
		</div><!-- /sidebar -->
		<div class="content">
			<div style="margin-left:20px;">
				<?=getMessageDiv()?>
				<div class="row">
					<div class="span14 offset columns" style="padding-bottom:20px">
						<table>
							<tr>
								<th>&nbsp;</th>
								<th><?=$Activity1?></th>
								<th><?=$Activity2?></th>
								<th><?=$Activity3?></th>
								<th><?=$Activity4?></th>
								<th>Total Activity Time</th>
								<th>Total Logins</th>
								<th>Total Login Time</th>
							</tr>
							<tr>
								<td><strong>Totals:</strong></td>
								<td><?=inMinutes($activity1Time)?></td>
								<td><?=inMinutes($activity2Time)?></td>
								<td><?=inMinutes($activity3Time)?></td>
								<td><?=inMinutes($activity4Time)?></td>
								<td><?=inMinutes($totalActivityTime)?></td>
								<td><?=$totalLogins?></td>
								<td><?=inMinutes($totalLoginTime)?></td>
							</tr>
						</table>
					</div><!-- /col -->
				</div><!-- /row -->
				<div class="row">
					<div class="span14 offset columns">
						<table id="userTable" class="zebra-striped">
							<thead>
								<tr>
									<th>#</th>
									<th>Username</th>
									<th>Logins</th>
									<th>Time Signed In</th>
									<th><?=$Activity1?></th>
									<th><?=$Activity2?></th>
									<th><?=$Activity3?></th>
									<th><?=$Activity4?></th>
									<th>Total</th>
								</tr>
							</thead>
							<tbody>
								<?=$userTableContents?>
							</tbody>
						</table>
					</div><!-- /col -->
				</div><!-- /row -->
			</div>
		</div><!-- /content -->
		<?=getFooterText()?>
	</div>
	
</body>
</html>