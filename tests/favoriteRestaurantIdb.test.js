import 'fake-indexeddb/auto';
import FavoriteRestaurantIdb from '../src/scripts/data/favorite-restaurant-idb';

describe('Favorite Restaurant Idb Contract Test', () => {
  it('should be able to add a restaurant to the database', async () => {
    const restaurant = { id: 1, name: 'Restaurant A' };
    await FavoriteRestaurantIdb.putRestaurant(restaurant);

    const storedRestaurant = await FavoriteRestaurantIdb.getRestaurant(1);
    expect(storedRestaurant).toEqual(restaurant);

    await FavoriteRestaurantIdb.deleteRestaurant(1);
  });

  it('should be able to remove a restaurant from the database', async () => {
    const restaurant = { id: 1, name: 'Restaurant A' };
    await FavoriteRestaurantIdb.putRestaurant(restaurant);

    await FavoriteRestaurantIdb.deleteRestaurant(1);
    const storedRestaurant = await FavoriteRestaurantIdb.getRestaurant(1);

    expect(storedRestaurant).toBeUndefined();
  });

  it('should retrieve all favorite restaurants from the database', async () => {
    const restaurantA = { id: 1, name: 'Restaurant A' };
    const restaurantB = { id: 2, name: 'Restaurant B' };

    await FavoriteRestaurantIdb.putRestaurant(restaurantA);
    await FavoriteRestaurantIdb.putRestaurant(restaurantB);

    const allRestaurants = await FavoriteRestaurantIdb.getAllRestaurants();
    expect(allRestaurants).toEqual([restaurantA, restaurantB]);

    await FavoriteRestaurantIdb.deleteRestaurant(1);
    await FavoriteRestaurantIdb.deleteRestaurant(2);
  });

  it('should not add a restaurant without an ID', async () => {
    const restaurant = {}; // Tidak memiliki properti 'id'

    try {
      await FavoriteRestaurantIdb.putRestaurant(restaurant);
      // Jika tidak ada error, buat pengujian gagal
      fail('restaurant without id should not be added');
    } catch (error) {
      expect(error.message).toBe('Restaurant must have an id');
    }
  });
});
