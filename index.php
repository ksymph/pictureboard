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
			<div class="tile">
				<img class="tab-img" src="/boards/test/icon.png">
			</div>

		</div>

		<nav>
			<div class="tab-button">
				<img class="tab-img" src="/boards/test/icon.png" width="64" height="64">
			</div>
			<div class="tab-button">
				<img class="tab-img" src="/boards/test/icon.png" width="64" height="64">
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


	</section>

</body>
</html>