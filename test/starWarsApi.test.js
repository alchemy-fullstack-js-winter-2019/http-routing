const { getCharacter } = require('../lib/services/starWarsApi');

describe('getting star wars characters', () => {
  it('can get star wars', () => {
    return getCharacter(1)
      .then(character => {
        expect(character).toEqual({
          name: 'Luke Skywalker',
          hairColor: 'blond',
          height: '172',
          mass: '77',
          birthYear: '19BBY'
        });
      });
  });
});
