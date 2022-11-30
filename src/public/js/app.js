const header = document.querySelector('#header');

window.onload = async () => {
    await fetch('http://localhost:8000/auth/')
          .then(res => res.json())
          .then((user) => {
            if (user.isUserSignedIn == false) {
                window.location.href = 'http://localhost:8000/user/signin';
            }
          })
}

header.addEventListener('click', () => {
    window.location.href = 'http://localhost:8000/'
})