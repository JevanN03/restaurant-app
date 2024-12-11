Feature('Favorite Restaurant');

Scenario('Memulai dari halaman Home, memilih restoran, menyukai, dan membatalkan suka', async ({ I }) => {

  I.amOnPage('/');
  I.wait(5);
  I.seeElement('#listContainer');


  I.click(locate('a#details').first());
  I.wait(5);
  I.seeElement('#favoriteButton');


  I.click('#favoriteButton');
  I.wait(5);
  I.see('Remove from Favorite', '#favoriteButton');


  I.amOnPage('/#/favorite');
  I.wait(5);
  I.seeElement('li');
  I.seeElement('.remove-favorite');


  I.click(locate('.remove-favorite').first());
  I.wait(5);


  I.see('No favorite restaurants yet.', '#favoriteContainer');
});
