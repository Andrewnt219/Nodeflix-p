(function () {
    const scores = document.querySelectorAll('.movie__score');
    console.log(scores[0].innerText);
    scores.forEach(score => {
        if(Number(score.textContent) <= 6 && Number(score.textContent) > 0)
            score.classList.add('movie__score--bad');
    })
})();