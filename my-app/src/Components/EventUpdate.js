import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import AuthContext from "../Context/AuthContext";
export default function EventUpdate(props) {
  const [data, setData] = useState();
  const { loggedIn } = useContext(AuthContext);
  const [success, SetSuccess] = useState(false);
  const [errorField, SetErrorField] = useState("");
  const [eventName, setEventName] = useState();
  const [eventDate, setEventDate] = useState();
  const [eventDescription, setEventDescription] = useState();
  const [url, setURL] = useState();
  const history = useHistory();

  let id = props.match.params._id;
  useEffect(() => {
    axios
      .post("https://nosql-delta.vercel.app/findevent", {
        id,
      })
      .then((json) => setData(json.data));
  }, []);
  const Error = (props) => {
    const message = props.ErrorType;
    return (
      <div className="my-3">
        <div className="text-xs text-red-500 font-bold">{message}</div>
      </div>
    );
  };
  const Success = () => {
    if (success === true) {
      return (
        <div className="my-2">
          <div className="text-xs text-green-500 font-bold">
            You have successfully updated the information.
          </div>
        </div>
      );
    }
  };
  const submit = async (e) => {
    e.preventDefault();
    SetErrorField("");
    // SetCompanyNameError("");
    SetSuccess(false);
    try {
      let pCompanyname = props.match.params.companyname;
      const response = await axios.post(
        "https://nosql-delta.vercel.app/eventupdate",
        {
          pCompanyname,
          eventName,
          eventDescription,
          eventDate,
          url,
          id
        }
      );
      console.log(response);
      if (response.data.success) {
        SetSuccess(true);
      }
    } catch (error) {
      console.log(error);
      if (error.response.data.ErrorType === "Field") {
        SetErrorField(error.response.data);
      }
    //   if (error.response.data.ErrorType === "CompanyDontExist") {
    //     SetCompanyNameError(error.response.data);
    //   }
    }
  };
  const remove = async () => {
    try {
        const response = await axios.post("https://nosql-delta.vercel.app/eventremove", { id });
        history.push("/")
    }
    catch (error) {
        console.log(error)
    }
  };
  return (
    <div>
      {loggedIn === false && (
        <div className="flex justify-center sm:mx-48 mt-24">
          <div className="text-zinc-200 font-bold text-xl mr-8">
            You are not logged in.
          </div>
          <div className="text-zinc-200 font-bold text-xl ml-4">
            Go to{" "}
            <a href="/login" className="text-red-400 underline decoration-2">
              Login
            </a>{" "}
            page.
          </div>
        </div>
      )}
      {loggedIn === true && (
        <div>
          {data ? (
            <div className="container flex justify-center sm:mx-48 mt-24">
              <form
                className="bg-zinc-200 shadow-md rounded-2xl sm:w-1/2 px-8 pt-6 pb-8 mb-4"
                onSubmit={submit}
              >
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Event Name
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder={data.eventName}
                    value={eventName}
                    onChange={(event) => setEventName(event.target.value)}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Event Desc
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder={data.eventDescription}
                    value={eventDescription}
                    onChange={(event) =>
                      setEventDescription(event.target.value)
                    }
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Event Date
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder={data.eventDate}
                    value={eventDate}
                    onChange={(event) => setEventDate(event.target.value)}
                    type="date"
                  />
                </div>
                <div className="mb-2">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="password"
                  >
                    Image URL
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                    id="webSite"
                    placeholder={data.url}
                    value={url}
                    onChange={(event) => setURL(event.target.value)}
                  />
                </div>
                <Error ErrorType={errorField.ErrorMessage} />
                {/* <Error ErrorType={companyNameError.ErrorMessage} /> */}
                <Success />
                <div className="flex items-center ">
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="submit"
                  >
                    Update
                  </button>
                  <div
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-12 cursor-pointer"
                    onClick={() => remove()}
                    target="_blank"
                  >
                    Remove Event
                  </div>
                </div>
              </form>
            </div>
          ) : (
            <>
              <div className="flex justify-center mt-6">
                <div className="font-bold text-xl mr-8">
                  There isn't event with that id.
                </div>
              </div>
            </>
          )}{" "}
        </div>
      )}
    </div>
  );
}
