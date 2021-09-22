const form = document.querySelector('form');
const title = form.querySelector('input[name="title"]');
const ingredientSection = form.querySelector('.ingredients');
const submitButton = form.querySelector('.btn_submit');
const ingrAdd = ingredientSection.querySelector('input[name="ingr"]');
const addIngr = ingredientSection.querySelector('.btn_add');
const ingrResult = ingredientSection.querySelector('.ingr_added');
const titleErr = form.querySelector('.title.error');
const ingrErr = form.querySelector('.ingredient.error');

// ingredient state
let ingredientList = [];

titleErr.textContent = '';
ingrErr.textContent = '';

const url = '/smoothies/add';

function addhandler(e) {
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

const showIngredients = () => {
  ingrResult.innerHTML = '';

  const html = ingredientList
    .map((ele, index) => {
      return `
        <div class="single_ingr">
          <p data-index="${index + 1}">${ele}</p>
          <button data-index="${
            index + 1
          }" class="btn btn_delete" >Delete</button>
        </div>
        `;
    })
    .join('');

  ingrResult.insertAdjacentHTML('afterbegin', html);
};

function fetchRecipe(recipe) {
  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(recipe),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.errors) {
        titleErr.textContent = data.errors.title;
        ingrErr.textContent = data.errors.ingredient;
      }
      if (!data.success) {
        throw new Error('Ops!! failed to add smoothie');
      } else if (data.success === 1) {
        location.assign('/smoothies');
      }
      // TODO: redirect it from backend
    })
    .catch((err) => console.error(err));
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
});

form.addEventListener('click', (e) => {
  titleErr.textContent = '';
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
        title: title.value,
        ingredients: ingredientList,
      };
      fetchRecipe(reqPayload);
    } else if (e.target.matches('button.btn_delete')) {
      let deleteIndex = e.target.dataset.index;
      deleteHandler(deleteIndex);
    }
  }
});

showIngredients();
