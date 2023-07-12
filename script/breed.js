"use strict";
import { saveToStorage, getFromStorage } from "./storage.js";

// ----------- 5. Breed feature -----------

// Variables
const submitBtn = document.getElementById("submit-btn");
const typeInput = document.getElementById("input-type");
const breedInput = document.getElementById("input-breed");

const tableBodyEl = document.querySelector("#tbody");

// OK 5.1 Breed lists stored in LocalStorage
const breedArr = JSON.parse(getFromStorage("breedArr")) ?? [];

function save() {
  saveToStorage("breedArr", JSON.stringify(breedArr));
}
// OK 5.2 Breed={breed:'',type:''}
// OK 5.3 Add/Delete breed

// ------ Global function ------
// Clear input function
const clearInput = function () {
  typeInput.value = "Select Type"; // Default value = "Select Type"
  breedInput.value = ""; // Default value = "Select Breed"
};

// Validate function
const validateInput = function () {
  let alertMsg = "";
  if (typeInput.value === "Select Type") {
    alertMsg += "Please select Type\n";
  }
  if (breedInput.value === "") {
    alertMsg += "Please input Breed\n";
  }
  breedArr.forEach((obj) => {
    if (obj.breed === breedInput.value && obj.type === typeInput.value) {
      alertMsg += "Breed must be unique\n";
    }
  });
  return alertMsg;
};

function addTableData(object, index) {
  const row = document.createElement("tr");
  row.innerHTML = `<th scope="row">${index + 1}</th>
  <td>${object.breed}</td>
  <td>${object.type}</td>
    <button type="button" class="btn btn-danger btn-delete" data-breed="${
      object.breed
    }">Delete</button>
  </td>`;
  tableBodyEl.appendChild(row);
}

function renderBreedTable(breedArray) {
  tableBodyEl.innerHTML = "";
  breedArray.forEach((petObj, i) => {
    addTableData(petObj, i);
  });
}
renderBreedTable(breedArr);

// Submit
submitBtn.addEventListener("click", function () {
  if (validateInput() === "") {
    // Assign value
    const data = {
      type: typeInput.value,
      breed: breedInput.value,
    };

    breedArr.push(data);
    save();
    clearInput();
    renderBreedTable(breedArr);
    console.log(breedArr);
  } else {
    alert(validateInput());
  }
});

// Delete
document.querySelector("#tbody").addEventListener("click", function (e) {
  if (e.target.classList.contains("btn-delete")) {
    deletePet(e.target.dataset.breed);
  }
});
function deletePet(breedName) {
  function findBreed(breedObj) {
    return breedName === breedObj.breed;
  }
  if (confirm("Are you sure?")) {
    breedArr.splice(breedArr.findIndex(findBreed), 1);
    // saveToStorage
    save();
    renderBreedTable(breedArr);
  }
}
