// CommentComponent.jsx
import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import AuthContext from "../Context/AuthContext";

const CommentComponent = (id) => {
  const [comments, setComments] = useState([]); // State to store comments
  const [newComment, setNewComment] = useState(""); // State for input field
  const { userData } = useContext(AuthContext);

  const handleAddComment = () => {
    if (newComment.trim() !== "") {
      const username = userData.user.username;

      axios.post("https://nosql-delta.vercel.app/addcomment", {
        username,
        newComment,
        id,
      });
      //   setComments([...comments, newComment]); // Add new comment to list
      setNewComment(""); // Clear input field
    }
  };
  useEffect(() => {
    axios
      .post("https://nosql-delta.vercel.app/getcomment", {
        id,
      })
      .then((json) => setComments(json.data.comments));
  }, [comments]);

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Comments</h2>

      <div className="mb-4">
        <textarea
          className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
      </div>

      <button
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        onClick={handleAddComment}
      >
        Add Comment
      </button>

      <div className="mt-6">
        {comments.length > 0 ? (
          <ul className="space-y-4">
            {comments.map((index) => (
              <li className="p-3 bg-gray-100 rounded-md shadow-sm">
                <div className="text-xl">{index.comment}</div>
                <div className="font-bold text-sm">{index.username}</div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">
            No comments yet. Be the first to comment!
          </p>
        )}
      </div>
    </div>
  );
};

export default CommentComponent;
