<?php
function generateTilesJson() {
	$tilesDir = scandir("tiles");
	$tiles = [];
	foreach ($tilesDir as $tileDir) {
		if ($tileDir === '.' || $tileDir === '..') {
			continue;
		}

		$fullTileDir = "tiles/" . $tileDir;

		$tileData = []; // json_decode(file_get_contents($fullTileDir . "/tile.json"), true);

		$tileData["title"] = $tileDir;
		$tileData["face"] = "/" . $fullTileDir . "/face.png";
		$tileData["clips"] = [];

		foreach(glob($fullTileDir . "/vid_*.mp4") as $clipDir) {
			$tileData["clips"][] = "/" . $clipDir;
		}

		$tiles[$tileDir] = $tileData;
	}
	return $tiles;
}

function generateAttributionHtml() {
    // Initialize an empty string to hold the final HTML
    $htmlOutput = '';

    // Check if the directory exists
    $directory = "attribution";

    // Scan the directory for JSON files
    $files = scandir($directory);
    foreach ($files as $file) {
        // Only process JSON files
        if (pathinfo($file, PATHINFO_EXTENSION) === 'json') {
            // Get the JSON title (without .json)
            $jsonTitle = pathinfo($file, PATHINFO_FILENAME);
            // Read the content of the JSON file
            $jsonContent = file_get_contents($directory . '/' . $file);
            $data = json_decode($jsonContent, true);

            // Check if JSON decoding was successful
            if ($data === null) {
                continue; // Skip this file if there's an error
            }

            // Start building the HTML for this JSON file
            $htmlOutput .= "<details>\n\t<summary>$jsonTitle</summary>\n\t<ul>\n";

            // Loop through each creator
            foreach ($data as $creator) {
                $creatorName = htmlspecialchars($creator['creator']);
                $creatorLink = htmlspecialchars($creator['creator_link']);
                $htmlOutput .= "\t\t<li>\n\t\t\t<a href=\"$creatorLink\">$creatorName</a>\n\t\t\t<ul>\n";

                // Loop through each video
                foreach ($creator['videos'] as $video) {
                    $videoUrl = htmlspecialchars($video['url']);
                    $videoTopic = htmlspecialchars($video['topic']);
                    $htmlOutput .= "\t\t\t\t<li>\n\t\t\t\t\t<a href=\"$videoUrl\">$videoTopic</a>\n\t\t\t\t</li>\n";
                }

                $htmlOutput .= "\t\t\t</ul>\n\t\t</li>\n";
            }

            $htmlOutput .= "\t</ul>\n</details>\n";
        }
    }

    return $htmlOutput;
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
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta name="description" content="PictureBoard is a speech therapy app featuring grids of drawn images. Tap an image to view a random real-life video of the object. New boards added regularly.">
	<link rel="author" href="https://kwikle.me">
	<meta name="robots" content="index,nofollow">
	<title>PictureBoard</title>
	<meta name="application-name" content="PictureBoard">
	<link rel="icon" type="image/x-icon" href="/assets/icon.png">
	<link rel="stylesheet" type="text/css" href="style.css">
	<link rel="manifest" href="/manifest.json">
	<meta name="theme-color" content="#31638b">
	<script src="script.js" defer></script>
</head>
<script>
  if (typeof navigator.serviceWorker !== 'undefined') {
    navigator.serviceWorker.register('sw.js')
  }
</script>

<body>
	<div id="debug" style="display: block;">

	</div>
	<main>
		<div id="board">
			<?php
				for ($tileNum = 0; $tileNum >= 23; $tileNum++) {
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
				<p>Select a board below.</p>
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
			<h2>Options</h2>
			<fieldset id="board-select">
				<legend>Boards</legend>
				<?php
					$boardsDir = scandir("boards");
					foreach ($boardsDir as $boardDir) {
						if ($boardDir === '.' || $boardDir === '..') {} else {
							$boardData = json_decode(file_get_contents("boards/" . $boardDir), true);
							$boardId = explode(".", $boardDir)[0];

							echo '<span>' . $boardData["title"] . '</span><br>';
							echo '<input type="checkbox" id="' . $boardId . '_enabled" name="' . $boardId . '[enabled]">';
							echo '<label for="' . $boardId . '_enabled">Enabled</label><br>';

							// "Labels" checkbox
							echo '<input type="checkbox" id="' . $boardId . '_labels" name="' . $boardId . '[labels]">';
							echo '<label for="' . $boardId . '_labels">Labels</label><br><br>';

						}
					}
				?>
			</fieldset>
			<h2>Attributions</h2>
			<fieldset id="attributions">
				<legend>Videos</legend>
				<?php echo generateAttributionHtml(); ?>
			</fieldset>
			<fieldset id="attributions">
				<legend>Art</legend>
				<span>Animals:</span><br>
				&nbsp<span>Creative Commons CC0</span><br><br>

				<span>Describing Words:</span><br>
				&nbsp<a href="https://www.teacherspayteachers.com/Store/Speech-Doodles">Speech Doodles</a><br><br>

				<span>Vehicles:</span><br>
				&nbsp<a href="https://www.teacherspayteachers.com/store/digitalartsi">Digitalartsi</a><br><br>
			</fieldset>
    </div>

		</div>
	</section>

</body>
</html>