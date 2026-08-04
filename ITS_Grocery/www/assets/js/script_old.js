console.log("done !");
let userId = localStorage.getItem("userId");
let cartData = JSON.parse(localStorage.getItem("cart"));
$("#cartPopup").hide();
if (cartData && cartData.length > 0) {
  $("#cartPopup").show();
  $("#cartQty").html(cartData.length);
} else {
  localStorage.setItem("cart", JSON.stringify([]));
}

let apiUrl =
  "http://localhost/indian%20tech%20solution/Dashboard_multiBranch/apis/app/";

let imgUrl =
  "http://localhost/indian%20tech%20solution/Dashboard_multiBranch/admin/";
let categoryId = localStorage.getItem("currentCategoryId");



function getTopHeroBanner(id) {
  categoryId = localStorage.getItem("currentCategoryId");

  // alert(id);
  $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "JSON",
    data: {
      type: "getTopHeroBanner",
      categoryId
    },
    success: function (response) {
      if (response.status === "success") {
        console.log(response.data);
        let topBannerData = response.data[0];
        $(`#topBanner${id}`).attr("src", imgUrl + topBannerData.img_path);
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
        let categoryHtml = "";

        localStorage.setItem("currentCategoryId", categories[0]?.id);
        getArivalsData();

        categories.forEach((item, index) => {
          categoryHtml += `
            <button 
                class="category_btn  ${index === 0 ? "active" : ""}"
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
        $("#category").append(categoryHtml);
        setTimeout(() => {
          moveIndicator($(".category_btn.active"));
        }, 100);
      } else {
        alert(response.message);
        console.log(response.data);
      }
    },
  });
}

function getTopLeftBanner() {
  $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "JSON",
    data: {
      type: "getTopLeftBanner",
    },
    success: function (response) {
      if (response.status === "success") {
        let carouselItems = "";

        response.data.forEach((item, index) => {
          carouselItems += `
        <div class="carousel-item ${index === 0 ? "active" : ""}">
          <img src="${imgUrl + item.img_path}" class="d-block w-100" alt="Banner">
        </div>
      `;
        });

        const bannerHTML = `
      <div id="carouselExampleAutoplaying" class="carousel slide" data-bs-ride="carousel">
        <div class="carousel-inner">
          ${carouselItems}
        </div>
      </div>
    `;

        $("#topLeftBanner").html(bannerHTML);
      } else {
        alert(response.message);
      }
    },
  });
}
function getTopRightBanner() {
  $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "JSON",
    data: {
      type: "getTopRightBanner",
    },
    success: function (response) {
      if (response.status === "success") {
        let bannerRightHtml = "";

        let bannerData = response.data;
        console.log(bannerData);
        bannerData.map((item) => {
          bannerRightHtml += `<img src="${imgUrl + item.img_path}" />`;
        });

        $("#bannerRight").html(bannerRightHtml);
      } else {
        alert(response.message);
      }
    },
  });
}
function getArivalsData() {
  $.ajax({
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
  $.ajax({
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
  $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "JSON",
    data: {
      type,
      id: cid,
      typeName,
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

          <div class="product_img" onclick="location.href='productDetail.html?id=${item.p_id}'">
            <img src="${imgUrl + item.image_path}" alt="">
          </div>

          <div class="like ${index == 0 || index == 3 || index == 4 ? "like_active" : ""
            }">
            <i class="ti ti-heart-filled"></i>
          </div>

          ${item.varient_count <= 1 /////deepanshu
              ? `
                <div class="AddWrp" id="AddBtnToggle${item.p_id}">
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
                  onclick="getSingleVarientId('${item.p_id}',' ','${item.image_path}','${item.name}')">
                  Add

                  <div class="varient_btn">
                    ${item.varient_count} option
                  </div>

                </div>
              `
            }

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

            <h4>${item.quantity}${item.unit}</h4>

            <div class="price_sec">
              <h6>₹${item.selling_price}</h6>
              <del>₹${item.mrp}</del>
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
  $.ajax({
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

  $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "JSON",
    data: {
      type: "getBrandProducts",
      categoryId
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
        
        $("#promotionImg1").html(`<img src='${imgUrl+data?.b1?.img}' alt='${data?.b1?.name}'/>`);
        $("#promotionImg2").html(`<img src='${ imgUrl+data?.b2?.img}' alt='${data?.b2?.name}'/>`)
        $("#promotionImg3").html(`<img src='${ imgUrl+data?.b3?.img}' alt='${data?.b3?.name}'/>`)

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
  $.ajax({
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
  $("#categoryBox1").html(createSubCategoryHTML1(data.title2));
  $("#categoryBox2").html(createSubCategoryHTML1(data.title3));
  $("#categoryBox3").html(createSubCategoryHTML1(data.title4));
  $("#categoryBox4").html(createSubCategoryHTML2(data.title5));
}
function renderSubCategories2(data) {
  $("#category1").html(createSubCategoryHTML1(data.title2));
  $("#category2").html(createSubCategoryHTML1(data.title3));
  $("#category3").html(createSubCategoryHTML1(data.title4));
  $("#category4").html(createSubCategoryHTML1(data.title5));
}


function createSubCategoryHTML2(categories = []) {
  return categories
    .map(
      (item) => `
      <div class="cateogy_box_new_design"
           onclick="renderInSubCategory('${item.under_category}','${item.id}')">

        <div class="category_img_new_design">
          <img src="${imgUrl + item.image_path}" alt="${item.name}">
        </div>

        <h6>${item.name}</h6>
      </div>
    `,
    )
    .join("");
}
function createSubCategoryHTML1(categories = []) {
  return categories
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
function renderInSubCategory(cid, sid) {
  location.href = `subCategory.html?cid=${cid}`;
  localStorage.setItem("subCatId", sid);
}

const products = {};
const AllProduct = {};
const varientAllData = [];
const varientData = {};

function getGroceryProducts() {
  categoryId = localStorage.getItem("currentCategoryId");
  $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "JSON",
    data: {
      type: "getProducts",
      categoryId,
    },

    success: function (response) {
      if (response.status === "success") {
        let data = response.data;

        data?.allData?.map((item) => {
          AllProduct[item.p_id] = item;
        });
        console.log(AllProduct,data?.allData)
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
  $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "JSON",
    data: {
      type: "getProducts",
      categoryId,
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
        $("#productBeauty4").html(renderProducts(data.title3));


        let producthead1 = $("#productheadBeauty1").text();
        let producthead2 = $("#productheadBeauty2").text();
        let producthead3 = $("#productheadBeauty3").text();
        let producthead4 = $("#productheadBeauty4").text();
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

        updateCartUI("prd");
      } else {
        console.log("something went wrong on getProducts");
      }
    },
  });
}
function getFashionProducts() {
  categoryId = localStorage.getItem("currentCategoryId");
  $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "JSON",
    data: {
      type: "getProducts",
      categoryId,
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


        let producthead1 = $("#productheadFashion1").text();
        let producthead2 = $("#productheadFashion2").text();
        let producthead3 = $("#productheadFashion3").text();
        let producthead4 = $("#productheadFashion4").text();
        let producthead5 = $("#productheadFashion5").text();
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

        updateCartUI("prd");
      } else {
        console.log("something went wrong on getProducts");
      }
    },
  });
}
function getPharmacyProducts() {
  categoryId = localStorage.getItem("currentCategoryId");
  $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "JSON",
    data: {
      type: "getProducts",
      categoryId,
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
  $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "JSON",
    data: {
      type: "getProducts",
      categoryId,
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
  $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "JSON",
    data: {
      type: "getProducts",
      categoryId,
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
  $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "JSON",
    data: {
      type: "getProducts",
      categoryId,
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
  $.ajax({
    url:apiUrl,
    method:"POST",
    dataType:"JSON",
    data:{
      type:"getRecentOrder",
      userId
    },
    success: function (response) {
      if(response.status=="success"){
        let recentOrder = response.data;
       
        $(".wrap_prd1").css("display","block");

          $("#productDesign1").html(renderProducts3(recentOrder));

      }else{
        console.log(response.message);
                $(".wrap_prd1").css("display","none");

      }
    },
   
  })
}



function renderProducts(productList) {
  let html = "";

  productList.forEach((item, index) => {
    products[item.p_id] = item;

    html += `
      <div class="product_design_item_wrap">

        <div class="product_top_wrap">

          <div class="product_img" onclick="location.href='productDetail.html?id=${item.p_id}'">
            <img src="${imgUrl + item.image_path}" alt="">
          </div>

          <div class="like ${index == 0 || index == 3 || index == 4 ? "like_active" : ""
      }">
            <i class="ti ti-heart-filled"></i>
          </div>

          ${item.varient_count <= 1 /////deepanshu
        ? `
                <div class="AddWrp" id="AddBtnToggle${item.p_id}">
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

            <h4>${item.quantity}${item.unit}</h4>

            <div class="price_sec">
              <h6>₹${item.selling_price}</h6>
              <del>₹${item.mrp}</del>
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

          <div class="product_img_fashion" onclick="location.href='productDetail.html?id=${item.p_id}'">
            <img src="${imgUrl + item.image_path}" alt="">
          </div>

          <div class="like ${index == 0 || index == 3 || index == 4 ? "like_active" : ""
      }">
            <i class="ti ti-heart-filled"></i>
          </div>

          ${item.varient_count <= 1 /////deepanshu
        ? `
                <div class="AddWrp" id="AddBtnToggle${item.p_id}">
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

            <h4>${item.quantity}${item.unit}</h4>

            <div class="price_fashion">
              <h6>₹${item.selling_price}</h6>
              <del>₹${item.mrp}</del>
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

          <div class="product_data_img" onclick="location.href='productDetail.html?id=${item.p_id}'">
            <img src="${imgUrl + item.image_path}" alt="">
          </div>

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

            <h4>${item.quantity}${item.unit}</h4>

            <div class="price_fashion">
              <h6>₹${item.selling_price}</h6>
              <del>₹${item.mrp}</del>
            </div>

          </div>
          ${item.varient_count <= 1 /////deepanshu
        ? `
                <div class="AddWrp" id="AddBtnToggle${item.p_id}">
                  <button 
                  class='green_btn'
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

                    ${item.varient_count} option

                </div>
              `
      }

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
  $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "JSON",
    data: {
      type: "getSingleVarientId",
      id,
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
  let idfr = localStorage.getItem("currentIdfr");

  if (!idfr) {
    idfr = Date.now() + Math.floor(Math.random() * 9000 + 1000);
    localStorage.setItem("currentIdfr", idfr);
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
      // alert("hululu...");
      $(`#AddBtnToggle${id}`).html(`
        <div class="add_varient_data">
          <button
            id="minus${id}"
            onclick="handleDecrement('${id}','${varId}','prdDataVar')">
            -
          </button>

          <input
            type="number"
            id="quantity${id}"
            value="0"
            readonly
          />

          <button
            id="plus${id}"
            onclick="handleIncrement('${id}','${varId}','prdDataVar','${idfr}')">
            +
          </button>
        </div>
      `);

      if (!isRestore) {
        console.log("================================");
        console.log(id, varId, "prdVarient", idfr);

        handleIncrement(id, varId, "prdDataVar", idfr);
        console.log("================================");
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

    // // ================= SINGLE PRODUCT =================
    // case "singlePrd":
    //   $("#addCartBtn").html(`
    //     <div class="btn_cart_add">
    //       <button
    //         id="minus${id}"
    //         onclick="handleDecrement('${id}','','singlePrd')">
    //         -
    //       </button>

    //       <input
    //         type="number"
    //         id="quantity${id}"
    //         value="0"
    //         readonly
    //       />

    //       <button
    //         id="plus${id}"
    //         onclick="handleIncrement('${id}','${varId}','','${idfr}')">
    //         +
    //       </button>
    //     </div>
    //   `);

    //   if (!isRestore) {
    //     handleIncrement(id, varId, "", idfr);
    //   }
    //   break;

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
            onclick="handleIncrement('${id}','${varId}','singleVarIdUpdate','${idfr}','${stock}')">
            +
          </button>
        </div>
      `);
      // alert("hululu...");

      if (!isRestore) {
        handleIncrement(id, varId, "singleVarIdUpdate", idfr, stock);
      }
      break;

    default:
      console.warn("Unknown toggleAdd type:", type);
  }
}
function getAllVarient() {
  $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "JSON",
    data: {
      type: "getAllVarient",
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

  cart.forEach((cartItem) => {
    // Product without variant
    if (type == "prd") {
      // alert("huli....")
      toggleAdd(cartItem.p_id, cartItem.varientId, "prd", "", true);

      console.log("cartItem");
      console.log(cartItem, cartItem.nop);
      console.log("cartItem");

      //  alert("hulaa...");

      $(`#quantity${cartItem.p_id}`).val(cartItem.nop);
      // alert("hulaa2...");
      // alert(cartItem.varientId);
    }

    // Product with variant
    else if (type == "varient") {
      // console.log(cartItem.varientId);
      toggleAdd(cartItem.p_id, cartItem.varientId, "varId", "", true);
      $(`#quantityVar${cartItem.varientId}`).val(cartItem.nop);
    }
  });

  if (type == "singleVarId") {
    const item = cart?.find((item) => item.varientId == singleVarId);
    // alert();
    if (item?.nop > 0) {
      toggleAdd(
        item?.p_id,
        item?.varientId,
        "singleVarId",
        item?.v_stock,
        true,
      );
      $(`#quantityVar${item.varientId}`).val(item.nop);
    }
  }
}
     getGroceryProducts();

function handleIncrement(id, varId, type, idfr) {
  
  const prdData = products[id];
  const allPrdData = AllProduct[id];

  console.log("id, varId, type, idfr")
  console.log(id, varId, type, idfr );
    console.log("id, varId, type, idfr")
    
// return;

  // Get Variant Data
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

  // Quantity Input
  const qtyInput =
    type === "prdDataVar"
      ? $(`#quantity${id}`)
      : $(`#quantityVar${varId}`);

  let qty = parseInt(qtyInput.val()) || 0;

  // Stock
  const stock =
    type === "prdDataVar"
      ? prdData?.stock
      : varData?.v_stock;

  if (qty >= stock) {
    alert("Out of Stock");

    qtyInput.val(stock);

    if (type === "prdDataVar") {
      $(`#plus${id}`).addClass("disabled");
    } else {
      $(`#plusVar${varId}`).addClass("disabled");
    }

    return false;
  }

  qty++;

  // Update Local Cart
  if (type === "prdDataVar") {
    console.log(prdData, varData, varId, qty)
    updateCartLocal(prdData, varData, varId, qty);
  } else {
    console.log("zennat. ",prdData, allPrdData, varData, varId, qty)
    updateCartLocal(allPrdData, varData, varId, qty);
  }

  qtyInput.val(qty);

  // Form Data
  const productData =
    type === "prdDataVar" ? prdData : allPrdData;

  const formData = {
    type: "handleIncrement",
    user_id: userId,
    idfr: idfr,
    p_id: productData?.p_id,
    vid: varId || "",
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
        console.log(response.message);

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
  const prdData = products[id];
  const allPrdData = AllProduct[id];
  console.log(prdData, allPrdData);

  // Get Variant Data
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

  // Get Quantity
  let qty;

  if (type === "prdDataVar") {
    qty = parseInt($(`#quantity${id}`).val()) || 0;
  } else {
    qty = parseInt($(`#quantityVar${varId}`).val()) || 0;
  }

  qty--;

  // Remove From Cart
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
      $(`#AddBtnToggle${id}`).html(`
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
    // Update Local Cart
    if (type === "prdDataVar") {
      updateCartLocal(prdData, varData, varId, qty);

      $(`#quantity${id}`).val(qty);
      $(`#plus${id}`).removeClass("disabled");
    } else {
      updateCartLocal(allPrdData, varData, varId, qty);

      $(`#quantityVar${varId}`).val(qty);
      $(`#plusVar${varId}`).removeClass("disabled");
    }
  }

  // API
  $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "JSON",
    data: {
      type: "handleDecrement",
      user_id: userId,
      p_id: type === "prdDataVar" ? prdData?.p_id : allPrdData?.p_id,
      varId: varId,
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
  $.ajax({
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
        $("#categoryhead2").html(categoryHead.title3);
        $("#categoryhead3").html(categoryHead.title2);
        if (type === "home") {
          $("#producthead1").html(productHead.title1);
          $("#producthead2").html(productHead.title2);
          $("#producthead3").html(productHead.title3);
          $("#producthead4").html(productHead.title5);
          $("#producthead5").html(productHead.title5);
          $("#producthead6").html(productHead.title6);

        } else if (type == "beauty") {
          $("#productheadBeauty1").html(productHead.title1);
          $("#productheadBeauty2").html(productHead.title2);
          $("#productheadBeauty3").html(productHead.title3);
          $("#productheadBeauty4").html(productHead.title4);
        } else if (type == "fashion") {
          $("#productheadFashion1").html(productHead.title1);
          $("#productheadFashion2").html(productHead.title2);
          $("#productheadFashion3").html(productHead.title3);
          $("#productheadFashion4").html(productHead.title4);
          $("#productheadFashion5").html(productHead.title4);
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
    width: btn.outerWidth() * 0.7,
    left:
      btn.position().left + container.scrollLeft() + btn.outerWidth() * 0.15,
  });
}

function getSingleProduct() {
  const params = new URLSearchParams(window.location.search);

  const id = params.get("id");

  $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "JSON",
    data: {
      type: "getSingleProduct",
      id,
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
  $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "JSON",
    data: {
      type: "getRelatedPrd",
      sid,
      cid,
    },
    success: function (response) {
      if (response.status == "success") {
        console.log(response.data);
        let relatedHtml = "";
        let relatedData = response.data.filter((item) => item.p_id !== pid);

        relatedData?.forEach((item, index) => {
          relatedHtml += `  <div class="product_design_item_wrap">

        <div class="product_top_wrap">

          <div class="product_img" onclick="location.href='productDetail.html?id=${item.p_id}'">
            <img src="${imgUrl + item.image_path}" alt="">
          </div>

          <div class="like ${index == 0 || index == 3 || index == 4 ? "like_active" : ""
            }">
            <i class="ti ti-heart-filled"></i>
          </div>

          ${item.varient_count <= 1 /////deepanshu
              ? `
                <div class="AddWrp" id="AddBtnToggle${item.p_id}">
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
                  onclick="getSingleVarientId('${item.p_id}',' ','${item.image_path}','${item.name}')">
                  Add

                  <div class="varient_btn">
                    ${item.varient_count} option
                  </div>

                </div>
              `
            }

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

            <h4>${item.quantity}${item.unit}</h4>

            <div class="price_sec">
              <h6>₹${item.selling_price}</h6>
              <del>₹${item.mrp}</del>
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
  console.log(product);
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  console.log(cart);
  const existingIndex = varientId
    ? cart.findIndex(
      (item) => item?.p_id == product?.p_id && item?.varientId == varientId,
    )
    : cart.findIndex((item) => item?.p_id == product?.p_id);
  if (existingIndex > -1) {
    cart[existingIndex].nop = qty;
  } else {
    console.log("product,varData");
    console.log("product,varData");
    console.log(product, varData);
    console.log("product,varData");
    console.log("product,varData");
    cart.push({
      ...product,
      ...varData,
      nop: qty,
      varientId,
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  $("#cartPopup").show();
  $("#cartQty").html(cart.length);
}
function removeCartLocal(productId, varId) {
  console.log(productId, varId);
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (!varId) {
    cart = cart.filter((item) => item.p_id != productId);
  } else {
    cart = cart.filter(
      (item) => !(item.p_id == productId && item.varientId == varId),
    );
  }

  localStorage.setItem("cart", JSON.stringify(cart));

  if (cart.length <= 0) {
    $("#cartPopup").hide();
  }

  $("#cartQty").html(cart.length);
}


let allProducts = [];
let allSubCategories = [];
let filterdProduct = [];

function renderFilterProduct(prd, category) {
  const params = new URLSearchParams(window.location.search);

  const cid = params.get("cid");
  let sid = localStorage.getItem("subCatId");
  let productHtml = "";
  if (prd.length > 0) {
    prd?.map((item, index) => {
      productHtml += `  <div class="product_design_item_wrap">

        <div class="product_top_wrap">

          <div class="product_img" onclick="location.href='productDetail.html?id=${item.p_id}'">
            <img src="${imgUrl + item.image_path}" alt="">
          </div>

          <div class="like ${index == 0 || index == 3 || index == 4 ? "like_active" : ""
        }">
            <i class="ti ti-heart-filled"></i>
          </div>

          ${item.varient_count <= 1 /////deepanshu
          ? `
                <div class="AddWrp" id="AddBtnToggle${item.p_id}">
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
                  onclick="getSingleVarientId('${item.p_id}',' ','${item.image_path}','${item.name}')">
                  Add

                  <div class="varient_btn">
                    ${item.varient_count} option
                  </div>

                </div>
              `
        }

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

            <h4>${item.quantity}${item.unit}</h4>

            <div class="price_sec">
              <h6>₹${item.selling_price}</h6>
              <del>₹${item.mrp}</del>
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
  let sid = localStorage.getItem("subCatId");

  $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "JSON",
    data: {
      type: "getSingleCategory",
      cid,
    },
    success: function (response) {
      if (response.status == "success") {
        console.log(response.data);
        console.log(response.subCategory);
        allProducts = response.data;
        allSubCategories = response.subCategory;
        localStorage.setItem("subCatId", sid);
        // renderFilterProduct(allProducts,allSubCategories)
        if (sid === "0") {
          handleData(sid, "");
        } else {
          handleData(sid, "filter");
        }
      } else {
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
  console.log(category, categoryId)

  localStorage.setItem("currentCategoryId", categoryId);
  console.log(category);

  renderCategory(category);
});

function getCart() {
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

function expiredCoupon() {
  $.ajax({
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
  const coupon = couponsData.find((item) => item.code === code);
  $("#couponId").val(coupon.id);
  let limit = Number(coupon.limit);
  limit--;
  $("#couponDiscount").html(`-₹${coupon.amount}`);
  calculationFnc();

  // console.log(coupon.amount)

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

  $(`#${code}`).text("Applied");
  $(`#${code}`).addClass("disabled");
  event.target.classList.add("active");
  bootstrap.Offcanvas.getOrCreateInstance(
    $("#offcanvasBottomCoupons")[0],
  ).hide();
}

function calculationFnc() {
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

  cart.map((item) => {
    const qty = Number(item.nop);
    const mrp = Number(item.v_mrp);
    const sellingPrice = Number(item.v_seliing_price);

    totalMrp += mrp * qty;
    totalSellingPrice += sellingPrice * qty;
    totalItems += qty;
  });
  other.map((item) => {
    if (item.type == "handling_charge") {
      handlingCharge = Number(item.min_amount);
    }
  });
  let totalDiscount = totalMrp - totalSellingPrice;
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
}
function getAllOtherDetail() {
  $.ajax({
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
        alert(response.message);

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

        $("#offcanvasBottomAddressLabel").text("Add Address");

        getAddress();
      } else {
        alert(response.message);
      }
    },

    error: function (xhr, status, err) {
      console.log(xhr.responseText);
      alert("AJAX Error: " + err);
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
        // console.log(response);

        let addressHtml = "";
        let addressId = localStorage.getItem("addressId");
        if (addressId) {
          getExistingData(response.data);
          $("#addressId").val(addressId);
        }
        response.data.forEach((item, index) => {
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
                '${item.type}',
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
  let addressHolder = data.filter((item) => item.id === AddressId);
  let address = addressHolder[0];

  $("#selectedAddress").html(`
  <h4>
    Delivering to
    <b>${address.type || "Home"}</b>
  </h4>

  <p>
    ${address.o_username},
    ${address.street}
    ${address.o_floor ? `, Floor: ${address.o_floor}` : ""},
    ${address.area},
    ${address.city},
    (${address.pin_code})
    Ph: ${address.o_mobile}
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
        // alert(response.message);

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
        alert(response.message);
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
        alert(response.message);
        getAddress();
      } else {
        alert(response.message);
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
  let idfr = localStorage.getItem("currentIdfr");
  //userId
  let selectedPayment = $("#payMethod1").val();
  let selectedSlot = $("#slot").val();
  let selectedAddress = $("#addressId").val();
  let couponId = $("#couponId").val();
  let addressType = $("#selectedRole").val();
  alert(addressType);
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
  let deliveryCharge = 0;
  let formData = new FormData();

  formData.append("type", "handleOrder");
  formData.append("idfr", idfr);
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
        localStorage.setItem("cart", JSON.stringify([]));
        location.href = "orders.html";
        localStorage.removeItem("currentIdfr");
      } else {
        console.log(response.message);
      }
    },
  });
}

function getOrder() {
  $.ajax({
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
                  <div class="order_left_img">
                   <i class="ri-shopping-bag-4-line"></i>
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
                <p>Qty : <b>${item.nop}</b></p>
              </div>
            </div>
          </div>`;
        });

        $("#singleOrder").html(orderHtml);

        let calculationHtml = "";
        calculationHtml += ` <div class="bill_field">
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
                    <small>${calculation.payment_method}</small>
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



function initGrocery() {
  getTopHeroBanner(1);
  getCategory();
  getTopLeftBanner();
  getTopRightBanner();
  getSubCategories();
  getAllHeading("home");
  getGroceryProducts();
  getAllbrands("grocery");
  getBrandsProducts();
  getGroceryBanner1();
  getGroceryBanner2();
  getGroceryBanner3();
  // getcategoryDesign();

  getNewFindPrd();
getRecentOrder();
  getBestSellingPrd();
}
function initBeauty() {
  getAllHeading("beauty");
  getBeautyProducts();
  getTopHeroBanner(2);
  getBeautyCategoryStore1();
  getBeautyCategoryStore2();
  getBeautyCategoryStore3();
  getBeautyCategoryStore4();
  getBeautyCategoryStore5();
  getBeautyBanner1();
  getBeautyBanner2();
  getBeautyBanner3();
  // getCategoryStore();

  // getCategoryStore3();
  // getCategories2();
  // handleCrousel();
  // getProductDesign2();
}
function initFashion() {
  getAllHeading("fashion");
  getFashionProducts();
  getfashionCategory1();
  getfashionCategory2();
  getfashionCategory3();
  getfashionCategory4();
  getfashionCategory5();
  getFashionBanner1();
  getFashionBanner2();
  getSubcategoryWithProduct();

  // handleCrouselFashion();
  // getFashionPrd();
  // getBrandsProduct();
  // getlastFashion();
}
function initElectric() {

  // getProductElectric();
  // getCategoryElectric();
  // getBannerElectric();
  getCategoryElectricity1();
  getCategoryElectricity2();
  getCategoryElectricity3();
  getCategoryElectricity3();
  getCategoryElectricity4();
  getCategoryElectricity5();
  getElectricityBanner1();
  getElectricityBanner2();
  getElictricityProducts();
}
function initPharmacy() {
  getAllHeading("pharmacy");
  getCategoryPharmacy1();
  getTopHeroBanner(3);
  getBannerPharmacy1();
  getBannerPharmacy2();
  getBannerPharmacy3();
  getPharmacyProducts();
  getbrandPharmacy();
  getCategoryPharmacy2();
  getCategoryPharmacy3();
  getAllbrands("");

}
function init99Store() {
  getTopHeroBanner(4);
  getCategory99store1();
  getCategory99store2();
  getCategory99store3();
  getCategory99store4();

  get99storeBanner1();
  get99storeBanner2();
  get99storeProducts();
  getNewFind99store();

}
function initKids() {
  getTopHeroBanner(5);
  getKidsProducts();
  getCategoryKids1();
  getCategoryKids2();
  getCategoryKids3();
  getCategoryKids4();
  getCategoryKids5();


  getKidsBanner1();
  getKidsBanner2();
  getKidsBanner3();
}








function getGroceryBanner1() {
  let banner = "";

  categoryId = localStorage.getItem("currentCategoryId");
  $.ajax({
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
  $.ajax({
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
  $.ajax({
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

function getBeautyCategoryStore1() {
  categoryId = localStorage.getItem("currentCategoryId");
  let categoryHtml = "";
  $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "JSON",
    data: {
      type: "getcategoryBeauty1",
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
        $("#categoryBeauty1").html(categoryHtml);
      } else {
        console.log(response.message);
      }
    }
  })





}
function getBeautyCategoryStore2() {
  categoryId = localStorage.getItem("currentCategoryId");
  let categoryHtml = "";
  $.ajax({
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
        let categoryData = response.data;
        categoryData.map((item) => {
          categoryHtml += `<div class="category_store_item" 
onclick="renderInSubCategory('${item.under_category}','${item.id}')"          >
                <h4>${item.name}</h4>
                <img src="${imgUrl + item.image_path}" alt="">
              </div>`;
        });
        $("#categoryBeauty2").html(categoryHtml);
      } else {
        console.log(response.message);
      }
    }
  })





}

function getBeautyCategoryStore3() {
  let categoryArrowHtml = "";

  categoryId = localStorage.getItem("currentCategoryId");
  $.ajax({
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
        arrowDesign.map((item) => {
          categoryArrowHtml += `   <div class="category_beauty_arrow_item" 
          onclick="renderInSubCategory('${item.under_category}','${item.id}')">
                <img src="${imgUrl + item.image_path}" alt="">
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
  $.ajax({
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
        arrowDesign.map((item) => {
          categoryArrowHtml += `  <div class="cateogy_box">
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
  $.ajax({
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
        arrowDesign.map((item) => {
          categoryArrowHtml += `  <div class="cateogy_box">
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
  $.ajax({
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
  $.ajax({
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
  $.ajax({
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
  $.ajax({
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
  $.ajax({
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
        data.map((item) => {
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
  $.ajax({
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
  $.ajax({
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
  $.ajax({
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
function getFashionBanner1() {
  let banner = "";

  categoryId = localStorage.getItem("currentCategoryId");
  $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "JSON",
    data: {

      type: "bannerFashion1",
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
function getFashionBanner2() {
  const categoryId = localStorage.getItem("currentCategoryId");

  $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "JSON",
    data: {
      type: "bannerFashion2",
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
          <div class="green_banner_img">
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
        margin: 5,
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

  $.ajax({
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

function getCategoryPharmacy1() {
  let productHtml = "";
  const categoryId = localStorage.getItem("currentCategoryId");


  $.ajax({
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

  $.ajax({
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

  $.ajax({
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

  $.ajax({
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
function getCategoryPharmacy2() {

  let productHtml = "";
  const categoryId = localStorage.getItem("currentCategoryId");


  $.ajax({
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

      response.data.forEach((product, index) => {
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


  $.ajax({
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

      response.data.forEach((product, index) => {
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

// ===============================
//          Pharmacy SECTION
// ===============================




// ===============================
//         Kids SECTION
// ===============================

function getCategoryKids1() {
  const categoryId = localStorage.getItem("currentCategoryId");
  $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "JSON",
    data: {
      type: "getCategoryKids1",
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
function getCategoryKids2() {

  let productHtml = "";
  const categoryId = localStorage.getItem("currentCategoryId");


  $.ajax({
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

      response.data.forEach((product, index) => {
        productHtml += `
           <div class="cateogy_box pharmacy_category_box">
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
function getCategoryKids3() {

  let productHtml = "";
  const categoryId = localStorage.getItem("currentCategoryId");


  $.ajax({
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

      response.data.forEach((product, index) => {
        productHtml += `
           <div class="cateogy_box pharmacy_category_box">
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
function getCategoryKids4() {

  let productHtml = "";
  const categoryId = localStorage.getItem("currentCategoryId");


  $.ajax({
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

      response.data.forEach((product, index) => {
        productHtml += `
           <div class="cateogy_box pharmacy_category_box">
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
function getCategoryKids5() {

  let productHtml = "";
  const categoryId = localStorage.getItem("currentCategoryId");


  $.ajax({
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

      response.data.forEach((product, index) => {
        productHtml += `
           <div class="cateogy_box pharmacy_category_box">
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
function getKidsBanner1() {

  const categoryId = localStorage.getItem("currentCategoryId");

  $.ajax({
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

  $.ajax({
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

  $.ajax({
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

  $.ajax({
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
  $.ajax({
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
        response.data.map((item) => {
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
  $.ajax({
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
        response.data.map((item) => {

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
  $.ajax({
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
        response.data.map((item) => {
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
function get99storeBanner1() {

  const categoryId = localStorage.getItem("currentCategoryId");

  $.ajax({
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

  $.ajax({
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



// ===============================
//         99 Store SECTION
// ===============================





// ===============================
//         Electricity SECTION
// ===============================

function getCategoryElectricity1() {
  categoryId = localStorage.getItem("currentCategoryId");
  $.ajax({
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
  $.ajax({
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
        storeData.map((item) => {
          storeHtml += `<div class="top_electric_img"
               onclick="renderInSubCategory('${item.under_category}','${item.id}')">
              <img src="${imgUrl + item.image_path}" alt="">
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
  $.ajax({
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
        storeData.map((item) => {
          storeHtml += `<div class="top_electric_img"
               onclick="renderInSubCategory('${item.under_category}','${item.id}')">
              <img src="${imgUrl + item.image_path}" alt="">
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
  $.ajax({
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
        storeData.map((item) => {
          storeHtml += `<div class="top_electric_img"
               onclick="renderInSubCategory('${item.under_category}','${item.id}')">
              <img src="${imgUrl + item.image_path}" alt="">
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
  $.ajax({
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
        storeData.map((item) => {
          storeHtml += `<div class="top_electric_img"
               onclick="renderInSubCategory('${item.under_category}','${item.id}')">
              <img src="${imgUrl + item.image_path}" alt="">
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

  $.ajax({
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
          <div class="item">
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

  $.ajax({
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
          <div class="item">
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

// ===============================
//         Electricity SECTION
// ===============================
























function getCategories() {
  const categories = [
    {
      name: "Dairy, Bread & Eggs",
      images: [
        "https://images.unsplash.com/photo-1550583724-b2692b85b150",
        "https://images.unsplash.com/photo-1509440159596-0249088772ff",
        "https://images.unsplash.com/photo-1563636619-e9143da7973b",
        "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f",
      ],
      more: 240,
    },
    {
      name: "Fruits & Vegetables",
      images: [
        "https://images.unsplash.com/photo-1619566636858-adf3ef46400b",
        "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce",
        "https://images.unsplash.com/photo-1519996529931-28324d5a630e",
        "https://images.unsplash.com/photo-1574226516831-e1dff420e37f",
      ],
      more: 320,
    },
    {
      name: "Snacks & Beverages",
      images: [
        "https://images.unsplash.com/photo-1621939514649-280e2ee25f60",
        "https://images.unsplash.com/photo-1581636625402-29b2a704ef13",
        "https://images.unsplash.com/photo-1544145945-f90425340c7e",
        "https://images.unsplash.com/photo-1551024709-8f23befc6cf7",
      ],
      more: 180,
    },
    {
      name: "Atta, Rice & Dal",
      images: [
        "https://images.unsplash.com/photo-1586201375761-83865001e31c",
        "https://images.unsplash.com/photo-1515543904379-3d757afe72e4",
        "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26",
        "https://images.unsplash.com/photo-1615485500704-8e990f9900f7",
      ],
      more: 150,
    },
    {
      name: "Personal Care",
      images: [
        "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9",
        "https://images.unsplash.com/photo-1556228578-8c89e6adf883",
        "https://images.unsplash.com/photo-1571781926291-c477ebfd024b",
        "https://images.unsplash.com/photo-1596755389378-c31d21fd1273",
      ],
      more: 110,
    },
    {
      name: "Cleaning Essentials",
      images: [
        "https://images.unsplash.com/photo-1583947582886-f40ec95dd752",
        "https://images.unsplash.com/photo-1604335399105-a0c585fd81a1",
        "https://images.unsplash.com/photo-1610552050890-fe99536c2614",
        "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1",
      ],
      more: 95,
    },
  ];

  let html = "";

  categories.forEach((category) => {
    html += `
      <div class="category_item">

        <div class="category_top">
          <div class="category_top_sub_item">

            ${category.images
        .map(
          (img) => `
              <div class="sub_item">
                <img src="${img}" alt="">
              </div>
            `,
        )
        .join("")}

            <p>+${category.more} more</p>

          </div>
        </div>

        <div class="category_bottom">
          <p>${category.name}</p>
        </div>

      </div>
    `;
  });

  $("#categoryContainer").html(html);
}
// function getCategories2() {
//   const groceryCategories = [
//     {
//       name: "Fruits",
//       img: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=300",
//     },
//     {
//       name: "Vegetables",
//       img: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300",
//     },
//     {
//       name: "Dairy",
//       img: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300",
//     },
//     {
//       name: "Bakery",
//       img: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300",
//     },
//     {
//       name: "Beverages",
//       img: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=300",
//     },
//     {
//       name: "Snacks",
//       img: "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=300",
//     },
//     {
//       name: "Rice & Dal",
//       img: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300",
//     },
//     {
//       name: "Personal Care",
//       img: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=300",
//     },
//   ];

//   let html = "";

//   groceryCategories.forEach((item) => {
//     html += `
//       <div class="cateogy_box">
//         <div class="category_img_box_design">
//           <img src="${item.img}" alt="${item.name}">
//         </div>
//         <h6>${item.name}</h6>
//       </div>
//     `;
//   });

//   $("#categoryBox1").html(html);
//   $("#categoryBox2").html(html);
//   $("#categoryBox3").html(html);

//   $("#categoryBeauty1").html(html);
//   $("#categoryBeauty2").html(html);
// }

function getProductDesign2() {
  let productHtml = "";
  [0, 1, 2, 3, 4, 5].map((item) => {
    productHtml += `  <div class="product_design_item_wrap">
            <div class="product_top_wrap">
            <div class="product_img" onclick="location.href='productDetail.html'">
              <img src="../assets/img/bg/prd1.svg" alt="">
            </div>
             <div class="like ${item == 0 || item == 3 || item == 4 ? "like_active" : ""}"><i class="ti ti-heart-filled"></i></div>
                ${item == 2 || item == 4 || item == 3 ? ` <button>Add</button>` : `<div type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasVarient" aria-controls="offcanvasVarient" class="cart_tag_Add varient">Add <div class="varient_btn">2 option</div></div>`}
                       </div>
            <div class="product_txt">
              <h5>Tata salt vacum evaporated iodised edible common salt </h5>
              <div class="rating_wrap">
                <div class="stars"><i class="ti ti-star-filled"></i><i class="ti ti-star-filled"></i><i class="ti ti-star-filled"></i><i class="ti ti-star-filled"></i><i class="ti ti-star-filled"></i></div>
                <div class="rate">(303003)</div>
              </div>
              <div class="qty_price_sec">
                <h4>1kg</h5>
                <div class="price_sec">
                <h6>₹29</h6>
                <del>₹30</del>
                </div>
                </div>
            </div>
          </div>`;
  });

  $("#productWrap1").html(productHtml);
  $("#productWrap2").html(productHtml);
  $("#productWrap3").html(productHtml);
  $("#productWrap4").html(productHtml);

  //beauty page id
  $("#productBeauty1").html(productHtml);
  $("#productBeauty2").html(productHtml);
  $("#productBeauty3").html(productHtml);
  $("#productBeauty4").html(productHtml);

  //beauty page id
  $("#productElectric1").html(productHtml);
}

function handleCrousel() {
  const bannerData = [
    {
      id: 1,
      bannerImg:
        "https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&q=80",
      title: "Fresh Vegetables",
    },
    {
      id: 2,
      bannerImg:
        "https://images.unsplash.com/photo-1547592180-85f173990554?w=1200&q=80",
      title: "Daily Grocery Deals",
    },
    {
      id: 3,
      bannerImg:
        "https://images.unsplash.com/photo-1573246123716-6b1782bfc499?w=1200&q=80",
      title: "Organic Fruits",
    },
    {
      id: 4,
      bannerImg:
        "https://images.unsplash.com/photo-1608686207856-001b95cf60ca?w=1200&q=80",
      title: "Healthy Essentials",
    },
    {
      id: 5,
      bannerImg:
        "https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=1200&q=80",
      title: "Weekend Offers",
    },
  ];
  let crouseHtml = "";

  bannerData.map((item) => {
    crouseHtml += ` <div class="banner_slide item">
    <img src="${item.bannerImg}" alt="${item.title}">
  </div>`;
  });
  $("#carousel1").html(crouseHtml);
  $("#carousel2").html(crouseHtml);
  $("#carousel3").html(crouseHtml);
}
function handleCrouselFashion() {
  const bannerData = [
    {
      id: 1,
      bannerImg:
        "https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&q=80",
      title: "Fresh Vegetables",
    },
    {
      id: 2,
      bannerImg:
        "https://images.unsplash.com/photo-1547592180-85f173990554?w=1200&q=80",
      title: "Daily Grocery Deals",
    },
    {
      id: 3,
      bannerImg:
        "https://images.unsplash.com/photo-1573246123716-6b1782bfc499?w=1200&q=80",
      title: "Organic Fruits",
    },
    {
      id: 4,
      bannerImg:
        "https://images.unsplash.com/photo-1608686207856-001b95cf60ca?w=1200&q=80",
      title: "Healthy Essentials",
    },
    {
      id: 5,
      bannerImg:
        "https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=1200&q=80",
      title: "Weekend Offers",
    },
  ];
  let crouseFashionHtml1 = "";
  let crouseFashionHtml2 = "";

  bannerData.map((item) => {
    crouseFashionHtml1 += ` <div class="fashion_banner">
    <img src="../assets/img/fashionbanner1.png" alt="${item.title}">
  </div>`;
    crouseFashionHtml2 += ` <div class="green_banner_img">
              <img src="../assets/img/green_banner.svg" alt="" />
            </div>`;
  });

  $("#carousel4").html(crouseFashionHtml1);
  $("#carousel5").html(crouseFashionHtml2);
}

function getStoresDesignPrd() {
  const productData = [
    {
      id: 1,
      image: "../assets/img/prd/Frame 9.svg",
      name: "Fresh Vegetables",
    },
    {
      id: 2,
      image: "../assets/img/prd/Frame 10.svg",
      name: "Daily Grocery Deals",
    },
    {
      id: 3,
      image: "../assets/img/prd/Frame 11.svg",
      name: "Organic Fruits",
    },
    {
      id: 4,
      image: "../assets/img/prd/Frame 12.svg",
      name: "Healthy Essentials",
    },
    {
      id: 5,
      image: "../assets/img/prd/Frame 13.svg",
      name: "Weekend Offers",
    },
    {
      id: 5,
      image: "../assets/img/prd/Frame 14.svg",
      name: "Weekend Offers",
    },
    {
      id: 5,
      image: "../assets/img/prd/Frame 15.svg",
      name: "Weekend Offers",
    },
    {
      id: 5,
      image: "../assets/img/prd/Frame 17.svg",
      name: "Weekend Offers",
    },
    {
      id: 5,
      image: "../assets/img/prd/Frame 16.svg",
      name: "Weekend Offers",
    },
  ];
  let categoryPrdHtml = "";
  productData.map((item) => {
    categoryPrdHtml += ` <div class="category_store_item" onclick="location.href='category.html'">
            <div class="category_store_image">
              <img src="${item.image}" alt="">
            </div>
            <p>${item.name}</p>
          </div>`;
  });

  $("#categoryPrd").html(categoryPrdHtml);
}

function getProductDesignWrap1() {
  let productHtml = "";
  [0, 1, 2, 3, 4, 5].map((item) => {
    productHtml += `  <div class="product_design_item_wrap">
            <div class="product_top_wrap">
            <div class="product_img" onclick="location.href='productDetail.html'">
              <img src="../assets/img/bg/prd1.svg" alt="">
            </div>
  <div class="like ${item == 0 || item == 3 || item == 4 ? "like_active" : ""}"><i class="ti ti-heart-filled"></i></div>
            ${item == 2 || item == 4 || item == 3 ? ` <button>Add</button>` : `<div type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasVarient" aria-controls="offcanvasVarient" class="cart_tag_Add varient">Add <div class="varient_btn">2 option</div></div>`}
                       </div>
            <div class="product_txt">
              <h5>Tata salt vacum evaporated iodised edible common salt </h5>
              <div class="rating_wrap">
                <div class="stars"><i class="ti ti-star-filled"></i><i class="ti ti-star-filled"></i><i class="ti ti-star-filled"></i><i class="ti ti-star-filled"></i><i class="ti ti-star-filled"></i></div>
                <div class="rate">(303003)</div>
              </div>
              <div class="qty_price_sec">
                <h4>1kg</h5>
                <div class="price_sec">
                <h6>₹29</h6>
                <del>₹30</del>
                </div>
                </div>
            </div>
          </div>`;
  });

  $("#productWrapsec1").html(productHtml);
  $("#productWrapsec2").html(productHtml);
  $("#productWrapsec3").html(productHtml);
}





















function getProductElectric() {
  const electronicProducts = [
    {
      id: 1,
      name: "boAt Nirvana Crystal",
      img: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=500",
      rating: 5,
      reviews: 20896,
      discount: "77% OFF",
      price: 2499,
      mrp: 10999,
    },
    {
      id: 2,
      name: "Noise Air Buds Pro",
      img: "https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?w=500",
      rating: 4.5,
      reviews: 15420,
      discount: "68% OFF",
      price: 1899,
      mrp: 5999,
    },
    {
      id: 3,
      name: "JBL Wireless Headphones",
      img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
      rating: 4.8,
      reviews: 12560,
      discount: "55% OFF",
      price: 3499,
      mrp: 7999,
    },
    {
      id: 4,
      name: "Sony Bluetooth Speaker",
      img: "https://images.unsplash.com/photo-1589003077984-894e133dabab?w=500",
      rating: 4.7,
      reviews: 8945,
      discount: "42% OFF",
      price: 4599,
      mrp: 7999,
    },
    {
      id: 5,
      name: "Fire-Boltt Smart Watch",
      img: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500",
      rating: 4.4,
      reviews: 32540,
      discount: "72% OFF",
      price: 1999,
      mrp: 6999,
    },
    {
      id: 6,
      name: "Mi Power Bank 20000mAh",
      img: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500",
      rating: 4.6,
      reviews: 18200,
      discount: "38% OFF",
      price: 1499,
      mrp: 2499,
    },
  ];
  let productDesign1Html = "";
  electronicProducts.map((item) => {
    productDesign1Html += ` <div class="product_design_item_wrap" >
            <div class="product_top_wrap">
            <div class="product_img" onclick="location.href='productDetail.html'">
              <img src="${item.img}" alt="">
            </div>
  <div class="like ${item.id == 0 || item.id == 3 || item.id == 4 ? "like_active" : ""}"><i class="ti ti-heart-filled"></i></div>
            ${item.id == 2 || item.id == 4 || item.id == 3 ? ` <button>Add</button>` : `<div type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasVarient" aria-controls="offcanvasVarient" class="cart_tag_Add varient">Add <div class="varient_btn">2 option</div></div>`}
                       </div>
            <div class="product_txt">
              <h5>${item.name} </h5>
              <div class="rating_wrap">
                <div class="stars"><i class="ti ti-star-filled"></i><i class="ti ti-star-filled"></i><i class="ti ti-star-filled"></i><i class="ti ti-star-filled"></i><i class="ti ti-star-filled"></i></div>
                <div class="rate">(303003)</div>
              </div>
              <div class="qty_price_sec">
                <h4>1kg</h4>
                <div class="price_sec">
                <h6>₹29</h6>
                <del>₹30</del>
                </div>
                </div>
            </div>
          </div>`;
  });

  $("#productElectric1").html(productDesign1Html);
  $("#productElectric2").html(productDesign1Html);
  $("#productElectric3").html(productDesign1Html);
  $("#productElectric4").html(productDesign1Html);
  $("#productElectric5").html(productDesign1Html);
}

function getCategoryElectric() {
  const electronicProducts = [
    {
      id: 1,
      name: "boAt Nirvana Crystal",
      img: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=500",
      rating: 5,
      reviews: 20896,
      discount: "77% OFF",
      price: 2499,
      mrp: 10999,
    },
    {
      id: 2,
      name: "Noise Air Buds Pro",
      img: "https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?w=500",
      rating: 4.5,
      reviews: 15420,
      discount: "68% OFF",
      price: 1899,
      mrp: 5999,
    },
    {
      id: 3,
      name: "JBL Wireless Headphones",
      img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
      rating: 4.8,
      reviews: 12560,
      discount: "55% OFF",
      price: 3499,
      mrp: 7999,
    },
    {
      id: 4,
      name: "Sony Bluetooth Speaker",
      img: "https://images.unsplash.com/photo-1589003077984-894e133dabab?w=500",
      rating: 4.7,
      reviews: 8945,
      discount: "42% OFF",
      price: 4599,
      mrp: 7999,
    },
    {
      id: 5,
      name: "Fire-Boltt Smart Watch",
      img: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500",
      rating: 4.4,
      reviews: 32540,
      discount: "72% OFF",
      price: 1999,
      mrp: 6999,
    },
    {
      id: 6,
      name: "Mi Power Bank 20000mAh",
      img: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500",
      rating: 4.6,
      reviews: 18200,
      discount: "38% OFF",
      price: 1499,
      mrp: 2499,
    },
    {
      id: 7,
      name: "Noise Air Buds Pro",
      img: "https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?w=500",
      rating: 4.5,
      reviews: 15420,
      discount: "68% OFF",
      price: 1899,
      mrp: 5999,
    },
    {
      id: 8,
      name: "JBL Wireless Headphones",
      img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
      rating: 4.8,
      reviews: 12560,
      discount: "55% OFF",
      price: 3499,
      mrp: 7999,
    },
  ];

  let html = "";

  electronicProducts.forEach((item) => {
    html += `
      <div class="cateogy_box">
        <div class="category_img_box_design">
          <img src="${item.img}" alt="${item.name}">
        </div>
        <h6>${item.name}</h6>
      </div>
    `;
  });

  $("#categoryElectric1").html(html);
  $("#categoryElectric2").html(html);
}


// function getBannerPharmacy() {
//   let bannerHtml = "";
//   [0, 1, 2, 3, 4, 5].map((item) => {
//     bannerHtml += `<div class="pharmacy_crausel_img">
//             <img src="../assets/img/pharmacy_middle_banner.svg" alt="">
//           </div>`;
//   });

//   $("#carousel8").html(bannerHtml);
//   $("#carousel9").html(bannerHtml);
//   $("#carousel10").html(bannerHtml);
// }

function getProductPharmacy() {
  const pharmacyProducts = [
    {
      id: 1,
      discount: "13% Off",
      name: "Crocin Pain Relief Tablet",
      qty: "15 Tablets",
      price: 78.3,
      oldPrice: 90,
      img: "https://images.apollo247.in/pub/media/catalog/product/c/r/cro0008.jpg",
    },
    {
      id: 2,
      discount: "10% Off",
      name: "Dolo 650 Tablet",
      qty: "15 Tablets",
      price: 32.4,
      oldPrice: 36,
      img: "https://images.apollo247.in/pub/media/catalog/product/d/o/dol0001.jpg",
    },
    {
      id: 3,
      discount: "15% Off",
      name: "Benadryl Cough Syrup",
      qty: "100 ml",
      price: 115,
      oldPrice: 135,
      img: "https://images.apollo247.in/pub/media/catalog/product/b/e/ben0001.jpg",
    },
    {
      id: 4,
      discount: "12% Off",
      name: "Volini Pain Relief Spray",
      qty: "100 gm",
      price: 210,
      oldPrice: 240,
      img: "https://images.apollo247.in/pub/media/catalog/product/v/o/vol0002.jpg",
    },
    {
      id: 5,
      discount: "8% Off",
      name: "Dettol Antiseptic Liquid",
      qty: "250 ml",
      price: 118,
      oldPrice: 128,
      img: "https://images.apollo247.in/pub/media/catalog/product/d/e/det0010.jpg",
    },
    {
      id: 6,
      discount: "18% Off",
      name: "Stayfree Secure XL",
      qty: "18 Units",
      price: 145,
      oldPrice: 177,
      img: "https://images.apollo247.in/pub/media/catalog/product/s/t/sta0024.jpg",
    },
    {
      id: 7,
      discount: "20% Off",
      name: "Digene Antacid Tablets",
      qty: "15 Tablets",
      price: 28,
      oldPrice: 35,
      img: "https://images.apollo247.in/pub/media/catalog/product/d/i/dig0003.jpg",
    },
    {
      id: 8,
      discount: "14% Off",
      name: "Vicks VapoRub",
      qty: "50 ml",
      price: 155,
      oldPrice: 180,
      img: "https://images.apollo247.in/pub/media/catalog/product/v/i/vic0005.jpg",
    },
    {
      id: 9,
      discount: "11% Off",
      name: "ORS Electrolyte Powder",
      qty: "21 gm",
      price: 22,
      oldPrice: 25,
      img: "https://images.apollo247.in/pub/media/catalog/product/o/r/ors0001.jpg",
    },
  ];
  let productDesign1Html = "";
  pharmacyProducts.map((item) => {
    productDesign1Html += ` <div class="pharmacy_product_item">
      <div class="pharmacy_product_img">
        <img src="${item.img}" alt="${item.name}">
        <div class="disc_pharmacy">${item.discount}</div>
  <div class="like ${item.id == 0 || item.id == 3 || item.id == 4 ? "like_active" : ""}"><i class="ti ti-heart-filled"></i></div>
            ${item.id == 2 || item.id == 4 || item.id == 3 ? ` <button>Add</button>` : `<div type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasVarient" aria-controls="offcanvasVarient" class="cart_tag_Add varient">Add <div class="varient_btn">2 option</div></div>`}
                 </div>

      <div class="pharmacy_product_bottom">
        <h6>${item.name}</h6>
        <p>${item.quantity}</p>

        <div class="price_pharmacy">
          <h6>₹${item.price}</h6>
          <del>₹${item.oldPrice}</del>
        </div>
      </div>
    </div>`;
  });

  $("#pharmacyProduct1").html(productDesign1Html);
  $("#pharmacyProduct2").html(productDesign1Html);
  $("#pharmacyProduct3").html(productDesign1Html);
  $("#pharmacyProduct4").html(productDesign1Html);
  $("#pharmacyProduct5").html(productDesign1Html);
  $("#pharmacyProduct6").html(productDesign1Html);
}

function getbrandPharmacy() {
  let brandsHtml = "";
  [1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => {
    brandsHtml += `  <div class="brand_pharmacy">
              <img src="../assets/img/brands/pbr${item}.png" alt="">
            </div>`;
  });
  $("#brandsPharmacy").html(brandsHtml);
}



function getCategory99Store2() {
  let categoryHtml = "";
  [1, 2, 3, 4, 5, 6, 7, 8].map((item) => {
    categoryHtml += ` <div class="cateogy_box">
                <div class="category_img_box_design">
                  <img src="../assets/img/bg/prd1.svg" alt="" />
                </div>
                <h6>Grocery</h6>
              </div>`;
  });

  $("#catgory99Store1").html(categoryHtml);
}


function getProduct99store() {
  const store99Data = [
    {
      id: 1,
      name: "Wall Mounted Toothbrush Holder",
      img: "https://images.unsplash.com/photo-1584622781564-1d987f7333c1?w=400",
      price: 99,
      oldPrice: 199,
      discount: "50% OFF",
      rating: 4.5,
      reviews: 20896,
    },
    {
      id: 2,
      name: "Hanging Wardrobe Organizer",
      img: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400",
      price: 99,
      oldPrice: 199,
      discount: "50% OFF",
      rating: 4.4,
      reviews: 20896,
    },
    {
      id: 3,
      name: "Wall Socket Mobile Holder",
      img: "https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=400",
      price: 99,
      oldPrice: 199,
      discount: "50% OFF",
      rating: 4.3,
      reviews: 20896,
    },
    {
      id: 4,
      name: "Window Glass Cleaning Wiper",
      img: "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=400",
      price: 99,
      oldPrice: 199,
      discount: "50% OFF",
      rating: 4.5,
      reviews: 20896,
    },
    {
      id: 5,
      name: "Kitchen Mug Hanging Rack",
      img: "https://images.unsplash.com/photo-1517705008128-361805f42e86?w=400",
      price: 99,
      oldPrice: 199,
      discount: "50% OFF",
      rating: 4.6,
      reviews: 20896,
    },
    {
      id: 6,
      name: "Portable Lunch Storage Bag",
      img: "https://images.unsplash.com/photo-1581605405669-fcdf81165afa?w=400",
      price: 99,
      oldPrice: 199,
      discount: "50% OFF",
      rating: 4.4,
      reviews: 20896,
    },
    {
      id: 7,
      name: "Mini Storage Basket",
      img: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400",
      price: 99,
      oldPrice: 199,
      discount: "50% OFF",
      rating: 4.2,
      reviews: 20896,
    },
    {
      id: 8,
      name: "Foldable Laundry Basket",
      img: "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=400",
      price: 99,
      oldPrice: 199,
      discount: "50% OFF",
      rating: 4.5,
      reviews: 20896,
    },
    {
      id: 9,
      name: "Silicone Kitchen Funnel",
      img: "https://images.unsplash.com/photo-1574781330855-d0db8cc6a79c?w=400",
      price: 99,
      oldPrice: 199,
      discount: "50% OFF",
      rating: 4.4,
      reviews: 20896,
    },
    {
      id: 10,
      name: "Multipurpose Storage Box",
      img: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400",
      price: 99,
      oldPrice: 199,
      discount: "50% OFF",
      rating: 4.6,
      reviews: 20896,
    },
    {
      id: 11,
      name: "Cable Management Clips",
      img: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400",
      price: 99,
      oldPrice: 199,
      discount: "50% OFF",
      rating: 4.3,
      reviews: 20896,
    },
    {
      id: 12,
      name: "Travel Cosmetic Pouch",
      img: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=400",
      price: 99,
      oldPrice: 199,
      discount: "50% OFF",
      rating: 4.5,
      reviews: 20896,
    },
  ];
  let productHtml = "";
  store99Data.map((item) => {
    productHtml += `  <div class="product_design_item_wrap store99prd_design" onclick="location.href='productDetail.html'">
        
        <div class="product_top_wrap">
          <div class="product_img" onclick="location.href='productDetail.html'">
            <img src="${item.img}" alt="${item.name}">
          </div>
  <div class="like ${item.id == 0 || item.id == 3 || item.id == 4 ? "like_active" : ""}"><i class="ti ti-heart-filled"></i></div>
            ${item.id == 2 || item.id == 4 || item.id == 3 ? ` <button>Add</button>` : `<div type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasVarient" aria-controls="offcanvasVarient" class="cart_tag_Add varient">Add <div class="varient_btn">2 option</div></div>`}
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
            <div class="rate">(${item.reviews})</div>
          </div>

          <div class="qty_price_sec">
            <h4>1 Pc</h4>

            <div class="price_sec">
              <h6>₹${item.price}</h6>
              <del>₹${item.oldPrice}</del>
            </div>
          </div>

         

        </div>
      </div>`;
  });
  $("#product99store1").html(productHtml);
  $("#product99store2").html(productHtml);
  $("#product99store3").html(productHtml);
  $("#product99store4").html(productHtml);
  $("#product99store5").html(productHtml);
}

function getProductKids() {
  const kidsProducts = [
    {
      id: 1,
      name: "Kids Building Blocks Set",
      img: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400",
      price: 299,
      oldPrice: 499,
      discount: "40% OFF",
      rating: 4.6,
      reviews: 12543,
    },
    {
      id: 2,
      name: "Remote Control Racing Car",
      img: "https://images.unsplash.com/photo-1517672651691-24622a91b550?w=400",
      price: 599,
      oldPrice: 899,
      discount: "33% OFF",
      rating: 4.4,
      reviews: 9876,
    },

    {
      id: 4,
      name: "Kids Drawing & Coloring Kit",
      img: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400",
      price: 199,
      oldPrice: 349,
      discount: "43% OFF",
      rating: 4.5,
      reviews: 7621,
    },
    {
      id: 5,
      name: "Educational Puzzle Board",
      img: "https://images.unsplash.com/photo-1588072432836-e10032774350?w=400",
      price: 179,
      oldPrice: 299,
      discount: "40% OFF",
      rating: 4.7,
      reviews: 8921,
    },
    {
      id: 6,
      name: "Baby Musical Toy Piano",
      img: "https://images.unsplash.com/photo-1514119412350-e174d90d280e?w=400",
      price: 449,
      oldPrice: 699,
      discount: "36% OFF",
      rating: 4.3,
      reviews: 5412,
    },
    {
      id: 7,
      name: "Kids School Backpack",
      img: "https://images.unsplash.com/photo-1581605405669-fcdf81165afa?w=400",
      price: 399,
      oldPrice: 599,
      discount: "33% OFF",
      rating: 4.6,
      reviews: 11234,
    },
  ];
  let productHtml = "";
  kidsProducts.map((item) => {
    productHtml += `  <div class="product_design_item_wrap kidsprd_design" onclick="location.href='productDetail.html'">
        
        <div class="product_top_wrap">
          <div class="product_img" onclick="location.href='productDetail.html'">
            <img src="${item.img}" alt="${item.name}">
          </div>
  <div class="like ${item.id == 0 || item.id == 3 || item.id == 4 ? "like_active" : ""}"><i class="ti ti-heart-filled"></i></div>
            ${item.id == 2 || item.id == 4 || item.id == 3 ? ` <button>Add</button>` : `<div type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasVarient" aria-controls="offcanvasVarient" class="cart_tag_Add varient">Add <div class="varient_btn">2 option</div></div>`}
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
            <div class="rate">(${item.reviews})</div>
          </div>

          <div class="qty_price_sec">
            <h4>1 Pc</h4>

            <div class="price_sec">
              <h6>₹${item.price}</h6>
              <del>₹${item.oldPrice}</del>
            </div>
          </div>

         

        </div>
      </div>`;
  });
  $("#productkids1").html(productHtml);
  $("#productkids2").html(productHtml);
  $("#productkids3").html(productHtml);
  $("#productkids4").html(productHtml);
  $("#productkids5").html(productHtml);
  $("#productkids6").html(productHtml);
}




function getcategoryDesignKids() {
  const categories = [
    {
      name: "Dairy, Bread & Eggs",
      images: [
        "https://images.unsplash.com/photo-1550583724-b2692b85b150",
        "https://images.unsplash.com/photo-1509440159596-0249088772ff",
      ],
    },
    {
      name: "Fruits & Vegetables",
      images: [
        "https://images.unsplash.com/photo-1619566636858-adf3ef46400b",
        "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce",
      ],
    },
    {
      name: "Snacks & Beverages",
      images: [
        "https://images.unsplash.com/photo-1621939514649-280e2ee25f60",
        "https://images.unsplash.com/photo-1581636625402-29b2a704ef13",
      ],
    },
    {
      name: "Atta, Rice & Dal",
      images: [
        "https://images.unsplash.com/photo-1586201375761-83865001e31c",
        "https://images.unsplash.com/photo-1515543904379-3d757afe72e4",
      ],
      more: 150,
    },
    {
      name: "Personal Care",
      images: [
        "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9",
        "https://images.unsplash.com/photo-1556228578-8c89e6adf883",
      ],
    },
    {
      name: "Cleaning Essentials",
      images: [
        "https://images.unsplash.com/photo-1583947582886-f40ec95dd752",
        "https://images.unsplash.com/photo-1604335399105-a0c585fd81a1",
      ],
    },
  ];

  let categoryHtml = "";
  categories.map((item) => {
    categoryHtml += `    <div class="data_design_sec_item kids_color">
              <h5>${item.name}</h5>
              <div class="data_design_img_wrap">
               ${item?.images
        .map(
          (img) => `
              <div class="design_img">
                  <img src="${img}" alt="">
                </div>
            `,
        )
        .join("")}
                
                
              </div>
            </div>`;
  });

  $("#categoryDesignKids").html(categoryHtml);
}

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
  const value = e.target.value;

  $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "JSON",
    data: {
      type: "handleSearch",
      query: value,
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

          <div class="product_img" onclick="location.href='productDetail.html?id=${item.p_id}'">
            <img src="${imgUrl + item.image_path}" alt="">
          </div>

          <div class="like ${index == 0 || index == 3 || index == 4 ? "like_active" : ""
              }">
            <i class="ti ti-heart-filled"></i>
          </div>

          ${item.varient_count <= 1 /////deepanshu
                ? `
                <div class="AddWrp" id="AddBtnToggle${item.p_id}">
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
                  onclick="getSingleVarientId('${item.p_id}',' ','${item.image_path}','${item.name}')">
                  Add

                  <div class="varient_btn">
                    ${item.varient_count} option
                  </div>

                </div>
              `
              }

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

            <h4>${item.quantity}${item.unit}</h4>

            <div class="price_sec">
              <h6>₹${item.selling_price}</h6>
              <del>₹${item.mrp}</del>
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
        alert(response.message);
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
  const userId = localStorage.getItem("userId");

  if (!userId) {
    window.location.replace("login.html");
    return false;
  }

  return true;
}

// Call on every protected page
checkLogin();
