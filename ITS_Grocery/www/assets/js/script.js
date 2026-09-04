console.log("done !");
let userId = localStorage.getItem("userId");
let cartData = JSON.parse(localStorage.getItem("cart"));
let addressId = localStorage.getItem("addressId");

// localStorage.setItem("branchId", 27);
let branchId = localStorage.getItem("branchId")
$("#cartPopup").hide();
if (cartData && cartData.length > 0) {
  let branchCart = cartData.filter((item) => item.branchId == branchId);
  if (branchCart && branchCart.length > 0) {
    $("#cartPopup").show();
    $("#cartQty").html(branchCart.length);
  }
}

let apiUrl =
  "https://indiantechsolution.com/demos/multibranch/its-cart/apis/app/";

let imgUrl =
  "https://indiantechsolution.com/demos/multibranch/its-cart/admin/";

// let apiUrl =
//   "http://localhost/indian%20tech%20solution-Branch/Dashboard_multiBranch/apis/app/";

// let imgUrl =
//   "http://localhost/indian%20tech%20solution-Branch/Dashboard_multiBranch/admin/";

let categoryId = localStorage.getItem("currentCategoryId") || '';

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

  if (page.includes("home.html") || page.includes("productDetail.html")) {
    await setStatusBar("#00000000", "dark", true); // false is not working 

  }
  else {
    await setStatusBar("#fff", "dark", false); // false is not working
  }

}

document.addEventListener("deviceready", async function () {
  await applyPageStatusBar();
}, false);



let loaderTl;

function showLoader() {

  // console.log("hello inner....");

  const loader = document.getElementById("loader");

  // IMPORTANT: show loader again
  loader.style.display = "flex";

  // Reset loader opacity
  gsap.set(loader, {
    opacity: 1
  });

  // Kill previous timeline if exists
  if (loaderTl) {
    loaderTl.kill();
  }

  // Heading
  gsap.set(".data_loader h6", {
    opacity: 0
  });

  gsap.to(".data_loader h6", {
    opacity: 1,
    duration: 0.3
  });

  // Images
  const images = gsap.utils.toArray(".loader-img");

  // Reset images
  gsap.set(images, {
    opacity: 0,
    y: 40
  });

  // Create new timeline
  loaderTl = gsap.timeline({
    repeat: -1
  });

  images.forEach((img) => {

    loaderTl
      .fromTo(
        img,
        {
          opacity: 0,
          y: 40
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.45,
          ease: "power2.out"
        }
      )

      .to({}, {
        duration: 0.7
      })

      .to(img, {
        opacity: 0,
        y: -40,
        duration: 0.35,
        ease: "power2.in"
      });

  });
}


function hideLoader() {

  // Stop animation
  if (loaderTl) {
    loaderTl.kill();
    loaderTl = null;
  }

  const loader = document.getElementById("loader");

  gsap.to(loader, {
    opacity: 0,
    duration: 0.4,

    onComplete() {
      loader.style.display = "none";
    }
  });
}





function getTopHeroBanner(id) {
  categoryId = localStorage.getItem("currentCategoryId");

  // alert(id);
  return $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "JSON",
    data: {
      type: "getTopHeroBanner",
      categoryId
    },
    success: function (response) {
      if (response.status === "success") {
        console.log(" response.data============");
        console.log(response.data);
        console.log(" response.data==========");
        let topBannerData = response.data[0];
        $(`#topBanner${id}`).attr("src", imgUrl + topBannerData.child_img);
        $(`#headerBg`).css("background", `url('${imgUrl + topBannerData.img_path}')`);
        $(`#headerBg`).css("color", `${topBannerData.color_code}`);

        if (topBannerData.icon_color == "white") {
          $(".main").addClass("lightTheme");
        } else {
          $(".main").removeClass("lightTheme");
        }
      } else {
        console.log(response.message);
      }
    }
  })
}





function getCategory() {
  $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "JSON",
    data: {
      type: "getCategory",
    },
    success: function (response) {
      if (response.status == "success") {
        console.log(response.data);
        let categories = response.data;
        let categoryHtml = `<div class="category_indicator"></div>`;
        let categoryId = localStorage.getItem("currentCategoryId");
        if (!categoryId || categoryId == '') {
          categoryId = categories[0]?.id;
          localStorage.setItem("currentCategoryId", categories[0]?.id);
        }
        let currentCategoryName = localStorage.getItem("currentCategoryName");
        if (!currentCategoryName || currentCategoryName == '') {
          currentCategoryName = categories[0]?.name;
          localStorage.setItem("currentCategoryName", categories[0]?.name);
        }
        renderCategory(currentCategoryName)


        categories.forEach((item, index) => {
          categoryHtml += `
            <button 
                class="category_btn  ${item.id === categoryId ? "active" : ""}"
                onclick="scrollToTop()"
                data-category="${item.name}"
                 data-category-id="${item.id}"
            >
                <div class="category_img">
                    <img src="${imgUrl + item.image_path}" alt="">
                </div>
                <div class="category_name">${item.name}</div>
            </button>
            `;
        });
        $("#category").html(categoryHtml);
        setTimeout(() => {
          moveIndicator($(".category_btn.active"));

        }, 100);


      } else {
        console.log(response.message);
        console.log(response.data);
      }
    },
  });
}


// function getTopLeftBanner() {
//   categoryId = localStorage.getItem("currentCategoryId");
//   const branchId = localStorage.getItem("branchId");

//   return $.ajax({
//     url: apiUrl,
//     method: "POST",
//     dataType: "JSON",
//     data: {
//       type: "getFlashSalePrd",
//       categoryId,
//       branchId
//     },
//     success: function (response) {
//       if (response.status === "success") {
//         console.log("response.data============ 44444");
//         console.log(response.data);
//         console.log("response.data==========");
//         let carouselItems = "";


//         response.data.forEach((item, index) => {
//           carouselItems += `
//         <div class="carousel-item  ${index === 0 ? "active" : ""}">
//         <div class="top_left_banner" onclick="location.href='productDetail.html?id=${item.p_id}'">
//         <h4>Flash Sale</h4>
//         <div class="sell_price">₹${item.v_seliing_price}</div>
//         <div class="mrp_price"><del>₹${item.v_mrp}</del></div>
//         <h6>${item.name}</h6>

//         <img src="${imgUrl + item.image_path}" class="d-block w-100" alt="Banner"> 
//        </div>
//         </div>
//       `;
//         });

//         const bannerHTML = `
//       <div id="carouselExampleAutoplaying" class="carousel slide" data-bs-ride="carousel">
//         <div class="carousel-inner">
//           ${carouselItems}
//         </div>
//       </div>
//     `;


//         $("#topLeftBanner").html(bannerHTML);

//         $(".slide").css("background", `url("${imgUrl + response.bg.img_path}")`);
//       } else {
//         console.log(response.message);
//       }
//     },
//   });
// }


function getTopLeftBanner() {
  categoryId = localStorage.getItem("currentCategoryId");
  const branchId = localStorage.getItem("branchId");

  return $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "JSON",
    data: {
      type: "getFlashSalePrd",
      categoryId,
      branchId
    },
    success: function (response) {
      if (response.status === "success") {
        console.log("response.data============ 44444");
        console.log(response.data);
        console.log("response.data==========");
        let carouselItems = "";


        response.data.forEach((item, index) => {
          carouselItems += `
        <div class="swiper-slide">
        <div class="top_left_banner" onclick="location.href='productDetail.html?id=${item.p_id}'">
        <h4>Flash Sale</h4>
        <div class="sell_price">₹${item.v_seliing_price}</div>
        <div class="mrp_price"><del>₹${item.v_mrp}</del></div>
        <h6>${item.name}</h6>   
        <img src="${imgUrl + item.image_path}" class="d-block w-100" alt="Banner"> 
       </div>
          </div>
      `;
        });

        const bannerHTML = `

     <div class="swiper mySwiper slide">
      <div class="swiper-wrapper">
                 ${carouselItems}

      </div>
     
    </div>
        `;



        $("#topLeftBanner").html(bannerHTML);

        var swiper = new Swiper('.mySwiper', {
          grabCursor: true,
          loop: true,
          parallax: true,
          spaceBetween: 30,
          centeredSlides: true,
          autoplay: {
            delay: 2500,
            disableOnInteraction: false,
          },

        });

        $(".slide").css("background", `url("${imgUrl + response.bg.img_path}")`);
      } else {
        console.log(response.message);
      }
    },
  });
}
function getTopRightBanner() {
  let categoryId = localStorage.getItem("currentCategoryId");
  return $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "JSON",
    data: {
      type: "getTopRightBanner",
      categoryId
    },
    success: function (response) {
      if (response.status === "success") {
        let bannerRightHtml = "";

        let bannerData = response.data;
        console.log("bannerData ===================");
        console.log(bannerData);
        console.log("bannerData =====================");
        bannerData.map((item) => {
          bannerRightHtml += `<img onclick="renderInSubCategory('${item.under_category}','${item.under_middle_category}')" src="${imgUrl + item.image_path}" />`;
        });

        $("#bannerRight").html(bannerRightHtml);
      } else {
        console.log(response.message);
      }
    },
  });
}
function getArivalsData() {
  return $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "JSON",
    data: {
      type: "getArrivalsData",
      categoryId: categoryId,
    },
    success: function (response) {
      if (response.status == "success") {
        let prdData = response.data;
        console.log("prdData");
        console.log(prdData);

        console.log("prdData");

        let prdHtml = "";
        prdData.map((item, index) => {
          prdHtml += `<div class="new_arrivals_item"  
          onclick="renderInSubCategory('${item.under_category}','${item.id}')">
              <img src="${imgUrl + item.image_path}" alt="">
            </div>`;
        });

        $("#newArrival").html(prdHtml);
      }
    },
  });
}
function getBestSellingPrd() {
  return $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "JSON",
    data: {
      type: "getBestSellingPrd",
      categoryId: categoryId,
    },
    success: function (response) {
      if (response.status == "success") {
        let prdData = response.data;
        let headData = response.header[0];
        console.log(prdData, headData);

        renderBestSellingHtml(prdData.btitle1, headData.title1, "btitle1");
        renderBestSellingHtml(prdData.btitle2, headData.title2, "btitle2");
        renderBestSellingHtml(prdData.btitle3, headData.title3, "btitle3");
        renderBestSellingHtml(prdData.btitle4, headData.title4, "btitle4");
        renderBestSellingHtml(prdData.btitle5, headData.title5, "btitle5");
        renderBestSellingHtml(prdData.btitle6, headData.title6, "btitle6");
      }
    },
  });
}
function renderBestSellingHtml(products, title, type) {
  if (!products || products.length === 0) return;

  let prdHtml = `
    <div class="category_item">

      <div class="category_top">
        <div class="category_top_sub_item">
  `;

  for (let i = 0; i < 4; i++) {
    const product = products[i];

    prdHtml += `
<div class="sub_item"
     onclick="renderToAllPrd('${product?.under_category}','${type}','${title}')">
      <img src="${product
        ? imgUrl + product.image_path
        : "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"
      }" alt="">
      </div>
    `;
  }

  prdHtml += `
          <p>+${Math.max(0, products.length - 4)} more</p>
        </div>
      </div>

      <div class="category_bottom">
        <p>${title}</p>
      </div>

    </div>
  `;

  // append because function multiple times call ho rahi hai
  $("#categoryContainer").append(prdHtml);
}

function getNewFindPrd() {
  return $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "JSON",
    data: {
      type: "getNewFindPrd",
      categoryId: categoryId,
    },
    success: function (response) {
      if (response.status == "success") {
        let prdData = response.data;
        let headData = response.header[0];
        console.log(prdData, headData);

        renderNewFindHtml(prdData.dtitle1, headData.title1, "dtitle1");
        renderNewFindHtml(prdData.dtitle2, headData.title2, "dtitle2");
        renderNewFindHtml(prdData.dtitle3, headData.title3, "dtitle3");
        renderNewFindHtml(prdData.dtitle4, headData.title4, "dtitle4");
        renderNewFindHtml(prdData.dtitle5, headData.title5, "dtitle5");
        renderNewFindHtml(prdData.dtitle6, headData.title6, "dtitle6");

      }
    },
  });

}
function renderNewFindHtml(products, title, type) {
  console.log("newfinds : ===========");
  console.log(products, title, type);
  console.log("newfinds : ===========");
  if (!products?.length) return;

  const item = {
    name: title,
    images: products.slice(0, 4).map((p) => imgUrl + p.image_path),
  };

  let html = `
    <div class="data_design_sec_item">
      <h5>${item.name}</h5>

      <div class="data_design_img_wrap grid_2">
        ${products
      .slice(0, 4)
      .map(
        (product) => `
              <div class="design_img"
                   onclick="renderToAllPrd('${product.under_category}','${type}','${title}')">
                <img src="${imgUrl + product.image_path}" alt="">
              </div>
            `
      )
      .join("")}
      </div>

        
    </div>
  `;

  $("#categoryDesign").append(html);
}
function getNewFindKids() {
  $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "JSON",
    data: {
      type: "getNewFindPrd",
      categoryId: categoryId,
    },
    success: function (response) {
      if (response.status == "success") {
        let prdData = response.data;
        let headData = response.header[0];
        console.log(prdData, headData);

        renderNewFindKidsHtml(prdData.dtitle1, headData.title1, "dtitle1");
        renderNewFindKidsHtml(prdData.dtitle2, headData.title2, "dtitle2");
        renderNewFindKidsHtml(prdData.dtitle3, headData.title3, "dtitle3");
        renderNewFindKidsHtml(prdData.dtitle4, headData.title4, "dtitle4");
        renderNewFindKidsHtml(prdData.dtitle5, headData.title5, "dtitle5");
        renderNewFindKidsHtml(prdData.dtitle6, headData.title6, "dtitle6");

      }
    },
  });
}
function renderNewFindKidsHtml(products, title, type) {
  if (!products?.length) return;

  const item = {
    name: title,
    images: products.slice(0, 4).map((p) => imgUrl + p.image_path),
  };

  let html = `
    <div class="data_design_sec_item kids_color">
      <h5>${item.name}</h5>

      <div class="data_design_img_wrap grid_2">
        ${products
      .slice(0, 4)
      .map(
        (product) => `
              <div class="design_img"
                   onclick="renderToAllPrd('${product.under_category}','${type}','${title}')">
                <img src="${imgUrl + product.image_path}" alt="">
              </div>
            `
      )
      .join("")}
      </div>

        
    </div>
  `;

  $("#categoryNewFind").append(html);
}
function getNewFind99store() {
  $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "JSON",
    data: {
      type: "getNewFindPrd",
      categoryId: categoryId,
    },
    success: function (response) {
      if (response.status == "success") {
        let prdData = response.data;
        let headData = response.header[0];
        console.log(prdData, headData);

        renderNewFindHtml99store(prdData.btitle1, headData.title1, "btitle1");
        renderNewFindHtml99store(prdData.btitle2, headData.title2, "btitle2");
        renderNewFindHtml99store(prdData.btitle3, headData.title3, "btitle3");
        renderNewFindHtml99store(prdData.btitle4, headData.title4, "btitle4");
        renderNewFindHtml99store(prdData.btitle5, headData.title5, "btitle5");
      }
    },
  });
}
function renderNewFindHtml99store(products, title, type) {
  if (!products?.length) return;

  const item = {
    name: title,
    images: products.slice(0, 4).map((p) => imgUrl + p.image_path),
  };

  let html = `
    <div class="data_design_sec_item">
      <h5>${item.name}</h5>

      <div class="data_design_img_wrap grid_2">
        ${products
      .slice(0, 4)
      .map(
        (product) => `
              <div class="design_img"
                   onclick="renderToAllPrd('${product.under_category}','${type}','${title}')">
                <img src="${imgUrl + product.image_path}" alt="">
              </div>
            `
      )
      .join("")}
      </div>

        
    </div>
  `;

  $("#newFind99store").append(html);
}

function renderToAllPrd(cid, type, title) {
  location.href = `viewProducts.html?cid=${cid || 0}&name=${title}`;
  localStorage.setItem("prdType", type);
}

function getAllProductData() {
  let branchId = localStorage.getItem("branchId");
  const params = new URLSearchParams(window.location.search);

  const cid = params.get("cid");
  const name = params.get("name");

  $("#selectedPrdHeading").text(name);
  let typeName;
  typeName = Number(localStorage.getItem("prdType"));

  let type;
  if (isNaN(typeName)) {
    typeName = localStorage.getItem("prdType");

    type = "getAllProductData"

  } else {
    type = "getAllProductBrandData"
  }
  return $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "JSON",
    data: {
      type,
      id: cid,
      typeName,
      branchId
    },
    success: function (response) {
      if (response.status == "success") {
        console.log(response.data);
        let productList = response.data;
        let html = "";

        productList.forEach((item, index) => {
          html += `
      <div class="product_design_item_wrap">

        <div class="product_top_wrap">


        ${item?.stock > 0 ?
              (`<div class="product_img" onclick="location.href='productDetail.html?id=${item.p_id}'">
            <img src="${imgUrl + item.image_path}" alt="">
          </div>`)
              :
              (` <div class="product_img outStock" onclick="location.href='#'">
          <div class='outOfStock'><p>Out Of Stock</p></div>
            <img src="${imgUrl + item.image_path}" alt="">
          </div>`)}
          

          <div class="like ${index == 0 || index == 3 || index == 4 ? "like_active" : ""
            }">
            <i class="ti ti-heart-filled"></i>
          </div>
          <div class="${item?.stock > 0 ? 'show ' : 'hide'}">
              ${item.varient_count <= 1
              ? `
          <div
            class="AddWrp productAddBtn"
            id="AddBtnToggle${item.p_id}"
            data-pid="${item.p_id}"
          >
            <button
              onclick="getSingleVarientId('${item.p_id}','prd','${item.image_path}','${item.name}')"
            >
              Add
            </button>
          </div>
        `
              : `
          <div
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasVarient"
            aria-controls="offcanvasVarient"
            class="cart_tag_Add varient"
            onclick="getSingleVarientId('${item.p_id}','','${item.image_path}','${item.name}')">
    
            Add
    
            <div class="varient_btn">
              ${item.varient_count} option
            </div>
    
          </div>
        `
            }
              </div>

        </div>

        <div class="product_txt">

          <h5>${item.name}</h5>

          <div class="rating_wrap">

            <div class="stars">
              <i class="ti ti-star-filled"></i>
              <i class="ti ti-star-filled"></i>
              <i class="ti ti-star-filled"></i>
              <i class="ti ti-star-filled"></i>
              <i class="ti ti-star-filled"></i>
            </div>

            <div class="rate">
              (${item.review_val})
            </div>

          </div>

          <div class="qty_price_sec">

            <h4>${item.v_quantity}${item.v_unit}</h4>

            <div class="price_sec">
              <h6>₹${item.v_seliing_price}</h6>
              <del>₹${item.v_mrp}</del>
            </div>

          </div>

        </div>

      </div>
         `;
        });
        $("#getAllProductData").html(html);
        $("#noOfPrd").text(`${productList.length} produts`);
        updateCartUI("prd");
      } else {
        console.log(response.message);
      }
    },
  });
}



function getAllbrands(type) {
  let categoryId = localStorage.getItem("currentCategoryId");
  return $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "JSON",
    data: {
      type: "getAllbrands",
      categoryId
    },
    success: function (response) {
      if (response.status == "success") {
        let brandData = response.data;

        let brandHtml = "";
        if (type === "grocery") {
          brandData.slice(0, 8).map((item) => {
            brandHtml += `
          <div class="spot_img" 
            onclick="renderToAllPrd('${item.categoryId}','${item.id}','${item.name}')">
          
             <img src="${imgUrl + item.logo_path}" alt="${item.name}">
            </div>`;
          });
          $("#brandspot").html(brandHtml);
        }
        else {
          brandData.slice(0, 9).map((item) => {
            brandHtml += `
        <div class="brand_pharmacy" 
          onclick="renderToAllPrd('${item.categoryId}','${item.id}','${item.name}')">
        
           <img src="${imgUrl + item.logo_path}" alt="${item.name}">
          </div>`;
          });
          $("#brandsPharmacy").html(brandHtml);
        }

      }
    },
    error: function (xhr, status, error) {
      console.log(error);
    }
  })

}
function getBrandsProducts() {
  let categoryId = localStorage.getItem("currentCategoryId");
  let branch_id = localStorage.getItem("branchId");

  return $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "JSON",
    data: {
      type: "getBrandProducts",
      categoryId,
      branch_id
    },
    success: function (response) {
      if (response.status == "success") {
        let brandPrdHtml = "";
        let data = response.data;
        console.log("===============")
        console.log(data);
        console.log("===============")

        // data?.allData?.map((item) => {
        //   AllProduct[item.p_id] = item;
        // });
        $("#promotionPrd1").html(renderProducts(data?.b1?.products));
        $("#promotionPrd2").html(renderProducts(data?.b2?.products));
        $("#promotionPrd3").html(renderProducts(data?.b3?.products));

        $("#promotionImg1").html(`<img src='${imgUrl + data?.b1?.img}' alt='${data?.b1?.name}'/>`);
        $("#promotionImg2").html(`<img src='${imgUrl + data?.b2?.img}' alt='${data?.b2?.name}'/>`)
        $("#promotionImg3").html(`<img src='${imgUrl + data?.b3?.img}' alt='${data?.b3?.name}'/>`)

        // // See All Products
        $("#promotionWrapHeading1").html(
          renderseeAllPrd(data?.b1?.products, data?.b1?.id, data?.b1?.name),
        );
        $("#promotionWrapHeading2").html(
          renderseeAllPrd(data?.b2?.products, data?.b2?.id, data?.b2?.name),
        );
        $("#promotionWrapHeading3").html(
          renderseeAllPrd(data?.b3?.products, data?.b3?.id, data?.b3?.name),
        );

        updateCartUI("prd");
      }

    },
    error: function (xhr, status, error) {
      console.log(error);
    }

  });

}

function getSubCategories() {
  return $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "JSON",
    data: {
      type: "getSubCategories",
      categoryId,
    },
    success: function (response) {
      if (response.status === "success") {
        renderSubCategories1(response.data);
        renderSubCategories2(response.data);
      } else {
        console.log(response.message);
      }
    },
    error: function (xhr, status, error) {
      console.log(error);
    },
  });
}

function renderSubCategories1(data) {
  $("#categoryBox1").html(createSubCategoryHTML1(data.title1));
  $("#categoryBox2").html(createSubCategoryHTML1(data.title2));
  $("#categoryBox3").html(createSubCategoryHTML1(data.title3));
  $("#categoryBox4").html(createSubCategoryHTML2(data.title4));
  $("#categoryBox5").html(createSubCategoryHTML1(data.title5));
}
function renderSubCategories2(data) {
  $("#category1").html(createSubCategoryHTML1(data.title1));
  $("#category2").html(createSubCategoryHTML1(data.title2));
  $("#category3").html(createSubCategoryHTML1(data.title3));
  $("#category4").html(createSubCategoryHTML1(data.title4));
  $("#category5").html(createSubCategoryHTML1(data.title5));
}


