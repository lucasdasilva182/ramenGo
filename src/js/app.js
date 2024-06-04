const url = 'https://api.tech.redventures.com.br';

const headers = {
  'x-api-key': 'ZtVdh8XQ2U8pWI2gmZ7f796Vh8GllXoN7mr0djNf',
};

const loaderModal = document.getElementById('loader-modal');

const showLoader = () => {
  loaderModal.style.display = 'flex';
};

const hideLoader = () => {
  loaderModal.style.display = 'none';
};

function createRadioButton(value, typeInput) {
  const radioWrapper = document.createElement('div');
  const radioInput = document.createElement('input');
  const radioLabel = document.createElement('label');
  const radioImg = document.createElement('img');
  const description = document.createElement('p');
  const price = document.createElement('p');
  const name = document.createElement('p');
  const btnOrder = document.getElementById('btn-order');

  radioWrapper.classList.add(`input-wrapper`);
  radioWrapper.classList.add(`input-${typeInput}`);
  description.classList.add('description');
  price.classList.add('price');
  name.classList.add('name');

  radioLabel.htmlFor = value.name;
  name.innerHTML = value.name;
  radioImg.src = value.imageInactive;
  description.innerHTML = value.description;
  price.innerHTML = `US$ ${value.price}`;

  radioInput.type = 'radio';
  radioInput.id = value.name;
  radioInput.name = `${typeInput}`;
  radioInput.value = value.id;

  radioInput.addEventListener('change', () => {
    const allRadioWrappers = document.querySelectorAll(`.input-${typeInput}`);
    allRadioWrappers.forEach((wrapper) => {
      const input = wrapper.querySelector(`input[name='${typeInput}']`);
      const img = wrapper.querySelector('img');

      if (input.checked) {
        img.src = value.imageActive;
        wrapper.classList.add('active');
      } else {
        img.src = input.dataset.imageInactive;
        wrapper.classList.remove('active');
      }
    });

    const selectedBroth = document.querySelector(
      'input[name="brothId"]:checked'
    );
    const selectedProtein = document.querySelector(
      'input[name="proteinId"]:checked'
    );

    if (selectedBroth && selectedProtein) {
      btnOrder.disabled = false;
    } else {
      btnOrder.disabled = true;
    }
  });

  radioWrapper.addEventListener('mouseover', () => {
    if (!radioInput.checked) {
      radioImg.src = value.imageActive;
    }
  });

  radioWrapper.addEventListener('mouseout', () => {
    if (!radioInput.checked) {
      radioImg.src = value.imageInactive;
    }
  });

  radioInput.dataset.imageInactive = value.imageInactive;

  radioLabel.appendChild(radioImg);
  radioLabel.appendChild(name);
  radioLabel.appendChild(description);
  radioLabel.appendChild(price);
  radioWrapper.appendChild(radioInput);
  radioWrapper.appendChild(radioLabel);

  return radioWrapper;
}

const getBroths = async () => {
  showLoader();
  await fetch(`${url}/broths`, { headers })
    .then((response) => response.json())
    .then((data) => {
      const radioContainer1 = document.getElementById('radio-container-1');
      radioContainer1.innerHTML = '';
      data.forEach((item) => {
        const radioButton = createRadioButton(item, 'brothId');
        radioContainer1.appendChild(radioButton);
      });
    })
    .catch((error) => {
      console.log(error);
    })
    .finally(hideLoader());
};

const getProteins = async () => {
  showLoader();
  await fetch(`${url}/proteins`, { headers })
    .then((response) => response.json())
    .then((data) => {
      const radioContainer2 = document.getElementById('radio-container-2');
      radioContainer2.innerHTML = '';

      data.forEach((item) => {
        const radioButton = createRadioButton(item, 'proteinId');
        radioContainer2.appendChild(radioButton);
      });
    })
    .catch((error) => {
      console.log(error);
    })
    .finally(hideLoader());
};

const postOrder = async (e) => {
  const selectedBroth = document.querySelector('input[name="brothId"]:checked');
  const selectedProtein = document.querySelector(
    'input[name="proteinId"]:checked'
  );

  if (!selectedBroth || !selectedProtein) {
    alert('Please select a broth and protein before placing the order.');
    return;
  }

  showLoader();

  let formData = new FormData(e);

  const json = Object.fromEntries(formData);

  await fetch(`${url}/orders`, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(json),
  })
    .then((response) => response.json())
    .then((data) => {
      sessionStorage.setItem('dataOrder', JSON.stringify(data));
      window.location.replace('/success-order.html');
    })
    .catch((error) => {
      console.log(error);
      hideLoader();
    });
};

const getLocalOrder = () => {
  const dataLocal = JSON.parse(sessionStorage.getItem('dataOrder'));
  if (dataLocal) {
    const imgSuccess = document.getElementById('img-order-success');
    const titleSuccess = document.getElementById('title-order-success');

    imgSuccess.src = dataLocal.image;
    titleSuccess.innerHTML = dataLocal.description;
  }
  hideLoader();
};

const form = document.getElementById('orderForm');

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    postOrder(e.target);
  });
}

function scrollToSection(e) {
  e.preventDefault();
  const href = e.currentTarget.getAttribute('href');
  const to = document.querySelector(href).offsetTop;
  window.scroll({
    top: to,
    behavior: 'smooth',
  });
}

const scrollToTrigger = document.getElementById('scrollTo');

const logoMenuImg = document.getElementById('menuImg');

if (window.location.pathname === '/') {
  scrollToTrigger.addEventListener('click', scrollToSection);
  logoMenuImg.src = './src/assets/images/logo.svg';
  getBroths();
  getProteins();
}

if (window.location.pathname === '/success-order.html') {
  logoMenuImg.src = './src/assets/images/logo-laranja.svg';
  getLocalOrder();
}
