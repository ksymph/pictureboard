<?php
function generateTilesJson() {
	$tilesDir = scandir("tiles");
	$tiles = [];
	foreach ($tilesDir as $tileDir) {
		if ($tileDir === '.' || $tileDir === '..') {
			continue;
		}

		$fullTileDir = "tiles/" . $tileDir;

		$tileData = json_decode(file_get_contents($fullTileDir . "/tile.json"), true);

		$tileData["face"] = "/" . $fullTileDir . "/face.png";
		$tileData["clips"] = [];

		foreach(glob($fullTileDir . "/vid_*.mp4") as $clipDir) {
			$tileData["clips"][] = "/" . $clipDir;
		}

		$tiles[$tileDir] = $tileData;
	}
	return $tiles;
}

function generateBoardsJson() {
	$boardsDir = scandir("boards");
	$boards = [];
	foreach ($boardsDir as $boardDir) {
		if ($boardDir === '.' || $boardDir === '..') {
			continue;
		}
		$boardData = json_decode(file_get_contents("boards/" . $boardDir), true);


		$boards[explode(".", $boardDir)[0]] = $boardData;

	}
	return $boards;
}

file_put_contents("tiles.json", json_encode(generateTilesJson()));
file_put_contents("boards.json", json_encode(generateBoardsJson()));

?>

<!doctype html>
<html lang="en-US">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Pictureboard</title>
	<!-- <link rel="stylesheet" type="text/css" href="style.css"> -->
	<script src="script.js" defer></script>
</head>
<body>
	<main>
		<div id="board">
			<?php
				$colors = [
					'#FFDDDD', // Light pastel pink
					'#FFE4CC', // Light pastel peach
					'#FFFFCC', // Light pastel yellow
					'#CCFFE5', // Light pastel mint
					'#CCF2FF', // Light pastel blue
					'#E5CCFF'  // Light pastel purple
				];
				for ($tileNum = 0; $tileNum <= 23; $tileNum++) {
					$tileColor = $colors[array_rand($colors)];
					?>
						<div class="tile">
						</div>
					<?php
				}
			?>
		</div>
		<div id="greet">
			<div id="greet-box">
				<h1 id="greeting">Hello!</h1>
				<p>Select a board below to begin.</p>
			</div>
			<img id="greet-arrow" src="/assets/arrow.svg">
		</div>
	</main>

	<nav>
		<div id="nav-menu-button">
			<img src="/assets/burger_menu.svg">
		</div>
		<div id="nav-boards">
		</div>
	</nav>

	<section id="config">
		<div id="config-container">
			<h2>Config</h2>
			<fieldset id="board-select">
				<legend>Boards</legend>
				<?php
					$boardsDir = scandir("boards");
					foreach ($boardsDir as $boardDir) {
						if ($boardDir === '.' || $boardDir === '..') {} else {
							$boardData = json_decode(file_get_contents("boards/" . $boardDir), true);
							$boardId = explode(".", $boardDir)[0];
							?><input type="checkbox" id="<?php echo $boardId; ?>" name="<?php echo $boardId; ?>"><?php
							?><label for="<?php echo $boardId; ?>"><?php echo $boardData["title"]; ?></label><br><?php
						}
					}
				?>
			</fieldset>

		</div>
	</section>

</body>
</html>