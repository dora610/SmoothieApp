const recipes = document.querySelector('.recipes');
const outerModal = document.querySelector('.modal_outer');
const innerModals = Array.from(document.querySelectorAll('.modal_inner'));
const successMessage = document.querySelector('.status > .success');
const errorMessage = document.querySelector('.status > .error');

let selectedModal;

const displayModal = (id) => {
  [selectedModal] = innerModals.filter((item) => item.dataset.id === id);
  selectedModal.classList.add('open');
  outerModal.classList.add('open');
  outerModal.addEventListener('click', showModal);
};

const closeModal = () => {
  outerModal.classList.remove('open');
  selectedModal.classList.remove('open');
  outerModal.removeEventListener('click', showModal);
};

const showModal = (e) => {
  !e.target.closest('.modal_inner') && closeModal();
};

const handleClick = (e) => {
  if (e.target.nodeName === 'BUTTON' && e.target.matches('.btn.btn_view')) {
    const smoothieId = e.target.parentElement.dataset.id;
    displayModal(smoothieId);
  }
};

recipes.addEventListener('click', handleClick);
