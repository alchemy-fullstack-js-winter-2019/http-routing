const {
  getCharacter
} = require('../service/StarWarsApi');

describe('star wars api service', () => {
  it('gets a character by id', () => {
    return getCharacter(1)
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
