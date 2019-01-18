const {
  getCharacter
} = require('../service/StarWarsApi');

describe('star wars api service', () => {
  it('gets a list of characters', () => {
    return getCharacter()
      .then(characters => {
        expect(characters).toHaveLength(2);
      });
  });
});
