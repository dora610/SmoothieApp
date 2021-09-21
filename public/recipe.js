function CreateElementList(ele) {
  if (!(ele instanceof Element)) {
    throw new Error('ingr section not found');
  }
  const inputAdd = ele.querySelector('input[name="ingr"]');
  const addButton = ele.querySelector('.btn_add');
  // const ingrError = ele.querySelector('.ingr_error');
  const ingrResult = ele.querySelector('.ingr_added');

  let ingredientList = [];

  function addhandler() {
    if (inputAdd.value) {
      ingredientList.unshift(inputAdd.value);
      inputAdd.value = '';
      // ingrError && ingrError.textContent = '';
      showIngredients();
      /* } else {
      ingrError.textContent = "hey!! let's add some ingredient";
    } */
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
        <div>
          <p data-index="${index + 1}">${ele}</p>
          <button data-index="${
            index + 1
          }" class="btn btn_delete" >Delete</button>
        </div>
        `;
      })
      .join('');
    ingrResult.insertAdjacentHTML('afterbegin', html);

    const deleteButtons = document.querySelectorAll('.btn_delete');
    deleteButtons.forEach((button) => {
      button.addEventListener('click', () =>
        deleteHandler(button.dataset.index)
      );
    });
  };

  addButton.addEventListener('click', addhandler);

  showIngredients();

  return function getIngerdientsList() {
    /* if (!ingredientList.length) {
      ingrError.textContent = "hey!! don't you like to add something?";
      return;
    } */
    return ingredientList;
  };
}

const ingr_section = document.querySelector('.ingredients');
const ingrgetter = CreateElementList(ingr_section);
const form = document.querySelector('form');
const title = document.querySelector('input[name="title"]');
const titleErr = document.querySelector('.title.error');
const ingrErr = form.querySelector('.ingredient.error');
titleErr.textContent = '';
ingrErr.textContent = '';

// prevent default submit behaviour
form.addEventListener('submit', (e) => {
  e.preventDefault();
});

const submitButton = document.querySelector('.btn_submit');
submitButton.addEventListener('click', () => {
  const ingrLi = ingrgetter();
  console.log(ingrLi);
  if (!ingrLi) {
    ingrErr.textContent = 'Ingredient list cannot be empty. Add atleast 1 item';
    return;
  }
  const reqPayload = {
    title: title.value,
    ingredients: ingrgetter(),
  };
  fetchRecipe(reqPayload);
});

function fetchRecipe(recipe, url = '/smoothies/add') {
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
