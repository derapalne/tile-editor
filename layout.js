function getById(id) {
    return document.getElementById(id);
}

let editable = true;
let clicking = false;
let currentSprite = "01";
const totalSprites = 14;

const cellSeparator = ",";
const rowSeparatosr = ";";

const screenContainer = getById("screen");

const currentSpriteElement = document.createElement("img");
currentSpriteElement.classList.add("current-element");
currentSpriteElement.src = `img/${currentSprite}.png`;
currentSpriteElement.addEventListener("click", changeCurrentSprite);
screenContainer.appendChild(currentSpriteElement);

const screenContent = document.createElement("div");
screenContent.classList.add("screen-content");

function spriteClickHandler(e, cellCoords) {
    if (e.shiftKey) {
        return fillAreaWithSprite(cellCoords);
    }
    paintSprite(cellCoords);
}

function spriteRightClickHandler(e, cellCoords) {
    e.preventDefault();
    if (e.shiftKey) {
        return pickSprite(cellCoords);
    }
    eraseSprite(cellCoords);
}

function spriteMouseDownHandler(e, cellCoords) {
    e.preventDefault();
    paintSprite(cellCoords);
    clicking = true;
}

function spriteMouseUpHandler(e) {
    clicking = false;
}

function spriteMouseOverHandler(e, cellCoords) {
    if (clicking) {
        paintSprite(cellCoords);
    }
}

function toggleEditMode() {
    if (editable) {
        const background = document.querySelectorAll(".cell");
        background.forEach((cell) => {
            cell.classList.remove("editable");
            cell.removeEventListener("contextmenu", (e) => spriteRightClickHandler(e, cellCoords));
            cell.removeEventListener("click", (e) => spriteClickHandler(e, cellCoords));
            cell.removeEventListener("mousedown", (e) => spriteMouseDownHandler(e, cellCoords));
            cell.removeEventListener("mouseup", (e) => spriteMouseUpHandler(e));
            cell.removeEventListener("mouseover", (e) => spriteMouseOverHandler(e));
        });
        editButton.innerText = "Editable: ❌";
    } else {
        for (let y = 0; y < 24; y++) {
            for (let x = 0; x < 32; x++) {
                const cellCoords = `${x}-${23 - y}`;
                const cell = getById(`cell-${cellCoords}`);
                cell.classList.add("editable");
                cell.addEventListener("contextmenu", (e) => spriteRightClickHandler(e, cellCoords));
                cell.addEventListener("click", (e) => spriteClickHandler(e, cellCoords));
                cell.addEventListener("mousedown", (e) => spriteMouseDownHandler(e, cellCoords));
                cell.addEventListener("mouseup", (e) => spriteMouseUpHandler(e));
                cell.addEventListener("mouseover", (e) => spriteMouseOverHandler(e));
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
    currentSpriteElement.src = `img/${currentSprite}.png`;
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
    sprite.src = `img/${currentSprite}.png`;
    sprite.setAttribute("data-sprite", currentSprite);
}

function eraseSprite(coords) {
    const cell = getById(`cell-${coords}`);
    const sprite = cell.children.item(0);
    sprite.src = `img/00.png`;
    sprite.setAttribute("data-sprite", "00");
}

function pickSprite(coords) {
    const cell = getById(`cell-${coords}`);
    const sprite = cell.children.item(0);
    currentSprite = sprite.dataset.sprite;
    currentSpriteElement.src = `img/${currentSprite}.png`;
}

function fillAreaWithSprite(coords) {
    const rootX = coords.split("-")[0];
    const rootY = coords.split("-")[1];
    const cell = getById(`cell-${coords}`);
    const sprite = cell.children.item(0);
    sprite.src = `img/${currentSprite}.png`;
    const matchingTile = sprite.dataset.sprite;
    console.log(matchingTile, rootX, rootY);
    let differentPY = false;
    let cursorPy = 0;
    while (!differentPY) {
        if (Number(rootY) + cursorPy > 23) break;
        let cursorPx = 1;
        let differentPX = false;
        while (!differentPX) {
            const newCellCoords = `${Number(rootX) + cursorPx}-${Number(rootY) + cursorPy}`;
            if (Number(rootX) + cursorPx > 31) break;
            console.log(newCellCoords);
            const newCell = getById(`cell-${newCellCoords}`);
            const newSprite = newCell.children.item(0);
            if (newSprite.dataset.sprite === matchingTile) {
                newSprite.src = `img/${currentSprite}.png`;
            } else {
                if (cursorPx === 1) differentPY = true;
                differentPX = true;
            }
            cursorPx++;
        }
        cursorPy++;
    }
}

function initScreenEditable(preset) {
    let filling, topping;
    switch (preset) {
        case "grass":
            filling = "img/02.png";
            topping = "img/01.png";
            break;
        case "ocean":
            filling = "img/04.png";
            topping = "img/05.png";
            break;
        case "stone":
            filling = "img/08.png";
            topping = "img/09.png";
            break;
        default:
            filling = "img/02.png";
            topping = "img/01.png";
            break;
    }
    screenContent.innerHTML = "";
    for (let y = 0; y < 24; y++) {
        const row = document.createElement("div");
        row.setAttribute("id", `row-${23 - y}`);
        row.classList.add("row");
        for (let x = 0; x < 32; x++) {
            const cell = document.createElement("div");
            const cellCoords = `${x}-${23 - y}`;
            cell.setAttribute("id", `cell-${cellCoords}`);
            cell.classList.add("cell", "editable");
            cell.addEventListener("contextmenu", (e) => spriteRightClickHandler(e, cellCoords));
            cell.addEventListener("click", (e) => spriteClickHandler(e, cellCoords));
            cell.addEventListener("mousedown", (e) => spriteMouseDownHandler(e, cellCoords));
            cell.addEventListener("mouseup", (e) => spriteMouseUpHandler(e));
            cell.addEventListener("mouseover", (e) => spriteMouseOverHandler(e, cellCoords));
            const sprite = document.createElement("img");
            if (y > 18) {
                sprite.src = filling;
                sprite.setAttribute("data-sprite", filling.substring(4, 6));
            } else {
                if (y === 18) {
                    sprite.src = topping;
                    sprite.setAttribute("data-sprite", topping.substring(4, 6));
                } else {
                    sprite.src = "img/00.png";
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

const grassPreset = getById("grass-preset");
grassPreset.addEventListener("click", (e) => {
    e.preventDefault();
    initScreenEditable("grass");
});

const oceanPreset = getById("ocean-preset");
oceanPreset.addEventListener("click", (e) => {
    e.preventDefault();
    initScreenEditable("ocean");
});

const stonePreset = getById("stone-preset");
stonePreset.addEventListener("click", (e) => {
    e.preventDefault();
    initScreenEditable("stone");
});

initScreenEditable("grass");

screenContainer.appendChild(screenContent);
