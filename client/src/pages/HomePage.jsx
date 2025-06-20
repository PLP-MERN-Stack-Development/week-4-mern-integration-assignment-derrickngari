import { useEffect, useState } from 'react'
import axios from 'axios'
import BlogList from '../componets/BlogList'
import useAxios from '../hooks/useAxios'
import LoadingError from '../componets/LoadingError'

const HomePage = () => {
    const { data: blogs, loading, error } = useAxios('http://localhost:3000/api/posts')
  
  if (loading || error) return <LoadingError loading={loading} error={error} />

    return (
      <div className="mt-5 space-y-8 p-5 max-w-4xl">
        {blogs.map((blog) => (
          <BlogList key={blog._id} blog={blog} />
        ))}
      </div>
    );
}

export default HomePage