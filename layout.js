function getById(id) {
    return document.getElementById(id);
}

let editable = true;
let currentSprite = "01";
const totalSprites = 10;

const cellSeparator = ",";
const rowSeparatosr = ";";

const screenContainer = getById("screen");

const currentSpriteElement = document.createElement("img");
currentSpriteElement.classList.add("current-element");
currentSpriteElement.src = `/img/${currentSprite}.png`;
currentSpriteElement.addEventListener("click", changeCurrentSprite);
screenContainer.appendChild(currentSpriteElement);

const screenContent = document.createElement("div");
screenContent.classList.add("screen-content");

function toggleEditMode() {
    if (editable) {
        const background = document.querySelectorAll(".cell");
        background.forEach((item) => {
            item.classList.remove("editable");
            item.removeEventListener("contextmenu", (e) => {
                e.preventDefault();
                if (e.shiftKey) {
                    return pickSprite(cellCoords);
                }
                eraseSprite(cellCoords);
            });
            item.removeAttribute("onclick");
        });
        editButton.innerText = "Editable: ❌";
    } else {
        for (let y = 0; y < 24; y++) {
            for (let x = 0; x < 32; x++) {
                const cellCoords = `${x}-${23 - y}`;
                const cell = getById(`cell-${cellCoords}`);
                cell.addEventListener("contextmenu", (e) => {
                    e.preventDefault();
                    if (e.shiftKey) {
                        return pickSprite(cellCoords);
                    }
                    eraseSprite(cellCoords);
                });
                cell.classList.add("cell", "editable");
                cell.setAttribute("onclick", `paintSprite('${cellCoords}')`);
            }
        }
        editButton.innerText = "Editable: ✔";
    }
    editable = !editable;
}

function changeCurrentSprite() {
    currentSprite++;
    if (currentSprite >= totalSprites) currentSprite = 0;
    currentSprite = currentSprite.toString().padStart(2, "0");
    currentSpriteElement.src = `/img/${currentSprite}.png`;
}

window.addEventListener("keyup", (e) => {
    if (e.key === " ") {
        e.preventDefault();
        changeCurrentSprite();
    }
});

function paintSprite(coords) {
    const cell = getById(`cell-${coords}`);
    const sprite = cell.children.item(0);
    sprite.src = `/img/${currentSprite}.png`;
    sprite.setAttribute("data-sprite", currentSprite);
}

function eraseSprite(coords) {
    const cell = getById(`cell-${coords}`);
    const sprite = cell.children.item(0);
    sprite.src = `/img/00.png`;
    sprite.setAttribute("data-sprite", "00");
}

function pickSprite(coords) {
    const cell = getById(`cell-${coords}`);
    const sprite = cell.children.item(0);
    currentSprite = sprite.dataset.sprite;
    currentSpriteElement.src = `/img/${currentSprite}.png`;
}

function initScreenEditable() {
    for (let y = 0; y < 24; y++) {
        const row = document.createElement("div");
        row.setAttribute("id", `row-${23 - y}`);
        row.classList.add("row");
        for (let x = 0; x < 32; x++) {
            const cell = document.createElement("div");
            const cellCoords = `${x}-${23 - y}`;
            cell.setAttribute("id", `cell-${cellCoords}`);
            cell.classList.add("cell", "editable");
            cell.setAttribute("onclick", `paintSprite('${cellCoords}')`);
            cell.addEventListener("contextmenu", (e) => {
                e.preventDefault();
                if (e.shiftKey) {
                    return pickSprite(cellCoords);
                }
                eraseSprite(cellCoords);
            });
            const sprite = document.createElement("img");
            if (y > 18) {
                sprite.src = "/img/02.png";
                sprite.setAttribute("data-sprite", "02");
            } else {
                if (y === 18) {
                    sprite.src = "/img/01.png";
                    sprite.setAttribute("data-sprite", "01");
                } else {
                    sprite.src = "/img/00.png";
                    sprite.setAttribute("data-sprite", "00");
                }
            }

            sprite.classList.add("background-sprite");
            cell.appendChild(sprite);
            row.appendChild(cell);
        }
        screenContent.appendChild(row);
    }
}

function savePattern() {
    screenContainer.classList.add("saving");
    let pattern = "";
    for (let y = 0; y < 24; y++) {
        for (let x = 0; x < 32; x++) {
            const coords = `${x}-${23 - y}`;
            const cell = getById(`cell-${coords}`);
            const sprite = cell.children.item(0);
            pattern += `${sprite.dataset.sprite}-`;
        }
        pattern += ";";
    }
    localStorage.setItem("pattern", pattern);
    setTimeout(() => {
        screenContainer.classList.remove("saving");
    }, Math.random() * 400 + 300);
}

function loadPattern() {
    screenContent.style.opacity = 0;
    const pattern = localStorage.getItem("pattern");
    if (!pattern) return false;
    const patternRows = pattern.split(";", 24);
    for (let y = 0; y < patternRows.length; y++) {
        const rowCells = patternRows[y].split("-", 32);
        for (let x = 0; x < rowCells.length; x++) {
            const cellCoords = `${x}-${23 - y}`;
            const cell = getById(`cell-${cellCoords}`);
            const sprite = cell.children.item(0);
            sprite.src = `/img/${rowCells[x]}.png`;
            sprite.setAttribute("data-sprite", rowCells[x]);
            sprite.classList.add("invisible");
        }
    }
    loadPatternAnimation();
}

function loadPatternAnimation() {
    let y = 0;
    let x = 0;
    screenContent.style.opacity = 1;
    const interval = setInterval(() => {
        if (y > 23) clearInterval(interval);
        if (x > 31) {
            y++;
            x = 0;
        }
        const cellCoords = `${x}-${23 - y}`;
        const cell = getById(`cell-${cellCoords}`);
        if (!cell) return;
        const sprite = cell.children.item(0);
        sprite.classList.remove("invisible");
        x++;
    }, 0.1);
}

const editButton = getById("edit-button");
editButton.addEventListener("click", (e) => {
    e.preventDefault();
    toggleEditMode();
});

const saveButton = getById("save-button");
saveButton.addEventListener("click", (e) => {
    e.preventDefault();
    savePattern();
});

const loadButton = getById("load-button");
loadButton.addEventListener("click", (e) => {
    e.preventDefault();
    loadPattern();
});

initScreenEditable();

screenContainer.appendChild(screenContent);