function createSubCategoryHTML2(categories = []) {
  return categories.slice(0, 8)
    .map(
      (item) => `
      <div class="cateogy_box_new_design"
           onclick="renderInSubCategory('${item.under_category}','${item.id}')">

           <img src="${imgUrl + item.image_path}" alt="${item.name}">

      </div>
    `,
    )
    .join("");
}
function createSubCategoryHTML1(categories = []) {
  return categories
    .slice(0, 8)
    .map(
      (item) => `
      <div class="cateogy_box"
           onclick="renderInSubCategory('${item.under_category}','${item.id}')">

        <div class="category_img_box_design">
          <img src="${imgUrl + item.image_path}" alt="${item.name}">
        </div>

        <h6>${item.name}</h6>
      </div>
    `,
    )
    .join("");
}
function renderInSubCategory(cid, mid) {
  location.href = `subCategory.html?cid=${cid}`;
  localStorage.setItem("middleCatId", mid);
  localStorage.setItem("subCatId", 0);
}

const products = {};
const AllProduct = {};
const varientAllData = [];
const varientData = {};

function getAllProduct() {
  const branchId = localStorage.getItem("branchId");

  $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "JSON",
    data: {
      type: "getAllProduct",
      branchId
    },
    success: function (response) {
      if (response.status == "success") {
        let data = response.data;


        data?.allData?.map((item) => {
          AllProduct[item.p_id] = item;
        });
        // console.log("AllProduct",AllProduct,data?.allData)
      }
    }
  })
}
getAllProduct();
function getGroceryProducts() {
  categoryId = localStorage.getItem("currentCategoryId");
  const branchId = localStorage.getItem("branchId");
  return $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "JSON",
    data: {
      type: "getProducts",
      categoryId,
      branchId
    },

    success: function (response) {
      if (response.status === "success") {
        let data = response.data;

        data?.allData?.map((item) => {
          AllProduct[item.p_id] = item;
        });
        console.log("AllProduct,data?.allData")
        console.log(AllProduct, data?.allData)
        $("#productWrap1").html(renderProducts(data.title1));
        $("#productWrap2").html(renderProducts(data.title2));
        $("#productWrap3").html(renderProducts(data.title3));
        $("#productWrap4").html(renderProducts(data.title4));
        $("#productWrap5").html(renderProducts(data.title5));
        $("#productWrap6").html(renderProducts(data.title6));

        let producthead1 = $("#producthead1").text();
        let producthead2 = $("#producthead2").text();
        let producthead3 = $("#producthead3").text();
        let producthead4 = $("#producthead4").text();
        let producthead5 = $("#producthead5").text();
        let producthead6 = $("#producthead6").text();
        // See All Products
        $("#productWrapHeading1").html(
          renderseeAllPrd(data.title1, "title1", producthead1),
        );
        $("#productWrapHeading2").html(
          renderseeAllPrd(data.title2, "title2", producthead2),
        );
        $("#productWrapHeading3").html(
          renderseeAllPrd(data.title3, "title3", producthead3),
        );
        $("#productWrapHeading4").html(
          renderseeAllPrd(data.title4, "title4", producthead4),
        );
        $("#productWrapHeading5").html(
          renderseeAllPrd(data.title5, "title5", producthead5),
        );
        $("#productWrapHeading6").html(
          renderseeAllPrd(data.title6, "title6", producthead6),
        );
        updateCartUI("prd");
      } else {
        console.log("something went wrong on getProducts");
      }
    },
  });
}
function getBeautyProducts() {

  categoryId = localStorage.getItem("currentCategoryId");
  branchId = localStorage.getItem("branchId");
  return $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "JSON",
    data: {
      type: "getProducts",
      categoryId,
      branchId
    },

    success: function (response) {
      if (response.status === "success") {
        let data = response.data;

        data?.allData?.map((item) => {
          AllProduct[item.p_id] = item;
        });
        $("#productBeauty1").html(renderProducts(data.title1));
        $("#productBeauty2").html(renderProducts(data.title2));
        $("#productBeauty3").html(renderProducts(data.title3));
        $("#productBeauty4").html(renderProducts(data.title4));
        $("#productBeauty5").html(renderProducts(data.title5));
        $("#productBeauty6").html(renderProducts(data.title6));


        let producthead1 = $("#productheadBeauty1").text();
        let producthead2 = $("#productheadBeauty2").text();
        let producthead3 = $("#productheadBeauty3").text();
        let producthead4 = $("#productheadBeauty4").text();
        let producthead5 = $("#productheadBeauty5").text();
        let producthead6 = $("#productheadBeauty6").text();
        // See All Products
        $("#productBeautyHeading1").html(
          renderseeAllPrd(data.title1, "title1", producthead1),
        );
        $("#productBeautyHeading2").html(
          renderseeAllPrd(data.title2, "title2", producthead2),
        );
        $("#productBeautyHeading3").html(
          renderseeAllPrd(data.title3, "title3", producthead3),
        );
        $("#productBeautyHeading4").html(
          renderseeAllPrd(data.title4, "title4", producthead4),
        );
        $("#productBeautyHeading5").html(
          renderseeAllPrd(data.title5, "title5", producthead5),
        );
        $("#productBeautyHeading6").html(
          renderseeAllPrd(data.title6, "title6", producthead6),
        );

        updateCartUI("prd");
      } else {
        console.log("something went wrong on getProducts");
      }
    },
  });
}
function getFashionProducts() {

  categoryId = localStorage.getItem("currentCategoryId");
  branchId = localStorage.getItem("branchId");
  return $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "JSON",
    data: {
      type: "getProducts",
      categoryId,
      branchId
    },

    success: function (response) {
      if (response.status === "success") {
        let data = response.data;

        data?.allData?.map((item) => {
          AllProduct[item.p_id] = item;
        });
        $("#productFashion1").html(renderProducts2(data.title1));
        $("#productFashion2").html(renderProducts2(data.title2));
        $("#productFashion3").html(renderProducts2(data.title3));
        $("#productFashion4").html(renderProducts2(data.title4));
        $("#productFashion5").html(renderProducts2(data.title5));
        $("#productFashion6").html(renderProducts2(data.title6));


        let producthead1 = $("#productheadFashion1").text();
        let producthead2 = $("#productheadFashion2").text();
        let producthead3 = $("#productheadFashion3").text();
        let producthead4 = $("#productheadFashion4").text();
        let producthead5 = $("#productheadFashion5").text();
        let producthead6 = $("#productheadFashion6").text();
        // See All Products
        $("#productFashionHeading1").html(
          renderseeAllPrd(data.title1, "title1", producthead1),
        );
        $("#productFashionHeading2").html(
          renderseeAllPrd(data.title2, "title2", producthead2),
        );
        $("#productFashionHeading3").html(
          renderseeAllPrd(data.title3, "title3", producthead3),
        );
        $("#productFashionHeading4").html(
          renderseeAllPrd(data.title4, "title4", producthead4),
        );
        $("#productFashionHeading5").html(
          renderseeAllPrd(data.title5, "title5", producthead5),
        );
        $("#productFashionHeading6").html(
          renderseeAllPrd(data.title6, "title6", producthead6),
        );

        updateCartUI("prd");
      } else {
        console.log("something went wrong on getProducts");
      }
    },
  });
}
function getPharmacyProducts() {
  categoryId = localStorage.getItem("currentCategoryId");
  branchId = localStorage.getItem("branchId");
  return $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "JSON",
    data: {
      type: "getProducts",
      categoryId,
      branchId
    },

    success: function (response) {
      if (response.status === "success") {
        let data = response.data;

        data?.allData?.map((item) => {
          AllProduct[item.p_id] = item;
        });
        $("#pharmacyProduct1").html(renderProducts(data.title1));
        $("#pharmacyProduct2").html(renderProducts(data.title2));
        $("#pharmacyProduct3").html(renderProducts(data.title3));
        $("#pharmacyProduct4").html(renderProducts(data.title4));
        $("#pharmacyProduct5").html(renderProducts(data.title5));
        $("#pharmacyProduct6").html(renderProducts(data.title6));



        let producthead1 = $("#productheadPharmacy1").text();
        let producthead2 = $("#productheadPharmacy2").text();
        let producthead3 = $("#productheadPharmacy3").text();
        let producthead4 = $("#productheadPharmacy4").text();
        let producthead5 = $("#productheadPharmacy5").text();
        let producthead6 = $("#productheadPharmacy6").text();

        // See All Products
        $("#productPharmacyHeading1").html(
          renderseeAllPrd(data.title1, "title1", producthead1),
        );
        $("#productPharmacyHeading2").html(
          renderseeAllPrd(data.title2, "title2", producthead2),
        );
        $("#productPharmacyHeading3").html(
          renderseeAllPrd(data.title3, "title3", producthead3),
        );
        $("#productPharmacyHeading4").html(
          renderseeAllPrd(data.title4, "title4", producthead4),
        );
        $("#productPharmacyHeading5").html(
          renderseeAllPrd(data.title5, "title5", producthead5),
        );

        $("#productPharmacyHeading6").html(
          renderseeAllPrd(data.title6, "title6", producthead6),
        );
        updateCartUI("prd");
      } else {
        console.log("something went wrong on getProducts");
      }
    },
  });
}
function getKidsProducts() {

  categoryId = localStorage.getItem("currentCategoryId");
  branchId = localStorage.getItem("branchId");
  return $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "JSON",
    data: {
      type: "getProducts",
      categoryId,
      branchId
    },

    success: function (response) {
      if (response.status === "success") {
        let data = response.data;

        data?.allData?.map((item) => {
          AllProduct[item.p_id] = item;
        });
        $("#productkids1").html(renderProducts(data.title1));
        $("#productkids2").html(renderProducts(data.title2));
        $("#productkids3").html(renderProducts(data.title3));
        $("#productkids4").html(renderProducts(data.title4));
        $("#productkids5").html(renderProducts(data.title5));
        $("#productkids6").html(renderProducts(data.title6));



        let producthead1 = $("#productheadKids1").text();
        let producthead2 = $("#productheadKids2").text();
        let producthead3 = $("#productheadKids3").text();
        let producthead4 = $("#productheadKids4").text();
        let producthead5 = $("#productheadKids5").text();
        let producthead6 = $("#productheadKids6").text();

        // See All Products
        $("#productKidsHeading1").html(
          renderseeAllPrd(data.title1, "title1", producthead1),
        );
        $("#productKidsHeading2").html(
          renderseeAllPrd(data.title2, "title2", producthead2),
        );
        $("#productKidsHeading3").html(
          renderseeAllPrd(data.title3, "title3", producthead3),
        );
        $("#productKidsHeading4").html(
          renderseeAllPrd(data.title4, "title4", producthead4),
        );
        $("#productKidsHeading5").html(
          renderseeAllPrd(data.title5, "title5", producthead5),
        );

        $("#productKidsHeading6").html(
          renderseeAllPrd(data.title6, "title6", producthead6),
        );
        updateCartUI("prd");
      } else {
        console.log("something went wrong on getProducts");
      }
    },
  });
}
function get99storeProducts() {

  categoryId = localStorage.getItem("currentCategoryId");
  branchId = localStorage.getItem("branchId");
  return $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "JSON",
    data: {
      type: "getProducts",
      categoryId,
      branchId
    },

    success: function (response) {
      if (response.status === "success") {
        let data = response.data;

        data?.allData?.map((item) => {
          AllProduct[item.p_id] = item;
        });
        $("#product99store1").html(renderProducts(data.title1));
        $("#product99store2").html(renderProducts(data.title2));
        $("#product99store3").html(renderProducts(data.title3));
        $("#product99store4").html(renderProducts(data.title4));
        $("#product99store5").html(renderProducts(data.title5));
        $("#product99store6").html(renderProducts(data.title6));



        let producthead1 = $("#producthead99store1").text();
        let producthead2 = $("#producthead99store2").text();
        let producthead3 = $("#producthead99store3").text();
        let producthead4 = $("#producthead99store4").text();
        let producthead5 = $("#producthead99store5").text();
        let producthead6 = $("#producthead99store6").text();

        // See All Products
        $("#product99storeHeading1").html(
          renderseeAllPrd(data.title1, "title1", producthead1),
        );
        $("#product99storeHeading2").html(
          renderseeAllPrd(data.title2, "title2", producthead2),
        );
        $("#product99storeHeading3").html(
          renderseeAllPrd(data.title3, "title3", producthead3),
        );
        $("#product99storeHeading4").html(
          renderseeAllPrd(data.title4, "title4", producthead4),
        );
        $("#product99storeHeading5").html(
          renderseeAllPrd(data.title5, "title5", producthead5),
        );

        $("#product99storeHeading6").html(
          renderseeAllPrd(data.title6, "title6", producthead6),
        );
        updateCartUI("prd");
      } else {
        console.log("something went wrong on getProducts");
      }
    },
  });
}
function getElictricityProducts() {

  categoryId = localStorage.getItem("currentCategoryId");
  branchId = localStorage.getItem("branchId");
  return $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "JSON",
    data: {
      type: "getProducts",
      categoryId,
      branchId
    },

    success: function (response) {
      if (response.status === "success") {
        let data = response.data;

        data?.allData?.map((item) => {
          AllProduct[item.p_id] = item;
        });
        $("#productElectricity1").html(renderProducts(data.title1));
        $("#productElectricity2").html(renderProducts(data.title2));
        $("#productElectricity3").html(renderProducts(data.title3));
        $("#productElectricity4").html(renderProducts(data.title4));
        $("#productElectricity5").html(renderProducts(data.title5));
        $("#productElectricity6").html(renderProducts(data.title6));



        let producthead1 = $("#productheadElectricity1").text();
        let producthead2 = $("#productheadElectricity2").text();
        let producthead3 = $("#productheadElectricity3").text();
        let producthead4 = $("#productheadElectricity4").text();
        let producthead5 = $("#productheadElectricity5").text();
        let producthead6 = $("#productheadElectricity6").text();

        // See All Products
        $("#productElectricityHeading1").html(
          renderseeAllPrd(data.title1, "title1", producthead1),
        );
        $("#productElectricityHeading2").html(
          renderseeAllPrd(data.title2, "title2", producthead2),
        );
        $("#productElectricityHeading3").html(
          renderseeAllPrd(data.title3, "title3", producthead3),
        );
        $("#productElectricityHeading4").html(
          renderseeAllPrd(data.title4, "title4", producthead4),
        );
        $("#productElectricityHeading5").html(
          renderseeAllPrd(data.title5, "title5", producthead5),
        );

        $("#productElectricityHeading6").html(
          renderseeAllPrd(data.title6, "title6", producthead6),
        );
        updateCartUI("prd");
      } else {
        console.log("something went wrong on getProducts");
      }
    },
  });
}


function getRecentOrder() {
  const branchId = localStorage.getItem("branchId");
  return $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "JSON",
    data: {
      type: "getRecentOrder",
      userId,
      branchId
    },
    success: function (response) {
      if (response.status == "success") {
        let recentOrder = response.data;

        $(".wrap_prd1").css("display", "block");

        $("#productDesign1").html(renderProducts3(recentOrder));

      } else {
        console.log(response.message);
        $(".wrap_prd1").css("display", "none");

      }
    },

  })
}



function renderProducts(productList) {
  let html = "";

  productList.slice(0, 6).forEach((item, index) => {
    products[item.p_id] = item;

    html += `
      <div class="product_design_item_wrap">

        <div class="product_top_wrap">

         ${item?.stock > 0 ?
        (`<div class="product_img" onclick="location.href='productDetail.html?id=${item.p_id}'">
            <img src="${imgUrl + item.image_path}" alt="">
          </div>`)
        :
        (` <div class="product_img outStock" onclick="location.href='#'">
          <div class='outOfStock'><p>Out Of Stock</p></div>
            <img src="${imgUrl + item.image_path}" alt="">
          </div>`)}

          <div class="like ${index == 0 || index == 3 || index == 4 ? "like_active" : ""
      }">
            <i class="ti ti-heart-filled"></i>
          </div>
          <div class="${item?.stock > 0 ? 'show ' : 'hide'}">
          
          ${item.varient_count <= 1
        ? `
                <div
                  class="AddWrp productAddBtn"
                  id="AddBtnToggle${item.p_id}"
                  data-pid="${item.p_id}"
                >
                  <button
                    onclick="getSingleVarientId('${item.p_id}','prd','${item.image_path}','${item.name}')"
                  >
                    Add
                  </button>
                </div>
              `
        : `
                <div
                  type="button"
                  data-bs-toggle="offcanvas"
                  data-bs-target="#offcanvasVarient"
                  aria-controls="offcanvasVarient"
                  class="cart_tag_Add varient"
                  onclick="getSingleVarientId('${item.p_id}','','${item.image_path}','${item.name}')">

                  Add

                  <div class="varient_btn">
                    ${item.varient_count} option
                  </div>

                </div>
              `
      }
                </div>


        </div>

        <div class="product_txt">

          <h5>${item.name}</h5>

          <div class="rating_wrap">

            <div class="stars">
              <i class="ti ti-star-filled"></i>
              <i class="ti ti-star-filled"></i>
              <i class="ti ti-star-filled"></i>
              <i class="ti ti-star-filled"></i>
              <i class="ti ti-star-filled"></i>
            </div>

            <div class="rate">
              (${item.review_val})
            </div>

          </div>

          <div class="qty_price_sec">

            <h4>${item.v_quantity}${item.v_unit}</h4>

            <div class="price_sec">
              <h6>₹${item.v_seliing_price}</h6>
              <del>₹${item.v_mrp}</del>
            </div>

          </div>

        </div>

      </div>
    `;
  });

  return html;
}
function renderProducts2(productList) {
  let html = "";

  productList.forEach((item, index) => {
    products[item.p_id] = item;

    html += `
      <div class="product_fashion_schema">

        <div class="product_top">

         ${item?.stock > 0 ?
        (` <div class="product_img_fashion" onclick="location.href='productDetail.html?id=${item.p_id}'">
            <img src="${imgUrl + item.image_path}" alt="">
          </div>`)
        :
        (` <div class="product_img_fashion outStock" onclick="location.href='#'">
          <div class='outOfStock'><p>Out Of Stock</p></div>
            <img src="${imgUrl + item.image_path}" alt="">
          </div>`)}
         
          

          <div class="like ${index == 0 || index == 3 || index == 4 ? "like_active" : ""
      }">
            <i class="ti ti-heart-filled"></i>
          </div>
          <div class="${item?.stock > 0 ? 'show ' : 'hide'}">
          
          ${item.varient_count <= 1
        ? `
                <div
                  class="AddWrp productAddBtn"
                  id="AddBtnToggle${item.p_id}"
                  data-pid="${item.p_id}"
                >
                  <button
                    onclick="getSingleVarientId('${item.p_id}','prd')"
                  >
                    Add
                  </button>
                </div>
              `
        : `
                <div
                  type="button"
                  data-bs-toggle="offcanvas"
                  data-bs-target="#offcanvasVarient"
                  aria-controls="offcanvasVarient"
                  class="cart_tag_Add varient"
                  onclick="getSingleVarientId('${item.p_id}','','${item.image_path}','${item.name}')">

                  Add

                  <div class="varient_btn">
                    ${item.varient_count} option
                  </div>

                </div>
              `
      }
          </div>


        </div>

        <div class="product_txt_fashion">

          <h5>${item.name}</h5>

          <div class="rating_wrap">

            <div class="stars">
              <i class="ti ti-star-filled"></i>
              <i class="ti ti-star-filled"></i>
              <i class="ti ti-star-filled"></i>
              <i class="ti ti-star-filled"></i>
              <i class="ti ti-star-filled"></i>
            </div>

            <div class="rate">
              (${item.review_val})
            </div>

          </div>

          <div class="qty_price_sec">

             <h4>${item.v_quantity}${item.v_unit}</h4>

            <div class="price_sec">
              <h6>₹${item.v_seliing_price}</h6>
              <del>₹${item.v_mrp}</del>
            </div>

          </div>

        </div>

      </div>
    `;
  });

  return html;
}
function renderProducts3(productList) {
  let html = "";

  productList.forEach((item, index) => {
    products[item.p_id] = item;

    html += `
      <div class="product_data_item">

        <div class="product_top">

         ${item?.stock > 0 ?
        (`  <div class="product_data_img" onclick="location.href='productDetail.html?id=${item.p_id}'">
            <img src="${imgUrl + item.image_path}" alt="">
          </div>`)
        :
        (` <div class="product_data_img  outStock" onclick="location.href='#'">
          <div class='outOfStock'><p>Out Of Stock</p></div>
            <img src="${imgUrl + item.image_path}" alt="">
          </div>`)}

         
          <div class="like ${index == 0 || index == 3 || index == 4 ? "like_active" : ""
      }">
            <i class="ti ti-heart-filled"></i>
          </div>

        </div>

        <div class="product_text">

          <h5>${item.name}</h5>

          <div class="rating_wrap">

            <div class="stars">
              <i class="ti ti-star-filled"></i>
              <i class="ti ti-star-filled"></i>
              <i class="ti ti-star-filled"></i>
              <i class="ti ti-star-filled"></i>
              <i class="ti ti-star-filled"></i>
            </div>

            <div class="rate">
              (${item.review_val})
            </div>

          </div>

          <div class="qty_price_sec">

             <h4>${item.v_quantity}${item.v_unit}</h4>

            <div class="price_sec">
              <h6>₹${item.v_seliing_price}</h6>
              <del>₹${item.v_mrp}</del>
            </div>

          </div>

          <div class="h ${item?.stock > 0 ? 'show' : 'pointerNone'}">
          ${item.varient_count <= 1
        ? `
                <div
                  class="AddWrp productAddBtn"
                  id="AddBtnToggle${item.p_id}"
                  data-pid="${item.p_id}"
                >
                  <button
                    class="green_btn"
                    onclick="getSingleVarientId('${item.p_id}','prd')"
                  >
                    ${item?.stock > 0 ? 'Add' : 'Out of stock'}
                  </button>
                </div>
              `
        : `
                <div
                  type="button"
                  data-bs-toggle="offcanvas"
                  data-bs-target="#offcanvasVarient"
                  aria-controls="offcanvasVarient"
                  class="cart_tag_Add varient"
                  onclick="getSingleVarientId('${item.p_id}','','${item.image_path}','${item.name}')">

                   ${item?.stock > 0 ?
          `${item.varient_count} option`
          : 'Out of stock'
        }
                

                </div >
    `
      }
      </div>

        </div>

      </div>
    `;
  });

  return html;
}


