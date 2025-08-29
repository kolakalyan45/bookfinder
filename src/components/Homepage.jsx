import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import loadinglif from '../../Loading_icon.gif';

import FullMore from './FullMore';

const Homepage = () => {
  const [response, setresponse] = useState([]); // full results
  const [count, setcount] = useState(10);       // how many to show
  const [data, setdata] = useState([]);         // visible results
  const [SinglePage, setSinglePage] = useState(false);
  const [loading, setloading] = useState(false);
  const [apicalled, setapicalled] = useState(false);
  const [Particularone, setParticularone] = useState("");

  const { register, handleSubmit } = useForm({
    defaultValues: {
      title: "",
      author: "",
      first_publish_year: "",
      language: ""
    },
  });

  // keep data in sync with response and count
  useEffect(() => {
    setdata(response.slice(0, count));
  }, [count, response]);

  // build query + call API
  const callApi = async (formData) => {
    setloading(true);
    setapicalled(true);
    let url = "";

    for (let [key, value] of Object.entries(formData)) {
      if (!value) continue; // skip empty
      if (key === "title") value = value.replaceAll(" ", "+");
      url += `${key}=${value}&`;
    }

    try {
      const res = await axios.get(`https://openlibrary.org/search.json?${url}`);
      setresponse(res.data.docs); 
      setcount(10);
    } catch (err) {
      console.error(err);
    } finally {
      setloading(false);
    }
  };

  const formsubmit = (data) => {
    const filteredData = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value?.toString().trim() !== "")
    );

    if (Object.keys(filteredData).length === 0) {
      alert("Please enter something");
      return;
    }

    callApi(filteredData);
  };

  return (
    <>
      <div className='flex flex-col justify-center items-center mt-5 gap-2 sm:p-5 p-3 relative'>
        <div className='Commoncol sm:w-auto w-full flex items-center justify-center '>
          <h1 style={{fontSize:"25px"}} className='font-bold text-blue-700'>BOOK FINDER</h1>
          <h5>Find your next favorite read by searching for titles, authors, or subjects.</h5>
        </div>

        <div className="mx-auto mt-4 w-full sm:w-4/5 md:w-2/3 lg:w-1/2 xl:w-2/5 border border-gray-200 shadow-lg rounded-2xl bg-white p-6">
          <form onSubmit={handleSubmit(formsubmit)} className="flex flex-wrap gap-4">
            {/* Book Title */}
            <div className="flex flex-col w-full sm:w-3/4">
              <label htmlFor="title" className="mb-1 text-sm font-medium text-gray-700">Book Title</label>
              <input {...register("title")} type="text" id="title" placeholder="Enter book title" className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700" />
            </div>

            {/* Author */}
            <div className="flex flex-col w-full sm:w-3/4">
              <label htmlFor="author" className="mb-1 text-sm font-medium text-gray-700">Author Name</label>
              <input {...register("author")} type="text" id="author" placeholder="Enter author name" className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700" />
            </div>

            {/* Year */}
            <div className="flex flex-col w-full sm:w-1/5">
              <label htmlFor="year" className="mb-1 text-sm font-medium text-gray-700">Year</label>
              <input {...register("first_publish_year")} type="number" id="year" placeholder="e.g. 1866" className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700" />
            </div>

            {/* Language */}
            <div className="flex flex-col w-full justify-items-end w-full sm:w-2/4 sm:mr-5">
              <label htmlFor="language" className="mb-1 text-sm font-medium text-gray-700">Language</label>
              <select {...register("language")} id="language" className="w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 bg-white">
                <option value="">Any Language</option>
                <option value="eng">English</option>
                <option value="spa">Spanish</option>
                <option value="fra">French</option>
                <option value="ger">German</option>
              </select>
            </div>

            {/* Submit */}
            <div className="flex items-center sm:mt-5 w-full justify-center sm:w-60 sm:w-auto sm:ml-5">
              <button type="submit" className="w-2/5 sm:w-auto px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg shadow-md transition duration-200">Search</button>
            </div>
          </form>
        </div>

        {/* Results */}
        <div className='flex flex-col items-center justify-center gap-1 items-center method' style={{width:"90%"}}>
         

          {loading ? (
            <div>
              <img src={loadinglif} alt="Loading..." />

            </div>
          ) : (
            <>
             <div className='mb-5'><h2 className='font-bold text-lg'>Here are the search results</h2></div>
           

           <div className="w-full mt-3 flex flex-wrap gap-6 justify-center">
  {data.map((e) => (
    <div
      key={e.key || e.cover_edition_key}
      className="bg-white w-[45%] sm:w-[30%] md:w-[22%] lg:w-[18%] 
                 shadow-sm hover:shadow-lg border border-gray-200 
                 rounded-2xl overflow-hidden transition-transform duration-200 hover:-translate-y-1"
    >
      {/* Cover */}
      <img
        src={
          e.cover_edition_key
            ? `https://covers.openlibrary.org/b/olid/${e.cover_edition_key}-L.jpg`
            : "https://via.placeholder.com/150x200?text=No+Cover"
        }
        alt={e.title}
        className="w-full h-56 object-cover"
      />

      {/* Info */}
      <div className="p-4 flex flex-col gap-2">
        <h6 className="font-semibold text-gray-900 text-sm sm:text-base truncate">
          {e.title}
        </h6>
        <p className="text-gray-600 text-xs sm:text-sm truncate">
          {e.author_name?.[0] || "Unknown Author"}
        </p>

        <button
          onClick={() => {
            setSinglePage(true);
            setParticularone(e);
          }}
          className="mt-3 px-3 py-2 bg-blue-600 text-white rounded-lg text-xs sm:text-sm 
                     font-medium shadow hover:bg-blue-700 transition-colors"
        >
          View Details
        </button>
      </div>
    </div>
  ))}
</div>

            </>
          )}

          <div>
            {!loading && apicalled && (
              <p className='underline text-red-600' style={{ cursor: "pointer" }} onClick={() => setcount((prev) => Math.min(prev + 5, response.length))}>
                {count < response.length ? "Show More" : "No More Results"}
              </p>
            )}
          </div>
        </div>
      </div>
   {SinglePage && <FullMore Particularone={Particularone} onClose={() => setSinglePage(false)} />}
    
   
    </>
  );
};

export default Homepage;
