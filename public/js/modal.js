const recipes = document.querySelector('.recipes');
const outerModal = document.querySelector('.modal_outer');
const innerModal = document.querySelector('.modal_inner');

const successMessage = document.querySelector('.status > .success');
const errorMessage = document.querySelector('.status > .error');

const fetchSmoothie = (id) => {
  const url = `/smoothies/${id}`;
  successMessage.innerHTML = '';
  errorMessage.innerHTML = '';

  fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((res) => {
      // console.log(res);
      if (res.redirected && res.url.includes('login')) {
        location.replace(res.url);
        throw Error('Redirected to login as user is not logged in');
      } else if (!res.ok) {
        errorMessage.insertAdjacentHTML(
          'afterbegin',
          `<h4>Ops!! ${res.statusText}</h4>`
        );
        throw Error(`Bad network request: ${res.statusText} | ${res.status}`);
      } else {
        return res.json();
      }
      // return res.json();
    })
    .then((smoothie) => {
      generateInnerModal(smoothie);
    })
    .catch((err) => console.error(err));
};

const generateInnerModal = (item) => {
  innerModal.innerHTML = '';

  const html = `
    <div class="img">
        <img src="/smoothie.png" alt="smoothie recipe icon" />
    </div>
    <div class="desc">
        <p>name:</p>
        <p>${item?.name}</p>
        <p>user:</p>
        <p>${item?.createdBy?.email}</p>
        <p>created on :</p>
        <p>${new Date(item?.createdAt)}</p>
        <p>updated on :</p>
        <p>${new Date(item?.updatedAt)}</p>
        <p>ingredients used :</p>
        <p>${item.ingredients.join(', ')}</p>
    </div>
  `;

  innerModal.insertAdjacentHTML('afterbegin', html);
  outerModal.classList.add('open');
  outerModal.addEventListener('click', showModal);
};

const closeModal = () => {
  innerModal.innerHTML = '';
  outerModal.classList.remove('open');
  outerModal.removeEventListener('click', showModal);
};

const showModal = (e) => {
  !e.target.closest('.modal_inner') && closeModal();
};

const handleClick = (e) => {
  if (e.target.nodeName === 'BUTTON' && e.target.matches('.btn.btn_view')) {
    const smoothieId = e.target.parentElement.dataset.id;
    fetchSmoothie(smoothieId);
  }
};

recipes.addEventListener('click', handleClick);
