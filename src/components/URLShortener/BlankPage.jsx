import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { urlShortener } from "../../services/api";

const BlankPage = () => {
  const { s_url } = useParams(); // Capture the s_url from the URL

  useEffect(() => {
    const fetchAndRedirect = async () => {
      try {
        const response = await urlShortener({
          action: "hit", // The action for the API call
          s_url: s_url, // Send the captured s_url as the input type
        });

        if (response?.status === 200 && response?.data?.status === 1) {
          const longURL = response.data["l_url"];
          if (longURL) {
            window.location.href = longURL; // Redirect to the long URL
          } else {
            console.error("Long URL not found in the response");
          }
        } else {
          console.error("Failed to retrieve the URL from the API:", response);
        }
      } catch (error) {
        console.error("Error occurred during API call:", error);
      }
    };

    fetchAndRedirect();
  }, [s_url]);

  return (
    <div>
      <p>Loading...</p> {/* This can be a loading indicator or message */}
    </div>
  );
};

export default BlankPage;
