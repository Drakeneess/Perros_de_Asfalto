const { createDog } = require("./dog")

function createPack(playerId) {
  return {
    playerId,
    food: 10,
    dogs: [
      createDog("Rastro"),
      createDog("Chispa"),
      createDog("Moro")
    ]
  }
}

module.exports = { createPack }