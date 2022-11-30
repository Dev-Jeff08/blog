document.querySelector('#form').addEventListener("submit", (event) => {
    event.preventDefault();

    window.location.href = 'http://localhost:8000/'
}, false)