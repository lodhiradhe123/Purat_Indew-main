import { useState, useRef, useEffect } from "react";

import { Handle, Position, useReactFlow } from "@xyflow/react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";

const NodeSuggestionMenu = ({ position, onSelect, onClose }) => {
  return (
    <div
      className="absolute bg-white border rounded shadow-md p-3  w-40"
      style={{
        left: position.x,
        top: position.y,
        zIndex: 100,
      }}
    >
      <button
        onClick={() => onSelect("sendMessage")}
        className="w-full mb-2 p-1 bg-blue-400 text-white rounded hover:bg-blue-500"
      >
        Message
      </button>
      <button
        onClick={() => onSelect("question")}
        className="w-full mb-2 p-1 bg-yellow-400 text-white rounded hover:bg-yellow-500"
      >
        Question
      </button>
      <button
        onClick={() => onSelect("buttons")}
        className="w-full mb-2 p-1 bg-green-400 text-white rounded hover:bg-green-500"
      >
        Buttons
      </button>
      <button
        onClick={() => onSelect("list")}
        className="w-full p-1 bg-purple-400 text-white rounded hover:bg-purple-500"
      >
        List
      </button>
    </div>
  );
};

const QuestionNode = ({ id, data }) => {
  const { setNodes, getNode, getNodes } = useReactFlow(); // Similar to MessageNode's setup

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [suggestionMenu, setSuggestionMenu] = useState({
    show: false,
    position: { x: 0, y: 0 },
    optionIndex: null,
  });

  const menuRef = useRef(null); // Ref for the menu
  const buttonRef = useRef(null); // Ref for the toggle button
  const reactFlowWrapper = document.querySelector(".react-flow");

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Copy Node logic similar to MessageNode
  const copyNode = () => {
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
          zIndex: highestZIndex + 1,
        },
      };

      return nds.map((node) => ({ ...node, selected: false })).concat(newNode);
    });

    setIsMenuOpen(false);
  };

  // Delete Node logic similar to MessageNode
  const deleteNode = () => {
    setNodes((nds) => nds.filter((node) => node.id !== id)); // Remove the node by filtering it out
    setIsMenuOpen(false); // Hide menu after action
  };

  // Edit Node (already handled correctly)
  const handleEditClick = () => {
    data.openModal(); // Call the existing open modal function for editing
    setIsMenuOpen(false); // Close the menu after action
  };

  const handleOptionClick = (event, optionIndex) => {
    event.stopPropagation();
    const flowWrapper = document.querySelector(".react-flow");
    const flowRect = flowWrapper.getBoundingClientRect();

    setSuggestionMenu({
      show: true,
      position: {
        x: flowRect.x + 80, 
        y: flowRect.y - 80, 
      },
      optionIndex,
    });
  };

  const handleNodeTypeSelect = (type) => {
    // Create new node
    const newNode = {
      id: `${Date.now()}`,
      type,
      position: {
        x: suggestionMenu.position.x + 150,
        y: suggestionMenu.position.y + 150,
      },
      data: {},
    };

    // Create edge from question option to new node
    const newEdge = {
      id: `edge-${id}-${newNode.id}`,
      source: id,
      sourceHandle: `handle-${suggestionMenu.optionIndex}`,
      target: newNode.id,
      type: "custom",
    };

    setNodes((nds) => [...nds, newNode]);
    data.onNewEdge(newEdge);

    setSuggestionMenu({
      show: false,
      position: { x: 0, y: 0 },
      optionIndex: null,
    });
  };

  // Handle outside click to close the menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Ignore clicks inside the React Flow container
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) && // Click outside menu
        buttonRef.current &&
        !buttonRef.current.contains(event.target) && // Click outside button
        !reactFlowWrapper.contains(event.target) // Ensure clicks inside ReactFlow container are ignored
      ) {
        setIsMenuOpen(false); // Close the menu
        setSuggestionMenu({
          show: false,
          position: { x: 0, y: 0 },
          optionIndex: null,
        });
      }
    };

    document.addEventListener("mousedown", handleClickOutside); // Detect clicks
    return () => {
      document.removeEventListener("mousedown", handleClickOutside); // Cleanup
    };
  }, [menuRef, buttonRef, reactFlowWrapper]); // Add buttonRef and menuRef to dependencies

  return (
    <div
      className="w-72 rounded-lg shadow-md border border-gray-300 cursor-grab"
      onDoubleClick={data.openModal}
    >
      <div className="flex justify-between items-center px-3 py-2 bg-orange-500 rounded-t-lg">
        <div className="text-white text-xl font-semibold flex items-center gap-2">
          <span className="text-3xl">?</span>
          Question
        </div>

        <button
          ref={buttonRef}
          onClick={toggleMenu}
          className="text-white text-2xl font-bold"
        >
          ⋮
        </button>

        {isMenuOpen && (
          <div
            ref={menuRef}
            className="absolute right-0 -top-28 bg-white border rounded shadow-md text-sm"
          >
            <ul className="w-36 p-2 flex flex-col gap-2 font-medium text-[#666666]">
              <li
                onClick={handleEditClick}
                className="flex items-center gap-2 hover:bg-gray-50 cursor-pointer"
              >
                <img src="/assets/images/svg/edit.svg" alt="edit" />
                <span>Edit</span>
              </li>

              <hr />

              <li
                onClick={copyNode}
                className="flex items-center gap-2.5 hover:bg-gray-50 cursor-pointer"
              >
                <img src="/assets/images/svg/copy.svg" alt="copy" />
                <span>Copy</span>
              </li>

              <hr />

              <li
                onClick={deleteNode}
                className="flex items-center pl-1 gap-3.5 hover:bg-gray-50 cursor-pointer"
              >
                <FontAwesomeIcon icon={faTrashCan} className="text-[#666666]" />
                <span>Delete</span>
              </li>
            </ul>
          </div>
        )}
      </div>

      <div className="px-3 bg-white text-lg font-medium">
        {data.label && <p className="pt-2">{data.label}</p>}
      </div>

      <div className="p-3 bg-white rounded-b-lg">
        {data.answerOptions && data.answerOptions.length > 0 ? (
          <ul className="space-y-2">
            {data.answerOptions.map((option, index) => (
              <li
                key={index}
                className="flex justify-between items-center bg-slate-50 p-2 rounded-lg cursor-pointer"
                onClick={(e) => handleOptionClick(e, index)}
              >
                <span className="text-center flex-1">{option}</span>
                <Handle
                  type="source"
                  position={Position.Right}
                  id={`handle-${index}`}
                  style={{
                    top: "auto",
                    bottom: "auto",
                    right: 18,
                    width: "12px",
                    height: "12px",
                    backgroundColor: "greenyellow",
                  }}
                  onMouseDown={(e) => handleOptionClick(e, index)}
                />
              </li>
            ))}
          </ul>
        ) : (
          <p>Double tap to add Question and Answer options</p>
        )}
      </div>

      <Handle type="target" position="left" className="bg-gray-600" />

      {suggestionMenu.show && (
        <NodeSuggestionMenu
          position={suggestionMenu.position}
          onSelect={handleNodeTypeSelect}
          onClose={() =>
            setSuggestionMenu({
              show: false,
              position: { x: 0, y: 0 },
              optionIndex: null,
            })
          }
        />
      )}
    </div>
  );
};

export default QuestionNode;
