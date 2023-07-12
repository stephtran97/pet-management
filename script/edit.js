"use strict";
import { saveToStorage, getFromStorage } from "./storage.js";

// ----------- 3. Edit feature to edit pet info -----------

// OK 3.1.khi vào giao diện Edit thì bạn sẽ hiển thị các thú cưng hiện tại, cùng với nút Edit như sau:

// OK 3.2.Khi nhấn vào Edit một thú cưng nào đó, bạn sẽ hiển thị thêm một Form để chỉnh sửa, các giá trị của input sẽ là giá trị hiện tại của thú cưng đó:

// OK 3.3. function startEditPet(petId) -> dc goi khi nguoi dung an vao nut Edit -> Tim thong tin thu cung va hien thi ra form; Submit -> hien thi thong tin da cap nhat; form chinh sua se duoc reset va an di;

// OK Ở form Edit, cần hiển thị Breed tương ứng với Type của thú cưng đang edit. Nếu người dùng đổi Type thì cũng hiển thị lại các Breed tương ứng.

// OK Không thể chỉnh sửa trường ID, do đây là trường để phân biệt các thú cưng.

// OK Khi nhấn nút Edit, giá trị trên Form sẽ là các thông tin hiện tại của thú cưng đó.

// OK Khi lưu (nhấn nút Submit), bạn cần Validate các dữ liệu hiện tại theo như các yêu cầu ở bài Assignment 01.

//----------------------------------------------------------------------------------

// Data copy from script.js: petArr;addTableData;renderTableData;validateInput;save;convertDate;breedArr;renderBreed;

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
// Table variable
const tableBodyEl = document.querySelector("#tbody");

// Pet array getFromStorage
const petArr = JSON.parse(getFromStorage("petArr")) ?? [];

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

// Validate function
const validateInput = function () {
  let alertMsg = "";
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
  
  <td>${convertDate(object.date)}</td>
  <td>
    <button type="button" class="btn btn-warning btn-edit" data-pet-identification="${
      object.id
    }">Edit</button>
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
// renderBreed

function renderBreed(listBreed, type) {
  if (typeInput.value === "Select Type") {
    breedInput.innerHTML = "<option>Select Breed</option>";
  } else {
    breedInput.innerHTML = "";
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

// ------------------------Working------------------------

// Display/hide form
function displayForm() {
  document.querySelector("form").classList.remove("none");
}
function hideForm() {
  document.querySelector("form").classList.add("none");
}

// startEditPet
let currentPet;
function startEditPet(petId) {
  currentPet = petArr.find((el) => el.id === petId);

  // Display pet info
  idInput.value = currentPet.id;
  nameInput.value = currentPet.name;
  ageInput.value = currentPet.age;
  typeInput.value = currentPet.type;
  renderBreed(breedArr, typeInput.value);

  weightInput.value = currentPet.weight;
  lengthInput.value = currentPet.length;
  colorInput.value = currentPet.color;
  breedInput.value = currentPet.breed;

  vaccinatedInput.checked = currentPet.vaccinated;
  dewormedInput.checked = currentPet.dewormed;
  sterilizedInput.checked = currentPet.sterilized;
}

// Running
renderTableData(petArr);

tableBodyEl.addEventListener("click", function (e) {
  if (e.target.classList.contains("btn-edit")) {
    displayForm();
    startEditPet(e.target.dataset.petIdentification); // pass petId into fn argument
  }
});
// Submit pet info
submitBtn.addEventListener("click", function () {
  if (validateInput() === "") {
    // Re-assign value
    currentPet.name = nameInput.value;
    currentPet.age = Number(ageInput.value);
    currentPet.type = typeInput.value;
    currentPet.weight = Number(weightInput.value);
    currentPet.length = Number(lengthInput.value);
    currentPet.color = colorInput.value;
    currentPet.breed = breedInput.value;
    currentPet.vaccinated = vaccinatedInput.checked;
    currentPet.dewormed = dewormedInput.checked;
    currentPet.sterilized = sterilizedInput.checked;
    currentPet.date = new Date();

    // Save data
    save();
    hideForm();
    renderTableData(petArr);
    currentPet = [];
  } else {
    alert(validateInput());
  }
});
