let tileGrid = document.querySelectorAll(".tile");
let boardDom = document.querySelector("#board");
let boardDomBackup = null;

const navBar = document.querySelector("nav");
const navBoards = document.querySelector("#nav-boards");
const menuButton = document.querySelector("#nav-menu-button");

const configPane = document.querySelector("#config");
const boardSelectCheckboxes = document.querySelectorAll("#board-select input");

const debug = document.querySelector("#debug");

let tiles = {};
let boards = {};





// Function to check if the PWA is installed
function isPWAInstalled() {
  return window.matchMedia('(display-mode: standalone)').matches || localStorage.getItem('pwa-installed') === 'true';
}

// Handle the `appinstalled` event to store state and show the button
window.addEventListener('appinstalled', (event) => {
  console.log('PWA installed to home screen');

  // Mark the PWA as installed
  localStorage.setItem('pwa-installed', 'true');

  // Show the caching button
  showCachingButton();
});

// Function to show the button and listen for interactions
function showCachingButton() {
  const buttonContainer = document.getElementById('cache-button-container');
  const cachingButton = document.getElementById('enable-caching-button');

  // Show the button container
  buttonContainer.style.display = 'block';

  // When the button is clicked, start caching
  cachingButton.addEventListener('click', () => {
    console.log('Button clicked, starting caching...');

    // Send a message to the service worker to cache tiles
    if (navigator.serviceWorker && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'CACHE_TILES'
      });

      // Optionally store the fact that caching has been enabled
      localStorage.setItem('tiles-caching-enabled', 'true');
    }
  });
}

// On every page load, check if the app is installed and show the button if needed
window.addEventListener('load', () => {
  if (isPWAInstalled()) {
    console.log('PWA is installed, showing caching button...');

    // Show the caching button if the app is installed
    showCachingButton();
  }
});









class Tile {
    constructor(jsonData) {
        this.face = jsonData["face"];
        this.title = jsonData["title"];
        this.clips = jsonData["clips"];
    }
}

async function loadTiles() {
    const response = await fetch("tiles.json");
    const tilesJson = await response.json();
    let tiles = {};

    for (const [name, tile] of Object.entries(tilesJson)) {
        tiles[name] = new Tile(tile);
    }
    return tiles;
}

function shuffle(array) {
    let currentIndex = array.length;

    // While there remain elements to shuffle...
    while (currentIndex !== 0) {

        // Pick a remaining element...
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }
}

function constructBoard(tileCount) {
    boardDom.innerHTML = "";
    for (let i = 0; i < tileCount; i++) {
        const newTile = document.createElement("div");
        newTile.className = "tile";
        boardDom.appendChild(newTile);
    }
}

async function loadBoards(tiles) {
    const response = await fetch("boards.json");
    const boardsJson = await response.json();
    let boards = [];
    for (const [name, board] of Object.entries(boardsJson)) {
        let boardObj = {
            title: board["title"],
            icon: board["icon"],
            tiles: []
        };
        for (const tile of board["tiles"]) {
            boardObj.tiles.push(tiles[tile]);
        }
        boards[name] = boardObj;
    }
    return boards;
}

function fillBoard(board) {
    shuffle(board.tiles);

    boardDomBackup = boardDom.cloneNode(true);
    boardDom.parentNode.replaceChild(boardDomBackup, boardDom)

    tileGrid = document.querySelectorAll(".tile");
    boardDom = document.querySelector("#board");

    for (let i = 0; i < board.tiles.length; i++) {
        const tileObj = board.tiles[i];
        const tileDom = tileGrid[i];

        tileDom.innerHTML = null;

        let tile_title = tileObj.title.replace(/_/g, ' ');
        tile_title = tile_title.charAt(0).toUpperCase() + tile_title.slice(1);

        tileDom.innerHTML = `
			<img class="tab-img" src="${tileObj.face}">
			<div class="tile-title">${tile_title}</div>
			<video loop muted>
				<source src="${tileObj.clips[0]}" type="video/mp4">
			</video>
		`;

        // <source src="/assets/test.mp4" type="video/mp4">

        const myCallback = () => {
            const video = tileDom.querySelector("video");

            if (configPane.classList.contains("menu-expanded")) {
                configPane.classList.remove("menu-expanded");
                menuButton.classList.remove("selected");
            } else if (tileDom.classList.contains("flipped")) {
                console.log("unflip!");
                tileDom.classList.toggle("flipped");

                video.pause();
                boardDom.style.pointerEvents = "none";
                tileDom.style.pointerEvents = null;
                navBar.style.pointerEvents = null;


                window.setTimeout(function () {
                    tileDom.style = null;
                    positionTilesAll(tileGrid.length);
                    boardDom.style.pointerEvents = null;
                }, 1000);

            } else {
                console.log("flip!");
                // debug.innerHTML = "";

                positionTileAbsolute(tileDom);

                const videoSource = video.querySelector("source");
                videoSource.src = tileObj.clips[Math.floor(Math.random() * tileObj.clips.length)];
                video.load()

                boardDom.style.pointerEvents = "none";
                navBar.style.pointerEvents = "none";

                tileDom.style.zIndex = 5;


                window.setTimeout(function () {
                    tileDom.classList.toggle("flipped");
                }, 10);
                window.setTimeout(function () {
                    video.play();
                    tileDom.style.pointerEvents = "all";
                }, 1000);

            }
            // debug.appendChild(video);
        }

        tileDom.removeEventListener("click", myCallback);
        tileDom.addEventListener("click", myCallback);

    }
}

