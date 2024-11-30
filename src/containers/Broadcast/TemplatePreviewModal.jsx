import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { motion } from "framer-motion";
import {
  FaWhatsapp,
  FaFile,
  FaVideo,
  FaMapMarkerAlt,
  FaImage,
  FaChevronLeft,
  FaEllipsisV,
  FaPhone,
} from "react-icons/fa";
import background from "../../../public/assets/images/png/image.png";

const placeholderMedia = {
  Document: "https://via.placeholder.com/150?text=Document",
  Video: "https://via.placeholder.com/150?text=Video",
  Location: "https://via.placeholder.com/150?text=Location",
  Image: "https://via.placeholder.com/150",
};

const TemplatePreviewModal = ({ template, isOpen, onClose }) => {
  if (!isOpen || !template) return null;

  const getCategoryText = (category) => {
    switch (category) {
      case 1:
        return "Marketing";
      case 2:
        return "Utility";
      case 3:
        return "Authentication";
      default:
        return "Unknown Category";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 0:
        return "Pending";
      case 1:
        return "Approved";
      case 2:
        return "Rejected";
      case 3:
        return "Pending";
      default:
        return "Unknown Status";
    }
  };

  const responsive = {
    superLargeDesktop: { breakpoint: { max: 4000, min: 1024 }, items: 1 },
    desktop: { breakpoint: { max: 1024, min: 768 }, items: 1 },
    tablet: { breakpoint: { max: 768, min: 464 }, items: 1 },
    mobile: { breakpoint: { max: 464, min: 0 }, items: 1 },
  };

  const renderHeaderContent = () => {
    if (template.header_media_type === "text") {
      return template.header_text || "No header text";
    } else if (template.header_media_type) {
      return template.header_media_type;
    } else {
      return "No header content";
    }
  };

  const renderMediaIcon = (type) => {
    switch (type) {
      case "Document":
        return <FaFile className="text-blue-500" />;
      case "Video":
        return <FaVideo className="text-red-500" />;
      case "Location":
        return <FaMapMarkerAlt className="text-green-500" />;
      case "Image":
        return <FaImage className="text-purple-500" />;
      default:
        return null;
    }
  };

  const renderCarouselMedia = (mediaType) => {
    switch (mediaType) {
      case "Document":
        return <img src={placeholderMedia.Document} alt="Document" />;
      case "Video":
        return <img src={placeholderMedia.Video} alt="Video" />;
      case "Location":
        return <img src={placeholderMedia.Location} alt="Location" />;
      case "Image":
        return <img src={placeholderMedia.Image} alt="Image" />;
      default:
        return <span>No media</span>;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-gray-800 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-7xl flex"
      >
        {/* Left Section for Template Details (Scrollable) */}
        <div className="flex-1 max-w-4xl pr-8 h-[80vh] overflow-y-auto">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">
            Template Details
          </h2>

          <div className="grid grid-cols-2 gap-6 mb-8">
            <InfoField
              label="Template Name"
              value={template.template_name || "N/A"}
            />
            <InfoField
              label="Category"
              value={getCategoryText(template.category)}
            />
            <InfoField label="Status" value={getStatusText(template.status)} />
            <InfoField
              label="Language"
              value={template.language.language || "N/A"}
            />
          </div>

          <Section title="Header">
            <div className="p-4 bg-gray-50 rounded-lg flex items-center">
              {renderMediaIcon(template.header_media_type)}
              <span className="ml-2">{renderHeaderContent()}</span>
            </div>
          </Section>

          <Section title="Body">
            <div
              className="p-4 bg-white overflow-auto text-gray-800 rounded-lg shadow"
              style={{ height: "250px" }}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap mb-1">
                {template.template_body}{" "}
                {/* Function to render the actual body content */}
              </p>
            </div>
          </Section>

          {template.template_footer && (
            <Section title="Footer">
              <div className="p-4 bg-gray-50 rounded-lg">
                {template.template_footer}
              </div>
            </Section>
          )}

          {template.carousels && template.carousels.length > 0 && (
            <Section title="Carousel">
              <Carousel
                responsive={responsive}
                infinite={true}
                className="mt-2 w-64" // Adjust width as needed
              >
                {template.carousels.map((carousel, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    className="p-6 bg-white rounded-lg shadow-md mx-2 my-8 border border-gray-200"
                  >
                    {/* Render carousel media based on media type */}
                    <div className="mb-4">
                      {renderCarouselMedia(carousel.media)}
                    </div>

                    <h4 className="font-semibold mb-2">Body:</h4>
                    <p className="mb-4">{carousel.body || "No body text"}</p>
                    <h4 className="font-semibold mb-2">Buttons:</h4>
                    {carousel.buttons.length > 0 ? (
                      carousel.buttons.map((button, btnIndex) => (
                        <div
                          key={btnIndex}
                          className="mb-2 p-2 bg-gray-100 rounded"
                        >
                          {button.text} - {button.type}
                        </div>
                      ))
                    ) : (
                      <p>No buttons</p>
                    )}
                  </motion.div>
                ))}
              </Carousel>
            </Section>
          )}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-8 bg-red-500 text-white px-6 py-2 rounded-full hover:bg-red-600 transition duration-300 ease-in-out"
            onClick={onClose}
          >
            Close
          </motion.button>
        </div>

        {/* Right Section - WhatsApp-style Preview */}
        <div className="w-96 bg-gray-100 p-6 rounded-lg shadow-inner">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="w-full bg-[#E5DDD5] rounded-lg shadow-md overflow-hidden h-[60vh] relative"
          >
            {/* WhatsApp-style header */}
            <div className="bg-[#075E54] text-white p-2 flex items-center">
              <FaChevronLeft className="mr-2" />

              <FaWhatsapp className="mr-2" />

              <span className="flex-grow">Business Name</span>

              <FaVideo className="mx-2" />

              <FaPhone className="mx-2" />

              <FaEllipsisV className="ml-2" />
            </div>
            <div
              className="p-4 h-full overflow-y-auto"
              style={{
                backgroundImage: `url(${background})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="bg-white p-3 rounded-lg shadow-sm max-w-[80%] ml-auto mb-2">
                {template.header_text && (
                  <p className="font-bold mb-1">{template.header_text}</p>
                )}
                <p className="whitespace-pre-wrap mb-1">
                  {template.template_body || "Your message..."}
                </p>

                {template.template_footer && (
                  <p className="text-xs text-gray-500">
                    {template.template_footer}
                  </p>
                )}
                <span className="text-xs text-gray-500 float-right -mt-2">
                  07:28
                </span>
                {template.quick_replies && (
                  <div className="mt-4 space-y-2">
                    {template.quick_replies.map((reply, index) => (
                      <motion.button
                        key={index}
                        className="bg-white text-[#8043f3] px-4 py-2 text-sm border-t hover:bg-gray-100 transition duration-300 ease-in-out w-full text-center"
                      >
                        {reply.text || "Reply"}
                      </motion.button>
                    ))}
                  </div>
                )}
              </div>

              {/* Add Carousel Preview in the WhatsApp-style box */}
              {template.carousels && template.carousels.length > 0 && (
                <Carousel
                  responsive={responsive}
                  infinite={true}
                  className="mt-4 w-full"
                  arrows={false} // Optional: Remove arrows in the smaller WhatsApp preview
                  showDots={true} // Optional: Show dots for navigation
                  containerClass="carousel-container"
                >
                  {template.carousels.map((carousel, index) => (
                    <motion.div
                      key={index}
                      className="p-3 bg-white rounded-lg shadow-sm mb-4"
                    >
                      {/* Render carousel media in the preview */}
                      <div className="mb-4">
                        {renderCarouselMedia(carousel.media)}
                      </div>

                      <p className="font-semibold">{carousel.body}</p>
                      {carousel.buttons.map((button, btnIndex) => (
                        <div
                          key={btnIndex}
                          className="mt-2 bg-gray-200 p-2 rounded"
                        >
                          {button.text} - {button.type}
                        </div>
                      ))}
                    </motion.div>
                  ))}
                </Carousel>
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const Section = ({ title, children }) => (
  <div className="mb-8">
    <h3 className="text-xl font-semibold mb-4 text-gray-700">{title}</h3>
    {children}
  </div>
);

const InfoField = ({ label, value }) => (
  <div className="bg-gray-50 p-4 rounded-lg">
    <p className="text-sm text-gray-500 mb-1">{label}</p>
    <p className="font-medium text-gray-800">{value}</p>
  </div>
);

export default TemplatePreviewModal;
