"use strict";
import { saveToStorage, getFromStorage } from "./storage.js";
import { saveAs } from "../lib/FileSaver.js";

const importBtn = document.querySelector("#import-btn");
const exportBtn = document.querySelector("#export-btn");

let petArr = JSON.parse(getFromStorage("petArr")) ?? [];

// save to Storage
function save() {
  saveToStorage("petArr", JSON.stringify(petArr));
}

// ----------- Export Feature -----------
exportBtn.addEventListener("click", function () {
  // Convert the JSON object to a Blob
  const blobPet = new Blob([JSON.stringify(petArr)], {
    type: "application/json",
  });

  // Save the Blob as a file
  saveAs(blobPet, "data.json");
});

// ----------- Import Feature -----------
const fileInput = document.getElementById("input-file");

importBtn.addEventListener("click", function () {
  fileInput.click(); // Trigger the file input
});

fileInput.addEventListener("change", function () {
  const file = fileInput.files[0]; // Get the selected file
  const reader = new FileReader();
  reader.onload = function (event) {
    const jsonData = event.target.result; // Get the file content as text
    petArr = JSON.parse(jsonData); // Parse the JSON data into petArr
    // saveToStorage
    save();
  };

  reader.readAsText(file); // Read the file as text
});
