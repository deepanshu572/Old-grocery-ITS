// const apiUrl = "http://localhost/food_backend/app/api/";
// const imageUrl = "http://localhost/food_backend/admin/";
const apiUrl = "https://indiantechsolution.com/demos/multivendor/food/app/api/";
const imageUrl = "https://indiantechsolution.com/demos/multivendor/food/admin/";
const userId = localStorage.getItem("userId");
console.log("done!");
// $(document).ready(function () {
//   $(".product_slider").owlCarousel({
//     loop: true,
//     margin: 10,
//     nav: false,
//     dots: true,
//     autoplay: true,
//     // autoplayTimeout: 5500,

//     responsive: {
//       0: {
//         items: 1,
//       },
//       768: {
//         items: 1,
//       },
//       1024: {
//         items: 1,
//       },
//     },
//   });
// });



function handleToggle(name, inpName) {
  console.log(name, inpName);
  if ($(`#${inpName}`).attr("type") == "text") {
    $(`#${inpName}`).attr("type", "password");
    $(`#${name}`).removeClass("bi bi-eye").addClass("bi bi-eye-slash");
  } else {
    $(`#${inpName}`).attr("type", "text");
    $(`#${name}`).removeClass("bi bi-eye-slash").addClass("bi bi-eye");
  }
}

async function handleLogin(e) {
  e.preventDefault();

  let phone = $("#mob").val();
  let password = $("#password").val();

  if (!phone || !password) {
    alert("Please fill all fields");
    return;
  }
  let load = true;

  if (load) {
    $("#btnLogin").html("<span class='loader'></span> submitting...");
    $("#btnLogin").prop("disabled", true);
  }

  $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "json",
    data: {
      type: "handleLogin",
      phone,
      password,
    },

    success: async function (response) {
      if (response.status === "success") {
        console.log("Login successfully!");
        load = false;

        localStorage.setItem("userId", response?.data?.id);
        const martLoginResponse = await login();
        const data = JSON.parse(martLoginResponse);
        if (data.message == 'success') {
          location.href = "welcome.html";
          $("#btnLogin").prop("disabled", false);
        }
      } else {
        alert(response.message || "Something went wrong");
        $("#btnLogin").prop("disabled", false);
        $("#btnLogin").html("Login");
      }
    },

    error: function (xhr, status, error) {
      console.log("AJAX Error:", error);
      $("#btnLogin").prop("disabled", false);
      $("#btnLogin").html("Login");
    },
  });
}
function handleRegister(e) {
  e.preventDefault();

  let name = $("#name").val().trim();
  let email = $("#email").val().trim();
  let password = $("#password").val().trim();
  let phone = $("#mob").val().trim();

  if (!name || !password) {
    alert("Please fill all fields");
    return;
  }
  let load = true;

  if (load) {
    $("#btnRegister").html("<span class='loader'></span> Submitting...");
    $("#btnRegister").prop("disabled", true);
  }

  $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "json",

    data: {
      type: "handleRegister",
      name,
      phone,
      email: email || "",
      password,
    },

    success: function (response) {
      if (response.status === "success") {
        load = false;

        $("#btnRegister").prop("disabled", false);

        localStorage.setItem("name", name);
        localStorage.setItem("phone", phone);
        localStorage.setItem("email", email);
        localStorage.setItem("password", password);
        location.href = "otp.html";
      } else {
        console.log(response.message || "Something went wrong");
        alert(response.message);
      }
    },

    error: function (xhr, status, error) {
      console.log("AJAX Error:", error);
    },
  });
}

function generateOTP(num) {
  let digits = "0123456789";
  let OTP = "";
  for (let i = 0; i < num; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
}

function sendOtpRegister() {
  let number = localStorage.getItem("phone");
  $("#num").html(number);
  let otp = generateOTP(6);
  localStorage.setItem("otp", otp);
  alert("Your OTP is: " + otp);
}

async function handleOtpRegister(e) {
  e.preventDefault();
  let enteredOtp = "";
  let Otp = localStorage.getItem("otp");

  let load = true;

  if (load) {
    $("#otpBtn").html("<span class='loader'></span> verifying...");
    $("#otpBtn").prop("disabled", true);
  }

  $(".otp_input").each(function () {
    enteredOtp += $(this).val();
  });

  if (enteredOtp.includes(Otp)) {
    let name = localStorage.getItem("name");
    let phone = localStorage.getItem("phone");
    let email = localStorage.getItem("email");
    let password = localStorage.getItem("password");

    $.ajax({
      url: apiUrl,
      method: "POST",
      dataType: "json",

      data: {
        type: "handleOtpRegister",
        name,
        phone,
        email,
        password,
      },

      success: async function (response) {
        if (response.status === "success") {
          console.log("register successfully!");
          // localStorage.clear();
          localStorage.setItem("userId", response?.userId);
          localStorage.setItem('login_status', true);
          const martSignupResponse = await signUp();
          if (martSignupResponse == 'success') {
            console.log(martSignupResponse);
            location.href = "welcome.html";
          } else {
            console.log(martSignupResponse);
          }
        } else {
          console.log(response.message || "Something went wrong");
        }
      },

      error: function (xhr, status, error) {
        console.log("AJAX Error:", error);
      },
    });
    load = false;
    $("#otpBtn").prop("disabled", false);
  } else {
    load = false;
    $("#otpBtn").html("Verify Otp");
    $("#otpBtn").prop("disabled", false);
    alert("not matched your otp : " + Otp);
  }
}

let forgotBtn = document.querySelectorAll(".forgot_btn");
forgotBtn.forEach((item) => {
  item.addEventListener("click", () => {
    let data = item.querySelector(".forgot_left_txt p").innerText;

    forgotBtn?.forEach((el) => el.classList.remove("active_forgot"));
    item?.classList.add("active_forgot");
    localStorage.setItem("selectedService", data);

    // console.log(item);
  });
});

function handleForgotOtp() {
  let selectedOtpType = $("#selectedForgotType").val();

  let load = true;

  if (load) {
    $("#forgotOtpBtn").html("<span class='loader'></span> Sending...");
    $("#forgotOtpBtn").prop("disabled", true);
  }

  setTimeout(() => {
    load = false;

    location.href = "forgotOtp.html";
    $("#forgotOtpBtn").prop("disabled", false);
  }, 1500);
}

function getVerificationData() {
  let requiredHtml = "";

  let selectedService = localStorage.getItem("selectedService");
  // if(selectedService)

  if (selectedService == "email") {
    requiredHtml += `  <div class="form_inp">
              <label for="email">Email Address</label>
              <div class="inp">
              <input type="text" id="email" placeholder="Enter email">
              </div>
            </div>`;
    $("#service").text("email");
  } else if (selectedService == "number") {
    requiredHtml += `    <div class="form_inp">
              <label for="mobLogin">Mobile no</label>
              <div class="inp">
              <input type="tel" id="mob" maxlength="10" placeholder="Enter number">
              </div>
            </div>`;
    $("#service").text("number");
  } else {
    console.log("something wents wrong ! on localstorage  ");
  }

  $("#requiredInp").html(requiredHtml);
}
function handleVerification() {
  let selectedService = localStorage.getItem("selectedService");

  if (selectedService == "email") {
    let email = $("#email").val();
    $("#btnVerify").html("<span class='loader'></span> submitting...");
    $("#btnVerify").prop("disabled", true);
    $.ajax({
      url: apiUrl,
      method: "POST",
      dataType: "JSON",
      data: {
        type: "verifyEmail",
        email,
      },
      success: function (response) {
        if (response.status == "success") {
          console.log(response);
          // alert(response.message);
          localStorage.setItem("data", response.email);
          location.href = "resetPassword.html";
        } else {
          alert(response.message);
          $("#btnVerify").prop("disabled", false);
          $("#btnVerify").html("Continue");
        }
      },
      error: function (xhr, status, error) {
        console.log("AJAX Error:", error);
        $("#btnVerify").prop("disabled", false);
        $("#btnVerify").html("Login");
      },
    });
  } else if (selectedService == "number") {
    let number = $("#mob").val();
    $("#btnVerify").html("<span class='loader'></span> submitting...");
    $("#btnVerify").prop("disabled", true);
    $.ajax({
      url: apiUrl,
      method: "POST",
      dataType: "JSON",
      data: {
        type: "verifyNumber",
        number,
      },
      success: function (response) {
        if (response.status == "success") {
          console.log(response);
          localStorage.setItem("data", response.phone);
          location.href = "resetPassword.html";
        } else {
          alert(response.message);
          $("#btnVerify").prop("disabled", false);
          $("#btnVerify").html("Continue");
        }
      },
      error: function (xhr, status, error) {
        console.log("AJAX Error:", error);
        $("#btnVerify").prop("disabled", false);
        $("#btnVerify").html("Continue");
      },
    });
  } else {
    console.log("something wents wrong !");
  }
}

function handleUpdatePassword(e) {
  e.preventDefault();

  if ($("#updatePassword").val() !== $("#reUpdatePassword").val()) {
    alert("password not matched !");
    return;
  }
  let password = $("#updatePassword").val();

  $("#btnReset").html("<span class='loader'></span> Updating...");
  $("#btnReset").prop("disabled", true);
  let selectedData = localStorage.getItem("data");
  let selectedService = localStorage.getItem("selectedService");

  $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "json",
    data: {
      type: "updatePassword",
      password,
      selectedData,
      selectedService,
    },
    success: function (response) {
      if (response == "success") {
        console.log(response.message);
        const offcanvas = new bootstrap.Offcanvas(
          document.getElementById("offcanvasPassword"),
        );

        offcanvas.show();
        $("#btnReset").html("Verified");
        $("#btnReset").prop("disabled", false);
      } else {
        console.log(response.message);
      }
    },
    error: function (xhr, status, error) {
      console.log("AJAX Error:", error);
      $("#btnReset").prop("disabled", false);
      $("#btnReset").html("Verify Account");
    },
  });

  setTimeout(() => {
    load = false;

    // location.href = "home.html";
    const offcanvas = new bootstrap.Offcanvas(
      document.getElementById("offcanvasPassword"),
    );

    offcanvas.show();
    $("#btnReset").html("Verified");

    $("#btnReset").prop("disabled", false);
  }, 1500);
}

function fetchBanner(type) {
  return $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "json",
    data: {
      type,
    },
  });
}
async function getBanners() {
  let heroData = await fetchBanner("handleHeroBanner");
  $("#heroBanner").attr("src", imageUrl + heroData.data.image);

  let topData = await fetchBanner("handleTopBanner");

  let topBannerHtml = "";
  topData?.data?.forEach((item) => {
    topBannerHtml += ` <div class="banner_sec_home1">
          <img src="${imageUrl + item?.image}" alt="" />
        </div>
     `;
  });

  $("#topBanner").html(topBannerHtml);

  let bottomData = await fetchBanner("handleBottomBanner");
  $("#bottomBanner").attr("src", imageUrl + bottomData.data.image);

  console.log(heroData, topData, bottomData);
}

