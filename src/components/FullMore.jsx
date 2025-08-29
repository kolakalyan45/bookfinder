import axios from 'axios';
import React, { useEffect, useState } from 'react';

const FullMore = ({ Particularone, onClose }) => {
  const [details, setdetails] = useState(null);

  useEffect(() => {
    const apical = async () => {
      try {
        const res = await axios.get(`https://openlibrary.org${Particularone.key}.json`);
        setdetails(res.data);
      } catch (err) {
        console.error("Error fetching book:", err);
      }
    };
    if (Particularone?.key) {
      apical();
    }
  }, [Particularone]);

  return (
    <div className="overLay">
      <div className="flex items-center w-100 justify-center h-full">
        <div className="bigcard h-3/5 relative md:w-4/5 lg:w-3/6 w-4/5 flex sm:flex-row flex-col gap-2 rounded-md justify-evenly p-5">
          {/* Cover */}
          <div className="sm:w-2/5 w-full h-2/6 sm:h-full ">
            <img
              className="w-full h-full sm:h-full object-contain"
              src={`https://covers.openlibrary.org/b/olid/${Particularone.cover_edition_key}-S.jpg`}
              alt={Particularone.title}
            />
          </div>

          {/* Info */}
        <div className="sm:w-2/5 w-full sm:p-4 flex flex-col justify-start gap-3 text-gray-800">
  {/* Title */}
  <h2 className="text-lg font-semibold text-gray-900">
    {Particularone.title}
  </h2>

  {/* Author */}
  <p className="text-sm">
    <span className="font-medium text-gray-700">Author:</span>{" "}
    {Particularone.author_name?.[0] || "Unknown Author"}
  </p>

  {/* Description */}
{details?.description && (
  <div className="text-sm leading-relaxed text-gray-600 relative">
    <span className="font-medium text-gray-700 block mb-1">Description:</span>
    <p className="line-clamp-3">
      {typeof details.description === "string"
        ? details.description
        : details.description.value}
    </p>
  </div>
)}

  {/* Subjects */}
  {details?.subjects && (
    <p className="text-sm">
      <span className="font-medium text-gray-700">Subjects:</span>{" "}
      <span className="italic text-gray-600">
        {details.subjects.slice(0, 5).join(", ")}
      </span>
    </p>
  )}
</div>


         <button type="button" class="absolute top-2 right-5 " style={{fontSize:"20px"}} onClick={() => onClose()}>❌</button>
        </div>
      </div>
    </div>
  );
};

export default FullMore;