function renderseeAllPrd(productList, type, name) {
  if (!productList.length) return "";

  let images = "";

  productList.slice(0, 3).forEach((item) => {
    images += `
      <img
        src="${imgUrl + item.image_path}"
        alt="${item.name}"
      />
    `;
  });

  return `
    <div
      class="see_all_prd_wrap"
      onclick="renderToAllPrd('${categoryId}','${type}','${name}')"
    >
      <div class="left_see_prd">
        ${images}
      </div>

      <div class="right_see_prd">
        <p>See All Products</p>
        <i class="ti ti-player-play-filled"></i>
      </div>
    </div>
  `;
}
function getSingleVarientId(id, type, image, name) {
  const branch_id = localStorage.getItem("branchId");
  $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "JSON",
    data: {
      type: "getSingleVarientId",
      id,
      branchId: branch_id
    },
    success: function (response) {
      if (response.status == "success") {
        console.log(response.data);
        let varientArr = response.data;

        if (type == "prd") {
          let varientArr = response.data[0];
          toggleAdd(id, varientArr.vid, "prd", "");
          console.log(id, varientArr.vid, "prd", "");
          // alert();
          return;
        }

        let varientHtml = "";
        varientArr.map((item) => {
          varientData[item.vid] = item;
          varientHtml += ` <div class="varient_data_item">
              <div class="varient_data_img">
                <img src="${imgUrl + image}" alt="" />
              </div>
              <div class="varient_txt">
                <div class="txt_left_varient">
                  <h6>${name}</h6>
                  <div class="price_varient">
                    <p>${item.v_seliing_price}</p>
                    <del>${item.v_mrp}</del>
                  </div>
                </div>
                <b>${item.v_quantity}${item.v_unit}</b>
           
                <div id="AddVarientBtn${item.vid}">
                 <button class="Addbutton"  onclick="toggleAdd('${id}','${item.vid}','varId')">Add to cart</button>
               </div> 
             </div>
            </div>`;
        });
        $("#varientData").html(varientHtml);

        updateCartUI("varient");
      } else {
        console.log(response.message);
      }
    },
  });
}

function getCurrentIdfr() {

  let branchId = localStorage.getItem("branchId");

  if (!branchId) {
    console.log("Branch ID not found");
    return null;
  }

  let currentSession =
    JSON.parse(localStorage.getItem("currentSession")) || {};

  // Is branch ka existing IDFR hai?
  let idfr = currentSession[branchId];

  // Nahi hai to new IDFR create karo
  if (!idfr) {

    idfr = Date.now() + Math.floor(Math.random() * 9000 + 1000);

    currentSession[branchId] = idfr;

    localStorage.setItem(
      "currentSession",
      JSON.stringify(currentSession)
    );
  }

  return idfr;
}

function toggleAdd(id, varId, type, stock, isRestore = false) {
  console.log("stock");
  console.log(id, varId, type, stock, isRestore);
  console.log("stock");

  const idfr = getCurrentIdfr();

  switch (type) {

    // ================= PRODUCT LIST =================
    case "prd":

      $(`.productAddBtn[data-pid="${id}"]`).each(function () {

        $(this).html(`
          <div class="add_varient_data">

            <button
              class="minusBtn"
              data-pid="${id}"
              onclick="handleDecrement('${id}','${varId}','prdDataVar')">
              -
            </button>

            <input
              type="number"
              class="quantityInput"
              data-pid="${id}"
              value="0"
              readonly
            />

            <button
              class="plusBtn"
              data-pid="${id}"
              onclick="handleIncrement('${id}','${varId}','prdDataVar','${idfr}')">
              +
            </button>

          </div>
        `);

      });

      if (!isRestore) {
        handleIncrement(id, varId, "prdDataVar", idfr);
      }

      break;

    // ================= PRODUCT VARIANT =================
    case "varId":

      $(`#AddVarientBtn${varId}`).html(`
        <div class="add_varient_btn">

          <button
            id="minusVar${varId}"
            onclick="handleDecrement('${id}','${varId}')">
            -
          </button>

          <input
            type="number"
            id="quantityVar${varId}"
            value="0"
            readonly
          />

          <button
            id="plusVar${varId}"
            onclick="handleIncrement('${id}','${varId}','prdVarient','${idfr}')">
            +
          </button>

        </div>
      `);

      if (!isRestore) {
        handleIncrement(id, varId, "", idfr);
      }

      break;

    // ================= SINGLE PRODUCT VARIANT =================
    case "singleVarId":

      $("#addCartBtn").html(`
        <div class="btn_cart_add">

          <button
            id="minusVar${varId}"
            onclick="handleDecrement('${id}','${varId}','singleVarIdUpdate')">
            -
          </button>

          <input
            type="number"
            id="quantityVar${varId}"
            value="0"
            readonly
          />

          <button
            id="plusVar${varId}"
            onclick="handleIncrement('${id}','${varId}','singleVarIdUpdate','${idfr}')">
            +
          </button>

        </div>
      `);

      if (!isRestore) {
        handleIncrement(id, varId, "singleVarIdUpdate", idfr);
      }

      break;

    default:
      console.warn("Unknown toggleAdd type:", type);
  }
}

function getAllVarient() {
  const branchId = localStorage.getItem("branchId");

  return $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "JSON",
    data: {
      type: "getAllVarient",
      branchId
    },
    success: function (response) {
      if (response.status == "success") {

        varientAllData.push(response.data);
      } else {
        console.log(response.message);
      }
    },
  });
}
getAllVarient();

function updateCartUI(type, singleVarId) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  let branchId = localStorage.getItem("branchId");
  const branchCart = cart.filter((item) => item.branchId == branchId)

  branchCart.forEach((cartItem) => {

    // ================= Product List =================
    if (type == "prd") {

      toggleAdd(
        cartItem.p_id,
        cartItem.varientId,
        "prd",
        "",
        true
      );

      $(`.quantityInput[data-pid="${cartItem.p_id}"]`).val(cartItem.nop);

    }

    // ================= Variant =================
    else if (type == "varient") {

      toggleAdd(
        cartItem.p_id,
        cartItem.varientId,
        "varId",
        "",
        true
      );

      $(`#quantityVar${cartItem.varientId}`).val(cartItem.nop);

    }

  });

  // ================= Single Product =================
  if (type == "singleVarId") {

    const item = branchCart.find(
      (item) => item.varientId == singleVarId
    );

    if (item?.nop > 0) {

      toggleAdd(
        item.p_id,
        item.varientId,
        "singleVarId",
        item.v_stock,
        true
      );

      $(`#quantityVar${item.varientId}`).val(item.nop);

    }

  }

}
getGroceryProducts();

function handleIncrement(id, varId, type, idfr) {
  const branchId = localStorage.getItem("branchId");

  const prdData = products[id];
  const allPrdData = AllProduct[id];

  console.log(products)

  console.log("ZEENAT -  prdData : ", prdData);
  console.log("ZEENAT -  allPrdData : ", allPrdData);
  console.log("ZEENAT -  id, varId, type, idfr :", id, varId, type, idfr)

  // ================= Variant Data =================
  let varData;

  if (
    type === "singleVarIdUpdate" ||
    type === "prdVarient" ||
    type === "prdDataVar" ||
    type === "cart"
  ) {
    const allVariants = varientAllData.flat();
    varData = allVariants.find((item) => item.vid == varId);
  } else {
    varData = varientData[varId];
  }
  console.log(varData, varientAllData, "varData, allVariants");


  // ================= Quantity Input =================
  const qtyInput =
    type === "prdDataVar"
      ? $(`.quantityInput[data-pid="${id}"]`)
      : $(`#quantityVar${varId}`);

  let qty = parseInt(qtyInput.first().val()) || 0;

  // ================= Stock =================


  const stock = Number(varData?.stock ?? 0);
  qty = Number(qty);

  console.log("qty:", qty);
  console.log("stock:", stock);

  if (qty >= stock) {
    alert("Out of Stock");

    qtyInput.val(stock);

    if (type === "prdDataVar") {
      $(`.plusBtn[data-pid="${id}"]`).addClass("disabled");
    } else {
      $(`#plusVar${varId}`).addClass("disabled");
    }

    return false;
  }

  qty++;

  // ================= Local Cart =================
  if (type === "prdDataVar") {
    if (prdData !== undefined && prdData !== null) {
      updateCartLocal(prdData, varData, varId, qty);
    } else {
      updateCartLocal(allPrdData, varData, varId, qty);
    }
    // updateCartLocal(prdData, varData, varId, qty);
    // console.log("Zeenat......")
    // console.log(prdData, varData, varId, qty)
  } else {
    updateCartLocal(allPrdData, varData, varId, qty);
    console.log("NOT - Zeenat......")

  }

  // ================= Update All Matching Product Cards =================
  if (type === "prdDataVar") {
    $(`.quantityInput[data-pid="${id}"]`).val(qty);
  } else {
    qtyInput.val(qty);
  }

  // ================= API =================
  let productData =
    type === "prdDataVar" ? prdData : allPrdData;
    if(productData !== undefined || productData !== null) {
        productData =allPrdData;
      // console.error("Product data is undefined or null for id:", id);
      // return;
    }


  console.log("ZEENAT -  productData?.p_id : ", productData);
  // alert(productData?.p_id)

  const formData = {
    type: "handleIncrement",
    user_id: userId,
    idfr: idfr,
    p_id: productData?.p_id,
    vid: varId || "",
    branch_id: branchId,
    name: productData?.name,
    image_path: productData?.image_path,
    quantity: varData.v_quantity,
    unit: varData.v_unit,
    nop: qty,
    purchase_price: varData.v_purchase_price,
    selling_price: varData.v_seliing_price,
    mrp: varData.v_mrp,
    isvarient: true,
    product_type: "product",
    status: "true",
  };

  $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "JSON",
    data: formData,
    success: function (response) {

      if (response.status === "success") {

        if (type === "cart") {
          calculationFnc();
        }

      } else {
        console.log(response.message);
      }
    },
  });

}
function handleDecrement(id, varId, type) {
  const branchId = localStorage.getItem("branchId");

  const prdData = products[id];
  const allPrdData = AllProduct[id];

  // ================= Variant Data =================
  let varData;

  if (
    type === "singleVarIdUpdate" ||
    type === "prdVarient" ||
    type === "prdDataVar" ||
    type === "cart"
  ) {
    const allVariants = varientAllData.flat();
    varData = allVariants?.find((item) => item?.vid == varId);
  } else {
    varData = varientData[varId];
  }

  // ================= Quantity =================
  let qty;

  if (type === "prdDataVar") {
    qty = parseInt($(`.quantityInput[data-pid="${id}"]`).first().val()) || 0;
  } else {
    qty = parseInt($(`#quantityVar${varId}`).val()) || 0;
  }

  qty--;

  // ================= Remove =================
  if (qty <= 0) {

    removeCartLocal(id, varId);

    if (type === "singleVarIdUpdate") {

      $("#addCartBtn").html(`
        <button class="Addbutton"
          onclick="toggleAdd('${id}','${varId}','singleVarId')">
          Add to cart
        </button>
      `);

    } else if (type === "prdDataVar") {

      $(`.productAddBtn[data-pid="${id}"]`).html(`
        <button onclick="getSingleVarientId('${id}','prd')">
          Add
        </button>
      `);

    } else {

      $(`#AddVarientBtn${varId}`).html(`
        <button class="Addbutton"
          onclick="toggleAdd('${id}','${varId}','varId')">
          Add to cart
        </button>
      `);

    }

  } else {

    // ================= Local Cart =================
    if (type === "prdDataVar") {

      updateCartLocal(prdData, varData, varId, qty);

      $(`.quantityInput[data-pid="${id}"]`).val(qty);
      $(`.plusBtn[data-pid="${id}"]`).removeClass("disabled");

    } else {

      updateCartLocal(allPrdData, varData, varId, qty);

      $(`#quantityVar${varId}`).val(qty);
      $(`#plusVar${varId}`).removeClass("disabled");

    }

  }

  // ================= API =================
  $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "JSON",
    data: {
      type: "handleDecrement",
      user_id: userId,
      p_id: type === "prdDataVar" ? prdData?.p_id : allPrdData?.p_id,
      varId: varId,
      branch_id: branchId,
      nop: qty,
    },
    success: function (res) {

      console.log(res);

      if (qty <= 0) {
        getCart();
      }

      if (type === "cart") {
        calculationFnc();
      }

    },
  });

}
function getAllHeading(type) {
  let categoryId = localStorage.getItem("currentCategoryId");
  return $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "JSON",
    data: {
      type: "getAllHeading",
      categoryId,
    },
    success: function (response) {
      if (response.status == "success") {
        // console.log(response.data);
        let categoryHead = response.data.categoryHeading[0];
        let productHead = response.data.productHeading[0];


        $("#categoryhead1").html(categoryHead.title1);
        $("#categoryhead2").html(categoryHead.title2);
        $("#categoryhead3").html(categoryHead.title3);
        $("#categoryhead4").html(categoryHead.title4);
        $("#categoryhead5").html(categoryHead.title5);
        if (type === "home") {
          $("#producthead1").html(productHead.title1);
          $("#producthead2").html(productHead.title2);
          $("#producthead3").html(productHead.title3);
          $("#producthead4").html(productHead.title4);
          $("#producthead5").html(productHead.title5);
          $("#producthead6").html(productHead.title6);

        } else if (type == "beauty") {
          $("#categoryTheadBeauty1").text(categoryHead.title1);
          $("#categoryTheadBeauty2").text(categoryHead.title2);
          $("#categoryTheadBeauty3").text(categoryHead.title3);
          $("#categoryTheadBeauty4").text(categoryHead.title4);
          $("#categoryTheadBeauty5").text(categoryHead.title5);
          $("#productheadBeauty1").html(productHead.title1);
          $("#productheadBeauty2").html(productHead.title2);
          $("#productheadBeauty3").html(productHead.title3);
          $("#productheadBeauty4").html(productHead.title4);
          $("#productheadBeauty5").html(productHead.title5);
          $("#productheadBeauty6").html(productHead.title6);
        } else if (type == "fashion") {
          $("#categoryTheadFashion1").text(categoryHead.title1);
          $("#categoryTheadFashion2").text(categoryHead.title2);
          $("#categoryTheadFashion3").text(categoryHead.title3);
          $("#categoryTheadFashion4").text(categoryHead.title4);
          $("#categoryTheadFashion5").text(categoryHead.title5);
          $("#productheadFashion1").html(productHead.title1);
          $("#productheadFashion2").html(productHead.title2);
          $("#productheadFashion3").html(productHead.title3);
          $("#productheadFashion4").html(productHead.title4);
          $("#productheadFashion5").html(productHead.title5);
          $("#productheadFashion6").html(productHead.title6);
        }
        else if (type == "pharmacy") {
          $("#categoryTheadPharmacy1").text(categoryHead.title1);
          $("#categoryTheadPharmacy2").text(categoryHead.title2);
          $("#categoryTheadPharmacy3").text(categoryHead.title3);
          $("#categoryTheadPharmacy4").text(categoryHead.title4);
          $("#categoryTheadPharmacy5").text(categoryHead.title5);
          $("#productheadPharmacy1").html(productHead.title1);
          $("#productheadPharmacy2").html(productHead.title2);
          $("#productheadPharmacy3").html(productHead.title3);
          $("#productheadPharmacy4").html(productHead.title4);
          $("#productheadPharmacy5").html(productHead.title5);
          $("#productheadPharmacy6").html(productHead.title6);
        }
        else if (type == "kids") {
          $("#categoryTheadKids1").text(categoryHead.title1);
          $("#categoryTheadKids2").text(categoryHead.title2);
          $("#categoryTheadKids3").text(categoryHead.title3);
          $("#categoryTheadKids4").text(categoryHead.title4);
          $("#categoryTheadKids5").text(categoryHead.title5);
          $("#productheadKids1").html(productHead.title1);
          $("#productheadKids2").html(productHead.title2);
          $("#productheadKids3").html(productHead.title3);
          $("#productheadKids4").html(productHead.title4);
          $("#productheadKids5").html(productHead.title5);
          $("#productheadKids6").html(productHead.title6);
        } else if (type == "99store") {
          $("#categoryThead99Store1").text(categoryHead.title1);
          $("#categoryThead99Store2").text(categoryHead.title2);
          $("#categoryThead99Store3").text(categoryHead.title3);
          $("#categoryThead99Store4").text(categoryHead.title4);
          $("#categoryThead99Store5").text(categoryHead.title5);
          $("#producthead99store1").html(productHead.title1);
          $("#producthead99store2").html(productHead.title2);
          $("#producthead99store3").html(productHead.title3);
          $("#producthead99store4").html(productHead.title4);
          $("#producthead99store5").html(productHead.title5);
          $("#producthead99store6").html(productHead.title6);
        } else if (type == "electronic") {
          $("#categoryTheadElectronic1").text(categoryHead.title1);
          $("#categoryTheadElectronic2").text(categoryHead.title2);
          $("#categoryTheadElectronic3").text(categoryHead.title3);
          $("#categoryTheadElectronic4").text(categoryHead.title4);
          $("#categoryTheadElectronic5").text(categoryHead.title5);
          $("#productheadElectricity1").html(productHead.title1);
          $("#productheadElectricity2").html(productHead.title2);
          $("#productheadElectricity3").html(productHead.title3);
          $("#productheadElectricity4").html(productHead.title4);
          $("#productheadElectricity5").html(productHead.title5);
          $("#productheadElectricity6").html(productHead.title6);
        }
      } else {
        console.log("something wents wrong on getAllHeading ");
      }
    },
  });
}

function moveIndicator(btn) {
  const indicator = $(".category_indicator");
  const container = $(".category_icons");

  indicator.css({
    width: btn.outerWidth() * 0.9,
    left:
      btn.position().left + container.scrollLeft() + btn.outerWidth() * 0.10,
  });
}

function getSingleProduct() {
  const params = new URLSearchParams(window.location.search);
  let branchId = localStorage.getItem("branchId");

  const id = params.get("id");

  return $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "JSON",
    data: {
      type: "getSingleProduct",
      id,
      branchId
    },
    success: function (response) {
      if (response.status == "success") {
        console.log(response.images);
        let product = response.product;
        let variants = response.variants;
        let images = response.images;

        $("#prdTxt").html(product.name);

        const Desc = JSON.parse(JSON.parse(product.information));
        if (Desc?.[0]?.idescription) {
          $("#descTxt").html(Desc[0].idescription);
        }
        // alert(Desc[0].idescription)
        getRelatedProduct(
          id,
          product.under_category,
          product.under_subcategory,
        );
        console.log(product)

        if (variants.length > 0) {
          $("#footerPrice").html("₹" + variants[0].v_seliing_price);
          $("#footerQty").html(variants[0].v_quantity + variants[0].v_unit);
          $("#footerMrp").html("₹" + variants[0].v_mrp);
          $("#addCartBtn").html(`<button class="Addbutton" 
             onclick="toggleAdd('${product.p_id}','${variants[0].vid}','singleVarId')">Add to cart</button>`);
        }
        // else {
        //   const mrp = Number(product.mrp);
        //   const sellingPrice = Number(product.selling_price);

        //   const discount = Math.round(((mrp - sellingPrice) / mrp) * 100);
        //   $("#prdDisc").html(discount + "% OFF");
        //   $("#footerPrice").html("₹" + sellingPrice);
        //   $("#footerQty").html(product.quantity + product.unit);
        //   $("#footerMrp").html("₹" + mrp);
        //   $("#prdQty").html(product.quantity + product.unit);
        //   $("#prdMrp").html("₹" + product.mrp);
        //   $("#prdSelling").html("₹" + product.selling_price);
        //   $("#addCartBtn").html(`<button class="Addbutton"
        //      onclick="toggleAdd('${product.p_id}','','singlePrd')">Add to cart</button>`);
        // }
        let varientHtml = "";

        if (variants.length > 0) {
          variants.map((item, index) => {
            if ($("#prdDisc").text() === "") {
              let disc = Math.round(
                ((item.v_mrp - item.v_seliing_price) / item.v_mrp) * 100,
              );
              $("#prdDisc").html(disc + "% OFF");
            }

            varientHtml += `<div id="selectVar${item.vid}" class="select_varient_box ${index == 0 && "active_varient"}" 
          onclick="varientToggle('${product.p_id}','${item.vid}','${item.v_quantity + item.v_unit}','${item.v_seliing_price}','${item.v_mrp}','${item.v_stock}')">
              <div class="top_select">${Math.round(((item.v_mrp - item.v_seliing_price) / item.v_mrp) * 100)}% OFF</div>
              <div class="bottom_select">
                <h4>${item.v_quantity + item.v_unit}</h4>
                <div class="bottom_tab">
                  <h5 id="varientSelling">₹${item.v_seliing_price}</h5>
                  <p>MRP <del>₹${item.v_mrp}</del></p>
                </div>
              </div>
            </div>`;
          });
          $(".product_select_wrap").css("display", "block");
        } else {
          $(".product_select_wrap").css("display", "none");
        }
        $("#varientData1").html(varientHtml);

        let imageHtml = "";
        images.map((item) => {
          imageHtml += `
            <div class="item">
                <img src="${imgUrl + item?.image_path}" alt="">
            </div>`;
        });

        $("#productDetailCrousel").html(imageHtml);

        $(document).ready(function () {
          $(".owl-carousel4").owlCarousel({
            loop: true,
            margin: 10,
            nav: false,
            dots: true,
            autoplay: true,

            responsive: {
              0: {
                items: 1, // mobile (0px se start)
              },
              480: {
                items: 2, // small phones
              },
              768: {
                items: 3, // tablets
              },
              1024: {
                items: 4, // desktop
              },
            },
          });
        });

        updateCartUI("singleVarId", variants?.[0]?.vid);
      } else {
        console.log(response.message);
      }
    },
  });
}

function getRelatedProduct(pid, cid, sid) {
  let branchId = localStorage.getItem("branchId");
  $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "JSON",
    data: {
      type: "getRelatedPrd",
      sid,
      cid,
      branchId
    },
    success: function (response) {
      if (response.status == "success") {
        console.log(response.data);

        let relatedHtml = "";
        let relatedData = response.data.filter((item) => item.p_id !== pid);

        relatedData.forEach((item, index) => {

          relatedHtml += `
          <div class="product_design_item_wrap">

            <div class="product_top_wrap">

           ${item?.stock > 0 ?
              (` <div class="product_img" onclick="location.href='productDetail.html?id=${item.p_id}'">
            <img src="${imgUrl + item.image_path}" alt="">
          </div>`)
              :
              (` <div class="product_img outStock" onclick="location.href='#'">
          <div class='outOfStock'><p>Out Of Stock</p></div>
            <img src="${imgUrl + item.image_path}" alt="">
          </div>`)}

              <div class="like ${index == 0 || index == 3 || index == 4 ? "like_active" : ""
            }">
                <i class="ti ti-heart-filled"></i>
              </div>

              <div class="${item?.stock > 0 ? 'show ' : 'hide'}">
              
              ${item.varient_count <= 1
              ? `
                    <div
                      class="AddWrp productAddBtn"
                      id="AddBtnToggle${item.p_id}"
                      data-pid="${item.p_id}"
                    >
                      <button
                        onclick="getSingleVarientId('${item.p_id}','prd','${item.image_path}','${item.name}')">
                        Add
                      </button>
                    </div>
                  `
              : `
                    <div
                      type="button"
                      data-bs-toggle="offcanvas"
                      data-bs-target="#offcanvasVarient"
                      aria-controls="offcanvasVarient"
                      class="cart_tag_Add varient"
                      onclick="getSingleVarientId('${item.p_id}','','${item.image_path}','${item.name}')">

                      Add

                      <div class="varient_btn">
                        ${item.varient_count} option
                      </div>

                    </div>
                  `
            }
                          </div>


            </div>

            <div class="product_txt">

              <h5>${item.name}</h5>

              <div class="rating_wrap">

                <div class="stars">
                  <i class="ti ti-star-filled"></i>
                  <i class="ti ti-star-filled"></i>
                  <i class="ti ti-star-filled"></i>
                  <i class="ti ti-star-filled"></i>
                  <i class="ti ti-star-filled"></i>
                </div>

                <div class="rate">
                  (${item.review_val})
                </div>

              </div>

              <div class="qty_price_sec">

                <h4>${item.v_quantity}${item.v_unit}</h4>

                <div class="price_sec">
                  <h6>₹${item.v_seliing_price}</h6>
                  <del>₹${item.v_mrp}</del>
                </div>

              </div>

            </div>

          </div>`;
        });

        $("#productRelatedData").html(relatedHtml);

        updateCartUI("prd");

      } else {
        console.log(response.message);
      }
    },
  });
}

