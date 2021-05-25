// DOM
const usernameId = document.querySelector("#username");
const passwordId = document.querySelector("#password");
const logInBtn = document.querySelector("#logIn");
const checkLogInBtn = document.querySelector("#checkLogIn");

function showError(title) {
  Swal.fire({
    icon: "error",
    title,
    confirmButtonText: "確定",
  });
}

function showSuccess(title) {
  Swal.fire({
    icon: "success",
    title,
    showConfirmButton: false,
    timer: 1800,
  });
}

function login(userData) {
  logInBtn.setAttribute("disabled", "");
  logInBtn.innerHTML = `登入中 <span class="js-spinner spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`;

  axios
    .post(`${url}admin/signin`, userData)
    .then((res) => {
      if (res.data.success) {
        logInBtn.removeAttribute("disabled");
        logInBtn.innerHTML = `登入`;
        const { token, expired } = res.data;
        // 把毫秒改成日期格式
        document.cookie = `shiMingToken=${token}; expires=${new Date(expired)}`;
        showSuccess("登入成功！");
        setTimeout(() => {
          window.location.replace("products_admin.html");
        }, 3000);
      } else {
        logInBtn.removeAttribute("disabled");
        logInBtn.innerHTML = `登入`;
        showError("登入失敗");
      }
    })
    .catch((err) => {
      console.error(err);
    });
}

function checkLogIn() {
  const token = document.cookie.replace(/(?:(?:^|.*;\s*)shiMingToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
  axios.defaults.headers.common.Authorization = token;
  axios
    .post(`${url}api/user/check`)
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.error(err);
    });
}

function formCheck() {
  const username = usernameId.value.trim();
  const password = passwordId.value.trim();

  const usernameRules = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  if (username === "" || password === "") {
    showError("帳號或密碼不得為空！");
  } else if (!usernameRules.test(username)) {
    showError("帳號不符合 Email 格式！");
  } else {
    const userData = {
      username,
      password,
    };
    login(userData);
  }
}

logInBtn.addEventListener("click", formCheck);
checkLogInBtn.addEventListener("click", checkLogIn);
