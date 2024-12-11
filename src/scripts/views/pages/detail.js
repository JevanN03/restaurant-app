import UrlParser from '../../routes/url-parser';
import FavoriteRestaurantIdb from '../../data/favorite-restaurant-idb';

const Detail = {
  async render() {
    return `
    <a href="#mainContentDetail" class="skip-link">Ayo ke konten</a>
      <section id="detail-section">  
        <h1>Restaurant Details</h1>
        <div id="detailContainer"></div>
        <button id="favoriteButton">Add to Favorite</button>
      </section>
    `;
  },

  async afterRender() {
    const { id } = UrlParser.parseActiveUrlWithoutCombiner();
    const container = document.getElementById('detailContainer');
    const favoriteButton = document.getElementById('favoriteButton');

    try {
      // Ambil data dari API
      const response = await fetch(`https://restaurant-api.dicoding.dev/detail/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch data from API');
      }

      const data = await response.json();
      const restaurant = data.restaurant;

      // Render detail restoran
      this._renderRestaurantDetail(container, restaurant);

      // Render tombol favorit
      const renderFavoriteButton = async () => {
        const isFavorited = await FavoriteRestaurantIdb.getRestaurant(id);
        favoriteButton.textContent = isFavorited ? 'Remove from Favorite' : 'Add to Favorite';
      };

      favoriteButton.addEventListener('click', async () => {
        const isFavorited = await FavoriteRestaurantIdb.getRestaurant(id);
        if (isFavorited) {
          await FavoriteRestaurantIdb.deleteRestaurant(id);
        } else {
          await FavoriteRestaurantIdb.putRestaurant(restaurant);
        }
        renderFavoriteButton();
      });

      renderFavoriteButton();
    } catch (error) {
      console.log('Error fetching data, checking cache...', error);

      // Ambil data dari IndexedDB jika API gagal
      const cachedRestaurant = await FavoriteRestaurantIdb.getRestaurant(id);
      if (cachedRestaurant) {
        this._renderRestaurantDetail(container, cachedRestaurant);
      } else {
        container.innerHTML = '<p>Failed to load data. No data available in cache.</p>';
      }
    }
  },

  _renderRestaurantDetail(container, restaurant) {
    container.innerHTML = `
      <h2>${restaurant.name}</h2>
      <img
      class="lazyload"
      data-src="https://restaurant-api.dicoding.dev/images/large/${restaurant.pictureId}"
      alt="Gambar dari ${restaurant.name}"
    />
      <p><strong>City:</strong> ${restaurant.city}</p>
      <p><strong>Address:</strong> ${restaurant.address}</p>
      <p><strong>Rating:</strong> ${restaurant.rating}</p>
      <p><strong>Description:</strong> ${restaurant.description}</p>

      <h3>Menu Makanan</h3>
      <ul>
        ${restaurant.menus.foods.map((food) => `<li>${food.name}</li>`).join('')}
      </ul>

      <h3>Menu Minuman</h3>
      <ul>
        ${restaurant.menus.drinks.map((drink) => `<li>${drink.name}</li>`).join('')}
      </ul>

      <h3>Customer Reviews</h3>
      <ul>
        ${restaurant.customerReviews
    .map(
      (review) => `
                <li>
                  <strong>${review.name}</strong>: ${review.review} (Tanggal: ${review.date})
                </li>`
    )
    .join('')}
      </ul>
    `;
  },
};

export default Detail;
