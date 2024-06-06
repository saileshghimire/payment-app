import { BrowserRouter, Routes, Route } from "react-router-dom"

function App() {

  return (
    <div>
        <BrowserRouter>
        <Routes>
          <Route path="/signup" />
          <Route path="/signin" />
          <Route path="/dashboard" />
          <Route path="/send" />

        </Routes>
        </BrowserRouter>
    </div>
  )
}

export default App