function positionTilesAll(tileCount) {
    console.log(tileCount);
    let rows = 4;
    let cols = 6;
    if (tileCount === 24) {
        rows = 4;
        cols = 6;
    } else if (tileCount === 20) {
        rows = 4;
        cols = 5;
    } else if (tileCount === 15) {
        rows = 3;
        cols = 5;
    }


    if (window.innerWidth < window.innerHeight) {
        const rowTemp = rows;
        rows = cols;
        cols = rowTemp;
    }
    document.body.style.setProperty("--row-count", rows);
    document.body.style.setProperty("--col-count", cols);
    for (let i = 0; i < tileCount; i++) {
        const y = Math.floor(i / cols) + 1;
        tileGrid[i].style.gridColumn = (i % cols) + 1;
        tileGrid[i].style.gridRow = y;
    }
}

function clearTileStyle() {
    for (let i = tileGrid.length - 1; i >= 0; i--) {
        tileGrid[i].style = null;
    }
}

function positionTileAbsolute(tile) {
    let rect = tile.getBoundingClientRect();

    tile.style.position = "absolute";
    tile.style.gridArea = null;
    tile.style.left = rect.left + "px";
    tile.style.top = rect.top + "px";
    tile.style.width = rect.width + "px";
    tile.style.height = rect.height + "px";
    tile.style.margin = 0;
}

function handleBoardSelection(checkbox, boardId, checkboxType) {
    // Save the checkbox state in localStorage based on boardId and checkboxType
    localStorage.setItem("board-" + boardId + "-" + checkboxType, checkbox.checked);

    // Call the function that updates the navbar
    fillNavbar();
}


function fillNavbar() {
    navBoards.innerHTML = null;
    let isEnabled;
    for (const [name, board] of Object.entries(boards)) {
        isEnabled = localStorage.getItem("board-" + name + "-enabled");
        if (isEnabled === "true") {
            navBoards.innerHTML += `
				<div class="tab-button" data-board="${name}">
					<img class="tab-img" src="/assets/board_${name}.svg" width="64" height="64">
				</div>
			`;
        }
    }
    const navButtons = navBoards.querySelectorAll(".tab-button");
    for (const button of navButtons) {
        button.addEventListener("click", () => {
            for (const button of navButtons) {
                button.classList.remove("selected");
            }
            const currentBoard = boards[button.getAttribute("data-board")];
            constructBoard(currentBoard.tiles.length);
            isLabeled = localStorage.getItem("board-" + button.getAttribute("data-board") + "-labels");

            if (isLabeled === "true") {
                boardDom.classList.add("has-labels");
                debug.innerText = "is labeled";
            } else {
                boardDom.classList.remove("has-labels");
                debug.innerText = "is not labeled";
            }


            tileGrid = document.querySelectorAll(".tile");
            positionTilesAll(currentBoard.tiles.length);
            fillBoard(currentBoard);
            button.classList.add("selected");
            boardDom.style.display = null;
            configPane.classList.remove("menu-expanded");
            menuButton.classList.remove("menu-button-spin");
            menuButton.classList.remove("selected");
        });
    }
}

function greet() {
    boardDom.style.display = "none";

    const greetingElement = document.getElementById('greeting');
    const now = new Date();
    const hours = now.getHours();

    if (hours < 12) {
        greetingElement.innerText = 'Good morning!';
    } else if (hours < 18) {
        greetingElement.innerText = 'Good afternoon!';
    } else {
        greetingElement.innerText = 'Good evening!';
    }
}

async function main() {
    tiles = await loadTiles();
    boards = await loadBoards(tiles);

    menuButton.addEventListener("click", () => {
        configPane.classList.toggle("menu-expanded");
        menuButton.classList.toggle("selected");
    });

    boardSelectCheckboxes.forEach(checkbox => {
        // Determine whether the checkbox is for "Enabled" or "Labels"
        const checkboxType = checkbox.id.includes("_enabled") ? "enabled" : "labels";
        const boardId = checkbox.id.split("_")[0]; // Extract the board ID

        // Set the checkbox state from localStorage if it's stored
        if (localStorage.getItem("board-" + boardId + "-" + checkboxType) === "true") {
            checkbox.checked = true;
        }

        // Add an event listener for changes
        checkbox.addEventListener("change", () => {
            handleBoardSelection(checkbox, boardId, checkboxType);
        });
    });

    fillNavbar();
    greet();
}

main()