function varientToggle(id, varId, qty, selling, mrp, stock) {
  $(".select_varient_box").removeClass("active_varient");
  $(`#selectVar${varId}`).addClass("active_varient");
  $("#addCartBtn").html(`<button class="Addbutton" 
             onclick="toggleAdd('${id}','${varId}','singleVarId','${stock}')">Add to cart</button>`);
  updateCartUI("singleVarId", varId);
  $("#footerQty").html(qty);
  $("#footerPrice").html("₹" + selling);
  $("#footerMrp").html("₹" + mrp);
}

function updateCartLocal(product, varData, varientId, qty) {
  let branchId = localStorage.getItem("branchId");
  console.log(product);
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  console.log(cart);
  const existingIndex = varientId
    ? cart.findIndex(
      (item) => item?.p_id == product?.p_id && item?.varientId == varientId && item?.branchId == branchId,
    )
    : cart.findIndex((item) => item?.p_id == product?.p_id && item?.branchId == branchId);
  if (existingIndex > -1) {
    cart[existingIndex].nop = qty;
  } else {
    cart.push({
      ...product,
      ...varData,
      branchId,
      nop: qty,
      varientId,
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  const branchCart = cart.filter(
    (item) => item.branchId == branchId
  );

  // Popup
  if (branchCart.length > 0) {
    $("#cartPopup").show();
    $("#cartQty").html(branchCart.length);
  } else {
    $("#cartPopup").hide();
    $("#cartQty").html(0);
  }
}


function removeCartLocal(productId, varId) {
  let branchId = localStorage.getItem("branchId");

  console.log(productId, varId);
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (!varId) {
    cart = cart.filter((item) => item.p_id != productId && item?.branchId == branchId);
  } else {
    cart = cart.filter(
      (item) => !(item.p_id == productId && item.varientId == varId && item?.branchId == branchId),
    );
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  const branchCart = cart.filter(
    (item) => item.branchId == branchId
  );

  $("#cartQty").html(branchCart.length);

  if (branchCart.length === 0) {
    $("#cartPopup").hide();
  } else {
    $("#cartPopup").show();
  }

}



let allProducts = [];
let allSubCategories = [];
let filterdProduct = [];





function renderFilterProduct(prd, category) {
  const params = new URLSearchParams(window.location.search);

  const cid = params.get("cid");
  const sid = localStorage.getItem("subCatId");
  let mid = localStorage.getItem("middleCatId");
  let productHtml = "";
  if (prd.length > 0) {
    prd?.map((item, index) => {
      products[item.p_id] = item;

      productHtml += `  <div class="product_design_item_wrap">

        <div class="product_top_wrap">

          ${item?.stock > 0 ?
          (` <div class="product_img" onclick="location.href='productDetail.html?id=${item.p_id}'">
            <img src="${imgUrl + item.image_path}" alt="">
          </div>`)
          :
          (` <div class="product_img outStock" onclick="location.href='#'">
          <div class='outOfStock'><p>Out Of Stock</p></div>
            <img src="${imgUrl + item.image_path}" alt="">
          </div>`)}

          <div class="like ${index == 0 || index == 3 || index == 4 ? "like_active" : ""
        }">
            <i class="ti ti-heart-filled"></i>
          </div>
          <div class="${item?.stock > 0 ? 'show ' : 'hide'}">
          ${item.varient_count <= 1
          ? `
      <div
        class="AddWrp productAddBtn"
        id="AddBtnToggle${item.p_id}"
        data-pid="${item.p_id}"
      >
        <button
          onclick="getSingleVarientId('${item.p_id}','prd','${item.image_path}','${item.name}')"
        >
          Add
        </button>
      </div>
    `
          : `
      <div
        type="button"
        data-bs-toggle="offcanvas"
        data-bs-target="#offcanvasVarient"
        aria-controls="offcanvasVarient"
        class="cart_tag_Add varient"
        onclick="getSingleVarientId('${item.p_id}','','${item.image_path}','${item.name}')">

        Add

        <div class="varient_btn">
          ${item.varient_count} option
        </div>

      </div>
    `
        }
          </div>


        </div>

        <div class="product_txt">

          <h5>${item.name}</h5>

          <div class="rating_wrap">

            <div class="stars">
              <i class="ti ti-star-filled"></i>
              <i class="ti ti-star-filled"></i>
              <i class="ti ti-star-filled"></i>
              <i class="ti ti-star-filled"></i>
              <i class="ti ti-star-filled"></i>
            </div>

            <div class="rate">
              (${item.review_val})
            </div>

          </div>

          <div class="qty_price_sec">

            <h4>${item.v_quantity}${item.v_unit}</h4>

            <div class="price_sec">
              <h6>₹${item.v_seliing_price}</h6>
              <del>₹${item.v_mrp}</del>
            </div>

          </div>

        </div>

      </div>`;
    });
  } else {
    productHtml += `<div class="not_found"> <img src="https://myntra-umber.vercel.app/assets/sad-Csmh6fkm.gif" /> <h6>No Data Found !</h6></div>`;
  }

  $("#subCategoryProductData").html(productHtml);

  updateCartUI("prd");

  let subCatHtml = `<div 
        onclick="handleData('0','all')" class="wrap_sub_cat allCat ${sid === "0" ? "active_category" : ""}" id="allPrdData"> 
            <div class="sub_category_box">
              <i class="ti ti-box"></i>
              <h6>All</h6>
            </div>
            <div class="brd"></div>
          </div>`;
  category?.map((item, index) => {
    subCatHtml += `   <div onclick="handleData('${item.id}','filter')" class="wrap_sub_cat ${sid == item.id ? "active_category" : ""}">
            <div class="sub_category_box">
              <img
                src="${imgUrl + item.image_path}"
                alt=""
              />
              <h6>${item.name}</h6>
            </div>
            <div class="brd"></div>
          </div>`;
  });

  $("#subCategory").html(subCatHtml);
}

function handleData(id, type) {
  localStorage.setItem("subCatId", id);

  if (type == "filter") {
    filterdProduct = allProducts.filter((item) => {
      console.log(item.under_subcategory, id, "item.under_subcategory, id");
      return item.under_subcategory === id;
    });
  } else {
    filterdProduct = allProducts;
  }
  renderFilterProduct(filterdProduct, allSubCategories);
}

function getSingleCategory() {
  const params = new URLSearchParams(window.location.search);

  const cid = params.get("cid");
  let mid = localStorage.getItem("middleCatId");
  let sid = localStorage.getItem("subCatId");
  let branchId = localStorage.getItem("branchId");

  return $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "JSON",
    data: {
      type: "getSingleCategory",
      cid,
      mid,
      branchId
    },
    success: function (response) {
      if (response.status == "success") {
        console.log(response.data);
        console.log(response.subCategory);
        allProducts = response.data;
        allSubCategories = response.subCategory;
        localStorage.setItem("subCatId", sid);
        $("#categoryName").html(response?.middleCategoryName[0]?.name);
        $("#productCount").html(response.data?.length)
        // renderFilterProduct(allProducts,allSubCategories)
        if (sid == "0") {
          handleData(sid, "");
        } else {
          handleData(sid, "filter");
        }

      } else {
        let productHtml = '';
        productHtml += `<div class="not_found"> <img src="https://myntra-umber.vercel.app/assets/sad-Csmh6fkm.gif" /> <h6>No Data Found !</h6></div>`;

        $("#subCategoryProductData").html(productHtml)
        // alert("nhi.....")
        console.log(response.message);
      }

    },
  });
}

function handleFilterSubCategory() {
  const params = new URLSearchParams(window.location.search);
  const sid = params.get("sid");
}

$(document).on("click", ".category_btn", function () {
  $(".category_btn").removeClass("active");
  $(this).addClass("active");

  moveIndicator($(this));
  const category = $(this).data("category");

  const categoryId = $(this).data("categoryId");


  localStorage.setItem("currentCategoryName", category);
  localStorage.setItem("currentCategoryId", categoryId);

  renderCategory(category);
});

function getCart() {
  let branchId = localStorage.getItem("branchId");
  return $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "JSON",
    data: {
      type: "getCart",
      userId,
      branchId
    },
    success: function (response) {
      if (response.status == "success") {
        // console.log(response.data);

        let cartData = response.data;
        calculationFnc();

        let cartDataHtml = "";
        cartData.map((item) => {
          cartDataHtml += `<div class="cart_data_items">
              <div class="cart_data_item_left">
                <div class="cart_item_img">
                  <img src="${imgUrl + item.image_path}" alt="" />
                </div>
                <div class="cart_item_txt">
                  <h4>
                    ${item.name}
                  </h4>
                  <small>${item.quantity}${item.unit}</small>
                  <span>
                    <p>₹${item.selling_price}</p>
                    <del>₹${item.mrp}</del>
                  </span>
                </div>
              </div>
              ${!item.vid
              ? `<div class="cart_data_item_btn">
                    <button
                      id="minus${item.p_id}"
                      onclick="handleDecrement('${item.p_id}','','cart')">
                      -
                    </button>
                    <input
                      type="number"
                      id="quantity${item.p_id}"
                      value="${item.nop}"
                      readonly
                    />

                    <button
                      id="plus${item.p_id}"
                      onclick="handleIncrement('${item.p_id}','','cart')">
                      +
                    </button>

                  </div>`
              : ` <div class="cart_data_item_btn">
                  <button  id="minusVar${item.vid}"
                  onclick="handleDecrement('${item.p_id}','${item.vid}','cart')">-</button>
                  <input type="number"  id="quantityVar${item.vid}"
                  value="${item.nop}"
                  readonly />
                  <button  id="plusVar${item.vid}"
                  onclick="handleIncrement('${item.p_id}','${item.vid}','cart')">+</button>
                </div> `
            }</div>
             `;
        });

        $("#cartData").html(cartDataHtml);
      } else {
        console.log(response.message);
        $("#cartData").html("");
        $("#cartWrap").html(
          `<div class="not_found"><img src="../assets/img/icon/notFound.gif" alt=""/>Nothing is in cart <button onclick="location.href='home.html'">Keep Browsering</button></div>`,
        );
      }
    },
  });
}

let couponsData = [];

// ======================
// GET COUPONS
// ======================
function getCoupons() {
  return $.ajax({
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

function expiredCoupon() {
  return $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "JSON",
    data: {
      type: "usedCoupons",
    },
    success: function (response) {
      if (response.status !== "success") return;

      let coupons = response.data;
      let html = "";
      coupons.forEach((coupon) => {
        html += `
        <div class="coupon-card">
            <img src="../assets/img/icon/couponsBox.svg" alt="coupon bg" class="coupon-bg">

            <div class="coupon-header">
                <h3>${coupon.code}</h3>
                <div>Valid Until ${coupon.end_date.split(" ")[0]}</div>
            </div>

            <div class="coupon-body">
                <div class="coupon-info">
                    <div class="coupon-title">
                        <i class="bi bi-gift-fill"></i>
                        <h4>₹${coupon.amount} OFF</h4>
                    </div>
                    <p>Min Order ₹${coupon.minimum_purchase}</p>
                </div>

                <button
                    class="coupon_btn apply-btn disabled"
                    id="${coupon.code}"
                    onclick="applyCoupon('${coupon.code}')"
                >
                    Expired
                </button>
            </div>
        </div>
        `;
      });
      $("#couponsData2").html(html);
    },
    error: function (xhr, status, error) {
      console.log(error);
    },
  });
}

// ======================
// RENDER COUPONS
// ======================
function renderCoupons(coupons) {
  let html = "";

  coupons.forEach((coupon) => {
    html += `
<div class="coupon-card">
    <img src="../assets/img/icon/couponsBox.svg" alt="coupon bg" class="coupon-bg">

    <div class="coupon-header">
        <h3>${coupon.code}</h3>
        <div>Valid Until ${coupon.end_date.split(" ")[0]}</div>
    </div>

    <div class="coupon-body">
        <div class="coupon-info">
            <div class="coupon-title">
                <i class="bi bi-gift-fill"></i>
                <h4>₹${coupon.amount} OFF</h4>
            </div>
            <p>Min Order ₹${coupon.minimum_purchase}</p>
        </div>

        <button
            class="coupon_btn apply-btn "
            id="${coupon.code}"
            onclick="applyCoupon('${coupon.code}')"
        >
            Apply
        </button>
    </div>
</div>
`;
  });
  $("#couponsData1").html(html);
}

// ======================
// APPLY COUPON
// ======================
function applyCoupon(code) {
  $(".apply-btn").text("Apply");
  $(".apply-btn").removeClass("disabled");

  localStorage.setItem("couponCode", code);
  const coupon = couponsData.find((item) => item.code === code);
  $("#couponId").val(coupon.id);

  $("#couponDiscount").html(`-₹${coupon.amount}`);
  calculationFnc();

  if (!coupon) {
    alert("Coupon not found");
    return;
  }

  // console.log(coupon.amount)



  $(`#${code}`).text("Applied");
  $(`#${code}`).addClass("disabled");
  event.target.classList.add("active");
  bootstrap.Offcanvas.getOrCreateInstance(
    $("#offcanvasBottomCoupons")[0],
  ).hide();
}
async function updateCoupon() {
  let code = localStorage.getItem("couponCode");
  const coupon = couponsData.find((item) => item.code === code);
  let limit = Number(coupon.limit);
  limit--;
  if (!coupon) {
    alert("Coupon not found");
    return;
  }

  $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "JSON",
    data: {
      type: "updateCoupon",
      id: coupon.id,
      limit,
    },
    success: function (response) {
      if (response.status == "success") {
      } else {
        console.log(response.message);
      }
    },
  });


}

async function calculationFnc() {
  let branchId = localStorage.getItem("branchId");
  let cart = JSON.parse(localStorage.getItem("cart"));
  let other = JSON.parse(localStorage.getItem("other"));
  let totalMrp = 0;
  let totalSellingPrice = 0;
  let totalItems = 0;
  let handlingCharge = 0;
  let couponDisc =
    parseFloat(
      $("#couponDiscount")
        .text()
        .replace(/[^\d.]/g, ""),
    ) || 0;
  let deliveryCharge = 0;



  const branchCart = cart.filter((item) => item?.branchId == branchId);
  branchCart.map((item) => {
    const qty = Number(item.nop);
    const mrp = Number(item.v_mrp);
    const sellingPrice = Number(item.v_seliing_price);

    totalMrp += mrp * qty;
    totalSellingPrice += sellingPrice * qty;
    totalItems += qty;
  });
  if (other && other?.length > 0) {
    other.map((item) => {
      if (item.type == "handling_charge") {
        handlingCharge = Number(item.min_amount);
      }
    });
  }
  let totalDiscount = totalMrp - totalSellingPrice;
  deliveryCharge = await getCurrentDeliveryBranch(totalSellingPrice);
  // console.log("data");
  // console.log(data);
  // console.log("data");
  let totalAmt =
    totalSellingPrice + handlingCharge + deliveryCharge - couponDisc;
  console.log("couponDisc");
  console.log(couponDisc);

  $("#totalAmount").text(`₹${totalAmt}`);
  $("#grandTotal").text(`₹${totalAmt}`);
  $("#handlingCharge").text(`₹${handlingCharge}`);
  $("#totalMrp").text(`₹${totalMrp}`);
  $("#productDiscount").text(`-₹${totalDiscount}`);
  $("#savedAmt").text(`-₹${totalDiscount}`);
  $("#subTotal").text(`₹${totalSellingPrice}`);
  $("#deliveryCharge").text(`₹${deliveryCharge}`)
}
async function getCurrentDeliveryBranch(totalSellingPrice) {
  let branchId = localStorage.getItem("branchId");

  const response = await $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "JSON",
    data: {
      type: "getCurrentDeliveryBranch",
      branchId: branchId,
      totalSellingPrice
    }
  });

  if (response.status === "success") {
    return Number(response?.data?.[0]?.amount) || 0;
  }

  console.log(response.message);
  return [];
}

function getAllOtherDetail() {
  return $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "JSON",
    data: {
      type: "getAllOtherDetail",
    },
    success: function (response) {
      if (response.status == "success") {
        // console.log(response.data);
        localStorage.setItem("other", JSON.stringify(response.data));
      } else {
        console.log(response.message);
      }
    },
  });
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

  // Clear Form
  $("#addressId").val("");
  $("#houseNo").val("");
  $("#floor").val("");
  $("#area").val("");
  $("#city").val("");
  $("#state").val("");
  $("#pincode").val("");
  $("#name").val("");
  $("#number").val("");
  $("#selectedRole").val("");

  $("#offcanvasBottomAddressLabel").text("Add Address");
}

