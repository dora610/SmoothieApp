const form = document.querySelector('form');
const emailErr = form.querySelector('.email.error');
const passwordErr = form.querySelector('.password.error');

const url = location.pathname;

// TODO: tooltip

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = form['email'].value;
  const password = form['password'].value;

  emailErr.textContent = '';
  passwordErr.textContent = '';

  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      password,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      // console.log(data);
      if (data.errors) {
        emailErr.textContent = data.errors.email;
        passwordErr.textContent = data.errors.password;
      }
      data.user && location.replace('/');
    })
    .catch((err) => console.error(err));
});
