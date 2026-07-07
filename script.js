const FONT_VERSION = "v0.020";
const DEMO_FONT_BASE_PATH = "fonts/";
const RELEASE_FONT_BASE_URL =
    `https://github.com/am517/SaiKanji/releases/download/${FONT_VERSION}/`;

const demoPanel = document.querySelector("#demoPanel");
const demoText = document.querySelector("#demoText");
const paletteSelect = document.querySelector("#paletteSelect");
const lightToggle = document.querySelector("#lightToggle");
const gridToggle = document.querySelector("#gridToggle");
const langSelect = document.querySelector("#langSelect");
const demoBackgroundToggle = document.querySelector("#demoBackgroundToggle");
const currentDownload = document.querySelector("#currentDownload");
const sectionDownload = document.querySelector("#sectionDownload");
const fontProgress = document.querySelector("#fontProgress");
const fontProgressBar = document.querySelector("#fontProgressBar");
const fontDownloadGrid = document.querySelector("#fontDownloadGrid");
const fillInputs = Array.from(document.querySelectorAll("input[name='fillStyle']"));

const paletteLabels = {
    regular: "Regular",
    balanced: "Balanced",
    contrast: "Contrast",
    spectrum: "Spectrum",
    black: "Black",
};

const fontRecords = buildFontRecords();
const fontsByKey = new Map(fontRecords.map((font) => [font.key, font]));
const loadedFonts = new Map();
let activeFontRequest = 0;

function titleCase(value) {
    return value
        .split("-")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join("-");
}

function buildFontRecords() {
    const records = [];
    const colorStyles = [
        ["regular", "Regular"],
        ["regular-light", "Regular-Light"],
        ["balanced", "Balanced"],
        ["balanced-light", "Balanced-Light"],
        ["contrast", "Contrast"],
        ["contrast-light", "Contrast-Light"],
        ["spectrum", "Spectrum"],
        ["spectrum-light", "Spectrum-Light"],
    ];
    const fillStyles = [
        ["gradient", "Gradient"],
        ["solid", "Solid"],
    ];
    const gridStyles = [
        ["", ""],
        ["grid", ".Grid"],
    ];

    for (const [colorKey, colorFile] of colorStyles) {
        for (const [fillKey, fillFile] of fillStyles) {
            for (const [gridKey, gridFile] of gridStyles) {
                const key = [colorKey, fillKey, gridKey]
                    .filter(Boolean)
                    .join("-");
                const fontStem = `SaiKanji.${colorFile}.${fillFile}${gridFile}`;
                const woff2FileName = `${fontStem}.${FONT_VERSION}.woff2`;
                const ttfFileName = `${fontStem}.ttf`;
                const family = `SaiKanji Demo ${titleCase(key)}`;
                records.push({
                    key,
                    family,
                    woff2FileName,
                    woff2Url: `${DEMO_FONT_BASE_PATH}${woff2FileName}`,
                    ttfFileName,
                    ttfUrl: `${RELEASE_FONT_BASE_URL}${ttfFileName}`,
                    label: `${colorFile} ${fillFile}${gridKey ? " Grid" : ""}`,
                    description: `${fillFile.toLowerCase()} color${gridKey ? ", guide grid" : ""}`,
                });
            }
        }
    }

    for (const gridKey of ["", "grid"]) {
        const key = ["black", gridKey].filter(Boolean).join("-");
        const fontStem = `SaiKanji.Black${gridKey ? ".Grid" : ""}`;
        const woff2FileName = `${fontStem}.${FONT_VERSION}.woff2`;
        const ttfFileName = `${fontStem}.ttf`;
        records.push({
            key,
            family: `SaiKanji Demo ${titleCase(key)}`,
            woff2FileName,
            woff2Url: `${DEMO_FONT_BASE_PATH}${woff2FileName}`,
            ttfFileName,
            ttfUrl: `${RELEASE_FONT_BASE_URL}${ttfFileName}`,
            label: `Black${gridKey ? " Grid" : ""}`,
            description: `monochrome fallback${gridKey ? ", guide grid" : ""}`,
        });
    }

    return records;
}

