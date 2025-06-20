import { SpinnerInfinity } from 'spinners-react'
import { useNavigate } from 'react-router-dom'

const LoadingError = ({ loading, error }) => {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex items-center min-h-[60vh] justify-center">
        <SpinnerInfinity
          size={58}
          thickness={124}
          speed={109}
          color="rgba(57, 110, 172, 1)"
          secondaryColor="rgba(57, 172, 86, 0.44)"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-10 items-center min-h-[60vh] justify-center text-sm">
        <p className="bg-pink-200 text-pink-600 rounded-lg px-4 py-2">
          Error fetching blogs: {error.message}
        </p>
        <button
          className="md:block w-[50%] text-center hover:bg-emerald-950 cursor-pointer hover:text-emerald-500 border border-emerald-500 text-emerald-500 font-bold px-6 py-2 rounded"
          onClick={() => navigate("/")}
        >
          Back Home
        </button>
      </div>
    );
  }

  return null;
};

export default LoadingError;
