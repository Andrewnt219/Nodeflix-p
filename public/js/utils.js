
(function () {
    const adminBtn = document.querySelector('.btn-register__text');
    if (adminBtn.textContent === 'Admin')
        adminBtn.parentNode.style = 'pointer-events: none';
    else
    adminBtn.parentNode.style = '';
})();

(function () {
    const scores = document.querySelectorAll('.movie__score');
    scores.forEach(score => {
        if(Number(score.textContent) <= 6 && Number(score.textContent) > 0)
            score.classList.add('movie__score--bad');
    })
})();

(function() {
    const body = document.querySelector('body');
    const banner = document.querySelector('.banner');
    if(!banner) 
        body.style.overflow = 'scroll';

})();

(function() {
    const nav__texts = document.querySelectorAll('.nav__text');
    const title = document.querySelector('.title');

    nav__texts.forEach(text => {
        if (text.textContent === title.textContent)
            text.parentNode.classList.add('nav__genre--active');
        else
            text.parentNode.classList.remove('nav__genre--active');

    });

})();

const closeButton = document.querySelector('.banner__btn-close');

closeButton.addEventListener('click', () => {
    const body = document.querySelector('body');
    const banner = document.querySelector('.banner');

    banner.style.display = 'none';
    body.style.overflow = 'scroll';
})
