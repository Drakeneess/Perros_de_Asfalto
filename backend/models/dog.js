const { v4: uuid } = require("uuid")

function createDog(name) {
  return {
    id: uuid(),
    name,
    energy: 5,
    maxEnergy: 5,
    consumption: 1
  }
}

module.exports = { createDog }