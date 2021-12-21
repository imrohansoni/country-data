const countryCardContainer = document.querySelector('.country_card_container');
const neighbourCardContainer = document.querySelector(
  '.neighbour_card_container'
);
const neighbourHeadingContainer = document.querySelector(
  '.neighbour_country_heading_container'
);
const searchCountry = document.querySelector('.search_input');

const getCountryData = async function (country_name, search_by = 'name') {
  neighbourCardContainer.innerHTML = ``;
  countryCardContainer.innerHTML = ``;
  neighbourHeadingContainer.innerHTML = ``;

  const card = `<div class="country_card">
                  <div class="country_image">
                  </div>
                  <div class="country_data">
                    <span class="country_name"></span>
                    <span class="continent"></span>
                    <span class="population"></span>
                    <span class="currency"></span>
                    <span class="language"></span>
                  </div>
                </div>
               `;

  countryCardContainer.insertAdjacentHTML('afterbegin', card);
  const countryCard = countryCardContainer.querySelector('.country_card');

  countryCardContainer.classList.add('loading');

  try {
    const country_data = await fetch(
      `https://restcountries.com/v3.1/${search_by}/${country_name}`
    );

    if (!country_data.ok) {
      throw new Error('country not found');
    }

    const [data] = await country_data.json();
    const countryName = data.name.common;
    const continent = data.continents[0];
    const population = data.population;
    const language = Object.values(data.languages).join(', ').toLowerCase();
    const currency = Object.values(data.currencies)[0].name;
    const countryNameHeading = `<h1 class="country_name_heading">${countryName}</h1>`;

    countryCardContainer.insertAdjacentHTML('afterbegin', countryNameHeading);

    document.querySelector(
      '.country_image'
    ).style.backgroundImage = `url(${data.flags.svg})`;
    document.querySelector('.country_name').textContent = `🌍 ${countryName}`;
    document.querySelector('.language').textContent = `🗣️ ${language}`;
    document.querySelector('.continent').textContent = `🗺️ ${continent}`;
    document.querySelector('.currency').textContent = `💶 ${currency}`;
    document.querySelector('.population').textContent = `👨‍👨‍👧‍👦 ${population}`;
    countryCardContainer.classList.remove('loading');

    if (!data.borders) {
      getNeighbourData(false);
      return;
    }
    const neighbourHeading = `
                <span class="neighbour_country_heading">🌍 neighbour country of ${countryName}</span>`;
    neighbourHeadingContainer.insertAdjacentHTML(
      'afterbegin',
      neighbourHeading
    );
    data.borders.forEach((e) => {
      getNeighbourData(e);
    });
  } catch (err) {
    const notFound = `<span class="error">🌍 country not found</span>`;
    neighbourCardContainer.insertAdjacentHTML('afterbegin', notFound);
    countryCard.remove();
  }
};

const getNeighbourData = async function (n) {
  if (!n) {
    const notFound = `<span class="error">🌍 No neighbour country found</span>`;
    neighbourCardContainer.insertAdjacentHTML('afterbegin', notFound);
    return;
  }

  const neighbour_data = await fetch(
    `https://restcountries.com/v3.1/alpha/${n}`
  );

  const [data] = await neighbour_data.json();
  const countryName = data.name.common;
  const continent = data.continents[0];
  const population = data.population;
  const language = Object.values(data.languages).join(', ').toLowerCase();
  const currency = Object.values(data.currencies)[0].name;

  const html = `<div class="country_card" data-country_name="${countryName}">
                  <div class="country_image">
                  </div>
                  <div class="country_data">
                    <span>🌍 
                        <span class="country_name">
                            ${countryName}
                        </span>
                    </span>
                    <span class="continent">
                        🗺️ ${continent}
                    </span>
                    <span class="population">
                        👨‍👨‍👧‍👦 ${population}
                    </span>
                    <span class="currency">
                        💶 ${currency}
                    </span>
                    <span class="language">
                        🗣️ ${language}
                    </span>
                  </div>
                </div>
`;

  neighbourCardContainer.insertAdjacentHTML('afterbegin', html);

  neighbourCardContainer.querySelector(
    '.country_image'
  ).style.backgroundImage = `url(${data.flags.svg})`;
};

neighbourCardContainer.addEventListener('click', function (e) {
  if (e.target.closest('.country_card')) {
    const countryName = e.target.closest('.country_card').dataset.country_name;
    getCountryData(countryName);
  }
});

const input = function () {
  document.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      const countryName = searchCountry.value;
      getCountryData(countryName);
    }
  });
};

input();
