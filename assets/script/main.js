// ====================AOS====================
AOS.init();

// ====================ISOTOPE====================
$(document).ready(function () {
  var $grid = $("#product-grid").isotope({
    itemSelector: ".col-md-4",
    layoutMode: "fitRows",
  });

  $("#filters").on("click", "button", function () {
    var filterValue = $(this).attr("data-filter");
    $grid.isotope({ filter: filterValue });
    $("#filters button").removeClass("active");
    $(this).addClass("active");
  });
});

// ====================SWIPER====================
var swiper = new Swiper(".mySwiper", {
  slidesPerView: 1,
  spaceBetween: 10,
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  breakpoints: {
    640: {
      slidesPerView: 2,
      spaceBetween: 20,
    },
    768: {
      slidesPerView: 3,
      spaceBetween: 40,
    },
    1024: {
      slidesPerView: 3,
      spaceBetween: 50,
    },
  },
});

var swiper = new Swiper(".mySwiper1", {
  spaceBetween: 30,
  effect: "fade",
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
});

// ====================NAVBAR====================
const hamburgerMenu = document.getElementById("hamburger-menu");
const menuNavbar = document.querySelector(".nav");

hamburgerMenu.addEventListener("click", () => {
  hamburgerMenu.classList.toggle("hamburger-active");
  menuNavbar.classList.toggle("nav-active");
});

// ====================ORDER====================
const validateInput = (inputElement, errorMessageSelector) => {
  const errorMessage = document.querySelector(errorMessageSelector);

  // Validasi umum
  if (
    inputElement.value === "" ||
    (inputElement.id === "quantity" &&
      (isNaN(inputElement.value) || inputElement.value < 1))
  ) {
    errorMessage.classList.add("error-message_input-active");
    setTimeout(() => {
      errorMessage.classList.remove("error-message_input-active");
    }, 5000);
    return false;
  }

  // Validasi Email
  if (inputElement.id === "email") {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(inputElement.value)) {
      errorMessage.textContent = "Format email tidak valid";
      errorMessage.classList.add("error-message_input-active");
      setTimeout(() => {
        errorMessage.classList.remove("error-message_input-active");
      }, 5000);
      return false;
    }
  }

  // Validasi No HP
  if (inputElement.id === "noHP") {
    const phoneNumber = inputElement.value.replace(/[^0-9]/g, "");
    if (phoneNumber.length < 10) {
      errorMessage.textContent = "Nomor HP harus memiliki setidaknya 10 digit";
      errorMessage.classList.add("error-message_input-active");
      setTimeout(() => {
        errorMessage.classList.remove("error-message_input-active");
      }, 5000);
      return false;
    }
  }

  // Validasi Alamat
  if (inputElement.id === "address") {
    const wordCount = inputElement.value.trim().replace(/\s+/g, "").length;
    if (wordCount < 30) {
      errorMessage.textContent =
        "Alamat harus terdiri dari setidaknya 30 huruf";
      errorMessage.classList.add("error-message_input-active");
      setTimeout(() => {
        errorMessage.classList.remove("error-message_input-active");
      }, 3000);
      return false;
    }
  }

  return true;
};

// Validasi tambahan email
const emailInput = document.getElementById("email");
emailInput.addEventListener("input", () => {
  const inputValue = emailInput.value;

  for (
    let checkInputEmailValue = 0;
    checkInputEmailValue < inputValue.length;
    checkInputEmailValue++
  ) {
    const charCode = inputValue.charCodeAt(checkInputEmailValue);
    if (
      (charCode < 65 || charCode > 90) &&
      (charCode < 97 || charCode > 122) &&
      (charCode < 48 || charCode > 57) &&
      charCode !== 46 &&
      charCode !== 64 &&
      charCode !== 95
    ) {
      emailInput.value =
        inputValue.substring(0, checkInputEmailValue) +
        inputValue.substring(checkInputEmailValue + 1);
    }
  }
});

// ====================LOGIC RINGKASAN PESANAN====================
let totalPrice = 0;
let orders = {};
let isOrderAdded = false;
const btnAddOrder = document.querySelector(".btn-add_order");

