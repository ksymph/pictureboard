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
	<script data-consolejs-channel="85b5f3c4-c976-8579-481e-86024ddda703" src="https://remotejs.com/agent/agent.js"></script>
</head>



<body>
	<button id="debutton">click me</button>
	<div id="output"></div>
</body>

<script>
	const debutton = document.getElementById("debutton");
	const output = document.getElementById("output");
	debutton.addEventListener("click", () => {
		output.innerHTML = `
			<video loop muted autoplay playsInLine>
				<source src="/assets/apple.mp4" type="video/mp4">
			</video>
		`;
	});

</script>