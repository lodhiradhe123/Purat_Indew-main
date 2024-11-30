import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faCamera,
  faCircleUser,
  faEllipsisVertical,
  faFaceGrinWide,
  faIndianRupeeSign,
  faPaperclip,
  faPhone,
  faVideo,
} from "@fortawesome/free-solid-svg-icons";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const Mobile = ({ data }) => {
  const { callPhoneNumber, callPhoneText, visitWebsiteText, visitWebsiteUrl } =
    data?.action || {};

  const responsive = {
    desktop: { breakpoint: { max: 3000, min: 1024 }, items: 1 },
    tablet: { breakpoint: { max: 1024, min: 464 }, items: 1 },
    mobile: { breakpoint: { max: 464, min: 0 }, items: 1 },
  };

  const renderMedia = () => {
    if (data?.media_file && data?.media_type) {
      if (data.media_type.startsWith("image")) {
        return (
          <img
            src={data.media_file}
            alt="Media Content"
            className="w-screen h-28 rounded-lg"
          />
        );
      } else if (data.media_type.startsWith("video")) {
        return (
          <video
            src={data.media_file}
            controls
            className="rounded-lg w-full h-auto"
          ></video>
        );
      } else if (data.media_type === "application/pdf") {
        return (
          <embed
            src={data.media_file}
            type="application/pdf"
            className="rounded-t-lg w-full h-auto"
          />
        );
      }
    }
    return null;
  };

  const renderCallToActionButtons = () => (
    <div className="mt-2">
      {visitWebsiteText && visitWebsiteUrl && (
        <a
          className="flex gap-2 justify-center items-end text-blue-500 active:text-purple-600 cursor-pointer border-b-2 pb-2"
          onClick={() => (window.location.href = visitWebsiteUrl)}
        >
          <img
            src="/assets/images/svg/icon-web.svg"
            width={16}
            height={16}
            alt="web-icon"
          />
          {visitWebsiteText}
        </a>
      )}
      {callPhoneText && callPhoneNumber && (
        <a
          className="flex gap-2 justify-center text-blue-500 active:text-purple-600 cursor-pointer pt-1"
          onClick={() => (window.location.href = `tel:${callPhoneNumber}`)}
        >
          <i className="fas fa-phone text-lg"></i>
          {callPhoneText}
        </a>
      )}
    </div>
  );

  const renderQuickReplyButtons = () => {
    const replies = data?.reply || [];
    if (!replies.length) return null;

    return (
      <div className="space-y-2">
        {replies.map((reply, index) => (
          <button
            key={index}
            className="bg-white flex items-center text-[#8043f3] px-8 py-2 text-sm border-t hover:bg-gray-100 transition duration-300 ease-in-out w-full  justify-center"
            onClick={() => handleQuickReplyClick(reply)}
          >
            <img
              src={getReplyIcon(reply.type)} // Get the icon dynamically based on the type
              width={16}
              height={16}
              alt={`${reply.type.toLowerCase()}-icon`}
              className="mr-2" // Margin between icon and text
            />
            {reply.text}
          </button>
        ))}
      </div>
    );
  };

  // Function to return icon/image path based on reply type
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

  const handleQuickReplyClick = (reply) => {
    switch (reply.type) {
      case "PHONE_NUMBER":
        window.location.href = `tel:${reply.phone_number}`;
        break;
      case "URL":
        window.open(reply.url, "_blank");
        break;
      default:
        console.log("Quick reply clicked:", reply.text);
    }
  };

  const renderCarousel = () => {
    if (data?.carousels && data.carousels.length > 0) {
      return (
        <Carousel
          responsive={responsive}
          infinite={true}
          className="mt-2 w-64" // Adjust width as needed
     
        >
          {data.carousels.map((item, index) => (
            <div
              key={index}
              className="carousel-item bg-white rounded-lg shadow-md p-2 flex- flex-col"
            >
          {item.media && (
  (() => {
    const blobUrl = item.media;
    const blob = new Blob([blobUrl], { type: 'image/jpeg' }); // or 'video/mp4' for videos
    const url = URL.createObjectURL(blob);

    if (blob.type.startsWith('image/')) {
      return (
        <img
          src={url}
          alt={`Carousel item ${index + 1}`}
          className="w-full h-32 object-cover rounded-t-lg"
        />
      );
    } else if (blob.type.startsWith('video/')) {
      return (
        <video
          src={url}
          controls
          className="w-full h-32 object-cover rounded-t-lg"
        >
          Your browser does not support the video tag.
        </video>
      );
    } else {
      return (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full h-32 object-cover rounded-t-lg"
        >
          {item.media}
        </a>
      );
    }
  })()
)}






              <div className="p-2">
                <h3 className="font-semibold text-lg">{item.header}</h3>
                <p className="text-sm">{item.body}</p>
                {item.buttons &&
                  item.buttons.map((button, btnIndex) => (
                    <button
                      key={btnIndex}
                      className="bg-white flex items-center text-[#8043f3] px-8 py-2 text-sm border-t hover:bg-gray-100 transition duration-300 ease-in-out w-full text-center"
                      onClick={() => handleCarouselButtonClick(button)}
                    >
                      <img
                        src="/assets/images/svg/reply2.svg"
                        width={16}
                        height={16}
                        alt="reply-icon"
                        className="mr-8"
                      />
                      {button.text}
                    </button>
                  ))}
              </div>
            </div>
          ))}
        </Carousel>
      );
    }
    return null;
  };

  const handleCarouselButtonClick = (button) => {
    switch (button.type) {
      case "Custom":
        console.log("Custom button clicked:", button.text);
        break;
      case "Visit website":
        window.open(button.url, "_blank");
        break;
      case "Call Phone Number":
        window.location.href = `tel:${button.phoneNumber}`;
        break;
      default:
        console.log("Button clicked:", button.text);
    }
  };

  return (
    <div className="mobile-ui bg-white rounded-2xl border-[8px] border-white shadow-2xl flex flex-col h-[70vh]">
      {/* top part */}
      <div className="p-2 flex items-center justify-between bg-[#3ea663] rounded-t-lg text-white">
        <div className="flex items-center gap-2">
          <FontAwesomeIcon icon={faArrowLeft} />
          <FontAwesomeIcon icon={faCircleUser} className="text-3xl" />
        </div>
        <div className="flex gap-4">
          <FontAwesomeIcon icon={faVideo} className="text-lg" />
          <FontAwesomeIcon icon={faPhone} className="text-lg" />
          <FontAwesomeIcon icon={faEllipsisVertical} className="text-lg" />
        </div>
      </div>

      {/* Middle part */}

      <div
        id="messages"
        className="flex-1 p-3 overflow-auto w-[85%] scrollbar-hide"
      >
        {data?.message && (
          <div className="bg-slate-50 p-2 rounded-lg border-slate-700">
            {renderMedia()}
            <div className="rounded-b-lg p-2 mt-1">
              <p className="whitespace-pre-wrap break-words">{data?.message}</p>
              <div className="text-right text-xs text-gray-500 border-b-2 py-2">
                {data?.delivery_time}
              </div>
              {(callPhoneNumber ||
                callPhoneText ||
                visitWebsiteText ||
                visitWebsiteUrl) &&
                renderCallToActionButtons()}
              {data?.reply && renderQuickReplyButtons()}
            </div>
          </div>
        )}
        {renderCarousel()}
      </div>

      {/* bottom part */}
      <div className="flex items-center p-2 gap-2 bg-gray-300 rounded-b-lg">
        <div className="flex items-center bg-gray-200 rounded-full p-1 gap-2 flex-grow">
          <FontAwesomeIcon
            icon={faFaceGrinWide}
            className="text-gray-600 text-lg"
          />
          <input
            type="text"
            id="messageInput"
            className="flex-grow bg-transparent placeholder-gray-600 outline-none w-36"
            placeholder="Message"
            autoFocus
          />
          <FontAwesomeIcon
            icon={faPaperclip}
            className="text-gray-600 text-lg rotate-[-45deg]"
          />
          <FontAwesomeIcon
            icon={faIndianRupeeSign}
            className="text-gray-600 text-lg"
          />
          <FontAwesomeIcon icon={faCamera} className="text-gray-600 text-lg" />
        </div>
        <div className="bg-green-500 cursor-pointer w-8 h-8 rounded-full flex justify-center items-center">
          <img
            src="/assets/images/svg/send-icon.svg"
            width={16}
            height={16}
            alt="send"
          />
        </div>
      </div>
    </div>
  );
};

export default Mobile;
