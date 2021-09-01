let hash = location.hash.substring(1);//delete # from hash

//my method to change the category(title) on the products page
// const goodsTitle = document.querySelector('.goods__title');
// const navigationList = document.querySelector('.navigation__list ');
// function changeCategory() {
//     switch (location.hash) {
//         case '#men':
//             goodsTitle.innerHTML = 'Мужчинам'
//             break;
//         case '#women':
//             goodsTitle.innerHTML = 'Женщинам'
//             break;
//         case '#kids':
//             goodsTitle.innerHTML = 'Детям'
//             break;
//         default:
//             goodsTitle.innerHTML = 'Для всех'
//     }
// }
// changeCategory();


//Request do db.json
const getData = async () => {
    const data = await fetch('db.json');

    if (data.ok) {
        return data.json();
    } else {
        throw new Error(`Cannot get the data, error ${data.status} ${data.statusText}`);
    }
};

const getGoods = (callback, prop, value) => {
    getData()
        .then(data => {
            if (value) {
                callback(data.filter(item => item[prop] === value))
            } else {
                callback(data);
            }
        })
        .catch(err => {
            console.error(err);
        })

}

//show the data for products page
try {
    const goodsList = document.querySelector('.goods__list');

    if (!goodsList) {
        throw 'This is not a goods page!';
    }

    // changing the category(title) on the page
    const goodsTitle = document.querySelector('.goods__title');

    const changeTitle = () => {
        goodsTitle.textContent = document.querySelector(`[href*="#${hash}"]`).textContent;
    }

    //destructuring data object
    const createCard = ({id, preview, cost, brand, name, sizes}) => {

        const li = document.createElement('li');

        li.classList.add('goods__item');

        li.innerHTML = `
        <article class="good">
               <a class="good__link-img" href="card-good.html#${id}">
                   <img class="good__img" src="goods-image/${preview}" alt="">
               </a>
               <div class="good__description">
                   <p class="good__price">${cost} &#8381;</p>
                   <h3 class="good__title">${brand} <span class="good__title__grey">/ ${name}</span></h3>
                   ${sizes ?
            `<p class="good__sizes">Размеры (RUS): <span class="good__sizes-list">${sizes.join(' ')}</span></p>`
            : ''
        }
                         
                   <a class="good__link" href="card-good.html#${id}">Подробнее</a>
               </div>
        </article>
        `;
        return li;
    };

    const renderGoodsList = data => {
        goodsList.textContent = '';

        data.forEach((item) => {
            const card = createCard(item);
            goodsList.append(card);
        })
    };

    window.addEventListener('hashchange', () => {
        hash = location.hash.substring(1);
        getGoods(renderGoodsList, 'category', hash);
        changeTitle();
        // changeCategory();
    })
    changeTitle();
    // changeCategory();
    getGoods(renderGoodsList, 'category', hash);

} catch (err) {
    console.warn(err)
}

//cart
const getLocalStorage = () => JSON?.parse(localStorage.getItem('cart-lomoda')) || [];
const setLocalStorage = (data) => localStorage.setItem('cart-lomoda', JSON.stringify(data));

const cartTotalCost = document.querySelector('.cart__total-cost');
const cartListGoods = document.querySelector('.cart__list-goods');

const renderCart = () => {
    cartListGoods.textContent = '';

    const cartItems = getLocalStorage();

    let totalPrice = 0;

    cartItems.forEach((item, i) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${i + 1}</td>
            <td>${item.brand} ${item.name}</td>
            ${item.color ? `<td>${item.color}</td>` : '<td>-</td>'}
            ${item.size ? `<td>${item.size}</td>` : '<td>-</td>'}
            <td>${item.cost} &#8381;</td>
            <td><button class="btn-delete" data-id="${item.id}">&times;</button></td>
        `;

        totalPrice += item.cost;

        cartListGoods.append(tr);

    });

    cartTotalCost.textContent = totalPrice + '₽';
}

const deleteItemCart = id => {
    const cartItems = getLocalStorage();
    const newCartItems = cartItems.filter(item => item.id !== id);
    setLocalStorage(newCartItems);
}

cartListGoods.addEventListener('click', (e) => {
    if (e.target.matches('.btn-delete')){
        deleteItemCart(e.target.dataset.id);
        renderCart();
    }
})


//show the data of one product
try {
    if (!document.querySelector('.card-good')) { //verify if we are on a product page
        throw 'This in not a card-good page'
    }
    const cardGoodImage = document.querySelector('.card-good__image');
    const cardGoodBrand = document.querySelector('.card-good__brand');
    const cardGoodTitle = document.querySelector('.card-good__title');
    const cardGoodPrice = document.querySelector('.card-good__price');
    const cardGoodColor = document.querySelector('.card-good__color');
    const cardGoodColorList = document.querySelector('.card-good__color-list');
    const cardGoodSizes = document.querySelector('.card-good__sizes');
    const cardGoodSizesList = document.querySelector('.card-good__sizes-list');
    const cardGoodBuy = document.querySelector('.card-good__buy');

    const cardGoodSelectWrapper = document.querySelectorAll('.card-good__select__wrapper');

    const generateList = data => data.reduce((html, item, i) => html +
        `<li class="card-good__select-item" data-id="${i}">${item}</li>`, '');

    const renderCardGood = ([{id, brand, name, cost, color, sizes, photo}]) => {

        const data = {brand, name, cost, id};

        cardGoodImage.src = `goods-image/${photo}`;
        cardGoodImage.alt = `${brand} ${name}`
        cardGoodBrand.textContent = brand
        cardGoodTitle.textContent = name;
        cardGoodPrice.textContent = `${cost} ₽`;
        if (color) {
            cardGoodColor.textContent = color[0];
            cardGoodColor.dataset.id = 0;
            cardGoodColorList.innerHTML = generateList(color);
        } else {
            cardGoodColor.style.display = 'none';
        }

        if (sizes) {
            cardGoodSizes.textContent = sizes[0];
            cardGoodSizes.dataset.id = 0;
            cardGoodSizesList.innerHTML = generateList(sizes);
        } else {
            cardGoodSizes.style.display = 'none';
        }



        cardGoodBuy.addEventListener('click', () => {
            if (cardGoodBuy.classList.contains('delete')) {
                deleteItemCart(id);
                cardGoodBuy.classList.remove('delete');
                cardGoodBuy.textContent = 'Добавить в корзину';
                return;
            }
            if (color){
                data.color = cardGoodColor.textContent;
            }
            if (sizes){
                data.size = cardGoodSizes.textContent;
            }
            if (getLocalStorage().some(item => item.id === id)){
                cardGoodBuy.classList.add('delete');
                cardGoodBuy.textContent = 'Удалить из корзины';
            }

            cardGoodBuy.classList.add('delete');
            cardGoodBuy.textContent = 'Удалить из корзины';

            const cartData = getLocalStorage();
            cartData.push(data);
            setLocalStorage(cartData);
        })
    };

    cardGoodSelectWrapper.forEach(item => {
        item.addEventListener('click', e => {
            const target = e.target;

            if (target.closest('.card-good__select')) {
                target.classList.toggle('card-good__select__open');
            }

            if (target.closest('.card-good__select-item')) {
                const cardGoodSelect = item.querySelector('.card-good__select');
                cardGoodSelect.textContent = target.textContent;
                cardGoodSelect.dataset.id = target.dataset.id;
                cardGoodSelect.classList.remove('card-good__select__open');
            }
        });
    })

    getGoods(renderCardGood, 'id', hash);
} catch (error) {
    console.warn(error)
}





