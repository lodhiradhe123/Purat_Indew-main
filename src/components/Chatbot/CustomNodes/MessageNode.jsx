import { useState, useRef, useCallback } from "react";
import { Handle, Position, useReactFlow } from "@xyflow/react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy, faTrashCan } from "@fortawesome/free-solid-svg-icons";

import DeleteIcon from "@mui/icons-material/Delete";

const MessageNode = ({ id, data }) => {
  const { setNodes, getNode, getNodes } = useReactFlow();

  const [showMenu, setShowMenu] = useState(false);
  const [message, setMessage] = useState("");
  const [mediaType, setMediaType] = useState(null);
  const [mediaFile, setMediaFile] = useState(null);

  const fileInputRef = useRef(null);

  const copyNode = useCallback(() => {
    const newId = `${Date.now()}`;
    setNodes((nds) => {
      const nodeToCopy = getNode(id);

      if (!nodeToCopy) return nds;
      const highestZIndex = Math.max(
        ...getNodes().map((node) => node.style?.zIndex || 0)
      );

      const newNode = {
        ...nodeToCopy,
        id: newId,
        position: {
          x: nodeToCopy.position.x + 150,
          y: nodeToCopy.position.y + 150,
        },
        data: {
          ...nodeToCopy.data,
        },
        selected: false,
        style: {
          ...nodeToCopy.style,
          zIndex: highestZIndex + 1, // Set z-index higher than all existing nodes
        },
      };
      return nds
        .map((node) => ({ ...node, selected: false }))
        .concat({ ...newNode, selected: true });
    });
    setShowMenu(false);
  }, [id, setNodes, getNode]);

  const deleteNode = () => {
    setNodes((nds) => nds.filter((node) => node.id !== id));
    setShowMenu(false);
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const handleMediaTypeChange = (type) => {
    setMediaType(type);
    setMediaFile(null);
    setTimeout(() => fileInputRef.current.click(), 0);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMediaFile(file);
    } else {
      setMediaType(null);
    }
  };

  const removeMedia = () => {
    setMediaType(null);
    setMediaFile(null);
  };

  const getMediaIcon = (type) => {
    switch (type) {
      case "image":
        return "🖼️";
      case "video":
        return "🎥";
      case "audio":
        return "🎵";
      case "document":
        return "📄";
      default:
        return "📎";
    }
  };

  const renderMediaPreview = () => {
    if (!mediaFile) return null;

    switch (mediaType) {
      case "image":
        return (
          <img
            src={URL.createObjectURL(mediaFile)}
            alt="Preview"
            className="w-28 h-28"
          />
        );
      case "video":
        return (
          <video controls className="w-48 h-28">
            <source src={URL.createObjectURL(mediaFile)} />
          </video>
        );
      case "audio":
        return (
          <audio controls className="w-full h-16">
            <source src={URL.createObjectURL(mediaFile)} />
          </audio>
        );
      case "document":
        return (
          <div className="flex items-center gap-2">
            <span>{mediaFile.name}</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-72 bg-white rounded-lg shadow-md cursor-grab">
      {showMenu && (
        <div className="absolute right-0 -translate-y-full bg-white border shadow-md rounded p-2">
          <ul className="w-36 text-sm font-medium flex flex-col gap-2 text-[#666666]">
            <li
              onClick={copyNode}
              className="flex items-center gap-2 text-lg hover:bg-gray-50 cursor-pointer text-green-500"
            >
              <FontAwesomeIcon icon={faCopy} />
              <span>Copy</span>
            </li>

            <hr />

            <li
              onClick={deleteNode}
              className="flex items-center gap-2 text-lg hover:bg-gray-50 cursor-pointer text-red-500"
            >
              <FontAwesomeIcon icon={faTrashCan} />
              <span>Delete</span>
            </li>
          </ul>
        </div>
      )}

      <div className="flex justify-between items-center bg-red-500 p-3 rounded-t-lg">
        <div className="text-white text-2xl font-semibold flex items-center gap-1">
          <span>💬</span>
          <span className="text-xl">Send a message</span>
        </div>

        <button
          className="text-white text-2xl font-extrabold"
          onClick={() => setShowMenu(!showMenu)}
        >
          ⋮
        </button>
      </div>

      <div className="p-3 flex flex-col gap-4">
        <textarea
          className="w-full border border-gray-300 rounded-md p-2 h-24 resize-none"
          placeholder="Type your message here..."
          value={message}
          onChange={handleMessageChange}
        />

        {mediaType && (
          <div className="flex items-center justify-between gap-2">
            <span className="text-2xl">{getMediaIcon(mediaType)}</span>

            {renderMediaPreview()}

            <button onClick={removeMedia} className="text-red-500">
              <DeleteIcon />
            </button>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2">
          {["image", "video", "audio", "document"].map((type) => (
            <button
              key={type}
              onClick={() => handleMediaTypeChange(type)}
              className={`text-center border rounded-md py-2 ${
                mediaType === type
                  ? "bg-green-500 text-white"
                  : "text-green-500 border-green-500 hover:bg-green-50"
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        <input
          type="file"
          accept={mediaType ? `${mediaType}/*` : undefined}
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      <Handle type="source" position={Position.Right} className="bg-gray-600" />
      <Handle type="target" position={Position.Left} className="bg-gray-600" />
    </div>
  );
};

export default MessageNode;
