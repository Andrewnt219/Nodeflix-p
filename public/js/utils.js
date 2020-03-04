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
        console.log(title,String(title).includes('Welcome back'));
        if (text.textContent === title.textContent || (text.textContent ==='My profile' && (title.textContent.includes('Welcome back') || title.textContent.includes('401'))))
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
