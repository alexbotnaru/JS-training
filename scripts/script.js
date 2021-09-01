const headerCityButton = document.querySelector('.header__city-button');

headerCityButton.textContent = localStorage.getItem('user-city') || 'Your city?';

headerCityButton.addEventListener('click', () => {
   const city = prompt('What is your city ?');
   headerCityButton.textContent = city;
   localStorage.setItem('user-city', city);
});

//scroll lock
const disableScroll = () => {
    const witdhScroll = window.innerWidth - document.body.offsetWidth;

    document.body.dbScrollY = window.scrollY; //ca sa nu scrolleze sus cand deschidem cart-ul

    document.body.style.cssText = `
        position: fixed;
        top: ${-window.scrollY}px;
        left: 0;
        width: 100%;
        height: 100vh;
        overflow: hidden;
        padding-right: ${witdhScroll}px;
        `;
};

const enableScroll = () => {
    document.body.style.cssText = '';
    window.scroll({
        top: document.body.dbScrollY
    })
};

//modal window
const subheaderCart = document.querySelector('.subheader__cart');
const cartOverlay = document.querySelector('.cart-overlay');

const cartModalOpen = () => {
    cartOverlay.classList.add('cart-overlay-open');
    disableScroll();
    renderCart();
}

const cartModalClose = () => {
    cartOverlay.classList.remove('cart-overlay-open');
    enableScroll();
}

subheaderCart.addEventListener('click', cartModalOpen);

cartOverlay.addEventListener('click', event => {
    const target = event.target;

    if (target.classList.contains('cart__btn-close') || target.matches('.cart-overlay')) {
        cartModalClose();
    }
})


