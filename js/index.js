var FsName = document.getElementById("sName");
var Furl = document.getElementById("url");
var Fcategory = document.getElementById("category");

var search = document.getElementById("search");
var tbody = document.getElementById("tbody");
var inputs = document.getElementsByClassName("inputs");
var categorySort = document.getElementById("categorySort");

var btnSubmit = document.getElementById("btnSubmit");
var showAllBtn = document.getElementById("showAllBtn");
var alert1 = document.getElementById("alert1");
var alert2 = document.getElementById("alert2");
// reg for name
var namereg = /^.{2,16}$/;
// reg for url
var urlreg =
  /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{2,15}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;

var bookmarkArr = [];
var categoryArr = ["Unsorted"];
var currentRowIndex = "";

// to retrieve data from local storage
if (JSON.parse(localStorage.getItem("MyBookmark")) != null) {
  bookmarkArr = JSON.parse(localStorage.getItem("MyBookmark"));
  displayBookmark();
}
if (localStorage.getItem("bookmarkCategories") != null) {
  categoryArr = JSON.parse(localStorage.getItem("bookmarkCategories"));
  displayCategory();
}

// to check user input(site name) immediately
FsName.onkeyup = function () {
  if (namereg.test(FsName.value)) {
    FsName.classList.add("is-valid");
    FsName.classList.remove("is-invalid");
    alert1.classList.add("d-none");
  } else {
    FsName.classList.add("is-invalid");
    FsName.classList.remove("is-valid");
    alert1.innerText = "From 2 to 16 characters ...";
    alert1.classList.remove("d-none");
  }
};
// to check user input(site url) immediately
Furl.onkeyup = function () {
  if (urlreg.test(Furl.value)) {
    Furl.classList.add("is-valid");
    Furl.classList.remove("is-invalid");
    alert2.classList.add("d-none");
  } else {
    Furl.classList.add("is-invalid");
    Furl.classList.remove("is-valid");
    alert2.innerText = "Start with http://-https://-Invalid Web Page ...";
    alert2.classList.remove("d-none");
  }
};

// to add bookmark + display bookmrk + category
btnSubmit.onclick = function () {
  if (checkfields()) {
    addtobookmarkArr();
    displayBookmark();
    displayCategory();
  }
};

// check process before adding bookmark
function checkfields() {
  // if fields empty
  if (FsName.value == "" && Furl.value == "") {
    alert1.innerText = "Required Field ...";
    alert1.classList.remove("d-none");
    alert2.innerText = "Required Field ...";
    alert2.classList.remove("d-none");
    return false;
  }
  // if fields not empty but not valid
  else if (!urlreg.test(Furl.value) || !namereg.test(FsName.value)) {
    if (!urlreg.test(Furl.value)) {
      alert2.innerText = "Invalid Field ...";
      alert2.classList.remove("d-none");
    } else if (!namereg.test(FsName.value)) {
      alert1.innerText = "Invalid Field ...";
      alert1.classList.remove("d-none");
    }
    return false;
  } else {
    alert1.classList.add("d-none");
    alert2.classList.add("d-none");
    return true;
  }
}

// to add bookmark after validation to table
function addtobookmarkArr() {
  var bookM = {
    name: FsName.value,
    url: Furl.value,
    // to define category (in case the user leave it empty )
    category: defineCategory(Fcategory.value),
  };

  bookmarkArr.push(bookM);
  var tempCategory = bookM.category;
  addToCategory(tempCategory);

  localStorage.setItem("MyBookmark", JSON.stringify(bookmarkArr));
  localStorage.setItem("bookmarkCategories", JSON.stringify(categoryArr));
  clearInputs();
}
// to show the table of bookmarks
function displayBookmark() {
  var displayContainer = "";

  if (bookmarkArr.length == 0) {
    tbody.innerHTML = displayContainer;
  } else {
    for (var i = 0; i < bookmarkArr.length; i++) {
      displayContainer += `
      <tr class="animate__animated animate__fadeIn">
          <td class="text-center t-over ">${bookmarkArr[i].name}</td>
          <td class="text-center t-over">${bookmarkArr[i].category}</td>
          <td><a href="${bookmarkArr[i].url}" target="_blank"><button type="button" id="V${i}"
                      class="btn btn-info text-dark fw-semibold">Visit</button></a>
          </td>
          <td><button type="button" id="D${i}" class="btn btn-danger fw-semibold">Delete</button>
          </td>
      </tr>
      `;
      tbody.innerHTML = displayContainer;
    }
  }
}

// to clear inputs after submit
function clearInputs() {
  for (var i = 0; i < inputs.length; i++) {
    inputs[i].value = "";
  }
  //to reset  all fields and alerts
  FsName.classList.remove("is-invalid");
  FsName.classList.remove("is-valid");
  Furl.classList.remove("is-invalid");
  Furl.classList.remove("is-valid");
}

