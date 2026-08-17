// let apiUrl =
//   "http://localhost/all_projects/ITS/Dashboard_multibranch/apis/app/";


function handleInputLogin(e) {
  console.log(e.target.value);
  let value = e.target.value;
  if (value.length > 9) {
    $("#btnLogin").html(
      ` <button class="continue_btn activeBtn">
            Continue
        </button>`,
    );
  }
}
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000);
}
function handleLogin(e) {
  e.preventDefault();
  let phone = $("#phone").val();
  location.href = "otp.html";
  let otp = generateOTP();
  localStorage.setItem("phone", phone);
  localStorage.setItem("otp", otp);
}

function handleOtpLogin(e) {
  e.preventDefault();
  const otpInputs = document.querySelectorAll(".otp_inputs input");
  let otp = localStorage.getItem("otp");
  let otpUser = "";
  otpInputs.forEach((item) => {
    otpUser = otpUser + item.value;
  });
  if (otp !== otpUser) {
    alert("something wents wrong ! on OTP");
    return false;
  }
  let phone = localStorage.getItem("phone");

  $.ajax({
    url: apiUrl,
    method: "POST",
    dataType: "JSON",
    data: {
      type: "handleLoginOtp",
      phone,
    },
    success: function (response) {
      if (response.status == "success") {
        localStorage.setItem("userId", response?.userId);
        location.replace("../food/Pages/welcome.html");
        // localStorage.removeItem("otp");
        // localStorage.removeItem("phone");
      } else {
        console.log(response.message);
      }
    },
  });
}

function getLoginData() {
  let phone = localStorage.getItem("phone");
  let otp = localStorage.getItem("otp");
  alert('Use OTP for testing '+otp);
  $("#phone").html(phone);
}