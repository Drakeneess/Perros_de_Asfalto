"use client"

import { useEffect, useState } from "react"
import { socket } from "@/lib/socket"

type Dog = {
  id: string
  name: string
  energy: number
  maxEnergy: number
  consumption: number
}

type Pack = {
  playerId: string
  food: number
  dogs: Dog[]
}

type GameState = {
  day: number
  players: Pack[]
}

export default function Home() {
  const [game, setGame] = useState<GameState | null>(null)
  const [myId, setMyId] = useState<string | null>(null)

  useEffect(() => {
    socket.on("connect", () => {
      setMyId(socket.id!)
    })

    socket.on("update", (state: GameState) => {
      setGame(state)
    })

    socket.on("joined", () => {
      console.log("Unido a partida")
    })

    return () => {
      socket.off("update")
      socket.off("joined")
    }
  }, [])

  const joinGame = () => {
    socket.emit("join")
  }

  const action = (dogId: string, type: string) => {
    socket.emit("action", { dogId, type })
  }

  if (!game) {
    return (
      <main className="p-8">
        <button
          onClick={joinGame}
          className="bg-black text-white px-4 py-2 rounded"
        >
          Unirse a partida
        </button>
      </main>
    )
  }

  const myPack = game.players.find(p => p.playerId === myId)

  return (
    <main className="p-8 space-y-6">
      <h1 className="text-2xl font-bold">🐺 Jaurías de Asfalto</h1>
      <p>Día: {game.day}</p>

      {myPack && (
        <div className="border p-4 rounded space-y-4">
          <h2 className="font-bold">Tu Jauría</h2>
          <p>🍖 Comida: {myPack.food}</p>

          {myPack.dogs.map(dog => (
            <div key={dog.id} className="border p-3 rounded space-y-2">
              <p className="font-semibold">{dog.name}</p>
              <p>🔋 Energía: {dog.energy}/{dog.maxEnergy}</p>

              <div className="flex gap-2">
                <button
                  onClick={() => action(dog.id, "search_food")}
                  className="bg-green-600 text-white px-3 py-1 rounded"
                >
                  Buscar comida
                </button>

                <button
                  onClick={() => action(dog.id, "rest")}
                  className="bg-blue-600 text-white px-3 py-1 rounded"
                >
                  Descansar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div>
        <h2 className="font-bold">Otros jugadores</h2>
        {game.players
          .filter(p => p.playerId !== myId)
          .map(p => (
            <div key={p.playerId} className="border p-3 rounded mt-2">
              <p>🍖 Comida: {p.food}</p>
              <p>🐕 Perros: {p.dogs.length}</p>
            </div>
          ))}
      </div>
    </main>
  )
}