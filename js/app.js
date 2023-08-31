const cards = document.getElementById('cards');
const items = document.getElementById('items');
const templateCards = document.getElementById('template-card').content;
const fragment = document.createDocumentFragment();

//VARIABLES 
let carrito = {};

document.addEventListener('DOMContentLoaded', () => {
    fetchData();
});

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