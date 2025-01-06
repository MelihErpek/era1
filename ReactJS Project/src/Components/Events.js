import React, { useEffect, useState, useContext } from "react";
import AuthContext from "../Context/AuthContext";

import { useHistory } from "react-router-dom";
import axios from "axios";

export default function Events() {
  const [events, setEvents] = useState();
  const { userData } = useContext(AuthContext);

  const history = useHistory();
  useEffect(() => {
    axios
      .get("https://nosql-delta.vercel.app/events")
      .then((data) => setEvents(data.data));
  }, []);
  const Data = () => {
    if (events) {
      return (
        <div className="flex flex-wrap ">
          {events.map(
            ({ eventName, eventDescription, eventDate, url, _id }, index) => {
              return (
                <React.Fragment key={index}>
                  <a href={"/eventdetail/" + _id}>
                    <div className="bg-white px-6 py-3 rounded-lg shadow-md justify-between items-center transition-colors duration-300 sm:ml-52 ml-12 mt-16">
                      <div className="flex justify-center">
                        <img src={url} className="w-36 h-36  " alt="Event" />
                      </div>
                      <div className="flex justify-center">
                        <div className="ml-4">
                          <div className="font-bold text-lg w-52">
                            {eventName}
                          </div>
                          <div className="text-gray-500 mt-3 text-sm w-36">
                            {eventDescription}
                          </div>
                          <div className="text-blue-800 font-semibold">
                            {eventDate}
                          </div>
                        </div>
                      </div>
                    </div>
                    {(index + 1) % 2 === 0 && <div className="w-full"></div>}
                  </a>
                </React.Fragment>
              );
            }
          )}
        </div>
      );
    } else {
      return null;
    }
  };

  return (
    <div>
      {userData.user ? (
        <div>
          <div className="flex justify-center mt-6">
            <button
              className="bg-red-500 p-4 font-bold text-white "
              onClick={() => history.push("/newevent")}
            >
              Add A New Event
            </button>
          </div>
          {events ? (
            <div className="flex  text-sm  sm:text-lg mt-12   ">
              <div className="justify-center sm:ml-52 ml-0 ">
                <Data />
              </div>
            </div>
          ) : (
            <>
              <div></div>
            </>
          )}
        </div>
      ) : (
        <div>
          
        </div>
      )}
    </div>
  );
}
