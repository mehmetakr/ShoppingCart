const cartBtn = document.querySelector(".cart-btn");

const cartİtems = document.querySelector(".cart-items");
const clearbtn = document.querySelector(".btn-clear");
const carttotal = document.querySelector(".total-value");

const cartContent = document.querySelector(".cart-list");
const productsDOM = document.querySelector("#products-dom");

let cart = [];
let buttonsDOM = [];

class Products {
  async getproducts() {
    try {
      let result = await fetch(
        "https://6565c8a8eb8bb4b70ef2583b.mockapi.io/products "
      );
      let data = await result.json();
      let products = data;
      return products;
    } catch (error) {}
  }
}

class UI {
  displayProducts(products) {
    let result = "";
    products.forEach((item) => {
      result += `
            
            <div class="col-lg-4 col-md-6">

            <div class="product">

                <div class="product-image">


                    <img src="${item.image}" alt="product">

                </div>
                <div class="product-hover">

                    <span class="product-title">${item.title}</span>
                    <span class="product-price">${item.price}</span>
                    <button class="btn btn-add-to-cart" data-id =${item.id}>

                        <i class="fas fa-cart-shopping"></i>

                    </button>
                </div>
            </div>


        </div>
            `;
    });

    productsDOM.innerHTML = result;
  }

  getBagButtons() {
    const buttons = [...document.querySelectorAll(".btn-add-to-cart")];
    buttonsDOM = buttons;

    buttons.forEach((button) => {
      let id = button.dataset.id;
      let incart = cart.find((item) => item.id === id);

      if (incart) {
        button.setAttribute("disabled", "disabled");
        button.opacity = ".3";
      } else {
        button.addEventListener("click", (event) => {
          event.target.disabled = true;
          event.target.style.opacity = ".3";

          // get product from products

          let cartItem = { ...Storage.getProduct(id), amount: 1 };

          cart = [...cart, cartItem];
          // save cart in local storage
          Storage.savecart(cart);
          this.savecartValues(cart);
          this.addcartitem(cartItem);
          this.showcart();
        });
      }
    });
  }

  savecartValues(cart) {
    let temptotal = 0;
    let itemstotal = 0;
    cart.map((item) => {
      temptotal += item.price * item.amount;
      itemstotal += item.amount;
    });

    carttotal.innerText = parseFloat(temptotal.toFixed(2));
    cartİtems.innerText = itemstotal;
  }

  addcartitem(item) {
    const li = document.createElement("li");

    li.classList.add("cart-list-item");
    li.innerHTML = `

<div class="cart-left">

<div class="cart-left-image">
    <img src="${item.image}" alt="product">

</div>
<div class="cart-left-info">
    <a class="cart-left-info-title" href="#">${item.title}i</a>
    <span class="cart-left-info-price">${item.price}</span>
</div>
</div>

<div class="cart-right">
<div class="cart-right-quantity">

    <button class="quantity-minus" date-id=${item.id}>
        <i class="fas fa-minus"></i>
    </button>
    <span class="quantity">${item.amount}</span>
    <button class="quantity-plus" data-id=${item.id}>
        <i class="fas fa-plus"></i>
    </button>
</div>
<div class="cart-right-remove">
    <button class="cart-remove-btn" data-id=${item.id}>
        <i class="fas fa-trash"></i>
    </button>

</div>

</div>
`;
    cartContent.appendChild(li);
  }

  showcart() {
    cartBtn.click();
  }

  setupApp() {
    cart = Storage.getcart();

    this.savecartValues(cart);
    this.populatecart(cart);
  }

  populatecart(cart) {
    cart.forEach((item) => this.addcartitem(item));
  }

  cartlogic() {
    clearbtn.addEventListener("click", () => {
      this.clearCart();


    });

    cartContent.addEventListener("click" ,event =>{

if(event.target.classList.contains("cart-remove-btn")){
let remowitems =event.target;
let id =remowitems.dataset.id;
remowitems.parentElement.parentElement.parentElement.remove();
this.removeitems(id);
}

else if(event.target.classList.contains("quantity-minus")){
let lowerAmount =event.target;
let id =lowerAmount.dataset.id;

let tempItem =cart.find(item => item.id === id);
tempItem.amount = tempItem.amount - 1;
if (tempItem.amount > 0) {
  Storage.savecart(cart);
  this.savecartValues(cart)
  lowerAmount.nextElementSibling.innerText =tempItem.amount;

}
else{

  lowerAmount.parentElement.parentElement.parentElement.remove();
this.removeitems(id);

}
}
else if (event.target.classList.contains("quantity-plus")) {
  
  let addamount =event.target;
  let id =addamount.dataset.id;
  let tempItem =cart.find(item => item.id === id);
  tempItem.amount = tempItem.amount + 1;
  Storage.savecart(cart);
this.savecartValues(cart); 
 addamount.previousElementSibling.innerText =tempItem.amount
}

    })


  }
  clearCart() {
    let cartItems = cart.map(item => item.id) 
    
      cartItems.forEach(id => this.remowitems(id));

      while(cartContent.children.length>0){

        cartContent.removeChild(cartContent.children[0])
      
    }
  
  };
  remowitems(id) {
    cart = cart.filter((item) => item.id !== id);
    this.savecartValues(cart);
    Storage.savecart(cart);
    let button = this.getsinglebutton(id);
    button.disabled = false;
    button.style.opacity = "1";
  }

  getsinglebutton(id) {
    return buttonsDOM.find((button) => button.dataset.id === id);
  }
}
class Storage {
  static saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
  }

  static getProduct(id) {
    let products = JSON.parse(localStorage.getItem("products"));
    return products.find((product) => product.id === id);
  }

  static savecart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  static getcart() {
    return localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart"))
      : [];
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const ui = new UI();
  const products = new Products();

  ui.setupApp();

  products
    .getproducts()
    .then((products) => {
      ui.displayProducts(products);
      Storage.saveProducts(products);
    })

    .then(() => {
      ui.getBagButtons();
      ui.cartlogic();
    });
});
