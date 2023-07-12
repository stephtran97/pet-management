"use strict";

import { saveToStorage, getFromStorage } from "./script/storage.js";

// Global variables
const submitBtn = document.getElementById("submit-btn");
const idInput = document.getElementById("input-id");
const nameInput = document.getElementById("input-name");
const ageInput = document.getElementById("input-age");
const typeInput = document.getElementById("input-type");
const weightInput = document.getElementById("input-weight");
const lengthInput = document.getElementById("input-length");
const colorInput = document.getElementById("input-color-1");
const breedInput = document.getElementById("input-breed");
const vaccinatedInput = document.getElementById("input-vaccinated");
const dewormedInput = document.getElementById("input-dewormed");
const sterilizedInput = document.getElementById("input-sterilized");

const btnHealthy = document.getElementById("healthy-btn");
const btnBmi = document.getElementById("bmi-btn");

let healthyCheck = false;
// Table variable
const tableBodyEl = document.querySelector("#tbody");

// Pet array getFromStorage
const petArr = JSON.parse(getFromStorage("petArr")) ?? [];
let healthyPetArr = [];

// ------ Global function ------

// save to Storage
function save() {
  saveToStorage("petArr", JSON.stringify(petArr));
}

// Convert date function
function convertDate(str) {
  const date = new Date(str),
    mnth = ("0" + (date.getMonth() + 1)).slice(-2), //Take 2 last char if mnth,day <10
    day = ("0" + date.getDate()).slice(-2);
  return [day, mnth, date.getFullYear()].join("-");
}

// Clear input function
const clearInput = function () {
  idInput.value = "";
  nameInput.value = "";
  ageInput.value = "";
  typeInput.value = "Select Type"; // Default value = "Select Type"
  weightInput.value = "";
  lengthInput.value = "";
  colorInput.value = "#000000";
  breedInput.value = "Select Breed"; // Default value = "Select Breed"
  vaccinatedInput.checked = false;
  dewormedInput.checked = false;
  sterilizedInput.checked = false;
};

// Validate function
const validateInput = function () {
  let alertMsg = "";
  if (idInput.value === "") {
    alertMsg += "Please input for id\n";
  }
  if (nameInput.value === "") {
    alertMsg += "Please input for name\n";
  }
  if (ageInput.value === "") {
    alertMsg += "Please input for age\n";
  }
  if (typeInput.value === "Select Type") {
    alertMsg += "Please select Type\n";
  }
  if (weightInput.value === "") {
    alertMsg += "Please input for weight\n";
  }
  if (lengthInput.value === "") {
    alertMsg += "Please input for length\n";
  }
  if (breedInput.value === "Select Breed") {
    alertMsg += "Please select Breed\n";
  }
  petArr.forEach((petObj) => {
    if (idInput.value === petObj.id) {
      alertMsg += "ID must be unique!\n";
    }
  });

  if (Number(ageInput.value) < 1 || Number(ageInput.value) > 15) {
    alertMsg += "Age must be between 1kg and 15kg!\n";
  }
  if (Number(weightInput.value) < 1 || Number(weightInput.value) > 15) {
    alertMsg += "Weight must be between 1kg and 15kg!\n";
  }
  if (Number(lengthInput.value) < 1 || Number(lengthInput.value) > 100) {
    alertMsg += "Length must be between 1cm and 100cm!\n";
  }
  return alertMsg;
};

// Add table data function

function addTableData(object) {
  const row = document.createElement("tr");
  row.innerHTML = `<th scope="row">${object.id}</th>
  <td>${object.name}</td>
  <td>${object.age}</td>
  <td>${object.type}</td>
  <td>${object.weight} kg</td>
  <td>${object.length} cm</td>
  <td>${object.breed}</td>
  <td>
    <i class="bi bi-square-fill" style="color: ${object.color}"></i>
  </td>
  <td><i class="bi ${
    object.vaccinated === true ? "bi-check-circle-fill" : "bi-x-circle-fill"
  }"></i></td>
  <td><i class="bi ${
    object.dewormed === true ? "bi-check-circle-fill" : "bi-x-circle-fill"
  }"></i></td>
  <td><i class="bi ${
    object.sterilized === true ? "bi-check-circle-fill" : "bi-x-circle-fill"
  }"></i></td>
  <td>${(object.bmi = object.bmi === undefined ? "?" : object.bmi)}</td>
  <td>${convertDate(object.date)}</td>
  <td>
    <button type="button" class="btn btn-danger btn-delete" data-pet-identification="${
      object.id
    }">Delete</button>
  </td>`;
  tableBodyEl.appendChild(row);
}

