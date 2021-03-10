const products = [
    {
      id: 1,
      name: "Ноутбук Lenovo",
      price: 18000,
      img: "img/cards/notebook_lenovo.jpg",
      alt: "Lenovo",
    },
    {
      id: 2,
      name: "Фотокамера Nikon",
      price: 25000,
      img: "img/cards/camera_nikon.jpg",
      alt: "Nikon",
    },
    {
      id: 3,
      name: "Apple iPad",
      price: 35000,
      img: "img/cards/ipad.jpg",
      alt: "ipad",
    },
    {
      id: 4,
      name: "Samsung Galaxy",
      price: 20000,
      img: "img/cards/phone_galaxy.jpg",
      alt: "Samsung",
    },
    {
      id: 5,
      name: "Телевизор SUPRA",
      price: 19000,
      img: "img/cards/tv_supra.jpg",
      alt: "SUPRA",
    },
  ];
  
  class Gallery {
    #cardTemplate(product) {
      const description = "Some random description";
      const html = `
      <div class="col-sm-6">
        <div class="card" style="width: 18rem;">
            <img src="${product.img}" class="card-img-top" alt="${product.alt}">
            <div class="card-body">
                <h5 class="card-title">${product.name}</h5>
                <p class="card-text">${description} id: ${product.id}</p>
                <p class="card-text">Price: ${this.#getLocalPrice(
                  product.price
                )}</p>
                  <button type="submit" class="btn btn-primary" onclick="addToShoppingCard(${
                    product.id
                  })">Add to cart</button>
            </div>
        </div>
      </div>
      `;
      return html;
    }
  
    #getLocalPrice(price) {
      return new Intl.NumberFormat("ru-RU", {
        style: "currency",
        currency: "RUB",
      }).format(price);
    }
  
    renderGallery() {
      let html = "";
      for (const product of products) {
        html += this.#cardTemplate(product);
      }
      return html;
    }
  }
  
  class ShoppingCart {
    #shoppingCart = [];
  
    #getLocalPrice(price) {
      return new Intl.NumberFormat("ru-RU", {
        style: "currency",
        currency: "RUB",
      }).format(price);
    }
  
    #rowTemplate(id) {
      const product = products.find((p) => p.id === id);
  
      const name = product.name,
        price = product.price,
        localPrice = this.#getLocalPrice(price),
        quantity = this.#shoppingCart.find((p) => p.id === id).quantity,
        sum = this.#getLocalPrice(price * quantity);
  
      const html = `
      <tr>
          <td>${id}</td>
          <td>${name}</td>
          <td>${localPrice}</td>
          <td>${quantity}
             <button type="submit" onclick="increaseQuantity(${id})">+</button>
             <button type="submit" onclick="decreaseQuantity(${id})">-</button>
          </td>
          <td>${sum}</td>
          <td>
              <button type="submit" onclick="removeProductFromCart(${id})">X</button>
          </td>
      </tr>
      `;
      return html;
    }
  
    renderShoppingCart() {
      if (this.#shoppingCart.length === 0) {
        return "Корзина пуста!";
      }
      let html = "";
  
      for (const position of this.#shoppingCart) {
        html += this.#rowTemplate(position.id);
      }
      return html;
    }
  
    renderShoppingCartSummary(){
      let totalCartSum = 0;
      let totalCartAmount = 0;
      for (let position of this.#shoppingCart){
        const product = products.find((p) => p.id === position.id);
        totalCartSum += product.price*position.quantity;
        totalCartAmount += position.quantity;
      }
  
      return `Итого: ${totalCartAmount} товаров на сумму  ${totalCartSum} руб.`
    }
  
    addToShoppingCart(id) {
      const cartID = this.#shoppingCart.findIndex((p) => p.id === id);
      if (cartID < 0) {
        this.#shoppingCart.push({
          id: id,
          quantity: 1,
        });
      } else {
        this.#shoppingCart[cartID].quantity++;
      }
    }
  
    removeFromShoppingCart(id) {
      const cartID = this.#shoppingCart.findIndex((p) => p.id === id);
      this.#shoppingCart.splice(cartID, 1);
    }
  
    increaseQuantity(id) {
      const cartID = this.#shoppingCart.findIndex((p) => p.id === id);
      this.#shoppingCart[cartID].quantity++;
    }
  
    decreaseQuantity(id) {
      const cartID = this.#shoppingCart.findIndex((p) => p.id === id);
      this.#shoppingCart[cartID].quantity--;
  
      if (this.#shoppingCart[cartID].quantity <= 0) {
        this.removeFromShoppingCart(id);
      }
    }
  
  
  }
  
  // Here starts the code!
  
  const gallery = new Gallery(),
    shoppingCart = new ShoppingCart();
  
  document.addEventListener("DOMContentLoaded", () => {
    galleryLoad(gallery.renderGallery());
    shoppingCartLoad(shoppingCart.renderShoppingCart());
  });
  
  function galleryLoad(htmlGallery) {
    const galleryContainer = document.querySelector("#gallery");
    galleryContainer.innerHTML = htmlGallery;
  }
  
  function shoppingCartLoad(htmlShoppingCart) {
    const shoppingCartContainer = document.querySelector("#cart"),
    summaryContainer = document.querySelector("#summ-amount");
    summaryContainer.innerHTML = shoppingCart.renderShoppingCartSummary();
    shoppingCartContainer.innerHTML = htmlShoppingCart;
  
  }
  
  function addToShoppingCard(id) {
    console.log("ID:" + id);
    shoppingCart.addToShoppingCart(id);
    shoppingCartLoad(shoppingCart.renderShoppingCart());
  }
  
  function increaseQuantity(id) {
    shoppingCart.increaseQuantity(id);
    shoppingCartLoad(shoppingCart.renderShoppingCart());
  }
  
  function decreaseQuantity(id) {
    shoppingCart.decreaseQuantity(id);
    shoppingCartLoad(shoppingCart.renderShoppingCart());
  }
  
  function removeProductFromCart(id) {
    shoppingCart.removeFromShoppingCart(id);
    shoppingCartLoad(shoppingCart.renderShoppingCart());
  }
  
  