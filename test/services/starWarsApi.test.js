const getStarWarsChar = require('../../lib/services/starWarsApi');

describe('starWarsApi service', () => {
  it('gets character by id', () => {
    return getStarWarsChar(1)
      .then(character => {
        expect(character).toEqual({
          name: 'Luke Skywalker',
          height: '172',
          mass: '77',
          hairColor: 'blond',
          birthYear: '19BBY'
        });
      });
  });
});
