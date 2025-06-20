// hooks/useAxios.js
import { useState, useEffect } from 'react'
import axios from 'axios'

const useAxios = (endpoint, config = {}, deps = []) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const res = await axios({
          url: endpoint,
          method: config.method || 'GET',
          data: config.body || null,
          headers: {
            'Content-Type': 'application/json',
            ...(config.headers || {})
          }
        })
        setData(res.data)
      } catch (err) {
        setError(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, deps)

  return { data, loading, error }
}

export default useAxios