function handleAddress(e) {
  e.preventDefault();
  console.log($("#selectedRole").val());

  let latitude;
  let longitude;
  let formData = new FormData();

  formData.append("type", "handleAddress");
  formData.append("userId", userId);

  // Address Details
  formData.append("houseNo", $("#houseNo").val().trim());
  formData.append("floor", $("#floor").val().trim());
  formData.append("area", $("#area").val().trim());
  formData.append("city", $("#city").val().trim());
  formData.append("state", $("#state").val().trim());
  formData.append("pincode", $("#pincode").val().trim());

  // Receiver Details
  formData.append("name", $("#name").val().trim());
  formData.append("number", $("#number").val().trim());

  // Home / Work / Other
  formData.append("addressType", $("#selectedRole").val());

  // Location
  formData.append("latitude", latitude || "");
  formData.append("longitude", longitude || "");

  $.ajax({
    url: apiUrl,
    method: "POST",
    data: formData,
    processData: false,
    contentType: false,
    dataType: "JSON",

    success: function (response) {
      if (response.status === "success") {
        console.log(response.message);

        // Reset Form
        $("#addressId").val("");
        $("#houseNo").val("");
        $("#floor").val("");
        $("#area").val("");
        $("#city").val("");
        $("#state").val("");
        $("#pincode").val("");
        $("#name").val("");
        $("#number").val("");
        $("#selectedRole").val("");
const canvas1 = document.getElementById('offcanvasBottomAddAddress');

bootstrap.Offcanvas.getOrCreateInstance(canvas1).hide();
        $("#offcanvasBottomAddressLabel").text("Add Address");
 const canvas2 = document.getElementById('offcanvasBottomAddress');
    bootstrap.Offcanvas.getOrCreateInstance(canvas2).show();
        getAddress();
      } else {
        console.log(response.message);
      }
    },

    error: function (xhr, status, err) {
      console.log(xhr.responseText);
      alert("AJAX Error: " + err);
    },
  });
}
function getAddress() {
  return $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "JSON",
    data: {
      type: "getAddress",
      userId,
    },
    success: function (response) {
      if (response.status == "success") {

        console.log(response.data);

        let addressHtml = "";
        let addressId = localStorage.getItem("addressId");
        if (response.data.length > 0 && addressId) {
          // alert("hulluu...")
          getExistingData(response.data);
          $("#addressId").val(addressId);


        }
        response.data.forEach((item, index) => {
          console.log(item.type)
          addressHtml += `
   <div class="saved_address_data">

      <div class="selected_box">Selected</div>

      <div class="saved_address_item">

        <div
            class="saved_address_left"
            onclick="selectAddress(
                this,
                '${item.id}',
                '${item.o_username}',
                '${item.o_mobile}',
                '${item.street}',
                '${item.area}',
                '${item.pin_code}',
                '${item?.type || "Home"}',
                '${item.o_floor}'
            )"
        >

            <div class="saved_icon">
                <i class="ti ti-home"></i>
            </div>

            <div class="saved_txt">

                <h5>${item.o_username}</h5>

                <p>
                    ${item.street}
                    ${item.o_floor ? `, Floor: ${item.o_floor}` : ""},
                    ${item.area},
                    ${item.city},
                    ${item.state} - ${item.pin_code}
                </p>

                <div class="phone">
                    <i class="ti ti-phone-call"></i>
                    <p>+91-<b>${item.o_mobile}</b></p>
                </div>

            </div>

        </div>

        <div class="saved_address_right">

            <button
                data-bs-toggle="offcanvas"
                data-bs-target="#offcanvasBottomAddAddress"
                aria-controls="offcanvasBottomAddAddress"
                class="address_action edit_btn"
                onclick='editAddress(${JSON.stringify(item)})'
            >
                <i class="ti ti-edit"></i>
            </button>

            <button
                class="address_action delete_btn"
                onclick="deleteAddress('${item.id}')"
            >
                <i class="ti ti-trash-filled"></i>
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
  street,
  area,
  pin_code,
  address_type,
  city,
  state,
  floor,
) {
  $("#addressId").val(id);
  localStorage.setItem("addressId", id);
  $("#selectedRole").val(address_type);
  $(".saved_address_data").removeClass("selected_address");
  $(element).closest(".saved_address_data").addClass("selected_address");
  const addressCanvas = document.getElementById('offcanvasBottomAddress');

const offcanvas = bootstrap.Offcanvas.getInstance(addressCanvas);

if (offcanvas) {
    offcanvas.hide();
}
  if (window.location.pathname.endsWith("home.html")) {
    getCurrentAddress();
  }



  $("#selectedAddress").html(`
      <h4>
        Delivering to
        <b>${address_type || "Home"}</b>
      </h4>

      <p>
        ${name},
        ${street}
        ${floor ? `, Floor: ${floor}` : ""},
        ${area},
        ${city},
        (${pin_code})
        Ph: ${phone}
      </p>
  `);
}

function getExistingData(data) {
  let AddressId = localStorage.getItem("addressId");
  let addressHolder = data.filter((item) => item.id == AddressId);


  console.log(addressHolder);
  let address = addressHolder[0];

  $("#selectedRole").val(address?.type);
  $("#selectedAddress").html(`
  <h4>
    Delivering to
    <b>${address?.type || "Home"}</b>
  </h4>

  <p>
    ${address?.o_username || ""},
    ${address?.street || ""}
    ${address?.o_floor ? `, Floor: ${address.o_floor}` : ""},
    ${address?.area || ""},
    ${address?.city || ""},
    (${address?.pin_code || ""})
    Ph: ${address?.o_mobile || ""}
  </p>
`);
}

function editAddress(data) {
  $("#addressId").val(data.id);

  $("#houseNo").val(data.street);
  $("#floor").val(data.o_floor);
  $("#area").val(data.area);

  $("#city").val(data.city);
  $("#state").val(data.state);
  $("#pincode").val(data.pin_code);

  $("#name").val(data.o_username);
  $("#number").val(data.o_mobile);

  // Hidden input
  $("#selectedRole").val(data.type);

  // Toggle Active Role
  $(".form_icon").removeClass("role_active");

  $(`.form_icon[data-role="${data.type}"]`).addClass("role_active");

  $("#btnToggleAddress").html(`
    <button type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasBottomAddress" aria-controls="offcanvasBottomAddress" onclick="updateAddress(event)">
      Update Address
    </button>
  `);

  $("#offcanvasBottomAddressLabel").text("Update Address");
}
$('#offcanvasBottomAddAddress').on('hidden.bs.offcanvas', function () {
  $(this).find('.form_input').val('');
  $("#offcanvasBottomAddressLabel").text("Add Address");

  // alert();
});

function updateAddress(e) {
  e.preventDefault();
  let latitude;
  let longitude;

  let formData = new FormData();

  formData.append("type", "updateAddress");
  formData.append("addressId", $("#addressId").val());
  formData.append("userId", userId);

  // Address
  formData.append("houseNo", $("#houseNo").val().trim());
  formData.append("floor", $("#floor").val().trim());
  formData.append("area", $("#area").val().trim());
  formData.append("city", $("#city").val().trim());
  formData.append("state", $("#state").val().trim());
  formData.append("pincode", $("#pincode").val().trim());

  // Receiver
  formData.append("name", $("#name").val().trim());
  formData.append("number", $("#number").val().trim());

  // Address Type
  formData.append("addressType", $("#selectedRole").val() || "Home");

  // Location
  formData.append("latitude", latitude || "");
  formData.append("longitude", longitude || "");

  $.ajax({
    url: apiUrl,
    method: "POST",
    data: formData,
    processData: false,
    contentType: false,
    dataType: "JSON",

    success: function (response) {
      if (response.status === "success") {
        // console.log(response.message);

        getAddress();

        // Reset Form
        $("#addressId").val("");
        $("#houseNo").val("");
        $("#floor").val("");
        $("#area").val("");
        $("#city").val("");
        $("#state").val("");
        $("#pincode").val("");
        $("#name").val("");
        $("#number").val("");
        $("#selectedRole").val("");

        $("#btnToggleAddress").html(`
          <button type="button" onclick="handleAddress(event)">
            Add Address
          </button>
        `);

        $("#offcanvasBottomAddressLabel").text("Add Address");
      } else {
        console.log(response.message);
      }
    },

    error: function (xhr, status, error) {
      console.log(xhr.responseText);
    },
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
      userId: userId,
    },

    success: function (response) {
      if (response.status === "success") {
        console.log(response.message);
        getAddress();
      } else {
        console.log(response.message);
      }
    },

    error: function (xhr) {
      console.log(xhr.responseText);
    },
  });
}

$(".slot_option").on("click", function () {
  $(".slot_option").removeClass("selected_option");

  $(this).addClass("selected_option");

  let slotData = $(this).find(".left_slot_box h5").text();
  $("#slotTime").html(slotData);
  $("#slot").val(slotData);
});

$(".payment_option").on("click", function () {
  $(".payment_option").removeClass("selected_option");

  $(this).addClass("selected_option");

  let payMethod = $(this).find(".left_pay_box h5").text();
  $("#payMethod1").val(payMethod);
  $("#payMethod2").html(payMethod);
});

function openOffcanvas(id) {
  const offcanvas = new bootstrap.Offcanvas(document.getElementById(id));
  offcanvas.show();
}

function handleOrder() {
  const branchId = localStorage.getItem("branchId");
  let currentSession = JSON.parse(localStorage.getItem("currentSession"));
  let cart = JSON.parse(localStorage.getItem("cart"));
  const updatedBranchData = cart.filter((item) => item.branchId !== branchId)
  let idfr = currentSession[branchId];
  //userId
  let selectedPayment = $("#payMethod1").val();
  let selectedSlot = $("#slot").val();
  let selectedAddress = $("#addressId").val();
  let couponId = $("#couponId").val();
  let addressType = $("#selectedRole").val();
  // alert(addressType);
  let totalAmount = parseFloat(
    $("#totalAmount")
      .text()
      .replace(/[^\d.]/g, ""),
  );

  if (!selectedAddress) {
    openOffcanvas("offcanvasBottomAddress");
    return false;
  } else if (!selectedSlot) {
    openOffcanvas("offcanvasBottomDeliverySlot");
    return false;
  } else if (!selectedPayment) {
    openOffcanvas("offcanvasBottomPay");
    return false;
  }

  let couponDisc =
    parseFloat(
      $("#couponDiscount")
        .text()
        .replace(/[^\d.]/g, ""),
    ) || 0;
  let handlingCharge =
    parseFloat(
      $("#handlingCharge")
        .text()
        .replace(/[^\d.]/g, ""),
    ) || 0;
  let deliveryCharge =
    parseFloat(
      $("#deliveryCharge")
        .text()
        .replace(/[^\d.]/g, ""),
    ) || 0; let subTotal =
      parseFloat(
        $("#subTotal")
          .text()
          .replace(/[^\d.]/g, ""),
      ) || 0;


  let formData = new FormData();

  formData.append("type", "handleOrder");
  formData.append("idfr", idfr);
  formData.append("branchId", branchId);
  formData.append("deliveryCharge", deliveryCharge);
  formData.append("subTotal", subTotal);
  formData.append("user_id", userId);
  formData.append("payMethod", selectedPayment);
  formData.append("selectAddress", selectedAddress);
  formData.append("orderType", addressType);
  formData.append("selectedSlot", selectedSlot);
  formData.append("couponId", couponId);
  formData.append("totalAmount", totalAmount);
  formData.append("couponAmt", couponDisc);
  formData.append("handlingCharge", handlingCharge);

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
        localStorage.setItem("cart", JSON.stringify(updatedBranchData));
        location.replace("orders.html");
        removeCurrentBranchSession();
        updateCoupon();
        localStorage.removeItem("couponCode");
      } else {
        console.log(response.message);
      }
    },
  });
}
function removeCurrentBranchSession() {

  const branchId = localStorage.getItem("branchId");

  let currentSession =
    JSON.parse(localStorage.getItem("currentSession")) || {};

  delete currentSession[branchId];

  localStorage.setItem(
    "currentSession",
    JSON.stringify(currentSession)
  );
}

function getOrder() {
  return $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "JSON",
    data: {
      type: "getOrder",
      userId,
    },
    success: function (response) {
      if (response.status == "success") {
        console.log(response.data);
        let orderData = response.data;
        let orderHtml = "";
        orderData.map((item) => {
          orderHtml += ` <div class="order_data" onclick="location.href='orderDetail.html?orderId=${item.idfr}'">
                <div class="order_left">
                  <div class="order_left_img order_img_wrap">
                  <img src="../assets/img/icon/order_line.png" alt="crt">
                  </div>
                  <div class="order_middle_txt">
                    <h5>ORD${item.idfr}</h5>
                    <p><b>${item.status}</b></p>
                    <p>Placed on : <b>${item.dor}</b></p>
                  </div>
                </div>
                <div class="order_right">
                  <i class="ti ti-chevron-right"></i>
                </div>
              </div>`;
        });

        $("#orderData").html(orderHtml);
      } else {
        console.log(response.message);
      }
    },
  });
}
function getSingleOrder() {
  const params = new URLSearchParams(window.location.search);

  const id = params.get("orderId");
  $("#invoice").html(`<div class="invoice" onclick="location.href='invoice.html?orderId=${id}'">
              <button><i class="ti ti-eye"></i> See invoice</button>
          </div>`)

  $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "JSON",
    data: {
      type: "getSingleOrder",
      idfr: id,
    },
    success: function (response) {
      if (response.status == "success") {
        console.log(response.data);
        let calculation = response.data;
        let orderData = response.singleOrder;

        let orderHtml = "";
        orderData.map((item) => {
          orderHtml += `  <div
            class="order_data"
          >
            <div class="order_left">
              <div class="order_left_img">
                <img src="${imgUrl + item.image_path}" alt="${item.name}" />
              </div>
              <div class="order_middle_txt">
                <small>#ORD${item.idfr}</small>
                <h5>${item.name}</h5>
                <div class="order_price_flex">
                <p>Price: <b>₹${item.selling_price}</b></p>
                <p>✕</p>
                  <p>Qty : <b>${item.nop}</b></p>
                  <p>=</p>
                  <p> Total : <b>₹${item.nop * item.selling_price}</b></p>
                </div>
              </div>
            </div>
          </div>`;
        });

        $("#singleOrder").html(orderHtml);

        let calculationHtml = "";
        calculationHtml += `
        <div class="bill_field">
                  <div class="left_bill_field">
                    <i class="ti ti-shopping-cart"></i>
                    <p>Subtotal</p>
                  </div>
                  <div class="right_bill_field">
                    <small id="subTotal">₹${calculation?.sub_total}</small>
                  </div>
                </div>
                
                <div class="bill_field green">
                  <div class="left_bill_field">
                    <img src="../assets/img/icon/coupons2.svg" alt="" />
                    <p>Promo Discount</p>
                  </div>
                  <div class="right_bill_field">
                    <small>-₹${calculation.coupon_amount}</small>
                  </div>
                </div>
                <div class="bill_field">
                  <div class="left_bill_field">
                    <i class="ti ti-truck-delivery"></i>
                    <p>Delivery Charge</p>
                  </div>
                  <div class="right_bill_field">
                    <small>${calculation.del_charge == 0 ? "FREE" : `₹${calculation.del_charge}`}</small>
                  </div>
                </div>
                <div class="bill_field">
                  <div class="left_bill_field">
                    <i class="ti ti-shopping-bag"></i>
                    <p>Handling Charge</p>
                  </div>
                  <div class="right_bill_field">
                    <small>₹${calculation.handling_charge}</small>
                  </div>
                </div>
                 <div class="bill_field">
                  <div class="left_bill_field">
                    <i class="ti ti-credit-card"></i>
                    <p>order_type</p>
                  </div>
                  <div class="right_bill_field">
                    <small>${calculation.order_type}</small>
                  </div>
                </div>
                
                <div class="bill_field ">
                  <div class="left_bill_field">
                    <i class="ti ti-tag-starred"></i>
                    <p>Pay Mode</p>
                  </div>
                  <div class="right_bill_field">
                    <small>${calculation.payment_method == "Online Payment" ? "Online" : "COD"}</small>
                  </div>
                </div>
                <div class="img-design"></div>
                <div class="bill_field bill_total">
                  <div class="left_bill_field">
                    <p>Grand Total</p>
                  </div>
                  <div class="right_bill_field">
                    <small>₹${calculation.total}</small>
                  </div>
                </div>`;

        $("#billCalc").html(calculationHtml);

      } else {
        console.log(response.message);
      }
    },
  });
}

function getInvoiceDetail() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("orderId");

  $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "JSON",
    data: {
      type: "getSingleOrder",
      idfr: id,
    },
    success: function (response) {
      if (response.status == "success") {
        console.log(response.data);
        const { address, data, singleOrder } = response;
        console.log(address, data, singleOrder);
        let invoiceAddressHtml = '';
        let orderDataHtml = '';
        let priceTotalHtml = '';

        invoiceAddressHtml += ` <h5>
                        <strong>Order ID :</strong>
                        <b>#ORD${data?.idfr}</b>
                    </h5>

                    <h5>
                        <strong>Name :</strong>
                        <b>${address?.o_username}</b>
                    </h5>

                    <h5>
                        <strong>Mobile No :</strong>
                        <b>${address?.o_mobile}</b>
                    </h5>

                    <h5>
                        <strong>Selected Date :</strong>
                        <b>${data?.dor}</b>
                    </h5>

                    <h5>
                        <strong>Delivery Type :</strong>
                        <b>${address?.type}</b>
                    </h5>

                    <h5>
                        <strong>Payment Method :</strong>
                        <b>${data?.payment_method}</b>
                    </h5>

                    <h5>
                        <strong>Address :</strong>
                        <b>${address?.full_address}</b>
                    </h5>
        `;

        orderDataHtml = ` <thead>
                        <tr>
                            <th>QTY</th>
                            <th>DESC</th>
                            <th>Price</th>
                        </tr>
                    </thead>`;
        singleOrder?.forEach((item) => {
          orderDataHtml += ` 

                    <tbody>

                        <tr>

                            <td class="qty">
                                ${item?.quantity} ${item?.unit}
                            </td>

                            <td class="product_desc">

                                <span class="product_name">
                                    ${item?.name}
                                </span>

                                <div>
                                    Unit Price: ₹${item?.selling_price}
                                </div>

                                <div>
                                    Nop : ${item?.nop}
                                </div>

                                

                            </td>

                            <td class="price">
                              ₹${Number(item?.nop) * Number(item?.selling_price)}
                            </td>

                        </tr>

                    </tbody>`;
        });
        priceTotalHtml += `<div class="summary_row">

                        <span class="label">
                            Item price:
                        </span>

                        <span class="amount">
                            ₹${data?.sub_total}
                        </span>

                    </div>


                    <div class="summary_row green_row">

                        <span class="label">
                            Product Discount:
                        </span>

                        <span class="amount">
                            - ₹ ${data?.coupon_amount}
                        </span>

                    </div>


                   



                    <div class="summary_row">

                        <span class="label">
                            Handling Charge:
                        </span>

                        <span class="amount">
                            ₹ ${data?.handling_charge}
                        </span>

                    </div>


                    <div class="summary_row">

                        <span class="label">
                            Delivery Fee:
                        </span>

                        <span class="amount">
                            ₹ ${data?.del_charge}
                        </span>

                    </div>


                    <div class="summary_row total">

                        <span class="label">
                            Total:
                        </span>

                        <span class="amount">
                            ₹ ${data?.total}
                        </span>

                    </div>`;

        $("#invoiceDetail").html(invoiceAddressHtml);
        $("#orderData").html(orderDataHtml);
        $("#totalOrderCalc").html(priceTotalHtml);
      } else {
        console.log(response.message);
      }
    }
  })
}
function getBranchData() {
  let branchId = localStorage.getItem("branchId");
  $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "JSON",
    data: {
      type: "getBranch",
      branchId
    },
    success: function (response) {
      if (response.status == "success") {
        console.log(response.data);
        let data = response?.data[0];
        $("#address1").html(`${data?.address}`)
        $("#address2").html(`${data?.city}, ${data?.state}`)
        $("#phoneNo").html(`Phone: ${data?.phone_no}`)
      }
    }
  })
}

$(".left_filter_btn_wrap").on("click", function () {
  $(".left_filter_btn_wrap").removeClass("active_filter");
  $(this).addClass("active_filter");

  const btnType = $(this).find("button").text().trim();

  renderRightFilter(btnType);
});

function renderRightFilter(btnType) {
  let rightFilterOption = "";

  switch (btnType) {
    // case "Brands":
    //   rightFilterOption = `
    //     <div class="radio_wrap">
    //       <input type="radio" id="brand1" name="filter" value="brand1">
    //       <label for="brand1">Filter 1</label>
    //     </div>

    //     <div class="radio_wrap">
    //       <input type="radio" id="brand2" name="filter" value="brand2">
    //       <label for="brand2">Filter 2</label>
    //     </div>

    //     <div class="radio_wrap">
    //       <input type="radio" id="brand3" name="filter" value="brand3">
    //       <label for="brand3">Filter 3</label>
    //     </div>

    //     <div class="radio_wrap">
    //       <input type="radio" id="brand4" name="filter" value="brand4">
    //       <label for="brand4">Filter 4</label>
    //     </div>
    //   `;
    //   break;
    case "Sort By":
      rightFilterOption = `
    <div class="radio_wrap" onclick="filterDataAsPerCondition('sortBy','relevance')">
      <input type="radio" id="sort1" name="sort" value="relevance">
      <label for="sort1">Relevance (Default)</label>
    </div>

    <div class="radio_wrap" onclick="filterDataAsPerCondition('sortBy','name_asc')">
      <input type="radio" id="sort2" name="sort" value="name_asc"  >
      <label for="sort2">Name: A to Z</label>
    </div>

    <div class="radio_wrap" onclick="filterDataAsPerCondition('sortBy','name_desc')">
      <input type="radio" id="sort3" name="sort" value="name_desc"  >
      <label for="sort3">Name: Z to A</label>
    </div>

    <div class="radio_wrap"  onclick="filterDataAsPerCondition('sortBy','price_low')">
      <input type="radio" id="sort4" name="sort" value="price_low">
      <label for="sort4">Price: Low to High</label>
    </div>

    <div class="radio_wrap"  onclick="filterDataAsPerCondition('sortBy','price_high')">
      <input type="radio" id="sort5" name="sort" value="price_high">
      <label for="sort5">Price: High to Low</label>
    </div>
     `;
  }

  $("#rightFilterOption").html(rightFilterOption);
}

function filterDataAsPerCondition(type, value) {
  switch (type) {
    case "Brands":
      break;
    case "sortBy":
      let sortedProducts = [...filterdProduct];

      switch (value) {
        case "relevance":
          break;

        case "name_asc":
          sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
          break;

        case "name_desc":
          sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
          break;

        case "price_low":
          sortedProducts.sort(
            (a, b) => Number(a.selling_price) - Number(b.selling_price),
          );
          break;

        case "price_high":
          sortedProducts.sort(
            (a, b) => Number(b.selling_price) - Number(a.selling_price),
          );
          break;
      }

      renderFilterProduct(sortedProducts, allSubCategories);
      break;
  }
}

async function initGrocery() {
  showLoader();
  try {
    await Promise.all([
      getTopHeroBanner(1),
      getTopLeftBanner(),
      getTopRightBanner(),
      getSubCategories(),
      getAllHeading("home"),
      getArivalsData(),
      getGroceryProducts(),
      getAllbrands("grocery"),
      getBrandsProducts(),
      getGroceryBanner1(),
      getGroceryBanner2(),
      getGroceryBanner3(),
      getNewFindPrd(),
      getRecentOrder(),
      getBestSellingPrd()
    ]);

  } catch (error) {
    console.error("Grocery loading error:", error);

  } finally {
    hideLoader();
  }
}
async function initBeauty() {
  showLoader();
  try {
    await Promise.all([
      getAllHeading("beauty"),
      getBeautyProducts(),
      getTopHeroBanner(2),
      getBeautyTopChild(),
      getBeautyCategoryStore1(),
      getBeautyCategoryStore2(),
      getBeautyCategoryStore3(),
      getBeautyCategoryStore4(),
      getBeautyCategoryStore5(),
      getBeautyBanner1(),
      getBeautyBanner2(),
      getBeautyBanner3()
    ]);
  } catch (error) {
    console.error("Grocery loading error:", error);

  } finally {
    hideLoader();
  }
}
async function initFashion() {
  showLoader();

  try {
    await Promise.all([
      getAllHeading("fashion"),
      getFashionProducts(),
      getfashionCategory1(),
      getfashionCategory2(),
      getfashionCategory3(),
      getfashionCategory4(),
      getfashionCategory5(),
      getFashionBanner1(),
      getFashionBanner2(),
      getFashionBanner3(),
      getSubcategoryWithProduct(),
      getTopHeroBanner()
    ]);
  } catch (error) {
    console.error("Grocery loading error:", error);

  } finally {
    hideLoader();
  }



}
async function initElectric() {
  showLoader();
  try {
    await Promise.all([
      getTopHeroBanner(),

      getAllHeading("electronic"),

      getCategoryElectricity1(),
      getCategoryElectricity2(),
      getCategoryElectricity3(),
      getCategoryElectricity3(),
      getCategoryElectricity4(),
      getCategoryElectricity5(),
      getElectricityBanner1(),
      getElectricityBanner2(),
      getElectricityBanner3(),
      getElictricityProducts()
    ]);
  } catch (error) {
    console.error("Grocery loading error:", error);

  } finally {
    hideLoader();
  }



}
async function initPharmacy() {
  showLoader();
  try {
    await Promise.all([
      getAllHeading("pharmacy"),
      getTopPharmacyChildBanner(),
      getCategoryPharmacy1(),
      getTopHeroBanner(3),
      getBannerPharmacy1(),
      getBannerPharmacy2(),
      getBannerPharmacy3(),
      getPharmacyProducts(),
      // getbrandPharmacy();
      getCategoryPharmacy2(),
      getCategoryPharmacy3(),
      getCategoryPharmacy4(),
      getCategoryPharmacy5(),
      getAllbrands("")
    ]);
  } catch (error) {
    console.error("Grocery loading error:", error);

  } finally {
    hideLoader();
  }


}
async function init99Store() {
  showLoader();
  try {
    await Promise.all([
      getAllHeading("99store"),

      getTopHeroBanner(4),
      getCategory99store1(),
      getCategory99store2(),
      getCategory99store3(),
      getCategory99store4(),
      getCategory99store5(),

      get99storeBanner1(),
      get99storeBanner2(),
      get99storeBanner3(),
      get99storeProducts(),
      getNewFind99store()
    ]);
  } catch (error) {
    console.error("Grocery loading error:", error);

  } finally {
    hideLoader();
  }

}
async function initKids() {
  showLoader();
  try {
    await Promise.all([
      getAllHeading("kids"),

      getTopHeroBanner(5),
      getKidsProducts(),
      getTopChildBanner(),
      getCategoryKids1(),
      getCategoryKids2(),
      getCategoryKids3(),
      getCategoryKids4(),
      getCategoryKids5(),
      getNewFindKids(),

      getKidsBanner1(),
      getKidsBanner2(),
      getKidsBanner3()
    ]);
  } catch (error) {
    console.error("Grocery loading error:", error);

  } finally {
    hideLoader();
  }
}





function getBrandOfTheDay() {
  $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "JSON",
    data: { type: "getBrandOfTheDay" },
    success: function (response) {
      if (response.status == "success") {
        let data = response?.data?.[0];
        localStorage.setItem("brandId", data.id);
        $("#imgBrandDay").attr("src", imgUrl + data?.logo_path)
      } else {
        console.log(response.message);
      }
    }
  })

}
function getSingleBrandOfTheDay() {
  let brandId = localStorage.getItem("brandId");
  let branchId = localStorage.getItem("branchId");
  return $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "JSON",
    data: {
      type: "getSingleBrandOfTheDay",
      brandId,
      branchId
    },
    success: function (response) {
      if (response.status == "success") {
        console.log(response.data);
        let productList = response.data;
        let html = "";

        productList.forEach((item, index) => {
          html += `
      <div class="product_design_item_wrap">

        <div class="product_top_wrap">

         ${item?.stock > 0 ?
              (` <div class="product_img" onclick="location.href='productDetail.html?id=${item.p_id}'">
            <img src="${imgUrl + item.image_path}" alt="">
          </div>`)
              :
              (` <div class="product_img outStock" onclick="location.href='#'">
          <div class='outOfStock'><p>Out Of Stock</p></div>
            <img src="${imgUrl + item.image_path}" alt="">
          </div>`)}

          <div class="like ${index == 0 || index == 3 || index == 4 ? "like_active" : ""
            }">
            <i class="ti ti-heart-filled"></i>
          </div>

          <div class="${item?.stock > 0 ? 'show ' : 'hide'}">
          ${item.varient_count <= 1
              ? `
      <div
        class="AddWrp productAddBtn"
        id="AddBtnToggle${item.p_id}"
        data-pid="${item.p_id}"
      >
        <button
          onclick="getSingleVarientId('${item.p_id}','prd','${item.image_path}','${item.name}')"
        >
          Add
        </button>
      </div>
    `
              : `
      <div
        type="button"
        data-bs-toggle="offcanvas"
        data-bs-target="#offcanvasVarient"
        aria-controls="offcanvasVarient"
        class="cart_tag_Add varient"
        onclick="getSingleVarientId('${item.p_id}','','${item.image_path}','${item.name}')">

        Add

        <div class="varient_btn">
          ${item.varient_count} option
        </div>

      </div>
    `
            }
          </div>

        </div>

        <div class="product_txt">

          <h5>${item.name}</h5>

          <div class="rating_wrap">

            <div class="stars">
              <i class="ti ti-star-filled"></i>
              <i class="ti ti-star-filled"></i>
              <i class="ti ti-star-filled"></i>
              <i class="ti ti-star-filled"></i>
              <i class="ti ti-star-filled"></i>
            </div>

            <div class="rate">
              (${item.review_val})
            </div>

          </div>

          <div class="qty_price_sec">

            <h4>${item.v_quantity}${item.v_unit}</h4>

            <div class="price_sec">
              <h6>₹${item.v_seliing_price}</h6>
              <del>₹${item.v_mrp}</del>
            </div>

          </div>

        </div>

      </div>
         `;
        });
        $("#brandOfTheDayPrd").html(html);
      } else {
        console.log(response.message);
      }
    }
  })
}
getBrandOfTheDay();