// Render table data function

function renderTableData(petArray) {
  tableBodyEl.innerHTML = "";
  petArray.forEach((petObj) => {
    addTableData(petObj);
  });
}

// Initial render table data

renderTableData(petArr);

// ----------- Add pet information Feature -----------

// ------ Submit button ------

submitBtn.addEventListener("click", function () {
  if (validateInput() === "") {
    // Assign value
    const data = {
      id: idInput.value,
      name: nameInput.value,
      age: Number(ageInput.value),
      type: typeInput.value,
      weight: Number(weightInput.value),
      length: Number(lengthInput.value),
      color: colorInput.value,
      breed: breedInput.value,
      vaccinated: vaccinatedInput.checked,
      dewormed: dewormedInput.checked,
      sterilized: sterilizedInput.checked,
      date: new Date(),
    };

    petArr.push(data);
    save();
    clearInput();
    switch (healthyCheck) {
      case false:
        renderTableData(petArr);
        break;
      case true:
        renderTableData(healthyPetArr);
        break;
    }
  } else {
    alert(validateInput());
  }
});

// ----------- Delete pet information Feature -----------
// Delete pet function:
document.querySelector("#tbody").addEventListener("click", function (e) {
  if (e.target.classList.contains("btn-delete")) {
    deletePet(e.target.dataset.petIdentification);
  }
});
function deletePet(petId) {
  if (confirm("Are you sure?")) {
    function findId(pet) {
      return pet.id === String(petId);
    }
    switch (healthyCheck) {
      case false:
        petArr.splice(petArr.findIndex(findId), 1);
        // saveToStorage
        save();
        renderTableData(petArr);
        break;
      case true:
        petArr.splice(petArr.findIndex(findId), 1);
        // saveToStorage
        save();
        healthyPetArr.splice(healthyPetArr.findIndex(findId), 1);
        renderTableData(healthyPetArr);
        break;
    }
  }
}
// ----------- Show healthy Pet Feature -----------

// Show Healthy pet/Show all pet button toggle

const healthyButtonToggle = function () {
  btnHealthy.textContent =
    healthyCheck === true ? "Show All Pet" : "Show Healthy Pet";
};

function isHealthy(pet) {
  return (
    pet.vaccinated === true && pet.dewormed === true && pet.sterilized === true
  );
}
btnHealthy.addEventListener("click", function () {
  if (!healthyCheck) {
    healthyCheck = true;
    healthyButtonToggle();
    healthyPetArr = petArr.filter(isHealthy);
    renderTableData(healthyPetArr);
  } else {
    healthyCheck = false;
    healthyButtonToggle();
    renderTableData(petArr);

    // Reset element in array healthyPetArr
    healthyPetArr.splice(0, healthyPetArr.length);
  }
});

// ----------- Calculate BMI Feature -----------

function bmiCalc(petObject) {
  let bmi;
  switch (petObject.type) {
    case "Cat":
      bmi = (petObject.weight * 703) / petObject.length ** 2;
      break;
    case "Dog":
      bmi = (petObject.weight * 886) / petObject.length ** 2;
      break;
  }
  petObject.bmi = Math.round(bmi * 100) / 100;
}

btnBmi.addEventListener("click", function () {
  petArr.forEach((petObj) => {
    bmiCalc(petObj);
  });
  switch (healthyCheck) {
    case false:
      renderTableData(petArr);
      break;
    case true:
      renderTableData(healthyPetArr);
      break;
  }
});

// \\\\\\\\\----------- ASM 2 -----------///////// \\

// ----------- 5. Breed -----------

// renderBreed

function renderBreed(listBreed, type) {
  if (typeInput.value === "Select Type") {
    breedInput.innerHTML = "<option>Select Breed</option>";
  } else {
    listBreed
      .filter((el) => {
        return el.type === type;
      })
      .forEach((el) => {
        const option = document.createElement("option");
        option.innerHTML = `${el.breed}`;
        breedInput.appendChild(option);
      });
  }
}

const breedArr = JSON.parse(getFromStorage("breedArr")) ?? [];

typeInput.addEventListener("change", () => {
  breedInput.innerHTML = "";
  renderBreed(breedArr, typeInput.value);
});
