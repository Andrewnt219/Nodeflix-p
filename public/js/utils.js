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

const closeButton = document.querySelector('.banner__btn-close');

closeButton.addEventListener('click', () => {
    const body = document.querySelector('body');
    const banner = document.querySelector('.banner');

    banner.style.display = 'none';
    body.style.overflow = 'scroll';
})
