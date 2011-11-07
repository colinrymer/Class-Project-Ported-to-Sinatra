<?php
/****************************************
 * --------  hangmanAjax.php   -------- *
 * -------- Created: 09/06/11  -------- *
 * -------- Modified: 09/13/11 -------- *
 * --------    Colin Rymer     -------- *
*****************************************/

$MIN_WORD_SIZE = 4;
$MAX_WORD_SIZE = 8;

if($_POST['getWord'])
{
	$result = "";

	$file = file('words.txt', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);

	$length = count($file);

	do {
		$num = mt_rand(0, $length-1);

		$result = $file[$num];

		$l = strlen($file[$num]);

		$check = false;
		if ($l >= $MIN_WORD_SIZE)
		{
			if ($l <= $MAX_WORD_SIZE)
			{
				$check = true;
			}
		}
		
	} while ($check != true);

	echo strtolower($result);

	exit();
}

?>