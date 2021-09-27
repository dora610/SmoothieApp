const form = document.querySelector('form');
const name = form.querySelector('input[name="name"]');
const ingredientSection = form.querySelector('.ingredients');
const submitButton = form.querySelector('.btn_submit');
const ingrAdd = ingredientSection.querySelector('input[name="ingr"]');
const addIngr = ingredientSection.querySelector('.btn_add');
const ingrResult = ingredientSection.querySelector('.ingr_added');
const nameErr = form.querySelector('.name.error');
const ingrErr = form.querySelector('.ingredient.error');
const successMessage = document.querySelector('.status > .success');
const errorMessage = document.querySelector('.status > .error');

// ingredient state
let ingredientList = [];

errorMessage.textContent = '';
successMessage.textContent = '';
nameErr.textContent = '';
ingrErr.textContent = '';

const showIngredients = () => {
  const html = ingredientList
    .map((ele, index) => {
      return `
        <div class="ingr_row">
          <p data-index="${index + 1}" class="ingr_name">${ele}</p>
          <button data-index="${
            index + 1
          }" class="btn btn_delete" >Delete</button>
        </div>
        `;
    })
    .join('');

  ingrResult.innerHTML = '';
  ingrResult.insertAdjacentHTML('afterbegin', html);
};

function addhandler() {
  if (ingrAdd.value) {
    ingredientList.unshift(ingrAdd.value);
    ingrAdd.value = '';
    showIngredients();
  } else {
    ingrErr.textContent = 'cannot add empty element!!';
  }
}

function deleteHandler(index) {
  ingredientList.splice(index - 1, 1);
  showIngredients();
}

const initIngredientList = () => {
  if (!ingredientList.length && ingrResult.childElementCount > 0) {
    const ingrResults = Array.from(ingrResult.querySelectorAll('p.ingr_name'));
    const ingr_present = ingrResults.map((ele) => ele.textContent);
    ingredientList = [...ingr_present];
  }
  showIngredients();
};

function fetchRecipe(recipe) {
  const url = location.pathname;
  let routeMethod, ops;
  // determine route method based on the url path
  if (location.pathname === '/smoothies/add') {
    routeMethod = 'POST';
    ops = 'add';
  } else {
    routeMethod = 'PUT';
    ops = 'edit';
  }

  successMessage.innerHTML = '';
  errorMessage.innerHTML = '';

  fetch(url, {
    method: routeMethod,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(recipe),
  })
    .then((response) => {
      if (!response.ok) {
        errorMessage.insertAdjacentHTML(
          'afterbegin',
          `<h4>Ops!! ${response.statusText}</h4>`
        );
      }
      return response.json();
    })
    .then((data) => {
      if (data.errors) {
        nameErr.textContent = data.errors.name;
        ingrErr.textContent = data.errors.ingredient;
        data.errors.genericError &&
          errorMessage.insertAdjacentHTML(
            'beforeend',
            `<p><strong>${data.errors.genericError}</strong></p>`
          );
        throw Error('error occurred');
      }
      successMessage.insertAdjacentHTML(
        'afterbegin',
        `<h4>Successfully ${ops}ed <strong>${data.name}</strong><h4>
        <p>will be auto-redirected to <a href='/smoothies'>View Smoothies</a> after 10s...</p>`
      );
      successMessage.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => {
        location.assign('/smoothies');
      }, 10000);
    })
    .catch((err) => console.error(err));
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
});

form.addEventListener('click', (e) => {
  nameErr.textContent = '';
  ingrErr.textContent = '';
  if (e.target && e.target.nodeName === 'BUTTON') {
    if (e.target.matches('button.btn_add')) {
      addhandler(e);
    } else if (e.target.matches('button[type="submit"]')) {
      if (!ingredientList.length) {
        ingrErr.textContent =
          'Ingredient list cannot be empty. Add atleast 1 item';
        return;
      }
      const reqPayload = {
        name: name.value,
        ingredients: ingredientList,
      };
      fetchRecipe(reqPayload);
    } else if (e.target.matches('button.btn_delete')) {
      let deleteIndex = e.target.dataset.index;
      deleteHandler(deleteIndex);
    }
  }
});

initIngredientList();