function selectedFill() {
    return fillInputs.find((input) => input.checked)?.value || "gradient";
}

function selectedFontKey() {
    const palette = paletteSelect.value;
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

    if (gridToggle.checked) {
        parts.push("grid");
    }

    return parts.join("-");
}

function setProgress(value, state = "loading") {
    fontProgress.dataset.state = state;
    fontProgressBar.style.transform = `scaleX(${Math.max(0, Math.min(1, value))})`;
}

function setDownloadTargets(font) {
    for (const link of [currentDownload, sectionDownload]) {
        link.href = font.ttfUrl;
        link.download = font.ttfFileName;
        link.setAttribute("aria-label", `Download ${font.label}`);
    }
}

async function fetchFontBuffer(font, requestId) {
    const response = await fetch(font.woff2Url);
    if (!response.ok) {
        throw new Error(`Could not load ${font.woff2FileName}`);
    }

    const total = Number(response.headers.get("content-length")) || 0;
    const reader = response.body?.getReader();

    if (!reader) {
        setProgress(0.45);
        return response.arrayBuffer();
    }

    const chunks = [];
    let received = 0;

    while (true) {
        const { done, value } = await reader.read();
        if (done) {
            break;
        }

        chunks.push(value);
        received += value.length;
        if (requestId === activeFontRequest) {
            setProgress(total ? received / total : 0.35);
        }
    }

    const buffer = new Uint8Array(received);
    let offset = 0;
    for (const chunk of chunks) {
        buffer.set(chunk, offset);
        offset += chunk.length;
    }

    return buffer.buffer;
}

async function loadDemoFont(font) {
    const requestId = ++activeFontRequest;
    setProgress(0.04);

    try {
        if (!loadedFonts.has(font.key)) {
            const buffer = await fetchFontBuffer(font, requestId);
            const face = new FontFace(font.family, buffer);
            await face.load();
            document.fonts.add(face);
            loadedFonts.set(font.key, face);
        }

        if (requestId !== activeFontRequest) {
            return;
        }

        demoText.style.fontFamily = `"${font.family}", serif`;
        setProgress(1, "loaded");
    } catch (error) {
        if (requestId === activeFontRequest) {
            demoText.style.fontFamily = "serif";
            setProgress(1, "error");
        }
        console.error(error);
    }
}

function updateDemoFont() {
    const isBlack = paletteSelect.value === "black";

    fillInputs.forEach((input) => {
        input.disabled = isBlack;
    });
    lightToggle.disabled = isBlack;

    const font = fontsByKey.get(selectedFontKey());
    if (!font) {
        return;
    }

    demoText.dataset.fontKey = font.key;
    setDownloadTargets(font);
    loadDemoFont(font);
}

function updateDemoBackground() {
    demoPanel.dataset.demoBackground = demoBackgroundToggle.checked
        ? "dark"
        : "light";
}

function changeLanguage(language) {
    document.documentElement.lang = language;
    document.documentElement.dataset.contentLang =
        document.querySelector(`.i18n[lang="${language}"]`) ? language : "en";
    localStorage.setItem("saikanji-language", language);
}

function renderFontDownloads() {
    fontDownloadGrid.replaceChildren(
        ...fontRecords.map((font) => {
            const link = document.createElement("a");
            link.className = "font-download";
            link.href = font.ttfUrl;
            link.download = font.ttfFileName;

            const name = document.createElement("strong");
            name.textContent = font.label;

            const description = document.createElement("span");
            description.textContent = font.description;

            link.append(name, description);
            return link;
        }),
    );
}

function restoreLanguage() {
    const savedLanguage = localStorage.getItem("saikanji-language") || "en";
    langSelect.value = savedLanguage;
    changeLanguage(savedLanguage);
}

[paletteSelect, lightToggle, gridToggle, ...fillInputs].forEach((control) => {
    control.addEventListener("change", updateDemoFont);
});

demoBackgroundToggle.addEventListener("change", updateDemoBackground);
langSelect.addEventListener("change", () => changeLanguage(langSelect.value));

renderFontDownloads();
restoreLanguage();
updateDemoBackground();
updateDemoFont();