// to get the index of any row inside table body
tbody.addEventListener("click", function (e) {
  var tempIndex = e.target.id;
  // to remove D letter from the beginning of btn name (id)
  currentRowIndex = tempIndex.slice(1);
  // to be sure the user clicked delet not visit btn
  if (tempIndex.startsWith("D")) {
    deleteRow(currentRowIndex);
  }
});
// to delete data from tablr body
function deleteRow(currentRowIndex) {
  var tempCategory = bookmarkArr[currentRowIndex].category;
  bookmarkArr.splice(currentRowIndex, 1);
  // to delete category from list of categories
  deleteCategory(tempCategory);
  localStorage.setItem("MyBookmark", JSON.stringify(bookmarkArr));
  displayBookmark();
}
// to delete category from list
function deleteCategory(tempCategory) {
  var index = categoryArr.indexOf(tempCategory);
  // counter to know number of items with the same category if we have only one we can delete it
  var count = 0;
  for (var i = 0; i < bookmarkArr.length; i++) {
    if (bookmarkArr[i].category == tempCategory) {
      count++;
    }
  }
  // to prevent delete, if we have other items inside the same category
  if (count == 0 && index != 0) {
    categoryArr.splice(index, 1);
    localStorage.setItem("bookmarkCategories", JSON.stringify(categoryArr));
    displayCategory();
  }
}

// to set category to unsorted list if it's empty
function defineCategory(catValue) {
  if (catValue == "") {
    return "Unsorted";
  } else {
    return catValue;
  }
}
// add to category array
function addToCategory(tempCategory) {
  // to prevent duplication
  if (!categoryArr.includes(tempCategory)) {
    categoryArr.push(tempCategory);
  }
}
// to display categories list
function displayCategory() {
  disCatContainer = `<div class="col-12 px-4 ">
        <div class="p-1 bg-info bg-opacity-50 text-center text-over rounded-3 fw-semibold shadow animate__animated animate__bounceInRight"
        data-bs-toggle="tooltip" data-bs-placement="right"
        data-bs-title="Click to Filter Categories">
            Unsorted
        </div>
    </div>
  `;
  if (categoryArr.length == 1) {
    categorySort.innerHTML = disCatContainer;
  } else {
    for (var i = 1; i < categoryArr.length; i++) {
      disCatContainer += `
      <div class="col-12 px-4 ">
        <div class="p-1 bg-info bg-opacity-50 text-center text-over rounded-3 fw-semibold shadow animate__animated animate__bounceInRight"
        data-bs-toggle="tooltip" data-bs-placement="right"
        data-bs-title="Click to Filter Categories">
            ${categoryArr[i]}
        </div>
    </div>
      `;
    }
    categorySort.innerHTML = disCatContainer;
  }
}
// to search inside bookmarks table
search.onkeyup = function () {
  var tempContainer = "";
  for (var i = 0; i < bookmarkArr.length; i++) {
    if (
      bookmarkArr[i].name.toLowerCase().includes(search.value.toLowerCase())
    ) {
      tempContainer += `
  <tr class="animate__animated animate__fadeIn">
      <td class="text-center t-over">${bookmarkArr[i].name}</td>
      <td class="text-center t-over">${bookmarkArr[i].category}</td>
      <td><a href="${bookmarkArr[i].url}" target="_blank"><button type="button" id="V${i}"
                  class="btn btn-info text-dark fw-semibold">Visit</button></a>
      </td>
      <td><button type="button" id="D${i}" class="btn btn-danger fw-semibold">Delete</button>
      </td>
  </tr>
  `;
      tbody.innerHTML = tempContainer;
    }
  }
};

// to filter bookmark results by category
categorySort.addEventListener("click", function (e) {
  var categoryName = e.target.innerText;
  //console.log(categoryName);
  var tempContainer = "";
  for (var i = 0; i < bookmarkArr.length; i++) {
    if (categoryName == bookmarkArr[i].category) {
      tempContainer += `
  <tr class="animate__animated animate__fadeInLeft">
      <td class="text-center t-over">${bookmarkArr[i].name}</td>
      <td class="text-center t-over">${bookmarkArr[i].category}</td>
      <td><a href="${bookmarkArr[i].url}" target="_blank"><button type="button" id="V${i}"
                  class="btn btn-info text-dark fw-semibold">Visit</button></a>
      </td>
      <td><button type="button" id="D${i}" class="btn btn-danger fw-semibold">Delete</button>
      </td>
  </tr>
  `;
      tbody.innerHTML = tempContainer;
    }
    // else if (categoryName == "Unsorted") {
    //   tempContainer = "";
    //   tbody.innerHTML = tempContainer;
    // }
  }
  // show the btn show all to restore all the results again without filter
  showAllBtn.innerHTML = `<div class="position-absolute rounded-3 showAll animate__animated animate__flipInY">Show
  All</div>`;
});

// to hide show all btn then display all bookmarks
showAllBtn.onclick = function () {
  showAllBtn.innerHTML = `<div class="position-absolute rounded-3 showAll animate__animated animate__flipOutY">Show
  All</div>`;

  displayBookmark();
};

// to enable Tooltip bootstrap -- used in category list
const tooltipTriggerList = document.querySelectorAll(
  '[data-bs-toggle="tooltip"]'
);
const tooltipList = [...tooltipTriggerList].map(
  (tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl)
);
