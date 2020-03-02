(function () {
    const scores = document.querySelectorAll('.movie__score');
    scores.forEach(score => {
        if(Number(score.textContent) <= 6 && Number(score.textContent) > 0)
            score.classList.add('movie__score--bad');
    })
})();
