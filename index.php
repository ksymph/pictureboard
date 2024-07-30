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
	<link rel="stylesheet" type="text/css" href="style.css">
	<script src="script.js" defer></script>
</head>
<body>
	<main>
		<div id="board">
			<?php
				for ($tileNum = 0; $tileNum <= 23; $tileNum++) {
					?>
						<div class="tile" id="tile_<?php echo $tileNum; ?>">
						</div>
					<?php
				}
			?>
		</div>

		<nav>
			<div class="tab-button">
				<img class="tab-img" src="/assets/animals_icon.svg" width="64" height="64">
			</div>
			<div class="tab-button">
				<img class="tab-img" src="/tiles/fox/face.png" width="64" height="64">
			</div>
		</nav>



		<form id="test">
			<label for="test-input">Test input</label>
			<input id="test-input" type="text">
			<button type="submit">Submit</button>
		</form>


		<button id="retrieve">Get stored text</button>
		<div id="output">empty</div>

	</main>

	<section id="config">
		<div id="config-container">
			<button id="debug-button">test</button>
		</div>
	</section>

</body>
</html>