function getCategory() {
  $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "json",
    data: {
      type: "handleCateory",
    },
    success: function (response) {
      if (response.status == "success") {
        console.log(response?.data);
        let categoryPrd = "";

        response?.data?.forEach((item) => {
          categoryPrd += `
       <div onclick="handleRenderResturant('${item.id}','${item.name}')" class="body_box">
       <div class="body_img_box">
            <img src="${imageUrl + item?.image}" alt="" />
            </div>
            <p>${item?.name}</p>
          </div>
      `;
        });
        $("#categoryShowcase1").html(categoryPrd);
        $("#categoryPrd").html(categoryPrd);
        $("#sugestCategoryData").html(categoryPrd);
      } else {
        console.log(response?.message);
      }
    },
  });
}

function handleRenderResturant(id, name) {
  localStorage.setItem("selectedCategory", name);
  location.href = `restaurants.html?cid=${id}`;
}

async function handleInput(e) {
  const value = e.target.value;
  console.log(value?.length);

  if (value?.length == 0) {
    return $("#searchData").html("");
  }

  $("#load").html("<span class='loader'></span>");

  $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "JSON",
    data: {
      type: "handleSearch",
      query: value,
    },
    success: function (response) {
      if (response.status == "success") {
        console.log(response.data);
        let data = response.data;
        let searchHtml = "";
        $("#load").html("<i class='bi bi-mic'></i>");
        data.forEach((item) => {
          searchHtml += `<a href="#" onclick="handleSearch(
  '${item?.name}',
  '${item?.food_type}',
  '${encodeURIComponent(JSON.stringify(data))}'
  )" class="search_txt">
                <div class="search_txt_img_desc">
                  <img src="${imageUrl + item.image}" alt="" />
                  <h4>${item?.name}</h4>
                </div>
              <i class="bi bi-chevron-right"></i>
              </a>`;
        });

        $("#searchData").html(searchHtml);
      } else {
        let searchHtml = "";
        console.log(response.message);
        $("#load").html("<i class='bi bi-mic'></i>");
        searchHtml += `<div class="not_found"><img src="../assets/image/icons/notFound.gif" alt=""/>No Meal Found !</div>`;

        $("#searchData").html(searchHtml);
      }
    },
  });
}
function handleSearch(selectedName, food_type, data) {
  data = JSON.parse(decodeURIComponent(data));
  location.href = `searchDetail.html?query=${selectedName}`;

  let ids = data
    .filter((item) => item.name === selectedName)
    .map((item) => item.id)
    .join(",");

  localStorage.setItem("searchIds", ids);
  localStorage.setItem("foodType", food_type);
}
function searchDataFetch() {
  let ids = localStorage.getItem("searchIds");
  let food_type = localStorage.getItem("foodType");

  $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "JSON",
    data: {
      type: "searchDataFetch",
      ids,
    },
    success: function (response) {
      if (response.status == "success") {
        let productContainer = "";
        response.data.forEach((item, index) => {
          productContainer += `
        
        <a href="restaurantDetail.html?rid=${item.id}" class="product_card">

          <div class="owl-carousel owl-theme product_slider product_slider_${index}">
            
            <div class="item">
              <img src="${imageUrl + item.food_images}" alt="${item.food_name}">
              <div class="product_txt">
                ${item.food_name} ₹${item.food_price}
              </div>
            </div>

          </div>

          <div class="product_info">

            <div class="details">
              <img src="../assets/image/icons/current.svg" alt="" />
              <span>25-30 min</span>
              <span>•</span>
              <span>2.5 km</span>
            </div>

            <div class="product_head">
              <h3>${item.name}</h3>
              <div class="product_rate">
                <i class="bi bi-star-fill"></i>
                ${item.avg_rating}
              </div>
            </div>

            <div class="offer_sec">
              <div>
                <div>
                  <img src="../assets/image/icons/crown.svg" alt="" />
                </div>
                <p>Extra 10% OFF</p>
              </div>

              <div class="line"></div>

              <div>
                <img src="../assets/image/icons/current.svg" alt="" />
                <p>Flash Sale : FLAT 50% OFF</p>
              </div>
            </div>

          </div>

        </a>
        
        `;
        });
        $("#prdSearch2").html(productContainer);
        $(document).ready(function () {
          // check owl exists
          if ($.fn.owlCarousel) {
            $(".product_slider").each(function () {
              // destroy if already initialized
              if ($(this).hasClass("owl-loaded")) {
                $(this).trigger("destroy.owl.carousel");
                $(this).removeClass("owl-loaded");
                $(this).find(".owl-stage-outer").children().unwrap();
              }

              // init carousel
              $(this).owlCarousel({
                loop: true,
                margin: 10,
                nav: false,
                dots: true,
                autoplay: true,
                autoplayTimeout: 5500,
                autoplayHoverPause: true,
                smartSpeed: 600,

                responsive: {
                  0: {
                    items: 1,
                  },
                  768: {
                    items: 1,
                  },
                  1024: {
                    items: 1,
                  },
                },
              });
            });
          } else {
            console.log("Owl Carousel file not loaded");
          }
        });
      } else {
        console.log(response.message);
      }
    },
  });
  $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "JSON",
    data: {
      type: "similarDataFetch",
      food_type,
    },
    success: function (response) {
      if (response.status == "success") {
        console.log(response.data);
        let restaurantData = response.data;
        let getSimilarPrdHtml = "";

        restaurantData.forEach((item) => {
          getSimilarPrdHtml += `
    <div class="product_box">
      <div class="product_top_sec">
        <div class="disc_tag">
          ⭐ ${item.avg_rating}
        </div>

        <div onclick="handleSaveData(${item.id},'restaurant')" class="like"  id="shop${item.id}">
          <i class="bi bi-bookmark"></i>
        </div>

        <a href="restaurantDetail.html?rid=${item.id}">
          <img src="${imageUrl + item.cover_image}" alt="${item.name}" />
        </a>
      </div>

      <div class="product_bottom_sec">
        <h4>${item.name}</h4>

        <div class="bottom_last_sec">
          <img src="../assets/image/icons/current.svg" alt="" />
          <h5>${item.city}</h5>
          <h5>•</h5>
          <h5>${item.state}</h5>
        </div>
      </div>
    </div>
  `;
        });

        $("#recomendation").html(getSimilarPrdHtml);
        getSavedProduct("restaurant");
      } else {
        console.log(response.message);
      }
    },
  });
}

function getInputValue() {
  const params = new URLSearchParams(window.location.search);

  const query = params.get("query");
  $("#searchQuery").html(query);

  let getPrdHtml = "";

  const products = [
    {
      id: 1,
      discount: "FLAT ₹150 OFF",
      liked: true,
      image: "../assets/image/temp/homePrd1.svg",
      title: "Food Bazaar Bazaar Bazaar Bazaar Bazaar Rast...",
      deliveryTime: "36 mins",
      distance: "3 km",
    },
    {
      id: 2,
      discount: "FLAT ₹100 OFF",
      liked: false,
      image: "../assets/image/temp/homePrd2.svg",
      title: "Fresh Mart Grocery Store",
      deliveryTime: "25 mins",
      distance: "1.5 km",
    },
    {
      id: 3,
      discount: "UPTO 50% OFF",
      liked: true,
      image: "../assets/image/temp/homePrd3.svg",
      title: "Organic Veggie Hub",
      deliveryTime: "40 mins",
      distance: "4 km",
    },
    {
      id: 4,
      discount: "FREE DELIVERY",
      liked: false,
      image:
        "https://b.zmtcdn.com/data/pictures/5/22411715/8fc8b5070d266246de26f97a6f0e80e2_o2_featured_v2.jpg?output-format=webp",
      title: "Daily Needs Super Store",
      deliveryTime: "18 mins",
      distance: "900 m",
    },
    {
      id: 5,
      discount: "FLAT ₹200 OFF",
      liked: true,
      image:
        "https://b.zmtcdn.com/data/pictures/6/21466036/9b5ea50c0d48a881b2cd6f3070d7127f_o2_featured_v2.jpg",
      title: "Mega Food Plaza",
      deliveryTime: "30 mins",
      distance: "2.2 km",
    },
    {
      id: 6,
      discount: "FLAT ₹200 OFF",
      liked: true,
      image:
        "https://b.zmtcdn.com/data/pictures/chains/1/18625991/8fa1a185a369be06f27c0fc9b4adce08_featured_v2.jpg",
      title: "Mega Food Plaza",
      deliveryTime: "30 mins",
      distance: "2.2 km",
    },
    {
      id: 6,
      discount: "FLAT ₹200 OFF",
      liked: false,
      image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=500",
      title: "Burger King Point",
      deliveryTime: "22 mins",
      distance: "1 km",
    },

    // 6 MORE ARRAY

    {
      id: 7,
      discount: "20% OFF",
      liked: true,
      image:
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500",
      title: "Pizza Town",
      deliveryTime: "28 mins",
      distance: "2.8 km",
    },
    {
      id: 8,
      discount: "FREE DELIVERY",
      liked: false,
      image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500",
      title: "Spicy Chicken Hub",
      deliveryTime: "35 mins",
      distance: "3.5 km",
    },
    {
      id: 9,
      discount: "FLAT ₹80 OFF",
      liked: true,
      image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500",
      title: "Healthy Salad Point",
      deliveryTime: "20 mins",
      distance: "1.2 km",
    },
    {
      id: 10,
      discount: "30% OFF",
      liked: false,
      image:
        "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=500",
      title: "Coffee Cafe",
      deliveryTime: "15 mins",
      distance: "700 m",
    },
    {
      id: 11,
      discount: "BUY 1 GET 1",
      liked: true,
      image:
        "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500",
      title: "Italian Pizza House",
      deliveryTime: "32 mins",
      distance: "2 km",
    },
  ];

  products?.forEach((item) => {
    getPrdHtml += `
    <div class="product_box">
          <div class="product_top_sec">
            <div class="disc_tag">
            ${item?.discount}
            </div>
            <div class="like">
             <i class="bi bi-bookmark"></i>
            </div>
           <a href="restaurants.html"> <img  src="${item?.image}" alt="" /></a>
          </div>
          <div class="product_bottom_sec">
            <h4>${item?.title}</h4>
            <div class="bottom_last_sec">
              <img src="../assets/image/icons/current.svg" alt="" />
              <h5>${item?.deliveryTime}</h5>
              <h5>•</h5>
              <h5>${item?.distance}</h5>
            </div>
          </div>
        </div>`;
  });

  $("#prdSearch").html(getPrdHtml);
}

