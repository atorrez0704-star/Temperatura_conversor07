const form = document.getElementById("converterForm");
const temperatureInput = document.getElementById("temperature");
const fromUnit = document.getElementById("fromUnit");
const toUnit = document.getElementById("toUnit");
const resultBox = document.getElementById("resultBox");
const resultValue = document.getElementById("resultValue");
const resultUnit = document.getElementById("resultUnit");
const errorMessage = document.getElementById("errorMessage");
const swapButton = document.getElementById("swapButton");
const clearButton = document.getElementById("clearButton");
const temperatureStatus = document.getElementById("temperatureStatus");
const statusText = document.getElementById("statusText");

const units = {
    C: { name: "Celsius", symbol: "°C" },
    F: { name: "Fahrenheit", symbol: "°F" },
    K: { name: "Kelvin", symbol: "K" }
};

function convertTemperature(value, from, to) {
    if (from === to) return value;

    let celsius;

    switch (from) {
        case "C": celsius = value; break;
        case "F": celsius = (value - 32) * 5 / 9; break;
        case "K": celsius = value - 273.15; break;
    }

    switch (to) {
        case "C": return celsius;
        case "F": return (celsius * 9 / 5) + 32;
        case "K": return celsius + 273.15;
        default: return NaN;
    }
}

function formatNumber(number) {
    const rounded = Math.round((number + Number.EPSILON) * 100) / 100;
    return rounded.toLocaleString("es-CO", { maximumFractionDigits: 2 });
}

function showError(message) {
    errorMessage.textContent = message;
    temperatureInput.classList.add("input-error");
}

function clearError() {
    errorMessage.textContent = "";
    temperatureInput.classList.remove("input-error");
}

function getCelsiusValue(value, unit) {
    switch (unit) {
        case "C": return value;
        case "F": return (value - 32) * 5 / 9;
        case "K": return value - 273.15;
        default: return NaN;
    }
}

function updateTemperatureStatus(celsiusValue) {
    temperatureStatus.classList.remove("cold", "hot");

    if (celsiusValue < 10) {
        temperatureStatus.classList.add("cold");
        statusText.textContent = "❄️ Temperatura fría";
    } else if (celsiusValue >= 30) {
        temperatureStatus.classList.add("hot");
        statusText.textContent = "🔥 Temperatura caliente";
    } else {
        statusText.textContent = "🌤️ Temperatura moderada";
    }
}

function performConversion() {
    clearError();

    const rawValue = temperatureInput.value.trim();

    if (rawValue === "") {
        showError("Por favor, ingresa una temperatura.");
        resultValue.textContent = "—";
        resultUnit.textContent = "Ingresa un valor para convertir";
        return;
    }

    const value = Number(rawValue);

    if (!Number.isFinite(value)) {
        showError("Ingresa un valor numérico válido.");
        resultValue.textContent = "—";
        resultUnit.textContent = "No se pudo realizar la conversión";
        return;
    }

    if (fromUnit.value === "K" && value < 0) {
        showError("La temperatura en Kelvin no puede ser menor que 0 K.");
        resultValue.textContent = "—";
        resultUnit.textContent = "Valor fuera del rango físico válido";
        return;
    }

    const result = convertTemperature(value, fromUnit.value, toUnit.value);

    if (!Number.isFinite(result)) {
        showError("No fue posible realizar la conversión.");
        return;
    }

    resultValue.textContent = formatNumber(result);
    resultUnit.textContent = `${units[toUnit.value].name} (${units[toUnit.value].symbol})`;

    resultBox.classList.remove("animate");
    void resultBox.offsetWidth;
    resultBox.classList.add("animate");

    updateTemperatureStatus(getCelsiusValue(value, fromUnit.value));
}

form.addEventListener("submit", (event) => {
    event.preventDefault();
    performConversion();
});

temperatureInput.addEventListener("input", () => {
    clearError();

    if (temperatureInput.value.trim() !== "") {
        performConversion();
    } else {
        resultValue.textContent = "—";
        resultUnit.textContent = "Ingresa un valor para convertir";
        temperatureStatus.classList.remove("cold", "hot");
        statusText.textContent = "Ingresa una temperatura";
    }
});

fromUnit.addEventListener("change", () => {
    if (temperatureInput.value.trim() !== "") performConversion();
});

toUnit.addEventListener("change", () => {
    if (temperatureInput.value.trim() !== "") performConversion();
});

swapButton.addEventListener("click", () => {
    const currentFrom = fromUnit.value;
    fromUnit.value = toUnit.value;
    toUnit.value = currentFrom;

    if (temperatureInput.value.trim() !== "") performConversion();
});

clearButton.addEventListener("click", () => {
    temperatureInput.value = "";
    fromUnit.value = "C";
    toUnit.value = "F";
    resultValue.textContent = "—";
    resultUnit.textContent = "Ingresa un valor para convertir";
    clearError();
    temperatureStatus.classList.remove("cold", "hot");
    statusText.textContent = "Ingresa una temperatura";
    temperatureInput.focus();
});

temperatureInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        event.preventDefault();
        performConversion();
    }
});
