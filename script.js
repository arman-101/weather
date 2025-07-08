let unit = "uk";
let lastLocation = "";

const unitBtn = document.getElementById("location-unit");
function listenUnit() {
  unitBtn.addEventListener("click", async () => {
    unit = unit === "uk" ? "us" : "uk";
    unitBtn.innerText = unit === "uk" ? "°C" : "°F";

    if (lastLocation) {
      document.querySelector(".content-div").innerHTML = "";
      const result = await fetchData(lastLocation, unit);
      if (result) displayData(result);
    }
  });
}


const formBtn = document.querySelector("form");
function listenLocation() {
  formBtn.addEventListener("submit", async (e) => {
    e.preventDefault();

    const queryValue = document.getElementById("location-input");
    const queryInput = queryValue.value.trim();

    if (!queryInput || queryInput === "") {
      const errorH1 = document.querySelector(".no-result-title");
      errorH1.innerText = "Please enter a location...";
      return;
    }

    document.querySelector(".content-div").innerHTML = "";

    const result = await fetchData(queryInput, unit);

    if (!result) {
      alert("Enter a valid location please...");
      return;
    }

    displayData(result);
    // empty query
    console.log("Clearing input");
    queryValue.value = "";
  });
}

async function fetchData(place, unit) {
  try {
    const response = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${place}?unitGroup=${unit}&nonulls&elements=tempmax,tempmin,temp&key=APY5RDY4JDSTPDN9WDNAEAKAS&contentType=json`
    );
    const data = await response.json();

    if (!data?.currentConditions || !data?.days?.length) {
      return null;
    }

    const address = data.resolvedAddress;
    const currentTemp = data.currentConditions.temp;
    const maxTemp = data.days[0].tempmax;
    const minTemp = data.days[0].tempmin;

    return { address, currentTemp, maxTemp, minTemp };
  } catch (err) {
    console.error(err);
    return null;
  }
}

function displayData(data) {
  const contentDiv = document.querySelector(".content-div");
  const card = document.createElement("div");
  card.classList.add("card");

  const location = document.createElement("p");
  location.textContent = data.address;
  location.classList.add("location-p");
  const date = document.createElement("p");

  const now = new Date();
  const day = now.getDate(); // 1-31
  const month = now.getMonth() + 1; // 0-11, so add 1
  const year = now.getFullYear(); // 4-digit year
  const hour = String(now.getHours()).padStart(2, "0"); // 0-23
  const minute = String(now.getMinutes()).padStart(2, "0"); // 0-59

  date.textContent = `${day}/${month}/${year}   -   ${hour}:${minute}`;

  const tempSymbol = unit === "uk" ? "°C" : "°F";

  const currentTemp = document.createElement("p");
  currentTemp.textContent =
    "Current Temperature: " + data.currentTemp + tempSymbol;
  const maxTemp = document.createElement("p");
  maxTemp.textContent = "Max Temperature: " + data.maxTemp + tempSymbol;
  const minTemp = document.createElement("p");
  minTemp.textContent = "Min Temperature: " + data.minTemp + tempSymbol;

  card.append(location, date, currentTemp, maxTemp, minTemp);
  contentDiv.appendChild(card);

  // hide h1 from beginning
  const searchH1 = document.querySelector(".no-result-title");

  if (searchH1) {
    searchH1.classList.add("hidden");
  }
}

function main() {
  listenLocation();
  listenUnit();
}

main();
