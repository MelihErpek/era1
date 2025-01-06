import React, { useState, useContext } from "react";
import axios from "axios";
import AuthContext from "../Context/AuthContext";
import { useHistory } from "react-router-dom";
function Login() {
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [errorField, SetErrorField] = useState("");
  const history = useHistory();
  const { userData,setLoggedIn } = useContext(AuthContext);
  const Error = (props) => {
    const message = props.ErrorType;
    return (
      <div className="my-3">
        <div className="text-xs text-red-500 font-bold">{message}</div>
      </div>
    );
  };
  const submit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://sqlite-gold.vercel.app/login",
        { username, password }
      );
      localStorage.setItem("auth-token", response.data.token);
      localStorage.setItem("ıd", response.data.user.id);
      setLoggedIn(true);
      history.push("/");
    } catch (error) {
      SetErrorField("");
      if (error.response.data.ErrorType === "Field") {
        SetErrorField(error.response.data);
      }
    }
  };
  return (
    <div className="container flex justify-center sm:mx-48 mt-24 ">
      {userData.user ? (
        <>
          <div>
            <div className="text-zinc-200 font-bold text-xl mr-8">
              You already logged in.
            </div>
            <div className="text-zinc-200 font-bold text-xl ml-4">
              Go to{" "}
              <a href="/home" className="text-red-400 underline decoration-2">
                Home
              </a>{" "}
              page.
            </div>
          </div>
        </>
      ) : (
        <>
          <form
            className="bg-zinc-200 shadow-md rounded-2xl sm:w-1/2 px-8 pt-6 pb-8 mb-4"
            onSubmit={submit}
          >
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Username
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="username"
                placeholder="Username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
              />
            </div>
            <div className="mb-2">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="password"
              >
                Password
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                id="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>
            <Error ErrorType={errorField.ErrorMessage} />
            <div className="flex items-center justify-between">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Login
              </button>
              <div>
                <div>
                  <a
                    className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
                    href="/register"
                  >
                    Dont Have An Account?
                  </a>
                </div>
              </div>
            </div>
          </form>
        </>
      )}
    </div>
  );
}

export default Login;