function getTopResturant() {
  $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "json",
    data: {
      type: "getTopResturant",
    },
    success: function (response) {
      if (response.status == "success") {
        console.log(response.data);
        let getPrdHtml = "";

        response.data?.forEach((item) => {
          getPrdHtml += `
    <div class="product_box">
          <div class="product_top_sec">
            <div class="disc_tag">
            flat 30% OFF
            </div>
            <div onclick="handleSaveData(${item.id},'restaurant')" class="like" id="shop${item.id}">
             <i class="bi bi-bookmark"></i>
            </div>
           <a href="restaurantDetail.html?rid=${item.id}"> <img  src="${imageUrl + item.cover_image}" alt="" /></a>
          </div>
          <div class="product_bottom_sec">
            <h4>${item?.name}</h4>
            <div class="bottom_last_sec">
              <img src="../assets/image/icons/current.svg" alt="" />
              <h5>${item?.address}</h5>
              <h5>•</h5>
              <h5></h5>
            </div>
          </div>
        </div>`;
        });
        $("#prd1").html(getPrdHtml);
        getSavedProduct("restaurant");
      } else {
        alert(response.message);
      }
    },
    error: function (xhr, status, error) {
      console.log("AJAX Error:", error);
    },
  });
}

function getBottomResturant() {
  $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "json",
    data: {
      type: "getBottomResturant",
    },
    success: function (response) {
      if (response.status == "success") {
        console.log(response);
        let restaurants = response?.data;
        let productContainer = "";

        restaurants.forEach((item, index) => {
          productContainer += `
  
  <div class="product_card">
      

    <div class="owl-carousel owl-theme product_slider product_slider_${index}">

      
      ${item.food_images
              ?.split(",")
              .map((prd, index) => {
                let prdId = item.food_id?.split(",");
                let names = item.food_name?.split(",");
                let prices = item.food_price?.split(",");

                return `
          
      <div class="item">
        <img  onclick="location.href='restaurantDetail.html?rid=${item?.id}&pid=${prdId[index]}'" src="${imageUrl + prd}" alt="${names[index]}">

        <div class="product_txt">
          ${names[index]} ₹${prices[index]}
        </div>
        
      </div>
    `;
              })
              .join("")}

    </div>

    <div class="product_info">
     <div class="details">
      <img src="../assets/image/icons/current.svg" alt="" />
        <span>item.deliveryTime</span>
        <span>•</span>
        <span>item.distance</span>
      </div>
      <div class="product_head">
      <h3>${item?.name}</h3>
      <div class="product_rate"><i class="bi bi-star-fill"></i> ${item?.avg_rating}</div>
      </div>

     

      <div class="offer_sec">
      <div>
         <div><img src="../assets/image/icons/crown.svg" alt="" /></div> <p>Extra 10% OFF</p>
         </div>
        <div class="line"></div>
        <div>
        <img src="../assets/image/icons/current.svg" alt="" /><p>   Flash Sale : FLAT 50% OFF</p>
        </div>
      </div>
    </div>

  </div>
  `;
        });
        $("#prd2").html(productContainer);

        $(document).ready(function () {
          // check owl exists
          if ($.fn.owlCarousel) {
            $(".product_slider").each(function () {
              // destroy if already initialized
              if ($(this).hasClass("owl-loaded")) {
                $(this).trigger("destroy.owl.carousel");
                $(this).removeClass("owl-loaded");
                $(this).find(".owl-stage-outer").children().unwrap();
              }

              // init carousel
              $(this).owlCarousel({
                loop: true,
                margin: 10,
                nav: false,
                dots: true,
                autoplay: true,
                autoplayTimeout: 5500,
                autoplayHoverPause: true,
                smartSpeed: 600,

                responsive: {
                  0: {
                    items: 1,
                  },
                  768: {
                    items: 1,
                  },
                  1024: {
                    items: 1,
                  },
                },
              });
            });
          } else {
            console.log("Owl Carousel file not loaded");
          }
        });
      } else {
        console.log(response.message);
      }
    },
    error: function (xhr, status, error) {
      console.log("AJAX Error:", error);
    },
  });
}

function getCategoryParam() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("cid");
  $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "JSON",
    data: {
      type: "getCategoryParam",
      id,
    },
    success: function (response) {
      if (response.status == "success") {
        console.log(response);
        let data = response?.data?.[0];

        if (data) {
          let image = imageUrl + data.cover_image;
          console.log(image);

          $("#categoryName").html(data.name);
          $("#bannerImage").attr("src", image);
        }
      } else {
        console.log(response.message);
      }
    },
    error: function (xhr, status, error) {
      console.log("AJAX Err: " + error);
    },
  });
}
function getCategoryResturant() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("cid");
  $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "JSON",
    data: {
      type: "getCategoryResturant",
      id,
    },
    success: function (response) {
      if (response.status == "success") {
        let resturantPrdHtml = "";
        console.log(response);
        let resturant = response.data;

        resturant?.forEach((item) => {
          resturantPrdHtml += `
       <a href="restaurantDetail.html?rid=${item.id}" class="bottom_product_wrap">
                        <div class="bottom_product_img">
                            <img src="${imageUrl + item?.logo}" alt="">
                        </div>
                        <div class="bottom_product_txt">
                            <h4>${item?.name}</h4>
                            <div class="product_star">
                                <div class="icon_star">
                                    <i class="bi bi-star-fill"></i>
                                    <i class="bi bi-star-fill"></i>
                                    <i class="bi bi-star-fill"></i>
                                    <i class="bi bi-star-fill"></i>
                                    <i class="bi bi-star-fill"></i>

                                </div>
                                <p>(${item.total_reviews})</p>
                            </div>
                            <div class="poduct_time">
                               <i class="bi bi-stopwatch-fill"></i>
                                <p>36-45 mins </p>
                            </div>
                            <p>${item.address}</p>
                           <div class="product_address">
                            <p>${item.city}</p>
                            <p>•</p>
                            <p>${item.pincode}</p>
                           </div>
                        </div>
                    </a>
  `;
        });

        $("#categoryResturants").html(resturantPrdHtml);
      } else {
        console.log(response.message);
      }
    },
    error: function (xhr, status, error) {
      console.log("Ajax err: " + error);
    },
  });
}

function getResturantData() {
  const params = new URLSearchParams(window.location.search);

  const rid = params.get("rid");

  $.ajax({
    url: apiUrl,
    type: "POST",
    dataType: "JSON",
    data: {
      type: "getResturantData",
      id: rid,
    },
    success: function (response) {
      if (response.status == "success") {
        console.log(response);
        let resturant = response.data[0];
        let resturantHtml = "";
        let r_name = resturant?.name
        $("#resturantName").text(r_name)

        resturantHtml += `<h4><i class="bi bi-shop"></i> ${resturant.name}</h4>
          <p>
            <i class="bi bi-geo-alt-fill"></i> ${resturant.address},
          </p>
          <div class="poduct_time">
            <i class="bi bi-stopwatch-fill"></i>
            <p>36-45 mins</p>
          </div>
          <div class="product_shop_flex">
            <div class="product_address">
              <p><i class="bi bi-geo-fill"></i></p>
              <p>${resturant.city} ${resturant.state}</p>
              
            </div>
            <div class="product_star">
              <div class="icon_star">
                <i class="bi bi-star-fill"></i>
                <i class="bi bi-star-fill"></i>
                <i class="bi bi-star-fill"></i>
                <i class="bi bi-star-fill"></i>
                <i class="bi bi-star-fill"></i>
              </div>
              <p>(${resturant.total_reviews})</p>
            </div>
          </div>`;
        getCarousel2Resturant(`${resturant.cover_image}`);

        $("#shopDetail").html(resturantHtml);
      } else {
        console.log(response.message);
      }
    },
    error: function (xhr, status, error) {
      console.log("AJAX errr: " + error);
    },
  });
}
function getSavedProduct(itemtype) {
  $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "JSON",
    data: {
      type: "getSavedProduct",
      id: userId,
      itemType: itemtype,
    },
    success: function (response) {
      if (response.status == "success") {
        let savedData = response.data;
        savedData?.forEach((item) => {
          if (itemtype == "food") {
            $(`#btn${item.item_id}`).addClass("fill-select");

            $(`#btn${item.item_id} i`)
              .addClass("bi-bookmark-fill")
              .removeClass("bi-bookmark");

            $(`#btn${item.item_id} p`).html("Saved");
          } else {
            $(`#shop${item.item_id}`).addClass("fill-select");
            $(`#shop${item.item_id} i`)
              .addClass("bi-bookmark-fill")
              .removeClass("bi-bookmark");
          }
        });
      } else {
        console.log(response.message);
      }
    },
    error: function (xhr, status, error) {
      console.log("AJX err :" + error);
    },
  });
}
function getProduct() {
  const params = new URLSearchParams(window.location.search);

  const rid = params.get("rid");
  const pid = params.get("pid");
  if (rid) {
    $.ajax({
      url: apiUrl,
      method: "POST",
      dataType: "JSON",
      data: {
        type: "selectedResturants",
        id: rid,
      },
      success: function (response) {
        if (response.status == "success") {
          let Allproducts = response.data;
          if (pid) {
            Allproducts = response.data?.filter((item) => item.id !== pid);
          }
          if (!pid) {
            $(".selectedPrd").css("display", "none");
          }

          let resturantPrdHtml = "";

          Allproducts?.forEach((item) => {
            resturantPrdHtml += `
          
          <div class="resturant_products" >
          
            <div class="resturant_prd_left">
            
              ${item.food_type == "veg"
                ? `<img src="../assets/image/icons/success.svg" alt="">`
                : ""
              }            
              ${item.food_type == "nonveg"
                ? `<img src="../assets/image/icons/failed.svg" alt="">`
                : ""
              }            
                  
              
              
              <h4>${item?.name}</h4>
              
              <p>₹${item?.discount_price}</p>

              <div class="prd_star">
                <i class="bi bi-star-fill"></i>
                <p>${item?.rating}</p>
                <p>(${item?.reviews})</p>
              </div>

              <div id="btn${item.id}" onclick="handleSaveData(${item.id},'food')" class="save_btn">
                <i class="bi bi-bookmark"></i>
                <p>Save to Eatlist</p>
              </div>

              <div class="desc_prd">
                <p>
                  ${item?.description}
                  <button onclick='handleModalData(${JSON.stringify(item)})' data-bs-toggle="offcanvas" data-bs-target="#offcanvasProductBox" aria-controls="offcanvasProductBox">more</button>
                </p>
              </div>

            </div>

            <div class="resturant_prd_right">
            
              <img onclick='handleModalData(${JSON.stringify(item)})' data-bs-toggle="offcanvas" data-bs-target="#offcanvasProductBox" aria-controls="offcanvasProductBox" src="${imageUrl}${item?.image}" alt="${item?.name}">
                  
             ${!item?.varient
                ? `<div
                   class="btn_add_data"
                   onclick='handleModalCartData(${JSON.stringify(item)})'
                   type="button"
                   data-bs-toggle="offcanvas"
                   data-bs-target="#offcanvasProductModal"
                   aria-controls="offcanvasProductModal"
                 >
                   Add
                 </div>`
                : ` <div
                     class="btn_add_data AddBtn"
                     id="AddBtn"
                      onclick="handleToggleBtn(this)"
                     type="button"
                   >
                     Add
                   </div>
                   <div class="btn_add_data button_data " style="display : none;">
                     <button class="plus">-</button>
                     <input type="number" value="1" />
                     <button>+</button>
                   </div>`
              }
       

                    </div>

                  </div>

                `;
          });

          $("#resturantProduct").html(resturantPrdHtml);
          getSavedProduct("food");
        } else {
          console.log(response.message);
        }
      },

      error: function (xhr, status, error) {
        console.log("AJAX Err: " + error);
      },
    });
  } else {
    console.log("something wents wrong on params");
  }

  if (pid) {
    $.ajax({
      url: apiUrl,
      method: "POST",
      dataType: "JSON",
      data: {
        type: "selectedResturantsPrd",
        id: pid,
      },
      success: function (response) {
        if (response.status == "success") {
          let products = response.data[0];
          $("#prdName").html(products.name);
          let selectedPrdHtml = "";

          selectedPrdHtml += `
          
          <div class="resturant_products" >
          
            <div class="resturant_prd_left">
            
              ${products.food_type == "veg"
              ? `<img src="../assets/image/icons/success.svg" alt="">`
              : ""
            }            
              ${products.food_type == "nonveg"
              ? `<img src="../assets/image/icons/failed.svg" alt="">`
              : ""
            }            
                  
              
              
              <h4>${products?.name}</h4>
              
              <p>₹${products?.discount_price}</p>

              <div class="prd_star">
                <i class="bi bi-star-fill"></i>
                <p>${products?.rating}</p>
                <p>(${products?.reviews})</p>
              </div>

              <div id="btn${products.id}" onclick="handleSaveData(${products.id},'food')" class="save_btn">
                <i class="bi bi-bookmark"></i>
                <p>Save to Eatlist</p>
              </div>

              <div class="desc_prd">
                <p>
                  ${products?.description}
                  <button onclick='handleModalData(${JSON.stringify(products)})' data-bs-toggle="offcanvas" data-bs-target="#offcanvasProductBox" aria-controls="offcanvasProductBox">more</button>
                </p>
              </div>

            </div>

            <div class="resturant_prd_right">
            
              <img onclick='handleModalData(${JSON.stringify(products)})' data-bs-toggle="offcanvas" data-bs-target="#offcanvasProductBox" aria-controls="offcanvasProductBox" src="${imageUrl}${products?.image}" alt="${products?.name}">

             ${!products?.varient
              ? `<div
                   class="btn_add_data"
                   onclick='handleModalCartData(${JSON.stringify(products)})'
                   type="button"
                   data-bs-toggle="offcanvas"
                   data-bs-target="#offcanvasProductModal"
                   aria-controls="offcanvasProductModal"
                 >
                   Add
                 </div>`
              : ` <div
                     class="btn_add_data AddBtn"
                     id="AddBtn"
                      onclick="handleToggleBtn(this)"
                     type="button"
                   >
                     Add
                   </div>
                   <div class="btn_add_data button_data " style="display : none;">
                     <button class="plus">-</button>
                     <input type="number" value="1" />
                     <button>+</button>
                   </div>`
            }
       

                    </div>

                  </div>

                `;

          $("#selectedProduct").html(selectedPrdHtml);
        } else {
          console.log(response.message);
        }
      },
      error: function (xhr, status, error) {
        console.log("AJAX Err: " + error);
      },
    });
  } else {
    console.log("something wents wrong on params");
  }
}

