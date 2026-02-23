const express = require("express")
const http = require("http")
const { Server } = require("socket.io")
const cors = require("cors")

const { createGame, handleAction } = require("./engine/game")

const app = express()
app.use(cors())

const server = http.createServer(app)

const io = new Server(server, {
  cors: { origin: "*" }
})

let game = createGame()

io.on("connection", (socket) => {
  console.log("Jugador conectado:", socket.id)

  socket.on("join", () => {
    if (game.players.length >= 2) {
      socket.emit("error", "Partida llena")
      return
    }

    const player = game.addPlayer(socket.id)
    socket.emit("joined", player)
    io.emit("update", game.getPublicState())
  })

  socket.on("action", (data) => {
    handleAction(game, socket.id, data)
    io.emit("update", game.getPublicState())
  })

  socket.on("disconnect", () => {
    console.log("Jugador desconectado:", socket.id)
  })
})

server.listen(3000, () => {
  console.log("Servidor activo en puerto 3000")
})