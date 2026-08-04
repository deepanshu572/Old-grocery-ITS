function renderCategory(name) {
  
  let loadedPages = {
    Grocery: false,
    Beauty: false,
    Fashion: false,
    Electric: false,
    Pharmacy: false,
    store99: false,
    kids: false,
  };
  $(
    "#groceryPage, #beautyPage, #fashionPage, #electricityPage, #pharmacyPage, #Store99Page, #kidsPage",
  ).hide();

  if (name == "Grocery") {
    $(".main").removeClass("lightThemePharmacy");

    $("#groceryPage").show();
    $("#banners").html(`   <div class="hero_sec_img">
            <img id="topBanner1" src="" alt="" />
          </div>
          <div class="home_banner optional" >

          <div id="topLeftBanner"></div>
            
            <div class="banner_right" id="bannerRight">
              
            </div>
          </div>
           </div>`);
    $("#groceryPage").html(`<div class="wrap_prd1">
          <div class="product_sec_design1">
            <h4>ORDER AGAIN</h4>
            <div class="product_data" id="productDesign1"></div>
          </div>
        </div>
        <div class="wrap_category1">
          <div class="category_wrap reuse_wrap_head">
            <h4>Bestselling</h4>
            <div class="category_item_wrap" id="categoryContainer"></div>
          </div>
        </div>
        <div class="reuse_category new_arivals">
          <div class="category_wrap_new_arrival">
            <h4>New Arrivals</h4>
            <div class="new_arivals_design" id="newArrival"></div>
          </div>
        </div>
        <div class="reuse_category wrap_category2">
          <div class="category_wrap reuse_wrap_head">
            <h4 id="categoryhead1"></h4>
            <div class="category_box_design" id="categoryBox1">
             
            </div>
          </div>
        </div>
        <div class="reuse_category wrap_category3">
          <div class="category_wrap reuse_wrap_head">
            <h4 id="categoryhead2"></h4>
            <div class="category_box_design" id="categoryBox2"></div>
          </div>
        </div>
        <div class="reuse_category wrap_category4">
          <div class="category_wrap reuse_wrap_head">
            <h4 id="categoryhead3"></h4>
            <div class="category_box_design" id="categoryBox3"></div>
          </div>
        </div>
        <div class="reuse_product product_design_sec_wrap">
          <h4 id="producthead1"></h4>
          <div class="product_wrapper" id="productWrap1"></div>
          <div class="seeAllProduct" id="productWrapHeading1">
            
          </div>
        </div>
         <div class="reuse_product product_design_sec_wrap">
          <h4 id="producthead2"></h4>
          <div class="product_wrapper" id="productWrap2"></div>
          <div class="seeAllProduct" id="productWrapHeading2">
            
          </div>
        </div>
        <div class="reuse_product product_design_sec_wrap">
          <h4 id="producthead3"></h4>
          <div class="product_wrapper" id="productWrap3"></div>
          <div class="seeAllProduct" id="productWrapHeading3">
            
          </div>
        </div>
        <div class="carousel_wrap">
          <h4>Brand On You</h4>
          <div
            class="owl-carousel owl-carousel1 banner_crousel"
            id="carousel1"
          ></div>
        </div>
      <!-- <div class="category_store_design reuse_wrap_head">
          <h4>Shop by Stores</h4>
          <div class="category_store_wrap" id="categoryPrd"></div>
        </div> -->
        <div class="category_Mart_design">
          <div class="header_wrap_mart">
            <h3>ITS Mart Exclusive</h3>
            <p>Exclusive deals, Exclusive quality</p>
          </div>
          <div class="cart_mart_design_wrap" id="categoryBox4">
            <div class="cart_mart_item">
              <img src="../assets/img/categorySec1.svg" alt="" />
            </div>
            <div class="cart_mart_item">
              <img src="../assets/img/categorySec2.svg" alt="" />
            </div>
            <div class="cart_mart_item">
              <img src="../assets/img/categorySec1.svg" alt="" />
            </div>
            <div class="cart_mart_item">
              <img src="../assets/img/categorySec2.svg" alt="" />
            </div>
          </div>
        </div>
        <div class="spotlight">
          <div class="header_spotlight">
            <img src="../assets/img/icon/shade2.png" />
            <h4>Br<i class="ti ti-heart-filled"></i>nd Spotlight</h4>
            <img src="../assets/img/icon/shade1.png" />
          </div>
          <div class="spotlight_images" id="brandspot">
            
          </div>
        </div>
        <div class="reuse_product bg bg1 product_design_sec_wrap">
          <div class="prd_img" id="promotionImg1">
          </div>
          <div class="product_wrapper" id="promotionPrd1"></div>
          <div class="seeAllProduct" id="promotionWrapHeading1">
            
          </div>
        </div>
        <div class="reuse_product bg bg2 product_design_sec_wrap">
          <div class="prd_img" id="promotionImg2">
          </div>
          <div class="product_wrapper" id="promotionPrd2"></div>
          <div class="seeAllProduct" id="promotionWrapHeading2">
            
          </div>
        </div>
        <div class="reuse_product bg bg1 product_design_sec_wrap">
          <div class="prd_img" id="promotionImg3">
          </div>
          <div class="product_wrapper" id="promotionPrd3"></div>
          <div class="seeAllProduct" id="promotionWrapHeading3">
            
          </div>
        </div>
        <div class="carousel_wrap crousel2">
         <h4>Brand On You</h4> 
          <div
            class="owl-carousel owl-carousel2 banner_crousel"
            id="carousel2"
          ></div>
        </div>
        <div class="reuse_wrap_head">
          <h4>Discover New Finds</h4>
          <div class="data_design_sec" id="categoryDesign"></div>
        </div>
        <div class="reuse_product product_design_sec_wrap">
          <h4 id="producthead4"></h4>
          <div class="product_wrapper" id="productWrap4"></div>
          <div class="seeAllProduct"  id="productWrapHeading4">
            
          </div>
        </div>
        <div class="carousel_wrap crousel3">
           <h4>Brand On You</h4> 
          <div
            class="owl-carousel owl-carousel3 banner_crousel"
            id="carousel3"
          ></div>
        </div>

        <div class="reuse_product product_design_sec_wrap">
          <h4 id="producthead5"></h4>
          <div class="product_wrapper" id="productWrap5"></div>
          <div class="seeAllProduct"  id="productWrapHeading5">
            
          </div>
        </div>
         <div class="reuse_product product_design_sec_wrap">
          <h4 id="producthead6"></h4>
          <div class="product_wrapper" id="productWrap6"></div>
          <div class="seeAllProduct"  id="productWrapHeading6">
            
          </div>
        </div>
        <div class="footer_grocery">
         <img src='../assets/img/bg/footer_bg.svg' alt=""/>
        </div>`);
    if (!loadedPages.Grocery) {
      loadedPages.Grocery = true;

      // Sirf pehli baar chalega
      initGrocery();
    }
   
  } else if (name == "Beauty") {
    $(".main").removeClass("lightThemePharmacy");

    $("#beautyPage").show();
    //  $("#contentToggle").html("Beauty ! ");
    $("#banners").html(` <div class="hero_sec_img">
            <img id="topBanner2" src="" alt="" />
          </div>`);
    $("#beautyPage").html(` <div class="main_category_beauty_wrap">
          <div class="main_category_item" id="beautyTopChildBanner"></div>


          
          <div class="category_store_beauty">
            <div class="category_store_head">
              <h4>Only At Itscart</h4>
              <p>Beauty you wont find anywhere else</p>
            </div>
            <div class="category_store_wrap_beauty" id="categoryBeauty1"></div>
          </div>

          <div class="category_banner_data carousel_wrap" id="bannerBeauty1">
           
           
          </div>
          <div class="reuse_product product_design_sec_wrap">
            <h4 id="productheadBeauty1"></h4>
            <div class="product_wrapper" id="productBeauty1"></div>
             <div class="seeAllProduct" id="productBeautyHeading1">
             
            </div>
          </div>
          <div class="category_beauty_arrow_design_Sec reuse_wrap_head">
            <h4>Your Beauty Must- Have Await</h4>
            <div class="category_beauty_arrow_wrap" id="categoryBeauty2">
           
            </div>
          </div>
             <div class="reuse_category wrap_category2">
            <div class="category_wrap reuse_wrap_head">
            <h4>Easy to buy</h4>
            <div class="category_box_design" id="categoryBeauty3">
              
            </div>
           </div>
          </div>
         
          <div class="category_big_bottom_design_banner">
            <div class="category_banner_wrap" id="bannerBeauty2">
          
           
            </div>
          </div>
           <div class="reuse_product product_design_sec_wrap">
            <h4 id="productheadBeauty2"></h4>
            <div class="product_wrapper" id="productBeauty2"></div>
            <div class="seeAllProduct" id="productBeautyHeading2">
             
            </div>
          </div>
          
           <div class="reuse_product product_design_sec_wrap">
            <h4 id="productheadBeauty3"></h4>
            <div class="product_wrapper" id="productBeauty3"></div>
            <div class="seeAllProduct" id="productBeautyHeading3">
             
            </div>
          </div>
           <div class="reuse_category wrap_category3">
            <div class="category_wrap reuse_wrap_head">
              <h4>Daily Needs</h4>
              <div class="category_box_design" id="categoryBeauty4"></div>
            </div> 
          </div>
          <div class="reuse_category wrap_category3">
            <div class="category_wrap reuse_wrap_head">
              <h4>Daily Needs</h4>
              <div class="category_box_design" id="categoryBeauty5"></div>
            </div>
          </div>
           <div class="category_big_bottom_design_banner">
            <div class="category_banner_wrap" id="bannerBeauty3">
            
            </div>
          </div>
               <div class="reuse_product product_design_sec_wrap">
            <h4 id="productheadBeauty4"></h4>
            <div class="product_wrapper" id="productBeauty4"></div>
             <div class="seeAllProduct" id="productBeautyHeading4">
             
            </div>
          </div>
           <div class="reuse_product product_design_sec_wrap">
            <h4 id="productheadBeauty5"></h4>
            <div class="product_wrapper" id="productBeauty5"></div>
             <div class="seeAllProduct" id="productBeautyHeading5">
             
            </div>
          </div>
           <div class="reuse_product product_design_sec_wrap">
            <h4 id="productheadBeauty6"></h4>
            <div class="product_wrapper" id="productBeauty6"></div>
             <div class="seeAllProduct" id="productBeautyHeading6">
             
            </div>
          </div>
          
        <div class="live_it_footer">
          <h2>
            Live <br />
            it up!
          </h2>
          <p>
            crafted with <i class="ti ti-heart-filled"></i> in jhankhand, india
          </p>
        </div>
        </div>`);
    if (!loadedPages.Beauty) {
      loadedPages.Beauty = true;

      initBeauty();
    }
  } else if (name == "Fashion") {
    $(".main").removeClass("lightThemePharmacy");

    // $(".header_nav").css(
    //   "background",
    //   "linear-gradient(180deg, #DAF0FE 85.62%, #FFFFFF 100%)",
    // );
    $("#contentToggle").html("Fashion ! ");
    $("#fashionPage").show();
    $("#banners").html(` <div class="heros_boxes_category" id="fashionCategory1">
             
            
          </div>`);
    $("#fashionPage").html(`   <div class="fashion_category_wrap">
          <div class="fashion_header">
            <h4>Categories</h4>
            <a href="#"> <i class="ti ti-arrow-narrow-right-dashed"></i></a>
          </div>
          <div class="fashion_category_sec" id="fashionCategoryWithPrd"></div>
        </div>
        <div class="fashion_banner_Sec">
          <div
            class="owl-carousel owl-carousel4 banner_crousel"
            id="carousel4"
          ></div>
        </div>
        <div class="reuse_product">
          <div class="fashion_header">
            <h4 id="productheadFashion1">New Item</h4>
            <a href="#"> <i class="ti ti-arrow-narrow-right-dashed"></i></a>
          </div>
          <div class="fashion_product" id="productFashion1"></div>
            <div class="seeAllProduct" id="productFashionHeading1"></div>
        </div>
        <div class="fashion_flash">
          <div class="fashion_header">
            <h4>Flash Sale</h4>
          </div>
          <div class="fashion_sale_wrap" id="fashionCategory2">
           
            
          </div>
         
        </div>
        <div class="fashion_brands">
          <div class="fashion_brand_head fashion_header">
            <h4>Hype-Worthly Brands</h4>
          </div>
          <div class="fashion_brand_content" id="fashionCategory3"></div>
        </div>
        <div class="fashion_big_banner">
          <div class="fashion_big_img" id="fashionBanner1">
           
          </div>
          <!-- <div class="bg_banner">
            <img src="../assets/img/bg/bgFashionprd.png" alt="">
          </div> -->
          <div class="fashion_small_banner_prd" id="fashionCategory4">
            
           
            
          </div>
        </div>
        <div class="wrapper_div_relative">
          <div class="reuse_product">
            <div class="fashion_header">
              <h4 id="productheadFashion2"></h4>
              <a href="#"> <i class="ti ti-arrow-narrow-right-dashed"></i></a>
            </div>
            <div
              class="product_wrapper fashion_product"
              id="productFashion2"
            ></div>
                        <div class="seeAllProduct" id="productFashionHeading2"></div>

          </div>
          <div class="reuse_product">
            <div class="fashion_header">
              <h4 id="productheadFashion3"></h4>
              <a href="#"> <i class="ti ti-arrow-narrow-right-dashed"></i></a>
            </div>
            <div
              class="product_wrapper fashion_product"
              id="productFashion3"
            ></div>
                        <div class="seeAllProduct" id="productFashionHeading3"></div>

          </div>
          <div class="green_banner">
             <div
            class="owl-carousel owl-carousel5 banner_crousel "
            id="carousel5"
          ></div>
            <!-- <div class="green_banner_img">
              <img src="../assets/img/green_banner.svg" alt="" />
            </div> -->
          </div>
          <div class="reuse_product">
            <div class="fashion_header">
              <h4 id="productheadFashion4"></h4>
              <a href="#"> <i class="ti ti-arrow-narrow-right-dashed"></i></a>
            </div>
            <div
              class="product_wrapper fashion_product"
              id="productFashion4"
            ></div>
                        <div class="seeAllProduct" id="productFashionHeading4"></div>

          </div>
          <div class="reuse_product">
            <div class="fashion_header">
              <h4 id="productheadFashion5"></h4>
              <a href="#"> <i class="ti ti-arrow-narrow-right-dashed"></i></a>
            </div>
            <div
              class="product_wrapper fashion_product"
              id="productFashion5"
            ></div>
                        <div class="seeAllProduct" id="productFashionHeading5"></div>

          </div>
           <div class="reuse_product">
            <div class="fashion_header">
              <h4 id="productheadFashion6"></h4>
              <a href="#"> <i class="ti ti-arrow-narrow-right-dashed"></i></a>
            </div>
            <div
              class="product_wrapper fashion_product"
              id="productFashion6"
            ></div>
                        <div class="seeAllProduct" id="productFashionHeading6"></div>

          </div>
          <div class="last_sec_fashion">
            <div class="fashion_header">
              <h4>What’s Trending Near By</h4>
              <a href="#"> <i class="ti ti-arrow-narrow-right-dashed"></i></a>
            </div>
            <div class="last_fashion_data">
              <div class="last_fashion_wrap" id="fashionCategory5"></div>
            </div>
          </div>
          
        </div>
         <div class="live_it_footer">
          <h2>
            Live <br />
            it up!
          </h2>
          <p>
            crafted with <i class="ti ti-heart-filled"></i> in jhankhand, india
          </p>
        </div>`);

    if (!loadedPages.Fashion) {
      loadedPages.Fashion = true;

      initFashion();
    }
  
    $(document).ready(function () {
      $(".owl-carousel4").owlCarousel({
        loop: true,
        margin: 5,
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
  } else if (name == "Electronic") {
    $("#electricityPage").show();
    $(".main").removeClass("lightThemePharmacy");
    // $(".header_nav").css(
    //   "background",
    //   "linear-gradient(135deg, #0F2027 0%, #203A43 50%, #2C5364 100%)",
    // );
    $("#banners").html("");
    $("#electricityPage").html(`<div class="top_electric_category" id="categoryElectricity1">
         
         
        </div>  
        <div class="reuse_product product_design_sec_wrap  electric_theme">
          <h4 id="productheadElectricity1">Everyday Essentials</h4>
          <div class="product_wrapper" id="productElectricity1"></div>
          <div class="seeAllProduct" id="productElectricityHeading1"></div>
        </div>
        <div class="reuse_category wrap_category3">
            <div class="category_wrap reuse_wrap_head">
              <h4>Snacks & Drinks</h4>
              <div class="category_box_design" id="categoryElectricity2"></div>
            </div>
        </div>
         <div class="carousel_wrap">
          <h4>Brand On You</h4>
          <div
            class="owl-carousel owl-carousel6 banner_crousel"
            id="carousel6"
          ></div>
        </div>
         <div class="reuse_product product_design_sec_wrap  electric_theme">
          <h4 id="productheadElectricity2">Everyday Essentials</h4>
          <div class="product_wrapper" id="productElectricity2"></div>
          <div class="seeAllProduct" id="productElectricityHeading2"></div>
        </div>
         <div class="reuse_product product_design_sec_wrap  electric_theme">
          <h4 id="productheadElectricity3">Everyday Essentials</h4>
          <div class="product_wrapper" id="productElectricity3"></div>
          <div class="seeAllProduct" id="productElectricityHeading3"></div>
        </div>
         <div class="reuse_category wrap_category3">
            <div class="category_wrap reuse_wrap_head">
              <h4>Snacks & Drinks</h4>
              <div class="category_box_design" id="categoryElectricity3"></div>
            </div>
        </div>
         <div class="carousel_wrap">
          <h4>Brand On You</h4>
          <div
            class="owl-carousel owl-carousel7 banner_crousel"
            id="carousel7"
          ></div>
        </div>
       
         <div class="reuse_product product_design_sec_wrap  electric_theme">
          <h4 id="productheadElectricity4">Everyday Essentials</h4>
          <div class="product_wrapper" id="productElectricity4"></div>
          <div class="seeAllProduct" id="productElectricityHeading4"></div>
        </div> 
        <div class="reuse_category wrap_category3">
            <div class="category_wrap reuse_wrap_head">
              <h4>Needs for you</h4>
              <div class="category_box_design" id="categoryElectricity4"></div>
            </div>
        </div>
         <div class="reuse_category wrap_category3">
            <div class="category_wrap reuse_wrap_head">
              <h4>Shop by category</h4>
              <div class="category_box_design" id="categoryElectricity5"></div>
            </div>
        </div>
         <div class="carousel_wrap">
          <h4>Brand On You</h4>
          <div
            class="owl-carousel owl-carouselElectronic8 banner_crousel"
            id="carouselElectronic8"
          ></div>
        </div>
        
        
         <div class="reuse_product product_design_sec_wrap  electric_theme">
          <h4 id="productheadElectricity5">Everyday Essentials</h4>
          <div class="product_wrapper" id="productElectricity5"></div>
          <div class="seeAllProduct" id="productElectricityHeading5"></div>
        </div>
         <div class="reuse_product product_design_sec_wrap  electric_theme">
          <h4 id="productheadElectricity6">Everyday Essentials</h4>
          <div class="product_wrapper" id="productElectricity6"></div>
          <div class="seeAllProduct" id="productElectricityHeading6"></div>
        </div>
        <div class="live_it_footer">
          <h2>
            Live <br />
            it up!
          </h2>
          <p>
            crafted with <i class="ti ti-heart-filled"></i> in jhankhand, india
          </p>
        </div>`);

    if (!loadedPages.Electric) {
      loadedPages.Electric = true;

      initElectric();
    }
   
  } else if (name == "Pharmacy") {
    $("#pharmacyPage").show();
    $(".main").addClass("lightThemePharmacy");
    // $(".header_nav").css(
    //   "background",
    //   "linear-gradient(180deg, #116857 82.6%, #22CEAC 100%)",

    // ); 
    $("#banners").html(` <div class="hero_sec_img">
           <img id="topBanner3" src="" alt="" />
          </div>
          <div class="banner_pharmacy_more_banner" id="bannerCategoryPharmacy">
          </div>
          `);
    $("#pharmacyPage").html(` <div class="order_box_pharmacy">
          <div class="left_order_pharmacy">
            <img src="../assets/img/icon/orderPharacy.svg" alt="" />
            <h6>Order with prescription</h6>
          </div>
          <div class="right_order_pharmacy">
            <button>Order Now</button>
          </div>
        </div>
        <div class="pharmacy_crousel">
          <div
            class="owl-carousel pharmacy_carousel owl-carousel8 banner_crousel"
            id="carousel8"
          ></div>
        </div>
       
        <div class="pharmacy_product_wrap">
          <div class="pharmacy_product_header reuse_header_for_all">
            <h5 id="productheadPharmacy1">Everyday medicines</h5>
             
          </div>

          <div class="pharmacy_product_box grid_3" id="pharmacyProduct1"></div>
           <div class="seeAllProduct" id="productPharmacyHeading1">
        </div>

        <div class="pharmacy_product_wrap">
          <div class="pharmacy_product_header reuse_header_for_all">
            <h5 id="productheadPharmacy2">Everyday medicines</h5>
             
          </div>

          <div class="pharmacy_product_box grid_3" id="pharmacyProduct2"></div>
           <div class="seeAllProduct" id="productPharmacyHeading2">
        </div>
        <div class="reuse_category wrap_category2">
          <div class="category_wrap reuse_wrap_head">
            <h4>Featured brands</h4>
            <div class="category_box_design" id="catgoryPharmacy1"></div>
          </div>
        </div>
        <div class="featured_pharmacy_brand">
          <div class="pharmacy_product_header reuse_header_for_all">
            <h5>Featured brands</h5>
          </div>
          <div class="brand_wrap_pharmacy grid_3" id="brandsPharmacy"></div>
          <div class="brand_see_all">
            <h6>View All Brand</h6>
            <i class="ti ti-chevrons-right"></i>
          </div>
        </div>
        <div class="pharmacy_crousel">
          <div
            class="owl-carousel pharmacy_carousel owl-carousel9 banner_crousel"
            id="carousel9"
          ></div>
        </div>

        <div class="reuse_category wrap_category2">
          <div class="category_wrap reuse_wrap_head">
            <h4>Featured brands</h4>
            <div class="category_box_design" id="catgoryPharmacy2"></div>
          </div>
        </div>
         <div class="reuse_category wrap_category2">
          <div class="category_wrap reuse_wrap_head">
            <h4>Featured brands</h4>
            <div class="category_box_design" id="catgoryPharmacy3"></div>
          </div>
        </div>
        
      

       <div class="pharmacy_product_wrap">
          <div class="pharmacy_product_header reuse_header_for_all">
            <h5 id="productheadPharmacy3">Everyday medicines</h5>
             
          </div>

          <div class="pharmacy_product_box grid_3" id="pharmacyProduct3"></div>
           <div class="seeAllProduct" id="productPharmacyHeading3">
        </div>
        <div class="pharmacy_product_wrap">
          <div class="pharmacy_product_header reuse_header_for_all">
            <h5 id="productheadPharmacy4">Everyday medicines</h5>
             
          </div>

          <div class="pharmacy_product_box grid_3" id="pharmacyProduct4"></div>
           <div class="seeAllProduct" id="productPharmacyHeading4">
        </div>
        <div class="pharmacy_crousel">
          <div
            class="owl-carousel pharmacy_carousel owl-carousel10 banner_crousel"
            id="carousel10"
          ></div>
        </div>
          <div class="reuse_category wrap_category2">
          <div class="category_wrap reuse_wrap_head">
            <h4>Featured brands</h4>
            <div class="category_box_design" id="catgoryPharmacy4"></div>
          </div>
        </div>
         <div class="reuse_category wrap_category2">
          <div class="category_wrap reuse_wrap_head">
            <h4>Featured brands</h4>
            <div class="category_box_design" id="catgoryPharmacy5"></div>
          </div>
        </div>
        <div class="pharmacy_product_wrap">
          <div class="pharmacy_product_header reuse_header_for_all">
            <h5 id="productheadPharmacy5">Everyday medicines</h5>
             
          </div>
          <div class="pharmacy_product_box grid_3" id="pharmacyProduct5"></div>
           <div class="seeAllProduct" id="productPharmacyHeading5">
        </div>
        <div class="pharmacy_product_wrap">
          <div class="pharmacy_product_header reuse_header_for_all">
            <h5 id="productheadPharmacy6">High-Power medicines</h5>
             
          </div>
          <div class="pharmacy_product_box grid_3" id="pharmacyProduct6"></div>
           <div class="seeAllProduct" id="productPharmacyHeading6">
        </div>
            <div class="pharmacy_footer_instruction">
            <div class="pharmcy_footer">
              <div class="pharmacy_img">
                <img src="../assets/img/icon/instructionPharmacy3.svg" alt="">
              </div>
              <h6>Secure Payments</h6>
            </div>
            <div class="pharmcy_footer">
              <div class="pharmacy_img">
                <img src="../assets/img/icon/instructionPharmacy2.svg" alt="">
              </div>
              <h6>Most Trusted Pharmacy</h6>
            </div>
            <div class="pharmcy_footer">
              <div class="pharmacy_img">
                <img src="../assets/img/icon/instructionPharmacy1.svg" alt="">
              </div>
              <h6>Genuine Products</h6>
            </div>
          </div>
          <div class="pharmacy_foot_img_txt">
               <img src="../assets/img/icon/medicalIcon.svg" />
               <h5>Affordable healthcare for every Indian</h5>
          </div>
       `);
    if (!loadedPages.Pharmacy) {
      loadedPages.Pharmacy = true;

      initPharmacy();
    }
    
   
   
  } else if (name == "99Store") {
    $("#Store99Page").show();
    $(".main").removeClass("lightThemePharmacy");
    // $(".header_nav").css("background", "#F6F6F6");
    $("#banners").html(` <div class="hero_sec_img">
            <img id="topBanner4" src="" alt="" />
          </div>
          `);
    $("#Store99Page").html(` <div class="store99_category">
         <div class="reuse_header_for_all">
            <h5>Categories</h5>
          </div>
          <div class="store99_category_wrap" id="storeCategory991">
            
       
          </div>
      
        
       </div>
        <div class="reuse_product product_design_sec_wrap">
          <h4 id="producthead99store1">Top Deals</h4>
          <div class="product_wrapper" id="product99store1"></div>
          <div class="seeAllProduct" id="product99storeHeading1">
        </div>
        </div>
          <div class="store99_crousel">
          <div
            class="owl-carousel store99_carousel owl-carousel11 banner_crousel"
            id="carousel11"
          ></div>
        </div>
        <div class="reuse_product product_design_sec_wrap">
          <h4 id="producthead99store2">Top Deals</h4>
          <div class="product_wrapper" id="product99store2"></div>
          <div class="seeAllProduct" id="product99storeHeading2">
        </div>
        </div>
         <div class="reuse_category wrap_category2">
    <div class="category_wrap reuse_wrap_head">
      <h4>Top Rated</h4>
      <div class="category_box_design" id="catgory99Store2">
      </div>
    </div>
  </div>
   <div class="reuse_category wrap_category2">
    <div class="category_wrap reuse_wrap_head">
      <h4>Top Rated</h4>
      <div class="category_box_design" id="catgory99Store3">
      </div>
    </div>
  </div>
 
          <div class="store99_crousel">
          <div
            class="owl-carousel store99_carousel owl-carousel12 banner_crousel"
            id="carousel12"
          ></div>
        </div>
       
          </div>
        </div>
         <div class="reuse_wrap_head">
          <h4>Discover New Finds</h4>
          <div class="data_design_sec" id="newFind99store"></div>
        </div>
        <div class="reuse_product product_design_sec_wrap">
          <h4 id="producthead99store3">Top Deals</h4>
          <div class="product_wrapper" id="product99store3"></div>
          <div class="seeAllProduct" id="product99storeHeading3">
            
           
          </div>
        </div> 
          <div class="store99_crousel">
          <div
            class="owl-carousel store99_carousel owl-carousel12 banner_crousel"
            id="carousel12"
          ></div>
        </div><div class="store99_crousel">
          <div
            class="owl-carousel store99_carousel owl-carouselstore12 banner_crousel"
            id="carouselstore12"
          ></div>
        </div>
          <div class="reuse_category wrap_category2">
    <div class="category_wrap reuse_wrap_head">
      <h4>Top Rated</h4>
      <div class="category_box_design" id="catgory99Store4">
      </div>
    </div>
  </div>
   <div class="reuse_category wrap_category2">
    <div class="category_wrap reuse_wrap_head">
      <h4>Top Rated</h4>
      <div class="category_box_design" id="catgory99Store5">
      </div>
    </div>
  </div>
        <div class="reuse_product product_design_sec_wrap">
          <h4 id="producthead99store4">Top Deals</h4>
          <div class="product_wrapper" id="product99store4"></div>
          <div class="seeAllProduct" id="product99storeHeading4">
            
          </div>
        </div>
        <div class="reuse_product product_design_sec_wrap">
          <h4 id="producthead99store5">Top Deals</h4>
          <div class="product_wrapper" id="product99store5"></div>
          <div class="seeAllProduct" id="product99storeHeading5">
            
          </div>
        </div>
        <div class="reuse_product product_design_sec_wrap">
          <h4 id="producthead99store6">Top Deals</h4>
          <div class="product_wrapper" id="product99store6"></div>
          <div class="seeAllProduct" id="product99storeHeading6">
            
          </div>
        </div>  <div class="live_it_footer">
          <h2>
            Live <br />
            it up!
          </h2>
          <p>
            crafted with <i class="ti ti-heart-filled"></i> in jhankhand, india
          </p>
        </div>`);

    if (!loadedPages.store99) {
      loadedPages.store99 = true;

      init99Store();
    }
   
  } else if (name == "Kids") {
    $("#kidsPage").show();
    $(".main").removeClass("lightThemePharmacy");
    // $(".header_nav").css(
    //   "background",
    //   "linear-gradient(0deg, rgba(255, 184, 0, 0.5) 0%, #FFB800 100%)",
    // );
    $("#banners").html(` <div class="hero_sec_img">
              <img id="topBanner5" src="" alt="" />
          </div>
          <div class="banner_kids_more_banner" id="bannerCategoryKids1"></div>
          `);

    $("#kidsPage").html(`  <div class="reuse_product product_design_sec_wrap">
          <h4 id="productheadKids1">Top Deals</h4>
          <div class="product_wrapper" id="productkids1"></div>
          <div class="seeAllProduct" id="productKidsHeading1">
        </div>
        </div>
        <div class="reuse_product product_design_sec_wrap">
          <h4 id="productheadKids2">Top Deals</h4>
          <div class="product_wrapper" id="productkids2"></div>
           <div class="seeAllProduct" id="productKidsHeading2">
        </div>
        </div>
         <div class="kids_crousel_wrap">
          <div
            class="owl-carousel kids_carousel owl-carousel13 banner_crousel"
            id="carousel13"
          ></div>
        </div>
         <div class="reuse_category wrap_category2">
          <div class="category_wrap reuse_wrap_head">
            <h4>Featured brands</h4>
            <div class="category_box_design" id="catgoryKids1"></div>
          </div>
        </div>
        <div class="reuse_category wrap_category2">
          <div class="category_wrap reuse_wrap_head">
            <h4>Featured brands</h4>
            <div class="category_box_design" id="catgoryKids2"></div>
          </div>
        </div>
        <div class="reuse_category wrap_category2">
          <div class="category_wrap reuse_wrap_head">
            <h4>Featured brands</h4>
            <div class="category_box_design" id="catgoryKids3"></div>
          </div>
        </div>

        
        
         <div class="kids_crousel_wrap">
          <div
            class="owl-carousel kids_carousel owl-carousel14 banner_crousel"
            id="carousel14"
          ></div>
        </div>
            <div class="reuse_product product_design_sec_wrap">
          <h4 id="productheadKids3">Top Deals</h4>
          <div class="product_wrapper" id="productkids3"></div>
           <div class="seeAllProduct" id="productKidsHeading3">
        </div>
        </div>
        <div class="reuse_product product_design_sec_wrap">
          <h4 id="productheadKids4">Top Deals</h4>
          <div class="product_wrapper" id="productkids4"></div>
           <div class="seeAllProduct" id="productKidsHeading4">
        </div>
        </div>
        <div class="reuse_category wrap_category2">
          <div class="category_wrap reuse_wrap_head">
            <h4>Featured brands</h4>
            <div class="category_box_design" id="catgoryKids4"></div>
          </div>
        </div>
        <div class="reuse_category wrap_category2">
          <div class="category_wrap reuse_wrap_head">
            <h4>Featured brands</h4>
            <div class="category_box_design" id="catgoryKids5"></div>
          </div>
        </div>
           <div class="reuse_wrap_head">
          <h4>Shop by Stores</h4>
          <div class="data_design_sec" id="categoryNewFind"></div>
        </div>
         <div class="kids_crousel_wrap">
          <div
            class="owl-carousel kids_carousel owl-carousel15 banner_crousel"
            id="carousel15"
          ></div>
        </div>
           <div class="reuse_product product_design_sec_wrap">
          <h4 id="productheadKids5">Top Deals</h4>
          <div class="product_wrapper" id="productkids5"></div>
          <div class="seeAllProduct" id="productKidsHeading5">
        </div>
        </div>
        
        <div class="reuse_product product_design_sec_wrap">
          <h4 id="productheadKids6">Top Deals</h4>
          <div class="product_wrapper" id="productkids6"></div>
           <div class="seeAllProduct" id="productKidsHeading6">
        </div>
        </div>
                 <div class="live_it_footer">
          <h2>
            Live <br />
            it up!
          </h2>
          <p>
            crafted with <i class="ti ti-heart-filled"></i> in jhankhand, india
          </p>
        </div>`);

    if (!loadedPages.kids) {
      loadedPages.kids = true;

      initKids();
    }
  }
}