function handleModalData(data) {
  console.log(data);
  let productDataHtml = "";
  productDataHtml += `  <img
          src="${imageUrl + data?.image}"
          alt=""
        />
        <div class="product_wrapper">
          <div class="flex_wrapper">
            <div class="resturant_prd_left">
              <img src="../assets/image/icons/success.svg" alt="" />

              <h4>${data?.name}</h4>

              <p>₹${data?.discount_price}</p>

              <div class="prd_star">
                <i class="bi bi-star-fill"></i>
                <p>${data?.rating}</p>
                <p>(${data?.reviews})</p>
              </div>
            </div>
            <button type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasProductModal" aria-controls="offcanvasProductModal" onclick='handleModalCartData(${JSON.stringify(data)})'>Add</button>
          </div>
          <p>
               ${data?.description}
          </p>
        </div>`;

  $("#ProductData").html(productDataHtml);
}

function handleSaveData(itemId, itemType) {
  $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "JSON",
    data: {
      type: "handleSaveData",
      itemId,
      itemType,
      userId,
    },
    success: function (response) {
      if (response.status == "success") {
        if (itemType == "food") {
          if (response.queryName == "delete") {
            $(`#btn${itemId}`).removeClass("fill-select");
            $(`#btn${itemId} i`).removeClass("bi-bookmark-fill");
            $(`#btn${itemId} i`).addClass("bi-bookmark");
            $(`#btn${itemId} p`).html("Save To Eatlist");
          } else {
            $(`#btn${itemId}`).addClass("fill-select");
            $(`#btn${itemId} i`).removeClass("bi-bookmark");
            $(`#btn${itemId} i`).addClass("bi-bookmark-fill");
            $(`#btn${itemId} p`).html("Saved");
          }
        } else {
          if (response.queryName == "delete") {
            $(`#shop${itemId}`).removeClass("fill-select");
            $(`#shop${itemId} i`)
              .removeClass("bi-bookmark-fill")
              .addClass("bi-bookmark");
          } else {
            $(`#shop${itemId}`).addClass("fill-select");
            $(`#shop${itemId} i`)
              .addClass("bi-bookmark-fill")
              .removeClass("bi-bookmark");
          }
        }
      } else {
        console.log(response.message);
      }
    },
    error: function (xhr, status, error) {
      console.log("AJAX err:" + error);
    },
  });
}

// function renderToModalCart(data) {
//   console.log(data);
//   // handleModalCartData(data);

// }
function handleModalCartData(data) {
  // console.log(data);
  // alert("okkk....");
  $("#prdNameModal").text(data?.name);
  $("#PrdImage").attr("src", imageUrl + data?.image);

  let cartData = JSON.parse(localStorage.getItem("foodCart")) || [];

  $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "JSON",
    data: {
      type: "getVarientData",
      id: data.id,
    },
    success: function (response) {
      if (response.status == "success") {
        let varientData = response.data;

        if (!varientData.length) return;
        console.log(varientData);

        let foodId = varientData[0]?.food_item_id;

        // Current food item from cart
        let currentCartItem = cartData.find((item) => item.foodId == foodId);
        console.log(currentCartItem);


        let qty = currentCartItem ? currentCartItem.qty : 1;
        let totalPrice = currentCartItem ? currentCartItem.Totalprice : "";
        // console.log(qty,totalPrice, currentCartItem);
        // console.log(currentCartItem.Totalprice);

        let varientHtml = "";
        let btnHtml = "";

        varientData.forEach((item) => {
          totalPrice = Math.floor(item?.price);
          console.log(totalPrice)
          let checked = "";

          if (currentCartItem && currentCartItem.id == item.id) {
            checked = "checked";
          }


          varientHtml += `
            <label
              onclick="handleTogglePrice(
                '${item.price}',
                '${item.id}',
                '${item.variant_name}',
                '${foodId}'
              )"
              for="varient${item.id}"
              class="modal_resturant_selection_box"
            >
              <div class="modal_resturant_left">
                <img src="../assets/image/icons/failed.svg" alt="" />
                <h5>${item.variant_name}</h5>
              </div>

              <div class="modal_resturant_right">
                <h5>₹ ${item.price}</h5>
                <input
                  type="radio"
                  id="varient${item.id}"
                  name="selectVarient"
                  ${checked}
                />
              </div>
            </label>
          `;
        });

        btnHtml += `
          <div class="btn_add_data button_data">
            <button onclick='decrementCounter("${foodId}")'>-</button>

            <input
              id="inp${foodId}"
              type="number"
              value="${qty}"
            />

            <button
              onclick='incrementCounter("${foodId}","${data?.name}")'
              class="plus"
            >
              +
            </button>
          </div>

          <input
            id="varientType${foodId}"
            type="hidden"
          />

          <input
            id="varientId${foodId}"
            type="hidden"
          />

          <input
            id="price${foodId}"
            type="hidden"
          />

          <button
            class=" cart_btn_add"
            onclick='renderCartPage("${foodId}")'
          >
            Add Item | ₹
            <b id="totalPrice${foodId}">
              ${totalPrice}
            </b>
          </button>
        `;

        $("#btnWrapper").html(btnHtml);
        $("#varientData").html(varientHtml);

        // Restore cart values
        if (currentCartItem) {
          $(`#varientType${foodId}`).val(currentCartItem.Type);
          $(`#varientId${foodId}`).val(currentCartItem.id);
          $(`#price${foodId}`).val(currentCartItem.price);
        } else {
          // Default first variant selected
          let firstVariant = varientData[0];

          $(`#varient${firstVariant.id}`).prop("checked", true);
          $(`#varientType${foodId}`).val(firstVariant.variant_name);
          $(`#varientId${foodId}`).val(firstVariant.id);
          $(`#price${foodId}`).val(firstVariant.price);

          $(`#totalPrice${foodId}`).text(firstVariant.price);
        }
      } else {
        console.log(response.message);
      }
    },
    error: function (xhr, status, error) {
      console.log("AJAX Error:", error);
    },
  });
}

function handleTogglePrice(price, vid, name, id) {
  let cartData = JSON.parse(localStorage.getItem("foodCart")) || [];
  // console.log(cartData)

  let currentCartItem = cartData.find((item) => item.id == vid);
  console.log(currentCartItem, cartData);
  let qty = currentCartItem ? currentCartItem.qty : 1;

  // $("#totalPrice").html("");
  $(`#totalPrice${id}`).html(price * Number(qty));
  $(`#price${id}`).val(price);
  $(`#inp${id}`).val(qty);
  $(`#varientType${id}`).val(name);
  $(`#varientId${id}`).val(vid);
  $(".cart_btn_add").removeClass("active_disable");
}

