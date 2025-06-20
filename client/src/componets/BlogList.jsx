import { useState } from 'react'
import { HeartIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/solid'
import { Link } from "react-router-dom";

const BlogList = ({ blog}) => {
    const [liked, setLiked] = useState(false)
    const [likeCount, setLikeCount] = useState(0)

  return (
    
      <ul
        className="border-1 rounded p-4 border-gray-800 shadow-md bg-slate-900 mt-6"
      >
        <li>
          <Link to={`/blog/${blog._id}`}>
            <h2 className="text-2xl font-bold mb-3 cursor-pointer hover:underline">{blog.title}</h2>
        </Link>
          <span className="text-xs mb-2 text-gray-500">
            {new Date(blog.createdAt).toLocaleString()}
          </span>
          <p className="text-md mb-2">{blog.excerpt}</p>
        </li>
        <div className="flex justify-between items-center">
          <div className="flex justify-between mt-1 gap-2 text-sm font-medium text-gray-500">
            <p className="">
              <ChatBubbleLeftRightIcon className="w-4 h-4 hover:text-emerald-400" />
            </p>
            <p>{blog.comments.length}</p>
          </div>
          <div className="flex justify-between gap-1 mt-1 text-sm font-medium items-center">
            <p>
              <HeartIcon
                className={`w-4 h-4 ${
                  liked ? "text-red-500" : "text-gray-500 hover:text-gray-400"
                }`}
                onClick={() => {
                  setLiked(!liked);
                  setLikeCount((prev) => prev + 1);
                }}
              />
            </p>
            <p className="text-gray-500">{likeCount}</p>
          </div>
        </div>
      </ul>
  );
}

export default BlogList