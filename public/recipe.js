function CreateElementList(ele) {
  if (!(ele instanceof Element)) {
    throw new Error('ingr section not found');
  }
  const inputAdd = ele.querySelector('input[name="ingr"]');
  const addButton = ele.querySelector('.btn_add');
  const ingrError = ele.querySelector('.ingr_error');
  const ingrResult = ele.querySelector('.ingr_added');

  let ingredientList = [];

  function addhandler() {
    if (inputAdd.value) {
      ingredientList.unshift(inputAdd.value);
      inputAdd.value = '';
      showIngredients();
    } else {
      ingrError.textContent = "hey!! let's add some ingredient";
    }
  }

  function deleteHandler(index) {
    ingredientList.splice(index - 1, 1);
    showIngredients();
  }

  const showIngredients = () => {
    ingrResult.innerHTML = '';
    // preparing html
    const html = ingredientList
      .map((ele, index) => {
        return `
        <div>
          <p data-index="${index + 1}">${ele}</p>
          <input type="text" name="ingr_ele" >
          <button data-index="${
            index + 1
          }" class="btn btn_delete" >Delete</button>
        </div>
        `;
      })
      .join('');
    ingrResult.insertAdjacentHTML('afterbegin', html);
    // adding delete button behaviour
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
    if (!ingredientList.length) {
      ingrError.textContent = "hey!! don't you like to add something?";
      return;
    }
    return ingredientList;
  };
}

const ingr_section = document.querySelector('.ingredients');
const ingrgetter = CreateElementList(ingr_section);
const form = document.querySelector('form');
const title = document.querySelector('input[name="title"]');
// let reqPayload = {};

// just to prevent default submit behaviour
form.addEventListener('submit', (e) => {
  e.preventDefault();
  // const title = form.title.value;
  // reqPayload['title'] = form.title.value;
  // reqPayload['ingredients'] = ingrgetter();

  /* const ingredients = ingrgetter();
  if (ingredients) {
    console.log(ingrgetter());
  } else {
    console.warn('nothing added');
  } */
  // console.log(e.target);
  // console.log(e.currentTarget);
  // console.log(ingredientList);
  /* fetch('/smoothies/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title,
      ingredients: ingredientList,
    }),
  })
    .then((response) => response.json())
    .then((data) => console.log(data))
    .catch((err) => console.error(err)); */
});

const submitButton = document.querySelector('.btn_submit');
submitButton.addEventListener('click', (e) => {
  // console.log(reqPayload);
  // console.log(title.value);
  const reqPayload = {
    title: title.value,
    ingredients: ingrgetter(),
  };
  // console.log(reqPayload);
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
    .then((data) => console.log(data))
    .catch((err) => console.error(err));
  //TODO: handle errors
}