function getGroceryBanner1() {
  let banner = "";

  categoryId = localStorage.getItem("currentCategoryId");
  return $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "JSON",
    data: {
      type: "getGroceryBanner1",
      categoryId
    },
    success: function (response) {
      if (response.status !== "success") {
        console.log(response.message);
        return;
      }
      console.log(response.data);

      let bannerHtml = "";
      response.data.forEach((banner) => {
        bannerHtml += `
          <div class="grocery_banner item">
            <img src="${imgUrl + banner.img_path}" alt="">
          </div>
        `;
      });

      $("#carousel1").html(bannerHtml);

      const $carousel = $(".owl-carousel1");

      // Destroy previous instance if already initialized
      if ($carousel.hasClass("owl-loaded")) {
        $carousel.trigger("destroy.owl.carousel");
        $carousel.removeClass("owl-loaded");
        $carousel.find(".owl-stage-outer").children().unwrap();
      }

      $("#carousel1").html(bannerHtml);

      // Initialize Owl Carousel
      $carousel.owlCarousel({
        loop: true,
        margin: -40,
        nav: false,
        dots: true,
        autoplay: true,
        responsive: {
          0: {
            items: 1,
          },
          480: {
            items: 2,
          },
          768: {
            items: 3,
          },
          1024: {
            items: 4,
          },
        },
      });
    },
    error: function (xhr, status, error) {
      console.error(error);
    },
  })


}
function getGroceryBanner2() {
  let banner = "";

  categoryId = localStorage.getItem("currentCategoryId");
  return $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "JSON",
    data: {
      type: "getGroceryBanner2",
      categoryId
    },
    success: function (response) {
      if (response.status !== "success") {
        console.log(response.message);
        return;
      }
      console.log(response.data);

      let bannerHtml = "";
      response.data.forEach((banner) => {
        bannerHtml += `
          <div class="grocery_banner item">
            <img src="${imgUrl + banner.img_path}" alt="">
          </div>
        `;
      });

      $("#carousel2").html(bannerHtml);

      const $carousel = $(".owl-carousel2");

      // Destroy previous instance if already initialized
      if ($carousel.hasClass("owl-loaded")) {
        $carousel.trigger("destroy.owl.carousel");
        $carousel.removeClass("owl-loaded");
        $carousel.find(".owl-stage-outer").children().unwrap();
      }

      $("#carousel2").html(bannerHtml);

      // Initialize Owl Carousel
      $carousel.owlCarousel({
        loop: true,
        margin: -40,
        nav: false,
        dots: true,
        autoplay: true,
        responsive: {
          0: {
            items: 1,
          },
          480: {
            items: 2,
          },
          768: {
            items: 3,
          },
          1024: {
            items: 4,
          },
        },
      });
    },
    error: function (xhr, status, error) {
      console.error(error);
    },
  })


}
function getGroceryBanner3() {
  let banner = "";

  categoryId = localStorage.getItem("currentCategoryId");
  return $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "JSON",
    data: {
      type: "getGroceryBanner3",
      categoryId
    },
    success: function (response) {
      if (response.status !== "success") {
        console.log(response.message);
        return;
      }
      console.log(response.data);

      let bannerHtml = "";
      response.data.forEach((banner) => {
        bannerHtml += `
          <div class="grocery_banner item">
            <img src="${imgUrl + banner.img_path}" alt="">
          </div>
        `;
      });

      $("#carousel3").html(bannerHtml);

      const $carousel = $(".owl-carousel3");

      // Destroy previous instance if already initialized
      if ($carousel.hasClass("owl-loaded")) {
        $carousel.trigger("destroy.owl.carousel");
        $carousel.removeClass("owl-loaded");
        $carousel.find(".owl-stage-outer").children().unwrap();
      }

      $("#carousel3").html(bannerHtml);

      // Initialize Owl Carousel
      $carousel.owlCarousel({
        loop: true,
        margin: -40,
        nav: false,
        dots: true,
        autoplay: true,
        responsive: {
          0: {
            items: 1,
          },
          480: {
            items: 2,
          },
          768: {
            items: 3,
          },
          1024: {
            items: 4,
          },
        },
      });
    },
    error: function (xhr, status, error) {
      console.error(error);
    },
  })


}









// ===============================
//          BEAUTY SECTION
// ===============================


function getBeautyTopChild() {
  categoryId = localStorage.getItem("currentCategoryId");
  let categoryHtml = "";
  $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "JSON",
    data: {
      type: "getTopRightBanner",
      categoryId
    },
    success: function (response) {
      if (response.status == "success") {
        console.log("response.data");
        console.log(response.data);
        console.log("response.data");
        let categoryData = response.data;
        categoryData.map((item) => {
          categoryHtml += ` <div class="category_img" 
          onclick="renderInSubCategory('${item.under_category}','${item.id}')">
              <img src="${imgUrl + item.image_path}" alt="" />
            </div>`;
        });
        $("#beautyTopChildBanner").html(categoryHtml);
      } else {
        console.log(response.message);
      }
    }
  })





}


function getBeautyCategoryStore1() {
  categoryId = localStorage.getItem("currentCategoryId");
  let categoryHtml = "";
  return $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "JSON",
    data: {
      type: "getcategoryBeauty1",
      categoryId
    },
    success: function (response) {
      if (response.status == "success") {
        console.log(response.data);
        let categoryData = response.data;
        categoryData.map((item) => {
          categoryHtml += `<div class="category_store_item" 
onclick="renderInSubCategory('${item.under_category}','${item.id}')"          >
                <h4>${item.name}</h4>
                <img src="${imgUrl + item.image_path}" alt="">
              </div>`;
        });
        $("#categoryBeauty1").html(categoryHtml);
      } else {
        console.log(response.message);
      }
    }
  })





}

function getBeautyCategoryStore2() {
  let categoryArrowHtml = "";

  categoryId = localStorage.getItem("currentCategoryId");
  return $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "JSON",
    data: {
      type: "getcategoryBeauty2",
      categoryId
    },
    success: function (response) {
      if (response.status == "success") {
        console.log(response.data);
        let arrowDesign = response.data;
        arrowDesign.slice(0, 9).map((item) => {
          categoryArrowHtml += `   <div class="category_beauty_arrow_item" 
          onclick="renderInSubCategory('${item.under_category}','${item.id}')">
                <img src="${imgUrl + item.image_path}" alt="">
              </div>`;
        });

        $("#categoryBeauty2").html(categoryArrowHtml);
      } else {
        console.log(response.message);
      }
    }
  })




}
function getBeautyCategoryStore3() {
  let categoryArrowHtml = "";

  categoryId = localStorage.getItem("currentCategoryId");
  return $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "JSON",
    data: {
      type: "getcategoryBeauty3",
      categoryId
    },
    success: function (response) {
      if (response.status == "success") {
        console.log(response.data);
        let arrowDesign = response.data;
        arrowDesign.slice(0, 8).map((item) => {
          categoryArrowHtml += `  <div  class="cateogy_box"
          onclick="renderInSubCategory('${item.under_category}','${item.id}')">
                <div class="category_img_box_design">
                  <img src="${imgUrl + item.image_path}" alt="">
                </div>
                <h6>${item.name}</h6>
              </div>`;
        });

        $("#categoryBeauty3").html(categoryArrowHtml);
      } else {
        console.log(response.message);
      }
    }
  })




}
function getBeautyCategoryStore4() {
  let categoryArrowHtml = "";

  categoryId = localStorage.getItem("currentCategoryId");
  return $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "JSON",
    data: {
      type: "getcategoryBeauty4",
      categoryId
    },
    success: function (response) {
      if (response.status == "success") {
        console.log(response.data);
        let arrowDesign = response.data;
        arrowDesign.slice(0, 8).map((item) => {
          categoryArrowHtml += `  <div class="cateogy_box"
           onclick="renderInSubCategory('${item.under_category}','${item.id}')">
                <div class="category_img_box_design">
                  <img src="${imgUrl + item.image_path}" alt="">
                </div>
                <h6>${item.name}</h6>
              </div>`;
        });

        $("#categoryBeauty4").html(categoryArrowHtml);
      } else {
        console.log(response.message);
      }
    }
  })




}

function getBeautyCategoryStore5() {
  let categoryArrowHtml = "";

  categoryId = localStorage.getItem("currentCategoryId");
  return $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "JSON",
    data: {
      type: "getcategoryBeauty5",
      categoryId
    },
    success: function (response) {
      if (response.status == "success") {
        console.log(response.data);
        let arrowDesign = response.data;
        arrowDesign.slice(0, 8).map((item) => {
          categoryArrowHtml += `  <div class="cateogy_box"
           onclick="renderInSubCategory('${item.under_category}','${item.id}')">
                <div class="category_img_box_design">
                  <img src="${imgUrl + item.image_path}" alt="">
                </div>
                <h6>${item.name}</h6>
              </div>`;
        });

        $("#categoryBeauty5").html(categoryArrowHtml);
      } else {
        console.log(response.message);
      }
    }
  })






}

function getBeautyBanner1() {
  let banner = "";

  categoryId = localStorage.getItem("currentCategoryId");
  return $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "JSON",
    data: {
      type: "bannerBeauty1",
      categoryId
    },
    success: function (response) {
      if (response.status == "success") {
        console.log(response.data);
        let data = response.data;
        data.map((item) => {
          banner += `     <div class="category_banner_img">
              <img src="${imgUrl + item.img_path}" alt="" />
            </div>`;
        });

        $("#bannerBeauty1").html(banner);
      } else {
        console.log(response.message);
      }
    }
  })


}
function getBeautyBanner2() {
  let banner = "";

  categoryId = localStorage.getItem("currentCategoryId");
  return $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "JSON",
    data: {
      type: "bannerBeauty2",
      categoryId
    },
    success: function (response) {
      if (response.status == "success") {
        console.log(response.data);
        let data = response.data;
        data.map((item) => {
          banner += `     <div class="big_banner_carosel">
              <img src="${imgUrl + item.img_path}" alt="" />
            </div>`;
        });

        $("#bannerBeauty2").html(banner);
      } else {
        console.log(response.message);
      }
    }
  })


}
function getBeautyBanner3() {
  let banner = "";

  categoryId = localStorage.getItem("currentCategoryId");
  return $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "JSON",
    data: {

      type: "bannerBeauty3",
      categoryId
    },
    success: function (response) {
      if (response.status == "success") {
        console.log(response.data);
        let data = response.data;
        data.map((item) => {
          banner += `     <div class="big_banner_carosel">
              <img src="${imgUrl + item.img_path}" alt="" />
            </div>`;
        });

        $("#bannerBeauty3").html(banner);
      } else {
        console.log(response.message);
      }
    }
  })


}
// ===============================
//          BEAUTY SECTION
// ===============================









// ===============================
//          FASHION SECTION
// ===============================

function getfashionCategory1() {
  let category = "";

  categoryId = localStorage.getItem("currentCategoryId");
  return $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "JSON",
    data: {

      type: "getfashionCategory1",
      categoryId
    },
    success: function (response) {
      if (response.status == "success") {
        console.log(response.data);
        let data = response.data;
        data.map((item) => {
          category += `      <div class="hero_cat_box" 
          onclick="renderInSubCategory('${item.under_category}','${item.id}')">
                   <div class="img_cover"></div>
                   <img src="${imgUrl + item.image_path}" alt="" />
                   <p>${item.name}</p>
              </div>`;
        });

        $("#fashionCategory1").html(category);
      } else {
        console.log(response.message);
      }
    }
  })

}
function getfashionCategory2() {
  let category = "";

  categoryId = localStorage.getItem("currentCategoryId");
  return $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "JSON",
    data: {

      type: "getfashionCategory2",
      categoryId
    },
    success: function (response) {
      if (response.status == "success") {
        console.log(response.data);
        let data = response.data;
        data.slice(0, 6).map((item) => {
          category += `      <div class="fashion_sale_box" 
          onclick="renderInSubCategory('${item.under_category}','${item.id}')">
              <img src="${imgUrl + item.image_path}" alt="" />
            </div>`;
        });

        $("#fashionCategory2").html(category);
      } else {
        console.log(response.message);
      }
    }
  })

}
function getfashionCategory3() {
  let category = "";
  categoryId = localStorage.getItem("currentCategoryId");
  return $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "JSON",
    data: {
      type: "getfashionCategory3",
      categoryId
    },
    success: function (response) {
      if (response.status == "success") {
        console.log(response.data);
        let data = response.data;
        data.map((item) => {
          category += `<div class='fashion_brand_img' 
          onclick="renderInSubCategory('${item.under_category}','${item.id}')">
                <img src='${imgUrl + item.image_path}' alt="">
              <h4>${item.name}</h4> 
            </div>`;
        });

        $("#fashionCategory3").html(category);
      } else {
        console.log(response.message);
      }
    }
  })

}
function getfashionCategory4() {
  let category = "";

  categoryId = localStorage.getItem("currentCategoryId");
  return $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "JSON",
    data: {
      type: "getfashionCategory4",
      categoryId
    },
    success: function (response) {
      if (response.status == "success") {
        console.log("response.data====================");
        console.log(response.data);
        console.log("response.data================");
        let data = response.data;
        data.map((item) => {
          category += `<div class="fashion_small_item"
          onclick="renderInSubCategory('${item.under_category}','${item.id}')">
              <img src="${imgUrl + item.image_path}" alt="" />
              <h5>${item.name}</h5>
            </div>`;
        });

        $("#fashionCategory4").html(category);
      } else {
        console.log(response.message);
      }
    }
  })

}
function getfashionCategory5() {
  let category = "";

  categoryId = localStorage.getItem("currentCategoryId");
  return $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "JSON",
    data: {
      type: "getfashionCategory5",
      categoryId
    },
    success: function (response) {
      if (response.status == "success") {
        console.log(response.data);
        let data = response.data;
        let i = 0;
        data.map((item) => {
          i++;
          category += `  <div class="last_fashion_item" 
          onclick="renderInSubCategory('${item.under_category}','${item.id}')">
                  <h5>${i}</h5>
                  <div class="last_fashion_img">
                            <div class='discount' > <p>min  70% <br/> Off</p> <img src='../assets/img/icon/discount.svg' /> </div>

                    <img src="${imgUrl + item.image_path}" alt="">
                    <h5>${item.name}</h5>
                  </div>
                </div>`;
        });

        $("#fashionCategory5").html(category);
      } else {
        console.log(response.message);
      }
    }
  })

}
function getFashionBanner2() {
  let banner = "";

  categoryId = localStorage.getItem("currentCategoryId");
  return $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "JSON",
    data: {

      type: "bannerFashion2",
      categoryId
    },
    success: function (response) {
      if (response.status == "success") {
        let data = response.data;
        data.map((item) => {
          banner += ` 
           
          <img src="${imgUrl + item.img_path}" alt="" /> `;
        });

        $("#fashionBanner1").html(banner);
      } else {
        console.log(response.message);
      }
    }
  })


}
function getFashionBanner3() {
  const categoryId = localStorage.getItem("currentCategoryId");

  return $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "JSON",
    data: {
      type: "bannerFashion3",
      categoryId,
    },
    success: function (response) {
      if (response.status !== "success") {
        console.log(response.message);
        return;
      }

      let bannerHtml = "";

      response.data.forEach((item) => {
        bannerHtml += `
          <div class="item">
            <img src="${imgUrl + item.img_path}" alt="">
          </div>
        `;
      });

      const $carousel = $(".owl-carousel5");

      // Destroy previous instance if already initialized
      if ($carousel.hasClass("owl-loaded")) {
        $carousel.trigger("destroy.owl.carousel");
        $carousel.removeClass("owl-loaded");
        $carousel.find(".owl-stage-outer").children().unwrap();
      }

      $("#carousel5").html(bannerHtml);

      // Initialize Owl Carousel
      $carousel.owlCarousel({
        loop: true,
        margin: -50,
        nav: false,
        dots: true,
        autoplay: true,
        responsive: {
          0: {
            items: 1,
          },
          480: {
            items: 2,
          },
          768: {
            items: 3,
          },
          1024: {
            items: 4,
          },
        },
      });
    },
    error: function (xhr, status, error) {
      console.error(error);
    },
  });
}
function getFashionBanner1() {
  const categoryId = localStorage.getItem("currentCategoryId");

  return $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "JSON",
    data: {
      type: "bannerFashion1",
      categoryId,
    },
    success: function (response) {
      if (response.status !== "success") {
        console.log(response.message);
        return;
      }

      let bannerHtml = "";

      response.data.forEach((item) => {
        bannerHtml += `
          <div class="item">
            <img src="${imgUrl + item.img_path}" alt="">
          </div>
        `;
      });

      const $carousel = $(".owl-carousel4");

      // Destroy previous instance if already initialized
      if ($carousel.hasClass("owl-loaded")) {
        $carousel.trigger("destroy.owl.carousel");
        $carousel.removeClass("owl-loaded");
        $carousel.find(".owl-stage-outer").children().unwrap();
      }

      $("#carousel4").html(bannerHtml);

      // Initialize Owl Carousel
      $carousel.owlCarousel({
        loop: true,
        margin: -50,
        nav: false,
        dots: true,
        autoplay: true,
        responsive: {
          0: {
            items: 1,
          },
          480: {
            items: 2,
          },
          768: {
            items: 3,
          },
          1024: {
            items: 4,
          },
        },
      });
    },
    error: function (xhr, status, error) {
      console.error(error);
    },
  });
}
function getSubcategoryWithProduct() {
  const categoryId = localStorage.getItem("currentCategoryId");

  return $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "JSON",
    data: {
      type: "getSubcategoryWithProduct",
      categoryId,
    },
    success: function (response) {
      if (response.status !== "success") {
        console.log(response.message);
        return;
      }

      let html = "";

      response.data.forEach((subcategory) => {

        let productHtml = "";

        subcategory.products.forEach((product) => {
          productHtml += `
      <div class="fashion_box">
        <img src="${imgUrl + product.image_path}" alt="${product.name}" />
      </div>
    `;
        });

        html += `
    <div class="fashion_category_box" onclick="renderInSubCategory('${categoryId}','${subcategory.id}')">

      <div class="fashion_img_wrap_box">
        ${productHtml}
      </div>

      <div class="txt_fashion_box">
        <h4>${subcategory.name}</h4>
        <div>
          <p>${subcategory.products.length}</p>
        </div>
      </div>

    </div>
  `;
      });
      $("#fashionCategoryWithPrd").html(html);
    },
    error: function (xhr, status, error) {
      console.error(error);
    },
  });
}

// ===============================
//          FASHION SECTION
// ===============================






// ===============================
//          Pharmacy SECTION
// ===============================


function getTopPharmacyChildBanner() {
  let productHtml = "";
  const categoryId = localStorage.getItem("currentCategoryId");


  return $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "JSON",
    data: {
      type: "getTopRightBanner",
      categoryId
    },
    success: function (response) {

      if (response.status !== "success") {
        console.log("zeenat");
        console.log(response.message);
        console.log("zeenat");
        return;
      }
      console.log("zeenat");

      console.log("child banner pharmacy")
      console.log(response.data)
      console.log("response.data==============       =====================")

      response.data.forEach((product, index) => {
        productHtml += `
          <div class="banner_image"
                    onclick="renderInSubCategory('${product.under_category}','${product.id}')">
            <img src="${imgUrl + product.image_path}" alt="${index}" />
          </div>
        `;
      });

      $("#bannerCategoryPharmacy").html(productHtml);
    },
    error: function (xhr, status, error) {
      console.error(error);
    },
  })

}







