import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import Detail from "./NewComment";
import AuthContext from "../Context/AuthContext";
import { useHistory } from "react-router-dom";

export default function EventDetail(props) {
  const [data, setData] = useState();
  const [part, setPart] = useState();
  const { userData } = useContext(AuthContext);
  const history = useHistory();

  let id = props.match.params._id;

  useEffect(() => {
    axios
      .post("https://nosql-delta.vercel.app/findevent", {
        id,
      })
      .then((json) => setData(json.data));
    if (userData.user) {
      let cid = userData.user.Id;

      axios
        .post("https://nosql-delta.vercel.app/getpart", { id, cid })
        .then((json) => setPart(json.data.success));
    }
  }, [userData.user]);

  const handleAddPart = () => {
    let cid = userData.user.Id;

    axios
      .post("https://nosql-delta.vercel.app/addpart", { id, cid })
      .then((json) => setData(json.data));

    history.push("/events");
  };
  return (
    <div>
      {userData.user ? (
        <div>
          {data ? (
            <div>
              <div className=" sm:flex justify-center sm:mx-24 mt-24">
                <img src={data.url} />
                <div className="sm:ml-6 ml-0">
                  <div className="font-bold text-4xl">{data.eventName}</div>
                  <div className="mt-8 text-2xl w-96">
                    {data.eventDescription}
                  </div>
                  <div className="mt-16 flex">
                    At this date :{" "}
                    <div className="font-semibold text-blue-800">
                      {" "}
                      {data.eventDate}
                    </div>
                  </div>
                  {part ? (
                    <div className="mt-16 font-bold text-red-600">
                      You already joined this event.
                    </div>
                  ) : (
                    <div>
                      <button
                        className="mt-16 text-white bg-green-600 p-4 font-bold"
                        onClick={handleAddPart}
                      >
                        Join This Event
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <Detail id={id} />
            </div>
          ) : (
            <>
              <div className="flex justify-center mt-6">
                <div className="font-bold text-xl mr-8">
                  There isn't event with that id.
                </div>
              </div>
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