const addOrder = () => {
  const inputs = [
    {
      element: document.getElementById("orderer-name"),
      errorMessage: "#orderer-name + .error-message_input",
    },

    {
      element: document.getElementById("chooseFood"),
      errorMessage: "#chooseFood + .error-message_input",
    },

    {
      element: document.getElementById("quantity"),
      errorMessage: "#quantity + .error-message_input",
    },

    {
      element: document.getElementById("address"),
      errorMessage: "#address + .error-message_input",
    },

    {
      element: document.getElementById("email"),
      errorMessage: "#email + .error-message_input",
    },

    {
      element: document.getElementById("noWhatsApp"),
      errorMessage: "#noWhatsApp + .error-message_input",
    },

    {
      element: document.getElementById("dateAndTime"),
      errorMessage: "#dateAndTime + .error-message_input",
    },
  ];

  for (let input of inputs) {
    if (!validateInput(input.element, input.errorMessage)) {
      return;
    }
  }

  const chooseFoodInput = document.getElementById("chooseFood");
  const quantityInput = document.getElementById("quantity");

  const selectedMenu = chooseFoodInput.options[chooseFoodInput.selectedIndex];
  const menuName = selectedMenu.text;
  const priceMenu = parseFloat(selectedMenu.getAttribute("data-price"));
  const quantity = parseInt(quantityInput.value);

  const idMenu = selectedMenu.value;

  if (orders[idMenu]) {
    orders[idMenu].quantity += quantity;
    orders[idMenu].totalPrice += priceMenu * quantity;
    updateSummaryOrder();
  } else {
    orders[idMenu] = {
      name: menuName,
      price: priceMenu,
      quantity: quantity,
      totalPrice: priceMenu * quantity,
    };
    addElementSummaryOrder(menuName, quantity);
  }

  totalPrice += priceMenu * quantity;
  updateCustomerInfo();
  updateTotalPrice();

  const summaryOrder = document.getElementById("summaryOrder");
  summaryOrder.classList.remove("d-none");

  isOrderAdded = true;
  if (isOrderAdded) {
    btnAddOrder.textContent = "Perbarui Pesanan";
  }
};

const updateCustomerInfo = () => {
  const ordererName = document.getElementById("orderer-name").value;
  const email = document.getElementById("email").value;
  const noWhatsApp = document.getElementById("noWhatsApp").value;
  const dateAndTimeInput = document.getElementById("dateAndTime").value;
  const dateAndTime = new Date(dateAndTimeInput).toLocaleString();
  const address = document.getElementById("address").value;
  const message =
    document.getElementById("message").value ||
    "Tidak ada pesan yang disampaikan pelanggan";

  const informationCustomer = document.getElementById("informationCustomer");
  informationCustomer.innerHTML = `
    <li><span>Nama Pemesan:</span> ${ordererName}</li>
    <li><span>Email:</span> ${email}</li>
    <li><span>Nomor WhatsApp:</span> ${noWhatsApp}</li>
    <li><span>Alamat:</span> ${address}</li>
  `;

  const dateAndTimeSummaryOrder = document.getElementById(
    "dateAndTimeSummaryOrder"
  );
  dateAndTimeSummaryOrder.innerHTML = `<li><span>Tanggal dan Waktu:</span> ${dateAndTime}</li>`;

  const messageSummaryOrder = document.getElementById("messageSummaryOrder");
  messageSummaryOrder.innerHTML = `<li><span>Pesan:</span> ${message}</li>`;
};

const addElementSummaryOrder = (menuName, quantity) => {
  const summaryOrder = document.getElementById("menuOrdered");
  const listItem = document.createElement("li");
  listItem.style.fontWeight = "600";
  listItem.textContent = menuName + " (x" + quantity + ")";
  summaryOrder.appendChild(listItem);
};

const updateSummaryOrder = () => {
  const summaryOrder = document.getElementById("menuOrdered");
  summaryOrder.innerHTML = "";

  for (let key in orders) {
    if (orders.hasOwnProperty(key)) {
      const menuItem = orders[key];
      addElementSummaryOrder(menuItem.name, menuItem.quantity);
    }
  }
};

const updateTotalPrice = () => {
  const formattedTotalHarga = formatCurrency(totalPrice);
  const totalPriceMenu = document.getElementById("totalPriceMenu");
  totalPriceMenu.textContent = `Total Harga: ${formattedTotalHarga}`;
};

const formatCurrency = (amount) =>
  "Rp" + amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,");

btnAddOrder.addEventListener("click", addOrder);

document.addEventListener("click", (event) => {
  if (event.target.classList.contains("btn_order-now_summary-order")) {
    const currentModal = document.querySelector(".modal.show");
    const btnLoading = document.getElementById("btn__loading");
    const btnOrderNow = document.getElementById("btn_order-now");
    const btnSuccessOrder = document.getElementById("btn_success-order");
    const alertSuccess = document.querySelector(".alert-success");

    const modalBackdrop = document.querySelector(".modal-backdrop");
    if (modalBackdrop) {
      modalBackdrop.parentNode.removeChild(modalBackdrop);
    }

    if (currentModal) {
      currentModal.classList.remove("show");
    }

    document.body.classList.remove("modal-open");
    document.body.style.overflowY = "auto";
    document.body.style.overflowX = "hidden";

    btnOrderNow.classList.add("d-none");
    btnLoading.classList.remove("d-none");

    setTimeout(() => {
      btnLoading.classList.add("d-none");
      btnSuccessOrder.classList.remove("d-none");
      alertSuccess.classList.remove("d-none");
    }, 5000);
  }
});