function getBannerPharmacy1() {
  const categoryId = localStorage.getItem("currentCategoryId");

  return $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "JSON",
    data: {
      type: "getPharmacyBanner1",
      categoryId
    },
    success: function (response) {
      if (response.status !== "success") {
        console.log(response.message);
        return;
      }
      console.log(response.data);

      let bannerHtml = "";
      response.data.forEach((banner) => {
        bannerHtml += `
          <div class="pharmacy_crausel_img">
            <img src="${imgUrl + banner.img_path}" alt="">
          </div>
        `;
      });

      $("#carousel8").html(bannerHtml);

      const $carousel = $(".owl-carousel8");

      // Destroy previous instance if already initialized
      if ($carousel.hasClass("owl-loaded")) {
        $carousel.trigger("destroy.owl.carousel");
        $carousel.removeClass("owl-loaded");
        $carousel.find(".owl-stage-outer").children().unwrap();
      }

      $("#carousel8").html(bannerHtml);

      // Initialize Owl Carousel
      $carousel.owlCarousel({
        loop: true,
        margin: -40,
        nav: false,
        dots: true,
        autoplay: true,
        responsive: {
          0: {
            items: 1,
          },
          480: {
            items: 2,
          },
          768: {
            items: 3,
          },
          1024: {
            items: 4,
          },
        },
      });
    },
    error: function (xhr, status, error) {
      console.error(error);
    },
  })

}
function getBannerPharmacy2() {
  const categoryId = localStorage.getItem("currentCategoryId");

  return $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "JSON",
    data: {
      type: "getPharmacyBanner2",
      categoryId
    },
    success: function (response) {
      if (response.status !== "success") {
        console.log(response.message);
        return;
      }
      console.log(response.data);

      let bannerHtml = "";
      response.data.forEach((banner) => {
        bannerHtml += `
          <div class="pharmacy_crausel_img">
            <img src="${imgUrl + banner.img_path}" alt="">
          </div>
        `;
      });

      $("#carousel9").html(bannerHtml);

      const $carousel = $(".owl-carousel9");

      // Destroy previous instance if already initialized
      if ($carousel.hasClass("owl-loaded")) {
        $carousel.trigger("destroy.owl.carousel");
        $carousel.removeClass("owl-loaded");
        $carousel.find(".owl-stage-outer").children().unwrap();
      }

      $("#carousel9").html(bannerHtml);

      // Initialize Owl Carousel
      $carousel.owlCarousel({
        loop: true,
        margin: -40,
        nav: false,
        dots: true,
        autoplay: true,
        responsive: {
          0: {
            items: 1,
          },
          480: {
            items: 2,
          },
          768: {
            items: 3,
          },
          1024: {
            items: 4,
          },
        },
      });
    },
    error: function (xhr, status, error) {
      console.error(error);
    },
  })

}
function getBannerPharmacy3() {
  const categoryId = localStorage.getItem("currentCategoryId");

  return $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "JSON",
    data: {
      type: "getPharmacyBanner3",
      categoryId
    },
    success: function (response) {
      if (response.status !== "success") {
        console.log(response.message);
        return;
      }
      console.log(response.data);

      let bannerHtml = "";
      response.data.forEach((banner) => {
        bannerHtml += `
          <div class="pharmacy_crausel_img">
            <img src="${imgUrl + banner.img_path}" alt="">
          </div>
        `;
      });

      $("#carousel10").html(bannerHtml);

      const $carousel = $(".owl-carousel10");

      // Destroy previous instance if already initialized
      if ($carousel.hasClass("owl-loaded")) {
        $carousel.trigger("destroy.owl.carousel");
        $carousel.removeClass("owl-loaded");
        $carousel.find(".owl-stage-outer").children().unwrap();
      }

      $("#carousel10").html(bannerHtml);

      // Initialize Owl Carousel
      $carousel.owlCarousel({
        loop: true,
        margin: -40,
        nav: false,
        dots: true,
        autoplay: true,
        responsive: {
          0: {
            items: 1,
          },
          480: {
            items: 2,
          },
          768: {
            items: 3,
          },
          1024: {
            items: 4,
          },
        },
      });
    },
    error: function (xhr, status, error) {
      console.error(error);
    },
  })

}
function getCategoryPharmacy1() {

  let productHtml = "";
  const categoryId = localStorage.getItem("currentCategoryId");


  return $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "JSON",
    data: {
      type: "getPharmacyCategory1",
      categoryId
    },
    success: function (response) {
      if (response.status !== "success") {
        console.log(response.message);
        return;
      }

      response.data.slice(0, 8).forEach((product, index) => {
        productHtml += `
           <div class="cateogy_box pharmacy_category_box"
                     onclick="renderInSubCategory('${product.under_category}','${product.id}')">

                <div class="category_img_box_design">
                   <img src="${imgUrl + product.image_path}" alt="${index}" />
                </div>
                <h6>${product.name}</h6>
              </div>
        `;
      });

      $("#catgoryPharmacy1").html(productHtml);
    },
    error: function (xhr, status, error) {
      console.error(error);
    },
  })
}
function getCategoryPharmacy2() {

  let productHtml = "";
  const categoryId = localStorage.getItem("currentCategoryId");


  return $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "JSON",
    data: {
      type: "getPharmacyCategory2",
      categoryId
    },
    success: function (response) {
      if (response.status !== "success") {
        console.log(response.message);
        return;
      }

      response.data.slice(0, 8).forEach((product, index) => {
        productHtml += `
           <div class="cateogy_box pharmacy_category_box"
                     onclick="renderInSubCategory('${product.under_category}','${product.id}')">

                <div class="category_img_box_design">
                   <img src="${imgUrl + product.image_path}" alt="${index}" />
                </div>
                <h6>${product.name}</h6>
              </div>
        `;
      });

      $("#catgoryPharmacy2").html(productHtml);
    },
    error: function (xhr, status, error) {
      console.error(error);
    },
  })
}

function getCategoryPharmacy3() {

  let productHtml = "";
  const categoryId = localStorage.getItem("currentCategoryId");


  return $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "JSON",
    data: {
      type: "getPharmacyCategory3",
      categoryId
    },
    success: function (response) {
      if (response.status !== "success") {
        console.log(response.message);
        return;
      }

      response.data.slice(0, 8).forEach((product, index) => {
        productHtml += `
           <div class="cateogy_box pharmacy_category_box"
                     onclick="renderInSubCategory('${product.under_category}','${product.id}')">

                <div class="category_img_box_design">
                   <img src="${imgUrl + product.image_path}" alt="${index}" />
                </div>
                <h6>${product.name}</h6>
              </div>
        `;
      });

      $("#catgoryPharmacy3").html(productHtml);
    },
    error: function (xhr, status, error) {
      console.error(error);
    },
  })
}
function getCategoryPharmacy4() {

  let productHtml = "";
  const categoryId = localStorage.getItem("currentCategoryId");


  return $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "JSON",
    data: {
      type: "getPharmacyCategory4",
      categoryId
    },
    success: function (response) {
      if (response.status !== "success") {
        console.log(response.message);
        return;
      }

      response.data.slice(0, 8).forEach((product, index) => {
        productHtml += `
           <div class="cateogy_box pharmacy_category_box"
                     onclick="renderInSubCategory('${product.under_category}','${product.id}')">

                <div class="category_img_box_design">
                   <img src="${imgUrl + product.image_path}" alt="${index}" />
                </div>
                <h6>${product.name}</h6>
              </div>
        `;
      });

      $("#catgoryPharmacy4").html(productHtml);
    },
    error: function (xhr, status, error) {
      console.error(error);
    },
  })
}
function getCategoryPharmacy5() {

  let productHtml = "";
  const categoryId = localStorage.getItem("currentCategoryId");


  return $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "JSON",
    data: {
      type: "getPharmacyCategory5",
      categoryId
    },
    success: function (response) {
      if (response.status !== "success") {
        console.log(response.message);
        return;
      }

      response.data.slice(0, 8).forEach((product, index) => {
        productHtml += `
           <div class="cateogy_box pharmacy_category_box"
                     onclick="renderInSubCategory('${product.under_category}','${product.id}')">

                <div class="category_img_box_design">
                   <img src="${imgUrl + product.image_path}" alt="${index}" />
                </div>
                <h6>${product.name}</h6>
              </div>
        `;
      });

      $("#catgoryPharmacy5").html(productHtml);
    },
    error: function (xhr, status, error) {
      console.error(error);
    },
  })
}

// ===============================
//          Pharmacy SECTION
// ===============================




// ===============================
//         Kids SECTION
// ===============================

function getTopChildBanner() {
  const categoryId = localStorage.getItem("currentCategoryId");
  return $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "JSON",
    data: {
      type: "getTopRightBanner",
      categoryId
    },
    success: function (response) {
      if (response.status == "success") {
        let categoryHtml = "";
        response.data.map((item) => {
          categoryHtml += `<div class="banner_image_kids" 
          onclick="renderInSubCategory('${item.under_category}','${item.id}')">
              <img src="${imgUrl + item.image_path}" />
              </div>`;
        })
        $("#bannerCategoryKids1").html(categoryHtml);
      } else {
        console.log(response.message);
      }
    },
    error: function (xhr, status, error) {
      console.error(error);
    }
  })
}
function getCategoryKids1() {

  let productHtml = "";
  const categoryId = localStorage.getItem("currentCategoryId");


  return $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "JSON",
    data: {
      type: "getCategoryKids1",
      categoryId
    },
    success: function (response) {
      if (response.status !== "success") {
        console.log(response.message);
        return;
      }

      response.data.slice(0, 8).forEach((product, index) => {
        productHtml += `
           <div class="cateogy_box pharmacy_category_box" 
           onclick="renderInSubCategory('${product.under_category}','${product.id}')">
                <div class="category_img_box_design">
                   <img src="${imgUrl + product.image_path}" alt="${index}" />
                </div>
                <h6>${product.name}</h6>
              </div>
        `;
      });

      $("#catgoryKids1").html(productHtml);
    },
    error: function (xhr, status, error) {
      console.error(error);
    },
  })
}
function getCategoryKids2() {

  let productHtml = "";
  const categoryId = localStorage.getItem("currentCategoryId");


  return $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "JSON",
    data: {
      type: "getCategoryKids2",
      categoryId
    },
    success: function (response) {
      if (response.status !== "success") {
        console.log(response.message);
        return;
      }

      response.data.slice(0, 8).forEach((product, index) => {
        productHtml += `
           <div class="cateogy_box pharmacy_category_box" 
           onclick="renderInSubCategory('${product.under_category}','${product.id}')">
                <div class="category_img_box_design">
                   <img src="${imgUrl + product.image_path}" alt="${index}" />
                </div>
                <h6>${product.name}</h6>
              </div>
        `;
      });

      $("#catgoryKids2").html(productHtml);
    },
    error: function (xhr, status, error) {
      console.error(error);
    },
  })
}
function getCategoryKids3() {

  let productHtml = "";
  const categoryId = localStorage.getItem("currentCategoryId");


  return $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "JSON",
    data: {
      type: "getCategoryKids3",
      categoryId
    },
    success: function (response) {
      if (response.status !== "success") {
        console.log(response.message);
        return;
      }

      response.data.slice(0, 8).forEach((product, index) => {
        productHtml += `
           <div class="cateogy_box pharmacy_category_box"
           onclick="renderInSubCategory('${product.under_category}','${product.id}')">
                <div class="category_img_box_design">
                   <img src="${imgUrl + product.image_path}" alt="${index}" />
                </div>
                <h6>${product.name}</h6>
              </div>
        `;
      });

      $("#catgoryKids3").html(productHtml);
    },
    error: function (xhr, status, error) {
      console.error(error);
    },
  })
}
function getCategoryKids4() {

  let productHtml = "";
  const categoryId = localStorage.getItem("currentCategoryId");


  return $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "JSON",
    data: {
      type: "getCategoryKids4",
      categoryId
    },
    success: function (response) {
      if (response.status !== "success") {
        console.log(response.message);
        return;
      }

      response.data.slice(0, 8).forEach((product, index) => {
        productHtml += `
           <div class="cateogy_box pharmacy_category_box" onclick="renderInSubCategory('${product.under_category}','${product.id}')">
                <div class="category_img_box_design">
                   <img src="${imgUrl + product.image_path}" alt="${index}" />
                </div>
                <h6>${product.name}</h6>
              </div>
        `;
      });

      $("#catgoryKids4").html(productHtml);
    },
    error: function (xhr, status, error) {
      console.error(error);
    },
  })
}
function getCategoryKids5() {

  let productHtml = "";
  const categoryId = localStorage.getItem("currentCategoryId");


  return $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "JSON",
    data: {
      type: "getCategoryKids5",
      categoryId
    },
    success: function (response) {
      if (response.status !== "success") {
        console.log(response.message);
        return;
      }

      response.data.slice(0, 8).forEach((product, index) => {
        productHtml += `
           <div class="cateogy_box pharmacy_category_box"
           onclick="renderInSubCategory('${product.under_category}','${product.id}')">
                <div class="category_img_box_design">
                   <img src="${imgUrl + product.image_path}" alt="${index}" />
                </div>
                <h6>${product.name}</h6>
              </div>
        `;
      });

      $("#catgoryKids5").html(productHtml);
    },
    error: function (xhr, status, error) {
      console.error(error);
    },
  })
}
function getKidsBanner1() {

  const categoryId = localStorage.getItem("currentCategoryId");

  return $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "JSON",
    data: {
      type: "getKidsBanner1",
      categoryId
    },
    success: function (response) {
      if (response.status !== "success") {
        console.log(response.message);
        return;
      }
      console.log(response.data);

      let bannerHtml = "";
      response.data.forEach((banner) => {
        bannerHtml += `
          <div class="pharmacy_crausel_img">
            <img src="${imgUrl + banner.img_path}" alt="">
          </div>
        `;
      });

      $("#carousel13").html(bannerHtml);

      const $carousel = $(".owl-carousel13");

      // Destroy previous instance if already initialized
      if ($carousel.hasClass("owl-loaded")) {
        $carousel.trigger("destroy.owl.carousel");
        $carousel.removeClass("owl-loaded");
        $carousel.find(".owl-stage-outer").children().unwrap();
      }

      $("#carousel13").html(bannerHtml);

      // Initialize Owl Carousel
      $carousel.owlCarousel({
        loop: true,
        margin: -40,
        nav: false,
        dots: true,
        autoplay: true,
        responsive: {
          0: {
            items: 1,
          },
          480: {
            items: 2,
          },
          768: {
            items: 3,
          },
          1024: {
            items: 4,
          },
        },
      });
    },
    error: function (xhr, status, error) {
      console.error(error);
    },
  })

}
function getKidsBanner2() {

  const categoryId = localStorage.getItem("currentCategoryId");

  return $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "JSON",
    data: {
      type: "getKidsBanner2",
      categoryId
    },
    success: function (response) {
      if (response.status !== "success") {
        console.log(response.message);
        return;
      }
      console.log(response.data);

      let bannerHtml = "";
      response.data.forEach((banner) => {
        bannerHtml += `
          <div class="pharmacy_crausel_img">
            <img src="${imgUrl + banner.img_path}" alt="">
          </div>
        `;
      });

      $("#carousel14").html(bannerHtml);

      const $carousel = $(".owl-carousel14");

      // Destroy previous instance if already initialized
      if ($carousel.hasClass("owl-loaded")) {
        $carousel.trigger("destroy.owl.carousel");
        $carousel.removeClass("owl-loaded");
        $carousel.find(".owl-stage-outer").children().unwrap();
      }

      $("#carousel14").html(bannerHtml);

      // Initialize Owl Carousel
      $carousel.owlCarousel({
        loop: true,
        margin: -40,
        nav: false,
        dots: true,
        autoplay: true,
        responsive: {
          0: {
            items: 1,
          },
          480: {
            items: 2,
          },
          768: {
            items: 3,
          },
          1024: {
            items: 4,
          },
        },
      });
    },
    error: function (xhr, status, error) {
      console.error(error);
    },
  })

}
function getKidsBanner3() {

  const categoryId = localStorage.getItem("currentCategoryId");

  return $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "JSON",
    data: {
      type: "getKidsBanner3",
      categoryId
    },
    success: function (response) {
      if (response.status !== "success") {
        console.log(response.message);
        return;
      }
      console.log(response.data);

      let bannerHtml = "";
      response.data.forEach((banner) => {
        bannerHtml += `
          <div class="pharmacy_crausel_img">
            <img src="${imgUrl + banner.img_path}" alt="">
          </div>
        `;
      });

      $("#carousel15").html(bannerHtml);

      const $carousel = $(".owl-carousel15");

      // Destroy previous instance if already initialized
      if ($carousel.hasClass("owl-loaded")) {
        $carousel.trigger("destroy.owl.carousel");
        $carousel.removeClass("owl-loaded");
        $carousel.find(".owl-stage-outer").children().unwrap();
      }

      $("#carousel15").html(bannerHtml);

      // Initialize Owl Carousel
      $carousel.owlCarousel({
        loop: true,
        margin: -40,
        nav: false,
        dots: true,
        autoplay: true,
        responsive: {
          0: {
            items: 1,
          },
          480: {
            items: 2,
          },
          768: {
            items: 3,
          },
          1024: {
            items: 4,
          },
        },
      });
    },
    error: function (xhr, status, error) {
      console.error(error);
    },
  })

}

// ===============================
//         Kids SECTION
// ===============================





// ===============================
//         99 Store SECTION
// ===============================

function getCategory99store1() {
  categoryId = localStorage.getItem("currentCategoryId");
  let storeHtml = "";

  return $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "JSON",
    data: {
      type: "getcategory99store1",
      categoryId
    },
    success: function (response) {
      if (response.status == "success") {
        console.log(response.data);
        let storeData = response.data;
        storeData.map((item) => {
          storeHtml += `<div class="store99_category_box" 
          onclick="renderInSubCategory('${item.under_category}','${item.id}')">
              <img src="${imgUrl + item.image_path}" alt="">
            </div>`;
        });
        $("#storeCategory991").html(storeHtml);
      } else {
        console.log(response.message);
      }
    }
  });


}
function getCategory99store2() {
  const categoryId = localStorage.getItem("currentCategoryId");
  return $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "JSON",
    data: {
      type: "getCategory99store2",
      categoryId
    },
    success: function (response) {
      if (response.status == "success") {
        let categoryHtml = "";
        response.data.slice(0, 8).map((item) => {
          categoryHtml += `
<div class="cateogy_box pharmacy_category_box"
     onclick="renderInSubCategory('${item.under_category}','${item.id}')">
    <div class="category_img_box_design">
        <img src="${imgUrl + item.image_path}" alt="${item.name}">
    </div>
    <h6>${item.name}</h6>
</div>`;
        })
        $("#catgory99Store2").html(categoryHtml);
      } else {
        console.log(response.message);
      }
    },
    error: function (xhr, status, error) {
      console.error(error);
    }
  })


}
function getCategory99store3() {
  const categoryId = localStorage.getItem("currentCategoryId");
  return $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "JSON",
    data: {
      type: "getCategory99store3",
      categoryId
    },
    success: function (response) {
      if (response.status == "success") {
        let categoryHtml = "";
        response.data.slice(0, 8).map((item) => {

          categoryHtml += `
<div class="cateogy_box pharmacy_category_box"
     onclick="renderInSubCategory('${item.under_category}','${item.id}')">
    <div class="category_img_box_design">
        <img src="${imgUrl + item.image_path}" alt="${item.name}">
    </div>
    <h6>${item.name}</h6>
</div>`;
        })
        $("#catgory99Store3").html(categoryHtml);
      } else {
        console.log(response.message);
      }
    },
    error: function (xhr, status, error) {
      console.error(error);
    }
  })


}
function getCategory99store4() {
  const categoryId = localStorage.getItem("currentCategoryId");
  return $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "JSON",
    data: {
      type: "getCategory99store4",
      categoryId
    },
    success: function (response) {
      if (response.status == "success") {
        let categoryHtml = "";
        response.data.slice(0, 8).map((item) => {
          categoryHtml += `
<div class="cateogy_box pharmacy_category_box"
     onclick="renderInSubCategory('${item.under_category}','${item.id}')">
    <div class="category_img_box_design">
        <img src="${imgUrl + item.image_path}" alt="${item.name}">
    </div>
    <h6>${item.name}</h6>
</div>`;
        })
        $("#catgory99Store4").html(categoryHtml);
      } else {
        console.log(response.message);
      }
    },
    error: function (xhr, status, error) {
      console.error(error);
    }
  })


}
function getCategory99store5() {
  const categoryId = localStorage.getItem("currentCategoryId");
  return $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "JSON",
    data: {
      type: "getCategory99store5",
      categoryId
    },
    success: function (response) {
      if (response.status == "success") {
        let categoryHtml = "";
        response.data.slice(0, 8).map((item) => {
          categoryHtml += `
<div class="cateogy_box pharmacy_category_box"
     onclick="renderInSubCategory('${item.under_category}','${item.id}')">
    <div class="category_img_box_design">
        <img src="${imgUrl + item.image_path}" alt="${item.name}">
    </div>
    <h6>${item.name}</h6>
</div>`;
        })
        $("#catgory99Store5").html(categoryHtml);
      } else {
        console.log(response.message);
      }
    },
    error: function (xhr, status, error) {
      console.error(error);
    }
  })


}
function get99storeBanner1() {

  const categoryId = localStorage.getItem("currentCategoryId");

  return $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "JSON",
    data: {
      type: "get99storeBanner1",
      categoryId
    },
    success: function (response) {
      if (response.status !== "success") {
        console.log(response.message);
        return;
      }
      console.log(response.data);

      let bannerHtml = "";
      response.data.forEach((banner) => {
        bannerHtml += `
          <div class="store99_crausel_img">
            <img src="${imgUrl + banner.img_path}" alt="">
          </div>
        `;
      });

      $("#carousel11").html(bannerHtml);

      const $carousel = $(".owl-carousel11");

      // Destroy previous instance if already initialized
      if ($carousel.hasClass("owl-loaded")) {
        $carousel.trigger("destroy.owl.carousel");
        $carousel.removeClass("owl-loaded");
        $carousel.find(".owl-stage-outer").children().unwrap();
      }

      $("#carousel11").html(bannerHtml);

      // Initialize Owl Carousel
      $carousel.owlCarousel({
        loop: true,
        margin: -40,
        nav: false,
        dots: true,
        autoplay: true,
        responsive: {
          0: {
            items: 1,
          },
          480: {
            items: 2,
          },
          768: {
            items: 3,
          },
          1024: {
            items: 4,
          },
        },
      });
    },
    error: function (xhr, status, error) {
      console.error(error);
    },
  })

}
function get99storeBanner2() {

  const categoryId = localStorage.getItem("currentCategoryId");

  return $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "JSON",
    data: {
      type: "get99storeBanner2",
      categoryId
    },
    success: function (response) {
      if (response.status !== "success") {
        console.log(response.message);
        return;
      }
      console.log(response.data);

      let bannerHtml = "";
      response.data.forEach((banner) => {
        bannerHtml += `
          <div class="store99_crausel_img">
            <img src="${imgUrl + banner.img_path}" alt="">
          </div>
        `;
      });

      $("#carousel12").html(bannerHtml);

      const $carousel = $(".owl-carousel12");

      // Destroy previous instance if already initialized
      if ($carousel.hasClass("owl-loaded")) {
        $carousel.trigger("destroy.owl.carousel");
        $carousel.removeClass("owl-loaded");
        $carousel.find(".owl-stage-outer").children().unwrap();
      }

      $("#carousel12").html(bannerHtml);

      // Initialize Owl Carousel
      $carousel.owlCarousel({
        loop: true,
        margin: -40,
        nav: false,
        dots: true,
        autoplay: true,
        responsive: {
          0: {
            items: 1,
          },
          480: {
            items: 2,
          },
          768: {
            items: 3,
          },
          1024: {
            items: 4,
          },
        },
      });
    },
    error: function (xhr, status, error) {
      console.error(error);
    },
  })

}
function get99storeBanner3() {

  const categoryId = localStorage.getItem("currentCategoryId");

  return $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "JSON",
    data: {
      type: "get99storeBanner3",
      categoryId
    },
    success: function (response) {
      if (response.status !== "success") {
        console.log(response.message);
        return;
      }
      console.log(response.data);

      let bannerHtml = "";
      response.data.forEach((banner) => {
        bannerHtml += `
          <div class="store99_crausel_img">
            <img src="${imgUrl + banner.img_path}" alt="">
          </div>
        `;
      });

      $("#carouselstore12").html(bannerHtml);

      const $carousel = $(".owl-carouselstore12");

      // Destroy previous instance if already initialized
      if ($carousel.hasClass("owl-loaded")) {
        $carousel.trigger("destroy.owl.carousel");
        $carousel.removeClass("owl-loaded");
        $carousel.find(".owl-stage-outer").children().unwrap();
      }

      $("#carouselstore12").html(bannerHtml);

      // Initialize Owl Carousel
      $carousel.owlCarousel({
        loop: true,
        margin: -40,
        nav: false,
        dots: true,
        autoplay: true,
        responsive: {
          0: {
            items: 1,
          },
          480: {
            items: 2,
          },
          768: {
            items: 3,
          },
          1024: {
            items: 4,
          },
        },
      });
    },
    error: function (xhr, status, error) {
      console.error(error);
    },
  })

}



