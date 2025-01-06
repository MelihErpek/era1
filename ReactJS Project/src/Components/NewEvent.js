import React, { useState, useContext } from "react";
import axios from "axios";
import AuthContext from "../Context/AuthContext";

export default function NewEvent() {
  const [eventName, setEventName] = useState();
  const [eventDate, setEventDate] = useState();
  const [eventDescription, setEventDescription] = useState();
  const [url, setURL] = useState();

  const [errorField, SetErrorField] = useState("");
  const [companyNameError, SetCompanyNameError] = useState("");
  const { userData } =
    useContext(AuthContext);
  const [success, SetSuccess] = useState(false);
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
            You have successfully added.
          </div>
        </div>
      );
    }
  };
  const submit = async (e) => {
    e.preventDefault();
    SetErrorField("");
    SetCompanyNameError("");
    console.log(userData.user.Id)
    const id = userData.user.Id;
    try {
      const response = await axios.post("https://nosql-delta.vercel.app/eventadd", {
        eventName,
        eventDate,
        eventDescription,
        url,
        id
      });
      if (response.data.success) {
        SetSuccess(true);
        setEventName("");
        setEventDescription("");
        setEventDate("");
        setURL("");
      }
    } catch (error) {
      SetErrorField("");
      SetCompanyNameError("");
      console.log(error);

      if (error.response.data.ErrorType === "Field") {
        SetErrorField(error.response.data);
      }

      if (error.response.data.ErrorType === "CompanyExist") {
        SetCompanyNameError(error.response.data);
      }
    }
  };
  return (
    <div className="container flex justify-center sm:mx-48 mt-24 ">
      {userData.user ? (
        <>
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
                placeholder="Event Name"
                value={eventName}
                onChange={(event) => setEventName(event.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Event Date
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Event Date"
                value={eventDate}
                onChange={(event) => setEventDate(event.target.value)}
                type="date"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Event Description
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Event Description"
                value={eventDescription}
                onChange={(event) => setEventDescription(event.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Event Image URL
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Event Image"
                value={url}
                onChange={(event) => setURL(event.target.value)}
              />
            </div>

            <Error ErrorType={errorField.ErrorMessage} />
            <Error ErrorType={companyNameError.ErrorMessage} />
            <Success />
            <div className="flex items-center justify-between">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Add Event
              </button>
            </div>
          </form>
        </>
      ) : (
        <>
          <div>
            
          </div>
        </>
      )}
    </div>
  );
}
