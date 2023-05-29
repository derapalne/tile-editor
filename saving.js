let currentSlot = 1;

function savePattern() {
    screenContainer.classList.add("saving");
    let pattern = "";
    for (let y = 0; y < 24; y++) {
        for (let x = 0; x < 32; x++) {
            const coords = `${x}-${23 - y}`;
            const cell = getById(`cell-${coords}`);
            const background = cell.children.item(0);
            const sprite = cell.children.item(1);
            
            pattern += `${background.dataset.sprite}${sprite.dataset.sprite}-`;
        }
        pattern += ";";
    }
    localStorage.setItem("pattern-" + currentSlot, pattern);
    setTimeout(() => {
        screenContainer.classList.remove("saving");
    }, Math.random() * 350 + 150);
}

function loadPattern() {
    screenContent.style.opacity = 0;
    const pattern = localStorage.getItem("pattern-" + currentSlot);
    if (!pattern) {
        screenContent.style.opacity = 1;
        initScreenEditable("grass");
        return;
    };
    const patternRows = pattern.split(";", 24);
    for (let y = 0; y < patternRows.length; y++) {
        const rowCells = patternRows[y].split("-", 32);
        if(rowCells[0].length !== 4) {
            alert("Corrupt, broken, or old pattern!");
            break;
        }
        for (let x = 0; x < rowCells.length; x++) {
            const cellCoords = `${x}-${23 - y}`;
            const cell = getById(`cell-${cellCoords}`);
            const background = cell.children.item(0);
            background.src = `img/${rowCells[x].substring(0,2)}b.png`;
            background.setAttribute("data-sprite", rowCells[x].substring(0,2));
            background.classList.add("invisible");
            const sprite = cell.children.item(1);
            sprite.src = `img/${rowCells[x].substring(2,4)}s.png`;
            sprite.setAttribute("data-sprite", rowCells[x].substring(2,4));
            sprite.classList.add("invisible");
        }
    }
    loadPatternAnimation();
}

function loadPatternAnimation() {
    let y = 0;
    let x = 0;
    const interval = setInterval(() => {
        if (y > 23) clearInterval(interval);
        if (x > 31) {
            y++;
            x = 0;
        }
        const cellCoords = `${x}-${23 - y}`;
        const cell = getById(`cell-${cellCoords}`);
        if (!cell) return;
        const background = cell.children.item(0);
        background.classList.remove("invisible");
        const sprite = cell.children.item(1);
        sprite.classList.remove("invisible");
        x++;
    }, 0.1);
    screenContent.style.opacity = 1;
}


function savePatternToFile() {
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
    setTimeout(() => {
        screenContainer.classList.remove("saving");
    }, Math.random() * 400 + 300);
    const fileName = `pattern_tiledit_${Date.now().toString().substring(7)}_${Math.floor(
        Math.random() * 16384
    )}`;
    const file = new File([pattern], fileName, { type: "text/plain" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(file);
    link.href = url;
    link.download = file.name;
    // document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
}

function loadPatternFromFile() {

}

function changeCurrentSlot(slot) {
    currentSlot = slot;
    const slotButtons = document.querySelectorAll(".slot");
    slotButtons.forEach((button) => {
        button.classList.remove("selected");
    })
    const slotButton = getById("slot-" + slot);
    slotButton.classList.add("selected");
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

// const saveToFileButton = getById("save-file-button");
// saveToFileButton.addEventListener("click", (e) => savePatternToFile());

const loadButton = getById("load-button");
loadButton.addEventListener("click", (e) => {
    e.preventDefault();
    loadPattern();
});

// const loadToFileButton = getById("load-file-button");
// loadToFileButton.addEventListener("click", (e) => savePatternToFile());

const slot1 = getById("slot-1");
const slot2 = getById("slot-2");
const slot3 = getById("slot-3");
const slot4 = getById("slot-4");

slot1.addEventListener("click", () => changeCurrentSlot(1));
slot2.addEventListener("click", () => changeCurrentSlot(2));
slot3.addEventListener("click", () => changeCurrentSlot(3));
slot4.addEventListener("click", () => changeCurrentSlot(4));




changeCurrentSlot(1);