function incrementCounter(foodId, name) {
  const params = new URLSearchParams(window.location.search);

  let qty = Number($(`#inp${foodId}`).val());
  // alert(qty);
  const rid = params.get("rid");
  let variant_id = $(`#varientId${foodId}`).val();
  qty = qty + 1;
  let priceData = $(`#totalPrice${foodId}`).text();
  let varientType = $(`#varientType${foodId}`).val();
  let basePrice = $(`#price${foodId}`).val();
  let updatedPrice = Number(basePrice) * Number(qty);
  console.log(basePrice, updatedPrice);

  $(`#inp${foodId}`).val(qty);
  $(`#totalPrice${foodId}`).html(updatedPrice);

  let cart = JSON.parse(localStorage.getItem("foodCart")) || [];
  console.log(cart);

  let existingItem = cart?.find(
    (item) => item.foodId == foodId && item.Type == varientType,
  );

  if (existingItem) {
    cart = cart.map((item) => {
      if (item.foodId == foodId && item.Type == varientType) {
        return {
          ...item,
          qty: qty,
          Totalprice: updatedPrice,
        };
      }

      return item;
    });
  } else {
    let product = {
      id: variant_id,
      foodId: foodId,
      name: name,
      restaurant_id: rid,
      price: basePrice,
      Totalprice: updatedPrice,
      qty: qty,
      Type: varientType,
    };

    cart.push(product);
  }

  localStorage.setItem("foodCart", JSON.stringify(cart));
}

function decrementCounter(foodId) {
  let cart = JSON.parse(localStorage.getItem("foodCart")) || [];
  let qty = Number($(`#inp${foodId}`).val());
  // let priceData = $(`#totalPrice${foodId}`).text();
  let varientType = $(`#varientType${foodId}`).val();
  let basePrice = $(`#price${foodId}`).val();

  if (qty == 1) {
    $(`#inp${foodId}`).val(1);
    const offcanvasEl = document.getElementById("offcanvasProductModal");
    const offcanvas = bootstrap.Offcanvas.getInstance(offcanvasEl);

    if (offcanvas) {
      offcanvas.hide();
    }
    $(`#totalPrice${foodId}`).html(Number(basePrice));
    // console.log(foodId,varientType)
    cart = cart.filter((item) => {
      return !(item.foodId == foodId && item.Type == varientType)
      // console.log( item.foodId == foodId , item.Type == varientType);
      // console.log(item.foodId, foodId , item.Type , varientType)
    });
    // console.log(cart)
    console.log("remove item !");
    localStorage.setItem("foodCart", JSON.stringify(cart));
    return false;
  } else {
    qty--;
  }


  let updatedPrice = Number(basePrice) * Number(qty);
  $(`#inp${foodId}`).val(qty);
  $(`#totalPrice${foodId}`).html(updatedPrice);



  let existingItem = cart.find(
    (item) => item.foodId == foodId && item.Type == varientType,
  );

  if (existingItem) {
    cart = cart.map((item) => {
      if (item.foodId == foodId && item.Type == varientType) {
        return {
          ...item,
          qty: qty,
          Totalprice: updatedPrice,
        };
      }

      return item;
    });
  } else {
    console.log("something wents wrong !");
  }

  localStorage.setItem("foodCart", JSON.stringify(cart));
}

function renderCartPage(fid) {
  const params = new URLSearchParams(window.location.search);

  const rid = params.get("rid");
  let totalPrice = $(`#totalPrice${fid}`).text();
  let qty = $(`#inp${fid}`).val();
  let price = Math.floor($(`#price${fid}`).val());
  let vid = $(`#varientId${fid}`).val();
  console.log(vid, price);

  $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "JSON",
    data: {
      type: "insertCartPage",
      userId,
      rid,
      fid,
      varId: vid,
      qty,
      price,
      totalPrice,
    },
    success: function (response) {
      if (response.status === "success") {
        console.log(response);
        cartPopupData();
        // location.href = `cart.html?rid=${rid}`;
        const offcanvasEl = document.getElementById("offcanvasProductModal");
        const offcanvas = bootstrap.Offcanvas.getInstance(offcanvasEl);

        if (offcanvas) {
          offcanvas.hide();
        }
      } else {
        console.log(response.message || "Something went wrong");
      }
    },

    error: function (xhr, status, error) {
      console.log("AJAX Error:", error);
    },
  });
}
function cartPopupData() {
  const params = new URLSearchParams(window.location.search);

  const rid = params.get("rid");

  $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "JSON",
    data: {
      type: "getCart",
      userId,
    },
    success: function (response) {
      if (response.status == "success") {
        let data = response.data;
        let filterdData = data?.filter((item) => item?.restaurant_id == rid);
        if (filterdData?.length > 0) {
          $("#cartPopup").show();
        }
        let cartPopup = `<div class="footer_pop_tab" onclick="location.href='cart.html?rid=${rid}'">
        <div class="footer_left">
          <div class="img_footer_pop_img" id="cartPopupImg">
            
          `;
        filterdData.slice(0, 3)?.map((item, index) => {
          cartPopup += `<div class="img_popup img${index + 1}">
              <img src="${imageUrl + item?.image}" alt="">
            </div>
            `;
        })
        cartPopup += `</div>
          <p> <b id="popupCount">${filterdData?.length}</b> item added <br>
            <span>View your cart</span>
          </p>
        </div>
        <div class="footer_right">
          <p>continue</p> <i class="bi bi-chevron-right"></i>
        </div>

      </div>`
        $("#cartPopup").html(cartPopup);

      } else {
        $("#cartPopup").hide();
      }
    }
  });
}
function handleAllCartPopup(){
  // let cart = JSON.parse(localStorage.getItem("foodCart")) || [];
  $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "JSON",
    data: {
      type: "getAllCart",
      userId,
    },
    success: function (response) {
      if(response.status == "success"){
      console.log(response.data);
      let {data,restaurantCount} = response;
      let cartDataHtml = '';
      $("#cartPopupAll").show();
      $("#restCount").html(restaurantCount);
      $("#restCount2").html(restaurantCount);
      data?.forEach((item)=>{
        cartDataHtml+=`    <div class="cartFooter-item">

        <div class="cartFooter-info">

          <img src="${imageUrl+item?.restaurant_logo}" alt="The Ruin House"
            class="cartFooter-image">

          <div class="cartFooter-details">

            <h4>${item?.restaurant_name}</h4>

            <div class="cartFooter-menu">
              View Menu
              <span>›</span>
            </div>

          </div>

        </div>


        <button type="button" class="cartFooter-viewCart" onclick="location.href='cart.html?rid=${item?.restaurant_id}'">

          <strong>View Cart</strong>

          <small>${item?.product_count} items</small>

        </button>


        <button type="button" class="cartFooter-remove" onclick="renderPopupDelete('${item?.restaurant_id}')">
          ×
        </button>

      </div>`;
      })
      $("#cartDataModal").html(cartDataHtml);
      
      }
      else{
        console.log(response.message);
        
      }
    }
  })

}
handleAllCartPopup();
function renderPopupDelete(rid) {
  handleCartDelete(rid)
  
}


function getCart() {
  const params = new URLSearchParams(window.location.search);

  const rid = params.get("rid");

  $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "JSON",
    data: {
      type: "getCart",
      userId,
    },
    success: function (response) {
      if (response.status == "success") {
        console.log(response.data);
        let cart = response.data.filter((item) => item.restaurant_id == rid);
        console.log(response);
        let cartHtml = "";
        cart.forEach((item) => {
          cartHtml += `  <div class="cart_data_items">
              <div class="cart_data_item_left">
                <div class="cart_item_img">
                  <img
                    src="../assets/image/icons/failed.svg"
                    alt=""
                  />
                </div>
                <div class="cart_item_txt">
                  <h4>
                  ${item.name}
                  </h4>
                   <div class="select_box">
                    <p >${item.variant_name}</p>
                   </div>
                  <button>+ Add More items</button>
                  
                </div>
              </div>
              <div class="wrapper_right_cart_btn">
                <div class="cart_data_item_btn">
                <button onclick='cartdecrementCounter(
                "${item.id}",
                "${item.restaurant_id}",
                "${item.food_item_id}",
                "${item?.variant_id}")
                '>-</button>
                <input id="inp${item.variant_id}" type="number" value="${item.quantity}" />
                <button  onclick='cartIncremetCounter(
                 "${item.id}",
                  "${item.restaurant_id}",
                "${item.food_item_id}",
                "${item?.variant_id}")' class="plus" >+</button>
                  <input id="varientType${item.variant_id}" value="${item.variant_name}" type="hidden" />
                <input id="varientId${item.variant_id}" value="${item.variant_id}" type="hidden" />
                <input id="price${item.variant_id}" value="${item.price}" type="hidden" /></div>
              <span>
              <p id="totalPrice${item.variant_id}">₹${Math.floor(item.total)}</p>
              </span>
              </div>
              
            </div>`;
        });
        if (cart.length > 0) {
          console.log(cart.length);
          $("#cartWrap").css("display", "block");
          $("#cartData").html(cartHtml);
        } else {
          $("#cartWrap").css("display", "block");

          $("#cartWrap").html(
            `<div class="not_found"><img src="../assets/image/icons/notFound.gif" alt=""/>No Meal Found ! <button onclick="location.href='home.html'">Go to resturants </button></div>`,
          );
        }
      } else {
        console.log(response.message);
        $("#cartWrap").css("display", "block");

        $("#cartWrap").html(
          `<div class="not_found"><img src="../assets/image/icons/notFound.gif" alt=""/>No Meal Found ! <button onclick="location.href='home.html'">Go to resturants </button></div>`,
        );
      }
    },
    error: function (xhr, status, error) {
      console.log("AJAX err : " + error);
    },
  });
}
let cartQty;
function cartIncremetCounter(cartId, rid, foodId, vid) {
  console.log(cartId, rid, foodId, name, vid)
  let cartQty = Number($(`#inp${vid}`).val()) + 1;
  let varientId = $(`#varientId${vid}`).val();
  let varientType = $(`#varientType${vid}`).val();
  let basePrice = Number($(`#price${vid}`).val());

  let updatedPrice = basePrice * cartQty;

  $(`#inp${vid}`).val(cartQty);
  $(`#totalPrice${vid}`).html(`₹${updatedPrice}`);

  let cart = JSON.parse(localStorage.getItem("foodCart")) || [];
  console.log(cart);
  // if (!Array.isArray(cart)) {
  //   cart = [cart];
  // }

  let existingItem = cart?.find(
    (item) => item.foodId == foodId && item.Type == varientType,
  );

  if (existingItem) {
    cart = cart?.map((item) => {
      if (item.foodId == foodId && item.Type == varientType) {
        return {
          ...item,
          qty: cartQty,
          Totalprice: updatedPrice,
        };
      }

      return item;
    });
  } else {
    cart.push({
      id: varientId,
      name: name,
      foodId: foodId,
      restaurant_id: rid,
      price: basePrice,
      Totalprice: updatedPrice,
      qty: cartQty,
      Type: varientType,
    });
  }

  localStorage.setItem("foodCart", JSON.stringify(cart));
  getSubtotal();

  console.log(cart);
  updateCartDataBase(cartId, varientId, rid, updatedPrice, cartQty, foodId);
}
function cartdecrementCounter(cartId, rid, foodId,vid) {
  console.log(cartId, rid, foodId,vid)
  let cartQty = Number($(`#inp${vid}`).val());
  let varientId = $(`#varientId${vid}`).val();
  let varientType = $(`#varientType${vid}`).val();
  let basePrice = Number($(`#price${vid}`).val());

  let cart = JSON.parse(localStorage.getItem("foodCart")) || [];

  cartQty--;

  if (cartQty == 0) {
    // $("#cartWrap").html(
    //   `<div class="not_found"><img src="../assets/image/icons/notFound.gif" alt=""/>No Meal Found ! <button onclick="location.href='home.html'">Go to resturants </button></div>`,
    // );
    cart = cart.filter(
      (item) => !(item.foodId == foodId && item.Type == varientType),
    );

    localStorage.setItem("foodCart", JSON.stringify(cart));

    updateCartDataBase(cartId, varientId, rid, 0, 0, foodId);
    return;
  }

  let updatedPrice = basePrice * cartQty;

  $(`#inp${vid}`).val(cartQty);
  $(`#totalPrice${vid}`).html(`₹${updatedPrice}`);

  cart = cart.map((item) => {
    if (item.foodId == foodId && item.Type == varientType) {
      return {
        ...item,
        qty: cartQty,
        Totalprice: updatedPrice,
      };
    }
    return item;
  });

  localStorage.setItem("foodCart", JSON.stringify(cart));
  getSubtotal();

  updateCartDataBase(cartId, varientId, rid, updatedPrice, cartQty, foodId);
}

