import { useState, useEffect} from 'react'
import { useParams } from "react-router-dom"; 
import axios from 'axios'
import { HeartIcon, ChatBubbleLeftRightIcon, EyeIcon } from '@heroicons/react/24/solid'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
TimeAgo.addDefaultLocale(en)
import ReactTimeAgo from 'react-time-ago'

const BlogPage = () => {
    const [blog, setBlog] = useState({})
    const [liked, setLiked] = useState(false)
    const [likeCount, setLikeCount] = useState(0)
    const [comments, setComments] = useState([])
    const [commentText, setCommentText] = useState('')

    const { id } = useParams()

    useEffect(() => {
        const fetchBlog = async () => {
            const res = await axios.get(`http://localhost:3000/api/posts/${id}`)
            setBlog(res.data)
            setComments(res.data.comments)
        }
        fetchBlog()
    }, [id])

    console.log(blog);

  return (
    <div className="p-15 max-w-4xl">
      <div className="items-center mb-6 ">
        <h2 className="text-2xl font-bold mb-3">{blog.title}</h2>
        <span>
          <p className="text-sm text-gray-500 ml-4">By {blog.author?.name}</p>
          <p className="text-xs text-gray-600 ml-4">
            {new Date(blog.createdAt).toLocaleString()}
          </p>
        </span>
      </div>
      <p className="px-1.5 prose max-w-none">
        {/* <ReactMarkdown
          rehypePlugins={[rehypeSanitize, rehypeHighlight]}
          components={{
            p: ({node, ...props}) => <p className="mb-3 mt-3" {...props} />
          }}
        >
      {blog.content}
    </ReactMarkdown> */}
        <p className="prose content prose-invert text-sm p-2 prose-lg max-w-2xl leading-relaxed text-slate-300 my-4">
          <div dangerouslySetInnerHTML={{ __html: blog.content || "" }} />
        </p>
      </p>

      <div className="w-[80%] bg-gray-800 h-[1px] mx-auto mt-6"></div>

      <div className="flex justify-between items-center mt-7">
        <div className="flex justify-between gap-2 text-sm font-medium text-gray-500">
          <p className="">
            <ChatBubbleLeftRightIcon className="w-4 h-4 mt-0.5 hover:text-emerald-400" />
          </p>
          <p>{comments?.length || 0}</p>
        </div>
        <div className="flex justify-between gap-2.5 text-sm font-medium items-center">
          <p>
            <HeartIcon
              className={`w-4 h-4 ${
                liked ? "text-red-500" : "text-gray-500 hover:text-gray-400"
              }`}
              onClick={async () => {
                try {
                  await axios.post(
                    `http://localhost:3000/api/posts/${id}/likes`,
                    {},
                    {
                      headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                          "token"
                        )}`,
                      },
                    }
                  );

                  const res = await axios.get(
                    `http://localhost:3000/api/posts/${id}`
                  );
                  setBlog(res.data);

                  // setBlog(prevBlog => ({ ...prevBlog, viewCount: (prevBlog.viewCount || 0) + 1 }));

                  setLiked(liked);
                } catch (err) {
                  console.error("Like failed", err);
                }
              }}
            />
          </p>
          <p className="text-gray-500 ">{blog?.viewCount}</p>
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
                {<ReactTimeAgo date={new Date(comment.createdAt)} locale="en-US" />}
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
            console.error("Error posting comment", err);
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
          className="self-end px-4 py-1 hover:bg-emerald-950 cursor-pointer hover:text-emerald-500 border border-emerald-500 text-emerald-500 rounded-md "
        >
          Post Comment
        </button>
      </form>
    </div>
  );
}

export default BlogPage