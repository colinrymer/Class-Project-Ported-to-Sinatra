<!doctype html>
<?php  

	$level = $_GET['level'];
	
	switch($level) {
		case 2:
			$startX 		= 55;
			$startY 		= 5;
			$winXleft 	= 350;
			$winXright 	= 383;
			$winYtop 		= 458;
			$winYbottom 	= 482;
		break;
		case 3:
			$startX 		= 30;
			$startY 		= 460;
			$winXleft 	= 50;
			$winXright 	= 75;
			$winYtop 		= 458;
			$winYbottom 	= 482;
		break;
		case 4:
			$startX 		= 30;
			$startY 		= 5;
			$winXleft 	= 458;
			$winXright 	= 482;
			$winYtop 		= 375;
			$winYbottom 	= 408;
		break;
		case 5:
			$startX 		= 245;
			$startY 		= 5;
			$winXleft 	= 280;
			$winXright 	= 312;
			$winYtop 		= 458;
			$winYbottom 	= 482;
		break;
		case 6:
			$startX 		= 5;
			$startY 		= 30;
			$winXleft 	= 458;
			$winXright 	= 482;
			$winYtop 		= 122;
			$winYbottom 	= 144;
		break;
		case 7:
			$startX 		= 5;
			$startY 		= 465;
			$winXleft 	= 26;
			$winXright 	= 56;
			$winYtop 		= 458;
			$winYbottom 	= 482;
		break;
		case 8:
			$startX 		= 5;
			$startY 		= 290;
			$winXleft 	= 218;
			$winXright 	= 238;
			$winYtop 		= 458;
			$winYbottom 	= 482;
		break;
		case 9:
			$startX 		= 5;
			$startY 		= 5;
			$winXleft 	= 458;
			$winXright 	= 482;
			$winYtop 		= 115;
			$winYbottom 	= 144;
		break;
		case 10:
			$startX 		= 460;
			$startY 		= 5;
			$winXleft 	= 255;
			$winXright 	= 287;
			$winYtop 		= 458;
			$winYbottom 	= 482;
		break;
		default:
			$level 		= 1;
			$startX 		= 1;
			$startY 		= 266;
			$winXleft 	= 458;
			$winXright 	= 482;
			$winYtop 		= 105;
			$winYbottom 	= 144;
	}
	
	function createLevelMenu($currentLevel) {
		$levelMenu = '<ul><li class="prev';
		if ($currentLevel==1) {
			$levelMenu .= ' disabled"><a href="?level=' . $currentLevel;
		} else {
			$levelMenu .= '"><a href="?level=' . ($currentLevel-1);
		}
		$levelMenu .= '">&larr; Previous</a></li>';
		for ($i=1; $i <= 10; $i++) {
			$levelMenu .= "<li";
			if ($currentLevel==$i) {
				$levelMenu .= ' class="active"';
			}
			$levelMenu .= '><a href="?level=' . $i . '">' . ($i) . '</a></li>';
		}
		$levelMenu .= '<li class="next';
		if ($currentLevel==10) {
			$levelMenu .= ' disabled"><a href="?level=' . ($currentLevel);
		} else {
			$levelMenu .= '"><a href="?level=' . ($currentLevel+1);
		}
		$levelMenu .= '">Next &rarr;</a></li></ul>';
		return $levelMenu;
	}
?>

<script type="text/javascript">
			x = <?= $startX ?>;
			y = <?= $startY ?>;
			level = <?= $level ?>;
			winXleft = <?= $winXleft ?>;
			winXright = <?= $winXright ?>;
			winYtop = <?= $winYtop ?>;
			winYbottom= <?= $winYbottom ?>;
</script>

<div class="page-header">
    <h1>
		The Maze 
		<small>
			Level <?= $level ?>
		</small>
	</h1>
</div>

<div class="row">
	<div class="span9 columns">
		<canvas id="canvas" width="482" height="482">
			This browser does not support HTML5 Canvas. Please upgrade to a later version.
		</canvas>
	
		
	</div>
	
	<div id="span2 columns">
		<dl>
			<dt>Controls</dt>
			<dd>Press <strong>w</strong> to move up</dd>
			<dd>Press <strong>s</strong> to move down</dd>
			<dd>Press <strong>a</strong> to move left</dd>
			<dd>Press <strong>d</strong> to move right</dd>
		</dl>
		<dl>
			<dt>Directions</dt>
			<dd>
				The goal of The Maze is to get to the exit. You'll start at the entrance, so 
				just click on the maze with your mouse, look for the exit (the other opening on the 
				external wall), and use the controls above to make your way to it. When you reach 
				the exit, you'll move on to the next level automatically.
			</dd>
		</dl>
	</div>
</div>
<div class="row">
	<div class="span12 columns">
		<div class="pagination">
			<?= createLevelMenu($level) ?>	
		</div>
	</div>
</div>