function updateCartDataBase(id, vid, rid, total, qty, fid) {
  $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "JSON",
    data: {
      type: "updateCartData",
      cartId: id,
      userId,
      variantId: vid,
      resturantId: rid,
      fid,
      total,
      quantity: qty,
    },
    success: function (response) {
      if (response.status == "success") {
        console.log(response.message);
        if (response.message == "deleted") {
          getCart();
        }
      } else {
        console.log(response.message);
      }
    },
    error: function (xhr, status, err) {
      console.log("AJAX Err : " + err);
    },
  });
}

function getCarousel2Resturant(img) {
  let bannerContainer = ` <div class="item_rest_img rest_reuse ">
       <img src="${imageUrl + img}" alt="banner-image">
      </div>`;
  $("#shopDetailCrousel").html(bannerContainer);
}

let couponsData = [];
let selectedCoupon = null;

// ======================
// GET COUPONS
// ======================
function getCoupons() {
  $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "JSON",
    data: {
      type: "getCoupons",
    },
    success: function (response) {
      if (response.status !== "success") return;

      couponsData = response.data;

      renderCoupons(couponsData);
    },
    error: function (xhr, status, error) {
      console.log(error);
    },
  });
}

// ======================
// VALIDATE COUPON
// ======================
function isCouponValid(coupon) {
  // console.log(coupon)
  const now = new Date();

  if (coupon.status !== "active") {
    return false;
  }

  // if (now < new Date(coupon.start_date)) {
  //   return false;
  // }

  if (now > new Date(coupon.end_date)) {
    return false;
  }

  if (
    Number(coupon.usage_limit) > 0 &&
    Number(coupon.used_count) >= Number(coupon.usage_limit)
  ) {
    return false;
  }

  return true;
}

// ======================
// RENDER COUPONS
// ======================
function renderCoupons(coupons) {
  let html = "";

  coupons.forEach((coupon) => {
    const valid = isCouponValid(coupon);

    html += `
<div class="coupon-card">
    <img src="../assets/image/icons/couponsBox.svg" alt="coupon bg" class="coupon-bg">

    <div class="coupon-header">
        <h3>${coupon.code}</h3>
        <div>Valid Until ${coupon.end_date.split(" ")[0]}</div>
    </div>

    <div class="coupon-body">
        <div class="coupon-info">
            <div class="coupon-title">
                <i class="bi bi-gift-fill"></i>
                <h4>${coupon.discount_value}% OFF</h4>
            </div>
            <p>Min Order ₹${coupon.minimum_order_amount}</p>
        </div>

        <button
            class="coupon_btn apply-btn ${!valid ? "disabled" : ""}"
            ${!valid ? "disabled" : ""}
            id="${coupon.code}"
            onclick="applyCoupon('${coupon.code}')"
        >
            Apply
        </button>
    </div>
</div>
`;
  });
  $(".disabled").html("Expired");
  $("#couponsData").html(html);

  $(".disabled").html("Expired");
}

// ======================
// CART SUBTOTAL
// ======================
function getSubtotal() {
  const params = new URLSearchParams(window.location.search);
  const rid = params.get("rid");
  let cart = JSON.parse(localStorage.getItem("foodCart")) || [];
  let filteredCart = cart?.filter((item) => item?.restaurant_id == rid);

  const subTotal = filteredCart.reduce(
    (sum, num) => sum + Number(num?.Totalprice || 0),
    0
  );
  let total = subTotal + 20 + 20;

  $("#subTotal").html(subTotal);
  $("#grandTotal").html(total);
  $("#checkPlaceOrder").html(total);
  $("#payAmtTotal").html(total);

  return total; // ye hona zaroori hai
}

// ======================
// CALCULATE DISCOUNT
// ======================
function calculateCouponDiscount(coupon, subtotal) {
  console.log(coupon);
  // Minimum Order Check
  if (
    Number(coupon.minimum_order_amount) > 0 &&
    subtotal < Number(coupon.minimum_order_amount)
  ) {
    return {
      success: false,
      message: `Minimum order amount ₹${coupon.minimum_order_amount} required`,
      discount: 0,
    };
  }

  let discount = 0;

  // Percentage Discount
  if (coupon.discount_type === "percentage") {
 discount = Number(
    ((subtotal * Number(coupon.discount_value)) / 100).toFixed(2)
);
    // Max Discount Check
    if (
      Number(coupon.max_discount_amount) > 0 &&
      discount > Number(coupon.max_discount_amount)
    ) {
      discount = Number(coupon.max_discount_amount);
    }
  }

  // Flat Discount
  else if (coupon.discount_type === "flat") {
    discount = Number(coupon.discount_value);

    if (discount > subtotal) {
      discount = subtotal;
    }
  }

  return {
    success: true,
    discount: discount,
  };
}

// ======================
// APPLY COUPON
// ======================
function applyCoupon(code) {
  const subtotal = getSubtotal();

  const coupon = couponsData.find((item) => item.code === code);

  if (!coupon) {
    alert("Coupon not found");
    return;
  }

  const result = calculateCouponDiscount(coupon, subtotal);

  if (!result.success) {
    alert(result.message);
    return;
  }

  selectedCoupon = coupon;

  const grandTotal = subtotal - result.discount;
  $(".bottom_coupons").show();
  $(".discount_data").show();

  // console.log(subtotal, result.discount);

  $("#couponDisc").text(`${Math.floor(result.discount.toFixed(2))}`);
  $("#amountApplied").text(Math.floor(coupon.minimum_order_amount));
  $("#saved2").text(`${Math.floor(result.discount.toFixed(2))}`);
  $("#saved").text(`${Math.floor(result.discount.toFixed(2))}`);

  $("#grandTotal").text(`${Math.floor(grandTotal.toFixed(2))}`);
  $("#checkPlaceOrder").text(`${Math.floor(grandTotal.toFixed(2))}`);
  $("#payAmtTotal").text(`${Math.floor(grandTotal.toFixed(2))}`);

  $(".coupon_btn").removeClass("active");
  $(".coupon_btn").text("Apply");

  $(`#${code}`).text("Applied");
  event.target.classList.add("active");
  bootstrap.Offcanvas.getOrCreateInstance(
    $("#offcanvasBottomCoupons")[0],
  ).hide();
}

$(".form_icon").on("click", function () {
  $(".form_icon").removeClass("role_active");

  $(this).addClass("role_active");

  let role = $(this).find("p").text();
  $("#selectedRole").val(role);
});
function toggleAddressBtn() {
  $("#btnToggleAddress").html(`
    <button type="button" onclick="handleAddress(event)">
        Add Address
    </button>
`);

  $("#addressId").val("");
  $("#houseNo").val("");
  $("#area").val("");
  $("#instruction").val("");
  $("#city").val("");
  $("#state").val("");
  $("#pincode").val("");
  $("#name").val("");
  $("#number").val("");
  $("#landmark").val("");
  $("#selectedRole").val("");
  $("#offcanvasBottomAddressLabel").html("Add Address");

}

