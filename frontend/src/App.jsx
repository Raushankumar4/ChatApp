import { useEffect } from "react"
import socket from "./socket/socket"

function App() {

  useEffect(() => {
    socket.on("connection", (socket) => {
      console.log(`Connect ${socket.id}`);
    })
    return () => socket.off("connection")
  }, [])


  return (
    <>
      <h1>Chat Appp</h1>
    </>
  )
}

export default App
