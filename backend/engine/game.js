const { createPack } = require("../models/pack")

function createGame() {
  return {
    day: 1,
    players: [],

    addPlayer(socketId) {
      const pack = createPack(socketId)
      this.players.push(pack)
      return pack
    },

    getPublicState() {
      return {
        day: this.day,
        players: this.players
      }
    }
  }
}

function handleAction(game, socketId, data) {
  const player = game.players.find(p => p.playerId === socketId)
  if (!player) return

  const dog = player.dogs.find(d => d.id === data.dogId)
  if (!dog) return

  switch (data.type) {
    case "search_food":
      if (dog.energy > 0) {
        dog.energy -= 1
        player.food += 2
      }
      break

    case "rest":
      dog.energy = Math.min(dog.maxEnergy, dog.energy + 2)
      break
  }
}

module.exports = { createGame, handleAction }