function handleAddress(e) {
  e.preventDefault();
  let formData = new FormData();

  formData.append("type", "handleAddress");
  formData.append("userId", userId);
  formData.append("houseNo", $("#houseNo").val());
  formData.append("area", $("#area").val());
  formData.append("instruction", $("#instruction").val());
  formData.append("city", $("#city").val());
  formData.append("state", $("#state").val());
  formData.append("pincode", $("#pincode").val());
  formData.append("name", $("#name").val());
  formData.append("number", $("#number").val());
  formData.append("addressType", $("#selectedRole").val());
  formData.append("landmark", $("#landmark").val());

  $.ajax({
    url: apiUrl,
    method: "POST",
    data: formData,
    processData: false,
    contentType: false,
    dataType: "JSON",
    success: function (response) {
      if (response.status == "success") {
        alert(response.message);

        $("#addressId").val("");
        $("#houseNo").val("");
        $("#area").val("");
        $("#instruction").val("");
        $("#city").val("");
        $("#state").val("");
        $("#pincode").val("");
        $("#name").val("");
        $("#number").val("");
        $("#landmark").val("");
        $("#selectedRole").val("");

        getAddress();
      } else {
        alert(response.message);
      }
    },
    error: function (xhr, status, err) {
      console.log(xhr.responseText);
      alert("AJAX err: " + err);
    },
  });
}
function getAddress() {
  $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "JSON",
    data: {
      type: "getAddress",
      userId,
    },
    success: function (response) {
      if (response.status == "success") {
        console.log(response);

        let addressHtml = "";

        response.data.forEach((item, index) => {
          addressHtml += `
                    
                  
                  <div class="saved_address_data"
                 >

                        <div class="selected_box">Selected</div>

                        <div class="saved_address_item">

                            <div class="saved_address_left"  onclick="selectAddress(
                      this,
                      '${item.id}',
                      '${item.receiver_name}',
                      '${item.receiver_phone}',
                      '${item.house_no}',
                      '${item.area}',
                      '${item.pincode}',
                      '${item.address_type}'
                  )">

                                <div class="saved_icon">
                                    <i class="bi bi-house-door-fill"></i>
                                </div>

                                <div class="saved_txt">

                                    <h5>${item.receiver_name}</h5>

                                    <p>
                                        ${item.house_no},
                                        ${item.area},
                                        ${item.landmark},
                                        ${item.city}
                                    </p>

                                    <div class="phone">
                                        <i class="bi bi-telephone"></i>
                                        <p>+91-<b>${item.receiver_phone}</b></p>
                                    </div>

                                </div>

                            </div>

                           <div class="saved_address_right">
    <button  data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasBottomAddAddress"
            aria-controls="offcanvasBottomAddAddress" class="address_action edit_btn" onclick='editAddress(${JSON.stringify(item)})'>
        <i class="bi bi-pencil-square"></i>
    </button>

    <button class="address_action delete_btn" onclick="deleteAddress('${item.id}')">
        <i class="bi bi-trash-fill"></i>
    </button>
</div>

                        </div>

                    </div>

                    `;
        });

        $("#savedAddress").html(addressHtml);
      } else {
        $("#savedAddress").html(`
                    <div class="not_found">
                        No saved address found
                    </div>
                `);
      }
    },
  });
}

function selectAddress(
  element,
  id,
  name,
  phone,
  houseNo,
  area,
  pincode,
  address_type,
) {
  $("#addressId").val(id);
  $(".saved_address_left").removeClass("selected_address");

  $(element).addClass("selected_address");
  $(".cart_sec3_box").show();

  let address = `
        <h4>
            Delivering to
            <b>${address_type}</b>
        </h4>

        <p>
            ${houseNo},
            ${area},
            (${pincode})
        </p>
    `;

  $("#addressvalue").html(address);

  let telephone = `
    <i class="bi bi-telephone-fill" style="color: rgb(200, 0, 0);"></i>
        ${name},
        +91-${phone}
    `;

  $("#telephoneValue").html(telephone);

  console.log(id);
}
function editAddress(data) {
  console.log(data)
  $("#addressId").val(data.id);
  $("#houseNo").val(data.house_no);
  $("#area").val(data.area);
  $("#instruction").val(data.instructions);
  $("#city").val(data.city);
  $("#state").val(data.state);
  $("#pincode").val(data.pincode);
  $("#name").val(data.receiver_name);
  $("#number").val(data.receiver_phone);
  $("#landmark").val(data.landmark);
  $("#selectedRole").val(data.address_type);
  $("#btnToggleAddress").html(`
    <button type="button" onclick="updateAddress(event)">
        Update Address
    </button>
`);
  $("#offcanvasBottomAddressLabel").html("Update Address");

}
function updateAddress(e) {
  e.preventDefault();

  let formData = new FormData();

  formData.append("type", "updateAddress");
  formData.append("addressId", $("#addressId").val()); // hidden input
  formData.append("userId", userId);
  formData.append("houseNo", $("#houseNo").val());
  formData.append("area", $("#area").val());
  formData.append("instruction", $("#instruction").val());
  formData.append("city", $("#city").val());
  formData.append("state", $("#state").val());
  formData.append("pincode", $("#pincode").val());
  formData.append("name", $("#name").val());
  formData.append("number", $("#number").val());
  formData.append("addressType", $("#selectedRole").val());
  formData.append("landmark", $("#landmark").val());

  $.ajax({
    url: apiUrl,
    method: "POST",
    data: formData,
    processData: false,
    contentType: false,
    dataType: "JSON",
    success: function (response) {
      if (response.status === "success") {
        alert(response.message);

        getAddress(); // refresh address list

        $("#addressId").val("");
        $("#houseNo").val("");
        $("#area").val("");
        $("#instruction").val("");
        $("#city").val("");
        $("#state").val("");
        $("#pincode").val("");
        $("#name").val("");
        $("#number").val("");
        $("#landmark").val("");
        $("#selectedRole").val("");
      } else {
        alert(response.message);
      }
    },
    error: function (xhr, status, error) {
      console.log(error);
    }
  });
}
function deleteAddress(id) {
  $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "JSON",
    data: {
      type: "deleteAddress",
      addressId: id,
      userId: userId
    },
    success: function (response) {
      if (response.status == "success") {
        alert("delete successfully !");
        getAddresses();
      }
      else {
        alert(response.message);

      }
    }
  });

}

$(".payment_option").on("click", function () {
  $(".payment_option").removeClass("selected_option");

  $(this).addClass("selected_option");

  let payMathod = $(this).find(".left_pay_box h5").text();
  $("#payMethod").html(payMathod);
});

function handleCheckout() {
  const params = new URLSearchParams(window.location.search);
  const rid = params.get("rid");
  let addressId = $("#addressId").val();
  let subTotal = $("#subTotal").text();
  let couponDisc = $("#couponDisc").text();
  let deleveryCharge = $("#deleveryCharge").text();
  let grandTotal = $("#grandTotal").text();
  let payMethod = $("#payMethod").html();
  let taxAmt = $("#taxAmount").text();
  const cart = JSON.parse(localStorage.getItem("foodCart")) || [];
  cartData = cart.filter((item) => item.restaurant_id == rid);

  let formData = new FormData();

  formData.append("type", "placeOrder");
  formData.append("restaurant_id", rid);
  formData.append("user_id", userId);
  formData.append("address_id", addressId);
  formData.append("subtotal", subTotal);
  formData.append("discount_amount", couponDisc);
  formData.append("delivery_charge", deleveryCharge);
  formData.append("grand_total", grandTotal);
  formData.append("payment_method", payMethod);
  formData.append("taxAmt", taxAmt);

  formData.append("foodCart", JSON.stringify(cartData));
  console.log(cart);

  $.ajax({
    url: apiUrl,
    method: "POST",
    data: formData,
    processData: false,
    contentType: false,
    dataType: "json",
    success: function (response) {
      if (response.status == "success") {
        console.log(response.message);


        handleCartDelete(rid);
        location.href = `placeOrder.html?id=${response.order_id}`;
      } else {
        console.log(response.message);
      }
    },
  });
}

function getCurrentOrderData() {
  const params = new URLSearchParams(window.location.search);
  const order_id = params.get("id");
  $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "JSON",
    data: {
      type: "getCurrentOrder",
      order_id
    },
    success: function (response) {
      if (response.status == "success") {
        console.log(response.data);
        let orderData = response.data;
        let orderHtml = '';
        orderData.map((item) => {
          orderHtml += `<div class="place_order_data_item">
                     <h5>${item.food_name}</h5>
                     <p>${item.total}</p>
                </div>`;
        });
        $("#orderData").html(orderHtml);
      } else {
        console.log(response.message)

      }
    }
  })


}

function handleCartDelete(rid) {
  let cart = JSON.parse(localStorage.getItem("foodCart")) || [];

  cart = cart.filter(item => item.restaurant_id != rid);

  localStorage.setItem("foodCart", JSON.stringify(cart));
  $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "JSON",
    data: {
      type: "handleCartDelete",
      id: rid,
    },
    success: function (response) {
      if (response.status == "success") {
        console.log(response.message);
          handleAllCartPopup();

      } else {
        console.log(response.message);
      }
    },
  });
}

function getOrders() {
  $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "json",
    data: {
      type: "getOrder",
      user_id: userId,
    },
    success: function (response) {
      if (response.status == "success") {
        let orders = response.data;
        let ordersHtml = "";
        let itemsHtml = "";
        localStorage.setItem("orders", JSON.stringify(orders));
        orders.forEach((order) => {
          console.log(order);

          const foodItems = order.food_items.split("||");
          console.log(foodItems);

          // foodItems.forEach((item) => {
          //   const [name, type] = item?.split("|") || "undefined";
          //   console.log(name, type)

          //   itemsHtml += `
          //       <div class="order_middle_box">
          //     ${type == "nonveg" ? `<img src="../assets/image/icons/failed.svg" alt="">` : ""}
          //     ${type == "veg" ? `<img src="../assets/image/icons/success.svg" alt="">` : ""}

          //       <p>${name}</p>
          //     </div>
          //   `;
          // });

          ordersHtml += `
    <div onclick="location.href='orderDetails.html?id=${order.id}'" class="order_data_item">

      <div class="order_top_wrap">
        <div class="order_item_img">
          <img src="${imageUrl + order.restaurant_image}" alt="">
        </div>

        <div class="order_item_txt">
          <h4>${order.restaurant_name}</h4>
          <p>${order.restaurant_address}</p>
        </div>
      </div>

      <div class="order_middle_wrap">
      </div>

      <div class="order_bottom_wrap">
        <div class="order_bottom_top">
          <h5>
            Order placed on
            <b>${order.ordered_at}</b>
          </h5>

          <p>Total Bill <b>₹${Math.floor(order.grand_total)}</b></p>
        </div>

        <div class="order_bottom_bottom status">
          <h5>${order.order_status}</h5>
          <a href="orderDetails.html?id=${order.id}">View Detail</a>
        </div>
      </div>

    </div>
  `;
        });

        $("#ordersData").html(ordersHtml);
      } else {
        console.log(response.messaage);
      }
    },
  });
}

