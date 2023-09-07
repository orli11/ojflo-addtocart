const cards = document.getElementById('cards');
const items = document.getElementById('items');
const footer = document.getElementById('footer');
const templateCards = document.getElementById('template-card').content;
const templateCarrito = document.getElementById('template-carrito').content;
const templateFooter = document.getElementById('template-footer').content;
const fragment = document.createDocumentFragment();

//VARIABLES 
let carrito = {};

document.addEventListener('DOMContentLoaded', () => {
    fetchData();
    if(localStorage.getItem('carrito')) {
        carrito = JSON.parse(localStorage.getItem('carrito'));
        pintarCarrito();
    }
    
});
cards.addEventListener('click', (e) => {
    addCarrito(e);
});
items.addEventListener('click', (e) => {
    actionsDelete(e);
});

//Funciones
const actionsDelete = (e) => {
    if(e.target.classList.contains('btn-warning')) {
        const product = carrito[e.target.dataset.id];
        product.cantidad++;
        carrito[e.target.dataset.id] = {...product};
        pintarCarrito()
    }
    if(e.target.classList.contains('btn-danger')) {
        const product = carrito[e.target.dataset.id];
        product.cantidad--;
        if(product.cantidad === 0 ){
            delete carrito[e.target.dataset.id]
        } else {
            carrito[e.target.dataset.id] = {...product};
        }
        pintarCarrito();
    }
    e.stopPropagation();
}

const addCarrito = e => {
    if(e.target.classList.contains('btn-dark')) {
        setCarrito(e.target.parentElement);
    }
    e.preventDefault();
    e.stopPropagation();
}

const setCarrito = item => {
    const aux = {
        title: item.querySelector('h5').textContent,
        price: item.querySelector('p').textContent,
        id: item.querySelector('button').dataset.id,
        cantidad: 1
    }
    if(carrito.hasOwnProperty(aux.id)) {
        aux.cantidad = carrito[aux.id].cantidad + 1;
    }
    carrito[aux.id] = { ...aux }
    pintarCarrito()
}

const pintarCarrito = () => {
    items.innerHTML = '';
    Object.values(carrito).forEach((item) => {
        const clone = templateCarrito.cloneNode(true);
        clone.querySelector('th').textContent = item.id;
        clone.querySelectorAll('td')[0].textContent = item.title;
        clone.querySelectorAll('td')[1].textContent = item.cantidad;
        clone.querySelector('span').textContent = item.cantidad * item.price;
        clone.querySelector('.btn-warning').dataset.id = item.id;
        clone.querySelector('.btn-danger').dataset.id = item.id;
        fragment.appendChild(clone);
    });
    items.appendChild(fragment);

    drawFooter();

    localStorage.setItem('carrito', JSON.stringify(carrito));
}

const drawFooter = () => {
    footer.innerHTML = '';
    if(Object.keys(carrito).length === 0){
        footer.innerHTML = /*html*/`<th class="text-center" colspan="5" scope="row">Carrito vacío...💲</th>`;
        return;
    }
    const nCantidad = Object.values(carrito).reduce((acc, { cantidad }) => acc + cantidad, 0);
    const nTotal = Object.values(carrito).reduce((acc, { cantidad, price }) => acc + (cantidad * price), 0);

    templateFooter.querySelectorAll('td')[0].textContent = nCantidad;
    templateFooter.querySelector('span').textContent = nTotal;
    const clone = templateFooter.cloneNode(true);
    fragment.appendChild(clone);
    footer.appendChild(fragment);

    const btn = document.querySelector('#vaciar');
    btn.addEventListener('click', () => {
        carrito = {}
        pintarCarrito();
    });
}

const fetchData = async () => {
    const response = await fetch('./api/products.json');
    const products = await response.json()
    //console.log('products => ', products)
    drawCards(products)
}

const drawCards = (products) => {
    products.forEach((item) => {
        templateCards.querySelector('h5').textContent = item.title;
        templateCards.querySelector('p').textContent = item.price;
        templateCards.querySelector('button').dataset.id = item.id;
        templateCards.querySelector('img').setAttribute('src', item.urlImage);


        const clone = templateCards.cloneNode(true);
        fragment.appendChild(clone);
    });
    cards.appendChild(fragment);
}