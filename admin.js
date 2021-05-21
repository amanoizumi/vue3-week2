const logOutBtn = document.querySelector(".js-logout");

const app = {
  data: {
    products: [],
  },
  getData() {
    axios.get(`${url}api/${path}/admin/products`).then((res) => {
      if (!res.data.success) {
        this.showError("取得商品列表失敗！");
      } else {
        this.data.products = res.data.products;
        this.render();
      }
    });
  },
  logOut() {
    axios.post(`${url}logout`).then((res) => {
      app.init();
    });
  },
  deleteProduct(e) {
    const productId = e.target.dataset.id;
    Swal.fire({
      title: "確定要刪除產品嗎？",
      showCancelButton: true,
      confirmButtonText: `確定`,
      cancelButtonText: `取消`,
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`${url}api/${path}/admin/product/${productId}`).then((res) => {
          app.getData();
        });
      }
    });
  },
  render() {
    const productList = document.querySelector("#productList");
    const productCount = document.querySelector("#productCount");
    let template = ``;
    this.data.products.forEach((product) => {
      template += `
      <tr>
      <td>${product.title}</td>
      <td>
      ${product.origin_price}
      </td>
      <td>
      ${product.price}
      </td>
      <td>
        <a href="#" class="enabled" data-id="${product.id}"
        ${product.is_enabled ? "text-success" : "text-danger"}">
        ${product.is_enabled ? "啟用" : "未啟用"}
        </a>
      </td>
      <td>
        <button type="button" class="btn btn-sm btn-outline-danger move deleteBtn" data-id="${
          product.id
        }"> 刪除 </button>
      </td>
    </tr>
      `;
    });
    productList.innerHTML = template;
    productCount.innerHTML = this.data.products.length;
    const deleteBtn = document.querySelectorAll(".move");
    deleteBtn.forEach((btn) => {
      btn.addEventListener("click", this.deleteProduct);
    });
  },
  init() {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)shiMingToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    axios.defaults.headers.common.Authorization = token;

    axios.post(`${url}api/user/check`).then((res) => {
      if (!res.data.success) {
        this.showError("您尚未登入！即將跳轉回登入頁面");
        setTimeout(() => {
          window.location.replace("logIn.html");
        }, 3000);
      } else {
        this.getData();
      }
    });
  },
  showError(title) {
    Swal.fire({
      icon: "error",
      title,
      confirmButtonText: "確定",
    });
  },
  showSuccess(title) {
    Swal.fire({
      icon: "success",
      title,
      showConfirmButton: false,
      timer: 1800,
    });
  },
};
logOutBtn.addEventListener("click", app.logOut);
app.init();