function getOrderDetail() {
  const allOrders = JSON.parse(localStorage.getItem("orders")) || [];

  const params = new URLSearchParams(window.location.search);
  const orderId = params.get("id");

  const order = allOrders.find((item) => item.id == orderId);

  if (!order) {
    $("#ordersData").html("<p>Order not found</p>");
    return;
  }

  let itemsHtml = "";

  const foodItems = order.food_items.split("||");
  console.log(foodItems);

  foodItems.forEach((item) => {
    const [name, type] = item.split("|");
    console.log(foodItems);

    itemsHtml += `
            <div class="order_middle_box">
                ${type === "nonveg"
        ? '<img src="../assets/image/icons/failed.svg" alt="">'
        : '<img src="../assets/image/icons/success.svg" alt="">'
      }
                <p>${name}</p>
            </div>
        `;
  });

  const ordersHtml = `
        <div class="order_data_item">

            <div class="order_top_wrap">
                <div class="order_item_img">
                    <img src="${imageUrl + order.restaurant_image}" alt="">
                </div>

                <div class="order_item_txt">
                    <h4>${order.restaurant_name}</h4>
                    <p>${order.restaurant_address}</p>
                </div>
            </div>

            <div class="order_middle_wrap">
                ${itemsHtml}
            </div>

            

        </div>
    `;

  $("#ordersData").html(ordersHtml);
}
function getOrderCalcData() {
  const params = new URLSearchParams(window.location.search);
  const orderId = params.get("id");

  $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "JSON",
    data: {
      type: "getOrderCalcData",
      id: orderId,
    },
    success: function (response) {
      if (response.status == "success") {
        let data = response.data[0];
        $("#status").html(data.order_status);

        let billHtml = `
        <div class="bill_format_data">

          <div class="bill_field">
            <div class="left_bill_field">
              <i class="bi bi-card-text"></i>
              <p>Sub Total</p>
            </div>
            <div class="right_bill_field">
              <small>₹${data.subtotal}</small>
            </div>
          </div>

          <div class="bill_field green">
            <div class="left_bill_field">
              <i class="bi bi-tags-fill"></i>
              <p>Discount</p>
            </div>
            <div class="right_bill_field">
              <small>-₹${data.discount_amount}</small>
            </div>
          </div>

          <div class="bill_field">
            <div class="left_bill_field">
              <img
                style="width:15px"
                src="../assets/image/icons/delivery.png"
                alt=""
              />
              <p>Delivery Charge</p>
            </div>
            <div class="right_bill_field">
              <small>₹${data.delivery_charge}</small>
            </div>
          </div>

          <div class="bill_field">
            <div class="left_bill_field">
              <i class="bi bi-receipt"></i>
              <p>Tax</p>
            </div>
            <div class="right_bill_field">
              <small>₹${data.tax_amount}</small>
            </div>
          </div>

          <div class="img-design"></div>

          <div class="bill_field bill_total">
            <div class="left_bill_field">
              <p>Grand Total</p>
            </div>
            <div class="right_bill_field">
              <small>₹${data.grand_total}</small>
            </div>
          </div>

        </div>
      `;

        $("#billData").html(billHtml);
      } else {
        console.log(response.message);
      }
    },
  });
}

function handleFilter(type, element = null) {
  if (element) {
    $(".filter_sidebar").removeClass("active_sort");
    $(element).addClass("active_sort");
  }

  let filterHtml = "";

  if (type === "foodType") {
    filterHtml = `
        <div class="filter_options">
            <h4>Food Type</h4>
            <div class="filter_option_item">
                <label class="radio_item">
    <input type="radio" name="foodType" value="All" checked>
    <span></span>
    All
</label>
                <label class="radio_item">
    <input type="radio" name="foodType" value="veg">
    <span></span>
    Veg
</label>

<label class="radio_item">
    <input type="radio" name="foodType" value="nonveg">
    <span></span>
    NonVeg
</label>
            </div>
        </div>`;
  } else if (type === "sort") {
    filterHtml = `
        <div class="filter_options">
            <h4>SORT BY</h4>
            <div class="filter_option_item">
               
<label class="radio_item">
    <input type="radio" name="sort2" value="relevance" checked>
    <span></span>
    Relevance
</label>

<label class="radio_item">
    <input type="radio" name="sort2" value="low_to_high">
    <span></span>
    Low to High
</label>

<label class="radio_item">
    <input type="radio" name="sort2" value="high_to_low">
    <span></span>
    High to Low
</label>
            </div>
        </div>`;
  }
  $("#rightFilter").html(filterHtml);
}

$(document).ready(function () {
  handleFilter("foodType");
});

$(document).on("change", "input[name='foodType']", function () {
  $("#selectedFoodType").val($(this).val());
  let foodType = $("#selectedFoodType").val();

  console.log(foodType);
});

$(document).on("change", "input[name='sort2']", function () {
  $("#selectedSort").val($(this).val());
  let sort = $("#selectedSort").val();

  console.log(sort);
});

$("#searchResturant").on("input", function () {
  handleApplyFilter();
});

function handleApplyFilter() {
  let sort = $("#selectedSort").val();
  let foodType = $("#selectedFoodType").val();
  const params = new URLSearchParams(window.location.search);
  let search = $("#searchResturant").val().trim().toLowerCase();

  const rid = params.get("rid");
  const pid = params.get("pid");
  if (rid) {
    $.ajax({
      url: apiUrl,
      method: "POST",
      dataType: "JSON",
      data: {
        type: "selectedResturants",
        id: rid,
      },
      success: function (response) {
        if (response.status == "success") {
          let Allproducts = response.data;

          if (pid) {
            Allproducts = response.data?.filter((item) => item.id !== pid);
          }
          if (!pid) {
            $(".selectedPrd").css("display", "none");
          }

          Allproducts = [...response.data];
          let count = 0;

          if (search) {
            Allproducts = Allproducts.filter((item) =>
              item.name.toLowerCase().includes(search),
            );
          }

          // Food Type Filter
          if (foodType !== "All") {
            Allproducts = Allproducts.filter(
              (item) => item.food_type === foodType,
            );
            $("#filter_tab_box").addClass("activeFilter");
            count++;
          }

          // Sorting
          if (sort === "low_to_high") {
            Allproducts.sort(
              (a, b) =>
                parseFloat(a.discount_price) - parseFloat(b.discount_price),
            );
            count++;
          } else if (sort === "high_to_low") {
            Allproducts.sort(
              (a, b) =>
                parseFloat(b.discount_price) - parseFloat(a.discount_price),
            );
            count++;
          }
          if (count > 0) {
            $(".filter_tab_box").addClass("activeFilter");
            $("#countFilter").html(count);
          }

          console.log(Allproducts);

          let resturantPrdHtml = "";

          Allproducts?.forEach((item) => {
            resturantPrdHtml += `
          
          <div class="resturant_products" >
          
            <div class="resturant_prd_left">
            
              ${item.food_type == "veg"
                ? `<img src="../assets/image/icons/success.svg" alt="">`
                : ""
              }            
              ${item.food_type == "nonveg"
                ? `<img src="../assets/image/icons/failed.svg" alt="">`
                : ""
              }            
                  
              
              
              <h4>${item?.name}</h4>
              
              <p>₹${item?.discount_price}</p>

              <div class="prd_star">
                <i class="bi bi-star-fill"></i>
                <p>${item?.rating}</p>
                <p>(${item?.reviews})</p>
              </div>

              <div id="btn${item.id}" onclick="handleSaveData(${item.id},'food')" class="save_btn">
                <i class="bi bi-bookmark"></i>
                <p>Save to Eatlist</p>
              </div>

              <div class="desc_prd">
                <p>
                  ${item?.description}
                  <button onclick='handleModalData(${JSON.stringify(item)})' data-bs-toggle="offcanvas" data-bs-target="#offcanvasProductBox" aria-controls="offcanvasProductBox">more</button>
                </p>
              </div>

            </div>

            <div class="resturant_prd_right">
            
              <img onclick='handleModalData(${JSON.stringify(item)})' data-bs-toggle="offcanvas" data-bs-target="#offcanvasProductBox" aria-controls="offcanvasProductBox" src="${imageUrl}${item?.image}" alt="${item?.name}">
                  
             ${!item?.varient
                ? `<div
                   class="btn_add_data"
                   onclick='handleModalCartData(${JSON.stringify(item)})'
                   type="button"
                   data-bs-toggle="offcanvas"
                   data-bs-target="#offcanvasProductModal"
                   aria-controls="offcanvasProductModal"
                 >
                   Add
                 </div>`
                : ` <div
                     class="btn_add_data AddBtn"
                     id="AddBtn"
                      onclick="handleToggleBtn(this)"
                     type="button"
                   >
                     Add
                   </div>
                   <div class="btn_add_data button_data " style="display : none;">
                     <button class="plus">-</button>
                     <input type="number" value="1" />
                     <button>+</button>
                   </div>`
              }
       

                    </div>

                  </div>

                `;
          });

          $("#resturantProduct").html(resturantPrdHtml);
          getSavedProduct("food");
        } else {
          console.log(response.message);
        }
      },

      error: function (xhr, status, error) {
        console.log("AJAX Err: " + error);
      },
    });
  } else {
    console.log("something wents wrong on params");
  }
}
function clearFilters() {
  // Hidden inputs reset
  $("#selectedFoodType").val("All");
  $("#selectedSort").val("relevance");

  // Radio reset
  $("input[name='foodType'][value='All']").prop("checked", true);
  $("input[name='sort2'][value='relevance']").prop("checked", true);

  // Products reload
  getProduct(); // ya jo bhi function products render karta hai
  $(".filter_tab_box").removeClass("activeFilter");
  $("#countFilter").html("");
  alert();
}

function handleToggleBtn(el) {
  let parent = el.closest(".resturant_prd_right");

  parent.querySelector(".AddBtn").style.display = "none";
  parent.querySelector(".button_data").style.display = "flex";
}



function getUser() {
  $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "JSON",
    data: {
      type: "getUser",
      userId
    },
    success: function (response) {
      if (response.status == "success") {
        console.log(response.data);
        let userData = response.data;
        $("#name").html(userData.name)
        $("#phone").html(userData.phone);
      } else {
        console.log(response.message);
      }
    }
  })

}

// Logout
function logoutFood() {
  localStorage.clear();

  window.location.replace("../../pages/login.html");
}

// Check Login
function checkLogin() {
  const pagePath = window.location.pathname;
  const userId = localStorage.getItem("userId");

  if (!userId) {
    if (!pagePath.includes('login') && !pagePath.includes('otp')) {
      window.location.replace("../../pages/login.html");
    }
    return false;
  }

  if (pagePath.includes('login')) {
    window.location.replace("../food/Pages/welcome.html");
  }

  return true;
}

// Call on every protected page
checkLogin();

async function setStatusBar(color, style, isTrue) {

  // if (!window.StatusBar) {
  //     alert("StatusBar plugin not available");
  //     return;
  // }

  StatusBar.overlaysWebView(isTrue);
  StatusBar.backgroundColorByHexString(color);

  if (style == "light") {
    StatusBar.styleLightContent();
  } else {
    StatusBar.styleDefault();
  }
}

async function applyPageStatusBar() {

  let page = window.location.pathname;

  if (page.includes("home.html")) {
    await setStatusBar("#fca8ab", "light", false); // false is not working 

  } else if (page.includes("splash1.html") || page.includes("splash2.html") || page.includes("splash3.html")) {
    await setStatusBar("#00000000", "light", true);

  }
  else {
    await setStatusBar("#fff", "dark", false); // false is not working
  }

}

document.addEventListener("deviceready", async function () {
  await applyPageStatusBar();
}, false);