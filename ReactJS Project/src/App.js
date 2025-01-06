import "./App.css";
import Router from "./Router/Router.js";
import { AuthContextProvider } from "./Context/AuthContext";
import Header from "./Components/Header"

function App() {
  return (
    <div>
      <AuthContextProvider>
      <Header />

        <Router />
      </AuthContextProvider>
    </div>
  );
}

export default App;
