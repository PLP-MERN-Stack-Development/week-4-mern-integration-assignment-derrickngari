import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { HeartIcon, ChatBubbleLeftRightIcon, EyeIcon } from "@heroicons/react/24/solid";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import ReactTimeAgo from "react-time-ago";
import { AuthContext } from "../context/authContext";

TimeAgo.addDefaultLocale(en);

const BlogPage = () => {
  const [blog, setBlog] = useState({});
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const { id } = useParams();
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()

  useEffect(()=> {
    if(!user) {
      navigate("/login")
    }
  }, [user, navigate])

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const headers = user
          ? {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
              }
            }
          : {};
        const res = await axios.get(`http://localhost:3000/api/posts/${id}`, headers);
        setBlog(res.data);
        setComments(res.data.comments);
      } catch (error) {
        console.error(error);
      }
    };
    fetchBlog();
  }, [id, user]);

  const isLikedByUser = user && blog.likes?.some((userId) => userId === user.id);

  const handleLike = async () => {
    try {
      await axios.post(
        `http://localhost:3000/api/posts/${id}/likes`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );
      const res = await axios.get(`http://localhost:3000/api/posts/${id}`);
      setBlog(res.data);
    } catch (err) {
      console.error("Like failed:", err);
    }
  };;
  
  return (
    <div className="p-15 max-w-4xl">
      <div className="items-center mb-6">
        <h2 className="text-2xl font-bold mb-3">{blog.title}</h2>
        <span>
          <p className="text-sm text-gray-500 ml-4">By {blog.author?.name}</p>
          <p className="text-xs text-gray-600 ml-4">
            {new Date(blog.createdAt).toLocaleString()}
          </p>
        </span>
      </div>
      <div className="px-1.5 prose max-w-none">
        <div
          className="prose content prose-invert text-sm p-2 prose-lg max-w-2xl leading-relaxed text-slate-300 my-4"
          dangerouslySetInnerHTML={{ __html: blog.content || "" }}
        />
      </div>

      <div className="w-[80%] bg-gray-800 h-[1px] mx-auto mt-6"></div>

      <div className="flex justify-between items-center mt-7">
        <div className="flex mt-1 justify-between gap-2 text-sm font-medium text-gray-500">
          <ChatBubbleLeftRightIcon className="w-4 h-4 mt-0.5 hover:text-emerald-400" />
          <p>{comments?.length || 0}</p>
        </div>
        <div className="flex justify-between gap-4 text-sm font-medium items-center">
          {/* View Count */}
          <div className="flex mt-1 items-center justify-between gap-2 text-sm font-medium text-gray-500">
            <EyeIcon className="w-4 h-4 hover:text-emerald-400" />
            <p className="text-gray-500">{blog?.viewCount?.length || 0}</p>
          </div>

          {/* Likes */}
          <div className="flex justify-between gap-1 mt-1 text-sm font-medium items-center">
            <HeartIcon
              className={`w-4 h-4 ${
                isLikedByUser
                  ? "text-red-500"
                  : "text-gray-500 hover:text-gray-400"
              }`}
              onClick={handleLike}
            />
            <p className="text-gray-500">{blog.likes?.length || 0}</p>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold text-white mb-2">Comments</h3>
        <div className="space-y-4">
          {comments.length === 0 && (
            <p className="text-gray-500 text-sm">
              No comments yet. Be the first!
            </p>
          )}
          {comments.map((comment, index) => (
            <div
              key={index}
              className="bg-slate-800 p-3 rounded-md text-gray-300"
            >
              <p className="text-sm">{comment.content}</p>
              <p className="text-xs text-gray-400 mt-1">
                — {comment.user?.name || "Anonymous"} at{" "}
                <ReactTimeAgo
                  date={new Date(comment.createdAt)}
                  locale="en-US"
                />
              </p>
            </div>
          ))}
        </div>
      </div>

      <form
        className="mt-6 flex flex-col gap-2"
        onSubmit={async (e) => {
          e.preventDefault();
          if (!commentText) return;

          try {
            await axios.post(
              `http://localhost:3000/api/posts/${id}/comments`,
              { content: commentText },
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            );
            setCommentText("");
            const res = await axios.get(
              `http://localhost:3000/api/posts/${id}`
            );
            setComments(res.data.comments);
          } catch (err) {
            console.error("Error posting comment:", err);
          }
        }}
      >
        <textarea
          className="p-2 rounded bg-slate-800 border border-emerald-500 text-gray-200 outline-none resize-none"
          rows={2}
          placeholder="Write a comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />
        <button
          type="submit"
          className="self-end px-4 py-1 hover:bg-emerald-950 cursor-pointer hover:text-emerald-500 border border-emerald-500 text-emerald-500 rounded-md"
        >
          Post Comment
        </button>
      </form>
    </div>
  );
};

export default BlogPage;
