import UrlParser from '../../routes/url-parser';
import FavoriteRestaurantIdb from '../../data/favorite-restaurant-idb';

const Favorite = {
  async render() {
    return `
    <a href="#mainContent" class="skip-link">Ayo ke konten</a>
      <section id="favorite-section">
        <h1>Favorite Restaurants</h1>
        <div id="favoriteContainer"></div>
      </section>
    `;
  },

  async afterRender() {
    const favoriteContainer = document.getElementById('favoriteContainer');
    const restaurants = await FavoriteRestaurantIdb.getAllRestaurants();

    if (restaurants.length === 0) {
      favoriteContainer.innerHTML = '<p>No favorite restaurants yet.</p>';
      return;
    }

    favoriteContainer.innerHTML = `
      <ul>
        ${restaurants
    .map(
      (restaurant) => `
          <li>
            <h3>${restaurant.name}</h3>
            <img
              class="lazyload"
              data-src="https://restaurant-api.dicoding.dev/images/medium/${restaurant.pictureId}"
              alt="Gambar dari ${restaurant.name}"
            />
            <p><strong>City:</strong> ${restaurant.city}</p>
            <p><strong>Address:</strong> ${restaurant.address}</p>
            <p><strong>Rating:</strong> ${restaurant.rating}</p>
            <a id="details" href="#/detail/${restaurant.id}">Details</a>
            <button class="remove-favorite" data-id="${restaurant.id}">Remove from Favorite</button>
          </li>`
    )
    .join('')}
      </ul>
    `;

    const removeButtons = document.querySelectorAll('.remove-favorite');
    removeButtons.forEach((button) => {
      button.addEventListener('click', async (event) => {
        const id = event.target.getAttribute('data-id');
        await FavoriteRestaurantIdb.deleteRestaurant(id);
        this.afterRender();
      });
    });
  },
};

export default Favorite;
