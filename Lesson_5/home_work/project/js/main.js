'use strict';

const image = 'https://placehold.it/200x150';
const cartImage = 'https://placehold.it/100x80';

const API = 'https://raw.githubusercontent.com/malashenok/JS_advanced/master/online-store-api/response';

//super for Catalog and Cart
class List {
    constructor(url, container) {
        this.container = container;
        this.url = url;
        this.items = [];
        this._init();
    }

    _init() {
        //listeners
        return false;
    }

    getJSON(url) {
        return fetch(url);

    }

    _render() {
        let block = document.querySelector(this.container);
        let htmlStr = '';
        this.items.forEach(item => {
            let product = new lists[this.constructor.name](item);
            htmlStr += product.render();

        });
        block.innerHTML = htmlStr;
    }
}

//super for CatalogItem and CartItem
class Item {
    constructor(obj, img = image) {
        this.product_name = obj.product_name;
        this.price = obj.price;
        this.id_product = obj.id_product;
        this.img = img;
    }


    
    render() {
        return `<div class="product-item" data-id="${this.id_product}">
                <img src="${this.img}" alt="Some img">
                    <div class="desc">
                        <h3>${this.product_name}</h3>
                        <p>${this.price} $</p>
                        <button class="buy-btn" 
                        data-id="${this.id_product}"
                        data-name="${this.product_name}"
                        data-image="${this.img}"
                        data-price="${this.price}">Купить</button>
                    </div>
                </div>`;
    }
}

//Класс каталога
class Catalog extends List {
    constructor(cart, container = '.products', url = '/catalogData.json') {
        super(url, container);
        this.cart = cart;
    }

    _addListeners() {
        document.querySelector(this.container).addEventListener('click', event => {
            if (event.target.classList.contains('buy-btn')) {
                this.cart.addItem(event.target);
            }
        });
    }

    _init() {
        this.getJSON(API + this.url)
            .then(d => d.json())
            .then(data => { this.items = data; })
            .then(() => { this._render(); })
            .finally(() => { this._addListeners(); });
    }

}

//Класс товара
class CatalogItem extends Item {
}

class Cart extends List {

    constructor(url = '/getBasket.json', container = '.cart-block') {
        super(url, container);
        //this.totalSum = 0;
    }

    _addListeners() {
        document.querySelector('.btn-cart').addEventListener('click', () => {
            document.querySelector('.cart-block').classList.toggle('invisible');
        });

        document.querySelector('.cart-block').addEventListener('click', evt => {
            if (evt.target.classList.contains('del-btn')) {
                this.removeItem(evt.target);
            }
        });
    }

    _init() {
        this.getJSON(API + this.url)
            .then(d => d.json())
            .then(data => { this.items = data.contents; })
            .then(() => { this._render(); })
            .finally(() => { this._addListeners(); })
    }
    addItem(item) {
        this.getJSON(API + '/addToBasket.json')
            .then(d => d.json())
            .then(response => {
                if (response.result) {
                    console.log(`Товар ${item.dataset.name} добавлен в корзину`);
                }
            });
    }

    removeItem(item) {
        this.getJSON(API + '/deleteFromBasket.json')
            .then(d => d.json())
            .then(response => {
                if (response.result) {
                    console.log(`Товар ${item.dataset.name} удален из корзины`);
                }
            });
    }

    getTotalSum() {
        return;
    }
}

class CartItem extends Item {
    constructor(obj, img = cartImage) {
        super(obj, img);
        this.quantity = 1;
    }

    render() {
        return `<div class="cart-item" data-id="${this.id_product}">
                <div class="product-bio">
                    <img src="${this.img}" alt="Some image">
                    <div class="product-desc">
                        <p class="product-title">${this.product_name}</p>
                        <p class="product-quantity">Quantity: ${this.quantity}</p>
                        <p class="product-single-price">${this.price}</p>
                    </div>
                </div>
                <div class="right-block">
                    <p class="product-price">${this.quantity * this.price}</p>
                    <button class="del-btn" data-id="${this.id_product}" data-name="${this.product_name}"">&times;</button>
                </div>
            </div>`;
    }
}

const lists = {
    Catalog: CatalogItem,
    Cart: CartItem
}

let cart = new Cart();
let catalog = new Catalog(cart);