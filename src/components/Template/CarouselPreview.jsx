import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { FaChevronLeft, FaWhatsapp, FaVideo, FaPhone, FaEllipsisV } from "react-icons/fa";
import { motion } from 'framer-motion';

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 1,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 1,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  },
};

const WhatsAppPreviewCarousel = ({ carouselItems }) => {
  // Helper function to get the icon for the button based on its type
  const getReplyIcon = (type) => {
    switch (type) {
      case "QUICK_REPLY":
        return "/assets/images/svg/reply2.svg"; // Placeholder for quick reply icon
      case "URL":
        return "/assets/images/svg/icon-web.svg"; // Placeholder for URL icon
      case "PHONE_NUMBER":
        return "/assets/images/svg/icon-web.svg"; // Placeholder for phone number icon
      default:
        return "/assets/images/svg/default.svg"; // Default icon if type doesn't match
    }
  };

  return (
    <>
    

      {/* Carousel with WhatsApp message preview */}
      <div className="p-4">
        <Carousel
          responsive={responsive}
          showDots={true}
          arrows={true}
          infinite={false}
          autoPlay={false}
          containerClass="carousel-container"
          itemClass="carousel-item"
          removeArrowOnDeviceType={["tablet", "mobile"]}
        >
          {carouselItems.length > 0 &&
            carouselItems.map((item, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm max-w-full mb-2">
                {/* Media Rendering */}
                {item.media === "Image" && (
                  <div className="mb-4">
                    <img
                      src="https://via.placeholder.com/200?text=Image" // Placeholder for image
                      alt="Image"
                      className="w-full h-auto rounded-lg"
                    />
                  </div>
                )}
                {item.media === "Video" && (
                  <div className="mb-4">
                    <video
                      src="https://via.placeholder.com/200?text=Video" // Placeholder for video
                      controls
                      className="w-full h-auto rounded-lg"
                    >
                      Your browser does not support the video tag.
                    </video>
                  </div>
                )}
                {item.media === "Document" && (
                  <div className="mb-4">
                    <img
                      src="https://via.placeholder.com/200?text=Document" // Placeholder for document
                      alt="Document"
                      className="w-full h-auto rounded-lg"
                    />
                  </div>
                )}

                {/* Body text */}
                <p className="whitespace-pre-wrap mb-2">
                  {item.body || "Your message..."}
                </p>

                {/* Render Buttons */}
                {item.buttons.length > 0 && (
                  <div className="flex flex-col space-y-2">
                    {item.buttons.map((button, buttonIndex) => (
                      <button
                        key={buttonIndex}
                        className="bg-white flex items-center text-[#8043f3] px-16  text-sm border-t hover:bg-gray-100 transition duration-300 ease-in-out w-full text-center"
                        style={{ maxWidth: "fit-content" }}
                      >
                        <img
                          src={getReplyIcon(button.type)} // Use button.type to get the correct icon
                          width={16}
                          height={16}
                          className="mr-2" // Margin between icon and text
                        />
                        {button.type === "URL" ? (
                          <a
                            href={button.url || "#"}
                            className="whatsapp-button-link text-[#8043f3]" // Text color updated
                          >
                            {button.text || "Visit Website"}
                          </a>
                        ) : button.type === "PHONE_NUMBER" ? (
                          <span>{button.text || "Call"}</span>
                        ) : (
                          <span>{button.text || "Quick Reply"}</span>
                        )}
                      </button>
                    ))}
                  </div>
                )}

                {/* Timestamp */}
                <div className="text-right text-xs text-gray-500 mt-2">07:28</div>
              </div>
            ))}
        </Carousel>
      </div>
    </>
  );
};

export default WhatsAppPreviewCarousel;
