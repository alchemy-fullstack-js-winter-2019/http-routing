const { getCharacters } = require('../lib/services/starWarsApi');

describe('getting star wars characters', () => {
  it('can get star wars', () => {
    return getCharacters()
      .then(characters => {
        expect(characters).toHaveLength(10);
      });
  });
});
