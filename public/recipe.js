const form = document.querySelector('form');
const name = form.querySelector('input[name="name"]');
const ingredientSection = form.querySelector('.ingredients');
const submitButton = form.querySelector('.btn_submit');
const ingrAdd = ingredientSection.querySelector('input[name="ingr"]');
const addIngr = ingredientSection.querySelector('.btn_add');
const ingrResult = ingredientSection.querySelector('.ingr_added');
const nameErr = form.querySelector('.name.error');
const ingrErr = form.querySelector('.ingredient.error');
const errorMessage = document.querySelector('.message.error');
const successMessage = document.querySelector('.message.success');

// ingredient state
let ingredientList = [];

errorMessage.textContent = '';
successMessage.textContent = '';
nameErr.textContent = '';
ingrErr.textContent = '';

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

const initIngredientList = () => {
  if (!ingredientList.length && ingrResult.childElementCount > 0) {
    const ingrResults = Array.from(ingrResult.querySelectorAll('p.ingr_name'));
    const ingr_present = ingrResults.map((ele) => ele.textContent);
    ingredientList = [...ingr_present];
  }
  showIngredients();
};

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

function fetchRecipe(recipe) {
  const url = location.pathname;
  let routeMethod;
  // determine routed method based on the url path
  if (location.pathname === '/smoothies/add') {
    routeMethod = 'POST';
  } else {
    routeMethod = 'PUT';
  }

  fetch(url, {
    method: routeMethod,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(recipe),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.errors) {
        nameErr.textContent = data.errors.name;
        ingrErr.textContent = data.errors.ingredient;
      }
      if (data.success == 1) {
        // console.log(data);
        successMessage.textContent = `${data.msg}, page will be auto-redirected to smoothies page after 10s..`;
        successMessage.focus();
        setTimeout(() => {
          location.assign('/smoothies');
        }, 15000);
      } else {
        errorMessage.textContent = 'Ops!! somthing is fishy!';
        errorMessage.focus();
        throw new Error(data);
      }
      // TODO: redirect it from backend
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
