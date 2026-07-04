const demoText = document.querySelector("#demoText");
const paletteSelect = document.querySelector("#paletteSelect");
const lightToggle = document.querySelector("#lightToggle");
const gridToggle = document.querySelector("#gridToggle");
const fillInputs = Array.from(document.querySelectorAll("input[name='fillStyle']"));

const fontClasses = [
    "regular-gradient",
    "regular-gradient-grid",
    "regular-solid",
    "regular-solid-grid",
    "regular-light-gradient",
    "regular-light-gradient-grid",
    "regular-light-solid",
    "regular-light-solid-grid",
    "balanced-gradient",
    "balanced-gradient-grid",
    "balanced-solid",
    "balanced-solid-grid",
    "balanced-light-gradient",
    "balanced-light-gradient-grid",
    "balanced-light-solid",
    "balanced-light-solid-grid",
    "contrast-gradient",
    "contrast-gradient-grid",
    "contrast-solid",
    "contrast-solid-grid",
    "contrast-light-gradient",
    "contrast-light-gradient-grid",
    "contrast-light-solid",
    "contrast-light-solid-grid",
    "spectrum-gradient",
    "spectrum-gradient-grid",
    "spectrum-solid",
    "spectrum-solid-grid",
    "spectrum-light-gradient",
    "spectrum-light-gradient-grid",
    "spectrum-light-solid",
    "spectrum-light-solid-grid",
    "black",
    "black-grid",
];

function selectedFill() {
    return fillInputs.find((input) => input.checked)?.value || "gradient";
}

function updateDemoFont() {
    const palette = paletteSelect.value;
    const grid = gridToggle.checked;
    const isBlack = palette === "black";
    const parts = [];

    if (isBlack) {
        parts.push("black");
    } else {
        parts.push(palette);
        if (lightToggle.checked) {
            parts.push("light");
        }
        parts.push(selectedFill());
    }

    if (grid) {
        parts.push("grid");
    }

    const className = parts.join("-");
    demoText.classList.remove(...fontClasses);
    demoText.classList.add(className);

    fillInputs.forEach((input) => {
        input.disabled = isBlack;
    });
    lightToggle.disabled = isBlack;
}

[paletteSelect, lightToggle, gridToggle, ...fillInputs].forEach((control) => {
    control.addEventListener("change", updateDemoFont);
});

updateDemoFont();