// ===============================
//         99 Store SECTION
// ===============================





// ===============================
//         Electricity SECTION
// ===============================

function getCategoryElectricity1() {
  categoryId = localStorage.getItem("currentCategoryId");
  return $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "JSON",
    data: {
      type: "getCategoryElectricity1",
      categoryId
    },
    success: function (response) {
      if (response.status == "success") {
        console.log(response.data);
        let storeData = response.data;
        let storeHtml = "";
        storeData.map((item) => {
          storeHtml += `<div class="top_electric_img"
               onclick="renderInSubCategory('${item.under_category}','${item.id}')">
              <img src="${imgUrl + item.image_path}" alt="">
              <p>${item.name}</p>
            </div>`;
        });
        $("#categoryElectricity1").html(storeHtml);
      } else {
        console.log(response.message);
      }
    }
  })

}
function getCategoryElectricity2() {
  categoryId = localStorage.getItem("currentCategoryId");
  return $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "JSON",
    data: {
      type: "getCategoryElectricity2",
      categoryId
    },
    success: function (response) {
      if (response.status == "success") {
        console.log(response.data);
        let storeData = response.data;
        let storeHtml = "";
        storeData.slice(0, 8).map((item) => {
          storeHtml += `<div class="top_electric_img"
               onclick="renderInSubCategory('${item.under_category}','${item.id}')">
              <img src="${imgUrl + item.image_path}" alt="">
              <p>${item.name}</p>
            </div>`;
        });
        $("#categoryElectricity2").html(storeHtml);
      } else {
        console.log(response.message);
      }
    }
  })

}
function getCategoryElectricity3() {
  categoryId = localStorage.getItem("currentCategoryId");
  return $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "JSON",
    data: {
      type: "getCategoryElectricity3",
      categoryId
    },
    success: function (response) {
      if (response.status == "success") {
        console.log(response.data);
        let storeData = response.data;
        let storeHtml = "";
        storeData.slice(0, 8).map((item) => {
          storeHtml += `<div class="top_electric_img"
               onclick="renderInSubCategory('${item.under_category}','${item.id}')">
              <img src="${imgUrl + item.image_path}" alt="">
                            <p>${item.name}</p>

            </div>`;
        });
        $("#categoryElectricity3").html(storeHtml);
      } else {
        console.log(response.message);
      }
    }
  })

}
function getCategoryElectricity4() {
  categoryId = localStorage.getItem("currentCategoryId");
  return $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "JSON",
    data: {
      type: "getCategoryElectricity4",
      categoryId
    },
    success: function (response) {
      if (response.status == "success") {
        console.log(response.data);
        let storeData = response.data;
        let storeHtml = "";
        storeData.slice(0, 8).map((item) => {
          storeHtml += `<div class="top_electric_img"
               onclick="renderInSubCategory('${item.under_category}','${item.id}')">
              <img src="${imgUrl + item.image_path}" alt="">
                            <p>${item.name}</p>

            </div>`;
        });
        $("#categoryElectricity4").html(storeHtml);
      } else {
        console.log(response.message);
      }
    }
  })

}
function getCategoryElectricity5() {
  categoryId = localStorage.getItem("currentCategoryId");
  return $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "JSON",
    data: {
      type: "getCategoryElectricity5",
      categoryId
    },
    success: function (response) {
      if (response.status == "success") {
        console.log(response.data);
        let storeData = response.data;
        let storeHtml = "";
        storeData.slice(0, 8).map((item) => {
          storeHtml += `<div class="top_electric_img"
               onclick="renderInSubCategory('${item.under_category}','${item.id}')">
              <img src="${imgUrl + item.image_path}" alt="">
                            <p>${item.name}</p>

            </div>`;
        });
        $("#categoryElectricity5").html(storeHtml);
      } else {
        console.log(response.message);
      }
    }
  })

}
function getElectricityBanner1() {

  const categoryId = localStorage.getItem("currentCategoryId");

  return $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "JSON",
    data: {
      type: "getElectricityBanner1",
      categoryId
    },
    success: function (response) {
      if (response.status !== "success") {
        console.log(response.message);
        return;
      }
      console.log(response.data);

      let bannerHtml = "";
      response.data.forEach((banner) => {
        bannerHtml += `
          <div class="item c6">
            <img src="${imgUrl + banner.img_path}" alt="">
          </div>
        `;
      });

      $("#carousel6").html(bannerHtml);

      const $carousel = $(".owl-carousel6");

      // Destroy previous instance if already initialized
      if ($carousel.hasClass("owl-loaded")) {
        $carousel.trigger("destroy.owl.carousel");
        $carousel.removeClass("owl-loaded");
        $carousel.find(".owl-stage-outer").children().unwrap();
      }

      $("#carousel6").html(bannerHtml);

      // Initialize Owl Carousel
      $carousel.owlCarousel({
        loop: true,
        margin: -70,
        nav: false,
        dots: true,
        autoplay: true,
        responsive: {
          0: {
            items: 1,
          },
          480: {
            items: 2,
          },
          768: {
            items: 3,
          },
          1024: {
            items: 4,
          },
        },
      });
    },
    error: function (xhr, status, error) {
      console.error(error);
    },
  })

}
function getElectricityBanner2() {

  const categoryId = localStorage.getItem("currentCategoryId");

  return $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "JSON",
    data: {
      type: "getElectricityBanner2",
      categoryId
    },
    success: function (response) {
      if (response.status !== "success") {
        console.log(response.message);
        return;
      }
      console.log(response.data);

      let bannerHtml = "";
      response.data.forEach((banner) => {
        bannerHtml += `
          <div class="item c6">
            <img src="${imgUrl + banner.img_path}" alt="">
          </div>
        `;
      });

      $("#carousel7").html(bannerHtml);

      const $carousel = $(".owl-carousel7");

      // Destroy previous instance if already initialized
      if ($carousel.hasClass("owl-loaded")) {
        $carousel.trigger("destroy.owl.carousel");
        $carousel.removeClass("owl-loaded");
        $carousel.find(".owl-stage-outer").children().unwrap();
      }

      $("#carousel7").html(bannerHtml);

      // Initialize Owl Carousel
      $carousel.owlCarousel({
        loop: true,
        margin: -70,
        nav: false,
        dots: true,
        autoplay: true,
        responsive: {
          0: {
            items: 1,
          },
          480: {
            items: 2,
          },
          768: {
            items: 3,
          },
          1024: {
            items: 4,
          },
        },
      });
    },
    error: function (xhr, status, error) {
      console.error(error);
    },
  })

}

function getElectricityBanner3() {

  const categoryId = localStorage.getItem("currentCategoryId");

  return $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "JSON",
    data: {
      type: "getElectricityBanner3",
      categoryId
    },
    success: function (response) {
      if (response.status !== "success") {
        console.log(response.message);
        return;
      }
      console.log(response.data);

      let bannerHtml = "";
      response.data.forEach((banner) => {
        bannerHtml += `
          <div class="item c6">
            <img src="${imgUrl + banner.img_path}" alt="">
          </div>
        `;
      });

      $("#carouselElectronic8").html(bannerHtml);

      const $carousel = $(".owl-carouselElectronic8");

      // Destroy previous instance if already initialized
      if ($carousel.hasClass("owl-loaded")) {
        $carousel.trigger("destroy.owl.carousel");
        $carousel.removeClass("owl-loaded");
        $carousel.find(".owl-stage-outer").children().unwrap();
      }

      $("#carouselElectronic8").html(bannerHtml);

      // Initialize Owl Carousel
      $carousel.owlCarousel({
        loop: true,
        margin: -70,
        nav: false,
        dots: true,
        autoplay: true,
        responsive: {
          0: {
            items: 1,
          },
          480: {
            items: 2,
          },
          768: {
            items: 3,
          },
          1024: {
            items: 4,
          },
        },
      });
    },
    error: function (xhr, status, error) {
      console.error(error);
    },
  })

}
// ===============================
//         Electricity SECTION
// ===============================





























// function getcategoryDesignKids() {
//   const categories = [
//     {
//       name: "Dairy, Bread & Eggs",
//       images: [
//         "https://images.unsplash.com/photo-1550583724-b2692b85b150",
//         "https://images.unsplash.com/photo-1509440159596-0249088772ff",
//       ],
//     },
//     {
//       name: "Fruits & Vegetables",
//       images: [
//         "https://images.unsplash.com/photo-1619566636858-adf3ef46400b",
//         "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce",
//       ],
//     },
//     {
//       name: "Snacks & Beverages",
//       images: [
//         "https://images.unsplash.com/photo-1621939514649-280e2ee25f60",
//         "https://images.unsplash.com/photo-1581636625402-29b2a704ef13",
//       ],
//     },
//     {
//       name: "Atta, Rice & Dal",
//       images: [
//         "https://images.unsplash.com/photo-1586201375761-83865001e31c",
//         "https://images.unsplash.com/photo-1515543904379-3d757afe72e4",
//       ],
//       more: 150,
//     },
//     {
//       name: "Personal Care",
//       images: [
//         "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9",
//         "https://images.unsplash.com/photo-1556228578-8c89e6adf883",
//       ],
//     },
//     {
//       name: "Cleaning Essentials",
//       images: [
//         "https://images.unsplash.com/photo-1583947582886-f40ec95dd752",
//         "https://images.unsplash.com/photo-1604335399105-a0c585fd81a1",
//       ],
//     },
//   ];

//   let categoryHtml = "";
//   categories.map((item) => {
//     categoryHtml += `    <div class="data_design_sec_item kids_color">
//               <h5>${item.name}</h5>
//               <div class="data_design_img_wrap">
//                ${item?.images
//         .map(
//           (img) => `
//               <div class="design_img">
//                   <img src="${img}" alt="">
//                 </div>
//             `,
//         )
//         .join("")}


//               </div>
//             </div>`;
//   });

//   $("#categoryDesignKids").html(categoryHtml);
// }

function toggleSystem() {
  if ($("#descToggle").css("opacity") == 0) {
    // alert();
    $("#descToggle").css("opacity", 1);
    $("#descToggle").css("height", "100%");
  } else {
    $("#descToggle").css("opacity", 0);
    $("#descToggle").css("height", "0");
  }
}

async function handleInput(e) {
  let branchId = localStorage.getItem("branchId");
  const value = e.target.value;

  $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "JSON",
    data: {
      type: "handleSearch",
      query: value,
      branchId
    },
    success: function (response) {
      let searchHtml = "";
      let notFoundHtml = "";
      if (response.status == "success") {
        console.log(response.data);
        let AllData = response.data;

        console.log(AllData);
        if (AllData.length > 0) {
          AllData?.forEach((item, index) => {
            products[item.p_id] = item;
            searchHtml += `  <div class="product_design_item_wrap">

        <div class="product_top_wrap">

        ${item?.stock > 0 ?
                (` <div class="product_img" onclick="location.href='productDetail.html?id=${item.p_id}'">
            <img src="${imgUrl + item.image_path}" alt="">
          </div>`)
                :
                (` <div class="product_img outStock" onclick="location.href='#'">
          <div class='outOfStock'><p>Out Of Stock</p></div>
            <img src="${imgUrl + item.image_path}" alt="">
          </div>`)}

          <div class="like ${index == 0 || index == 3 || index == 4 ? "like_active" : ""
              }">
            <i class="ti ti-heart-filled"></i>
          </div>
          <div class="${item?.stock > 0 ? 'show ' : 'hide'}">
          ${item.varient_count <= 1
                ? `
      <div
        class="AddWrp productAddBtn"
        id="AddBtnToggle${item.p_id}"
        data-pid="${item.p_id}"
      >
        <button
          onclick="getSingleVarientId('${item.p_id}','prd')"
        >
          Add
        </button>
      </div>
    `
                : `
      <div
        type="button"
        data-bs-toggle="offcanvas"
        data-bs-target="#offcanvasVarient"
        aria-controls="offcanvasVarient"
        class="cart_tag_Add varient"
        onclick="getSingleVarientId('${item.p_id}','','${item.image_path}','${item.name}')">

        Add

        <div class="varient_btn">
          ${item.varient_count} option
        </div>

      </div>
    `
              }
          </div>

        </div>

        <div class="product_txt">

          <h5>${item.name}</h5>

          <div class="rating_wrap">

            <div class="stars">
              <i class="ti ti-star-filled"></i>
              <i class="ti ti-star-filled"></i>
              <i class="ti ti-star-filled"></i>
              <i class="ti ti-star-filled"></i>
              <i class="ti ti-star-filled"></i>
            </div>

            <div class="rate">
              (${item.review_val})
            </div>

          </div>

          <div class="qty_price_sec">

            <h4>${item.v_quantity}${item.v_unit}</h4>

            <div class="price_sec">
              <h6>₹${item.v_seliing_price}</h6>
              <del>₹${item.v_mrp}</del>
            </div>

          </div>

        </div>

      </div>`;
          });
        }
      } else {
        console.log(response.message);
        notFoundHtml += `<div class="not_found"><img src="../assets/img/icon/notFound.gif" alt=""/>No Result Found !</div>`;
        searchHtml += ``;
      }
      $("#notFound").html(notFoundHtml);
      $("#searchData").html(searchHtml);
      updateCartUI("prd");
    },
  });
}

function getCurrentUserData() {
  $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "JSON",
    data: {
      type: "getCurrentUser",
      userId,
    },
    success: function (response) {
      if (response.status == "success") {
        let data = response?.data[0];
        console.log(response.data[0]);
        $("#name").val(data.full_name);
        $("#email").val(data.email);
        $("#phone").val(data.mobile);
        if (location.pathname.includes("wallet.html")) {

          $("#walletAmt").html(`₹ ${data?.wallet_balance == '' ? "0" : data?.wallet_balance}`)
        }
        if (location.pathname.includes("home.html")) {


          $("#walletAmt").html(`₹ ${data?.wallet_balance == '' ? "0" : data?.wallet_balance}`)
        }

        $("#profileNumber").html(` <i class="ti ti-phone-call"></i>
            <p>+91-<b>${data.mobile}</b></p>`);
        $("#profileName").html(data.full_name);
      } else {
        console.log(response.message);
      }
    },
  });
}

getCurrentUserData();

function handleUpdateProfile(e) {
  e.preventDefault();

  let name = $("#name").val();
  let phone = $("#phone").val();
  let email = $("#email").val();

  // console.log(name,phone,email)

  $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "JSON",
    data: {
      type: "handleUpdateProfile",
      userId,
      name,
      phone,
      email,
    },
    success: function (response) {
      if (response.status == "success") {
        console.log(response.message);
        // getCurrentUserData();
        location.href = "profile.html";
      } else {
        console.log(response.message);
      }
    },
  });
}

// Logout
function handleLogout() {
  localStorage.clear();

  window.location.replace("login.html");
}

// Check Login
function checkLogin() {
  const pagePath = window.location.pathname;
  const userId = localStorage.getItem("userId");

  if (!userId) {
    if (!pagePath.includes('login') && !pagePath.includes('otp')) {
      window.location.replace("login.html");
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



function toggleBrandDay() {
  // Pehle Text dikhao
  $("#brandOfDay").fadeIn(400);
  $("#imgBrandDay").fadeOut(400);

  // 3 sec baad Image dikhao
  setTimeout(() => {
    $("#brandOfDay").fadeOut(400, function () {
      $("#imgBrandDay").fadeIn(400);
    });
  }, 3000);

  // 6 sec baad fir Text dikhao
  setTimeout(() => {
    $("#imgBrandDay").fadeOut(400, function () {
      $("#brandOfDay").fadeIn(400);
    });
  }, 6000);
}

toggleBrandDay();


setInterval(toggleBrandDay, 6000);






function getCurrentAddress() {
  addressId = localStorage.getItem("addressId")
  return $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "JSON",
    data: {
      type: "getCurrentAddress",
      userId,
      addressId
    },
    success: function (response) {
      if (response.status == "success") {
        console.log(response.data);
        let data = response?.data?.[0];

        $("#addressTypeHome").html(data?.type);
        $("#addressTxtHome").html(data?.full_address);


      } else {
        console.log(response.message);
      }
    }
  });
}


// function getCurrentLocation() {

//   navigator.geolocation.getCurrentPosition(
//     (position) => {

//       const lat = position.coords.latitude;
//       const lng = position.coords.longitude;

//       document.getElementById("latitude").value = lat;
//       document.getElementById("longitude").value = lng;

//       console.log("Latitude:", lat);
//       console.log("Longitude:", lng);

//     },
//     (error) => {
//       console.error("Location error:", error);
//       alert("Please allow location permission.");
//     },
//     {
//       enableHighAccuracy: true,
//       timeout: 10000,
//       maximumAge: 0
//     }
//   );
// }


async function getCurrentBranch() {
  // const lat = 18.921984;
  // const lng = 72.834654;
  // let lat = 23.39868927001953;
  // let lng = 85.33858489990234;

  let { lat, lng } = await getCurrentLatLong();

  const address = await getAddress2(lat, lng);

  const branchId = await findNearestBranch(lat, lng);
  // console.log(branchId, address);

  return { branchId, address };
}

async function getCurrentLocation() {
  $("#currentLocation").html('')
  $(".current-location-btn").html(`<div class="location_loader">
<span class="loader_loc"></span>    <span>Detecting your location...</span>
</div>`)

  // let lat = 23.39868927001953;
  // let lng = 85.33858489990234;

  let { lat, lng } = await getCurrentLatLong();






  const address = await getAddress2(lat, lng);
  // console.log(address.city);
  const item = {
    user_id: userId,
    o_username: "",
    o_mobile: "",
    street: address?.address?.neighbourhood + "," + address?.address?.suburb,
    o_floor: "",
    type: "Home",
    for: "Self",
    area: address?.address?.neighbourhood + "," + address?.address?.suburb + "," + address?.address?.county,
    full_address: address?.display_name,
    city: address?.address?.city,
    state: address?.address?.state,
    pin_code: address?.address?.postcode,
  };

  const itemJson = JSON.stringify(item).replace(/'/g, "\\'");

  // console.log(itemJson)
  $("#currentLocation").html(`<div class="modal_current_location" onclick='handleCurrentAddress(${itemJson})' data-bs-toggle="offcanvas" data-bs-target="#offcanvasBottomAddAddress" aria-controls="offcanvasBottomAddAddress">
        <div class="saved_wrap_main_left">
           <div class="modal_left_loc"><i class="ti ti-current-location"></i></div>
           <div class="modal_right_loc">
            <h5>Use current location</h5>
            <p>${address?.display_name}</p>
        </div>
      </div>
      <i class="ti ti-chevron-right"></i>
    
        </div>`)
  $(".current-location-btn").html(`<i class="ti ti-current-location"></i>
          <span>Use Current Location</span>`)

}
async function getCurrentLatLong() {

  // Check geolocation support
  if (!navigator.geolocation) {
    alert("Geolocation is not supported.");
    return null;
  }

  const getLocation = (highAccuracy = true) => {

    return new Promise((resolve, reject) => {

      navigator.geolocation.getCurrentPosition(

        (position) => {

          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          console.log("Latitude:", lat);
          console.log("Longitude:", lng);
          console.log("Accuracy:", position.coords.accuracy);

          resolve({
            lat: lat,
            lng: lng,
            accuracy: position.coords.accuracy
          });
        },

        (error) => {

          console.log(
            `Location Error (${highAccuracy ? "High" : "Low"} Accuracy):`,
            error
          );

          reject(error);
        },

        {
          enableHighAccuracy: highAccuracy,
          timeout: highAccuracy ? 20000 : 10000,
          maximumAge: highAccuracy ? 0 : 60000
        }
      );

    });

  };


  try {

    // --------------------------------
    // First attempt: GPS
    // --------------------------------

    console.log("Getting high accuracy location...");

    const location = await getLocation(true);

    return location;

  } catch (error) {

    console.log("High accuracy failed.");

    // --------------------------------
    // Second attempt: Network location
    // --------------------------------

    try {

      console.log("Trying low accuracy location...");

      const location = await getLocation(false);

      return location;

    } catch (error2) {

      console.log("Second location attempt failed:", error2);

      switch (error2.code) {

        case error2.PERMISSION_DENIED:

          alert(
            "Location permission denied. Please allow location permission from App Settings."
          );

          break;


        case error2.POSITION_UNAVAILABLE:

          alert(
            "Location is currently unavailable. Please turn ON GPS and try again."
          );

          break;


        case error2.TIMEOUT:

          alert(
            "Location request timed out. Please check your GPS and try again."
          );

          break;


        default:

          alert(
            "Unable to get your current location."
          );
      }

      return null;
    }
  }
}
function handleCurrentAddress(item) {

  console.log(item);
  $("#houseNo").val(item?.street)
  $("#floor").val(item?.o_floor)
  $("#area").val(item?.area)
  $("#city").val(item?.city)
  $("#state").val(item?.state)
  $("#pincode").val(item?.pin_code)
  $("#selectedRole").val(item?.type);
  console.log("zeenat....")
}


async function getAddress2(lat, lng) {

  try {

    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
    );

    const data = await response.json();

    console.log("Full Address Data:", data);

    // setTimeout(() => {
    const address = data.display_name;

    $("#address").html(address);
    let findText = $(".find_text");

    if (findText) {

      findText.css("display", "none");
    }
    // }, 1000);
    // document.getElementById("address").html = address;
    return data;

  } catch (error) {

    console.error("Address error:", error);

    alert("Unable to get address.");

  }
}

async function findNearestBranch(lat, lng) {
  return $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "JSON",
    data: {
      type: "findNearestBranch",
      lat,
      lng
    },
    success: function (response) {
      if (response.status == "success") {
        console.log(response.branch);
        let data = response?.branch;
        let branchId = data?.id;
        localStorage.setItem("branchId", branchId);
        console.log("hihihi...." + branchId);
        return branchId
      } else {
        console.log(response.branch);
      }
    }
  })
}
