"use strict";
import { saveToStorage, getFromStorage } from "./storage.js";

// ----------- 4. Search feature -----------

/* OK Lưu ý: Bạn cần hiển thị đầy đủ các giá trị của trường Breed, không phân biệt Dog hay Cat.

Chức năng này sẽ có một Form để nhập liệu như trên hình. Sau đó khi người nhưng nhấn "Find", bạn sẽ tìm và hiển thị những thú cưng với tiêu chí sau:

OK 4.1 Nếu trường ID được nhập, hiển thị những thú cưng có ID chứa ID vừa nhập. Ví dụ như bạn nhập vào "P0" thì sẽ hiển thị thú cưng có ID "P001", "P002", ... Tương tự như vậy với trường Name.
OK 4.2 Nếu trường Name được nhập thì sẽ hiển thị những thú cưng có tên chứa ký tự được nhập.
OK 4.3 Nếu trường Type được chọn giá trị (Cat hoặc Dog) thì hiển thị các thú cưng với Type tương ứng. Tương tự với trường Breed.
OK 4.4 Nếu trường Vaccinated được tick, hiển thị các thú cưng đã được tiêm phòng. Tương tự với Dewormed và Sterilized.
OK 4.5 Lưu ý: Bạn sẽ cần tìm thú cưng đáp ứng đầy đủ các tiêu chí trên chứ không phải một trong các tiêu chí đó.

*/

// Code get from script.js: variables;convertDate;clearInput;addTableData;renderTableData;renderBreed;

// Global variables
const findBtn = document.getElementById("find-btn");
const idInput = document.getElementById("input-id");
const nameInput = document.getElementById("input-name");
const typeInput = document.getElementById("input-type");
const breedInput = document.getElementById("input-breed");
const vaccinatedInput = document.getElementById("input-vaccinated");
const dewormedInput = document.getElementById("input-dewormed");
const sterilizedInput = document.getElementById("input-sterilized");

// Table variable
const tableBodyEl = document.querySelector("#tbody");

// Pet array getFromStorage
const petArr = JSON.parse(getFromStorage("petArr")) ?? [];
// ------ Global function ------

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
  typeInput.value = "Select Type"; // Default value = "Select Type"
  breedInput.value = "Select Breed"; // Default value = "Select Breed"
  vaccinatedInput.checked = false;
  dewormedInput.checked = false;
  sterilizedInput.checked = false;
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
  `;
  tableBodyEl.appendChild(row);
}

// Render table data function

function renderTableData(petArray) {
  tableBodyEl.innerHTML = "";
  petArray.forEach((petObj) => {
    addTableData(petObj);
  });
}

// renderBreedAll (modified -> render all breed)
const breedArr = JSON.parse(getFromStorage("breedArr")) ?? [];

function renderBreedAll(listBreed) {
  breedInput.innerHTML = "<option>Select Breed</option>";
  listBreed.forEach((el) => {
    const option = document.createElement("option");
    option.innerHTML = `${el.breed}`;
    breedInput.appendChild(option);
  });
}

// ---------------- Running ----------------
// Breed render
renderBreedAll(breedArr);

// Find feature

findBtn.addEventListener("click", function (e) {
  const displayArr = petArr.filter(
    (el) =>
      (idInput.value !== ""
        ? el.id.toLowerCase().includes(idInput.value.toLowerCase())
        : true) &&
      (nameInput.value !== ""
        ? el.name.toLowerCase().includes(nameInput.value.toLowerCase())
        : true) &&
      (typeInput.value === "Select Type"
        ? true
        : el.type === typeInput.value) &&
      (breedInput.value === "Select Breed"
        ? true
        : el.breed === breedInput.value) &&
      (vaccinatedInput.checked === false
        ? true
        : vaccinatedInput.checked === el.vaccinated) &&
      (dewormedInput.checked === false
        ? true
        : dewormedInput.checked === el.dewormed) &&
      (sterilizedInput.checked === false
        ? true
        : sterilizedInput.checked === el.sterilized)
  );
  renderTableData(displayArr);
});
