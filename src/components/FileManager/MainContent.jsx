import React, { useEffect, useState } from "react";
import { FiTrash, FiEdit } from "react-icons/fi";
import { fileHosting } from "../../services/api";
import axios, { Axios } from "axios";
import Item from "antd/es/list/Item";
import { FcPicture } from "react-icons/fc";
import { FaFilePdf } from "react-icons/fa6";
import { TbArrowsRandom } from "react-icons/tb";

const MainContent = ({
  view,
  files,
  filesImagefn,
  onFolderClick,
  onDeleteFile,
  onEditFile,
  refrshFolder,
  updateCurrentFolderContents,
 
}) => {
  const [fileToDelete, setFileToDelete] = useState(null); // State to track the file selected for deletion
  console.log(files);
  console.log(filesImagefn);

  // Function to open the file viewer
  const openFolderHandler = (id) => {
    console.log(id);
  };

  // Function to confirm deletion of the selected file

  
  const handleDeleteConfirm = async () => {
    const fileApi = "https://service2.nuke.co.in/api/file-managers";
    const folderApi = "https://service2.nuke.co.in/api/file-folders";
    const token = `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiMDIxMzQ0M2I4NjBiNTRlZWRlMjhjY2VlMGZmZWVkYWRiZWMzNmRjN2E5OThlZWIyZDExYTlkNDZmZWE0NTFlNzVlN2ZlYjZmZDYxNzg1OGEiLCJpYXQiOjE3MzE0ODc5MTAuODU4MjQ0LCJuYmYiOjE3MzE0ODc5MTAuODU4MjUxLCJleHAiOjE3NjMwMjM5MTAuODQ5OTM1LCJzdWIiOiI2OSIsInNjb3BlcyI6W119.g78aoi0_Kr-7MDl0Bu6eNVmUh2MJsOPwCn5NrEwvSuINeUH9rKCjIPDk7GP-du6ivym-WfjCg2RJmCu_YuIPzkRcRZJTvHe9da6zIeE8DZKqFzxZ1HCHe4P68NlWmRkiVfe8Rwvaxz8sgl4QK9VfAnS9cH8qNjth0r87lH7DtR9b1QvY_QpcgllR0HyMDjBaH7KUJzL10oTiOhMpYIJzUj_qqKhNs9P13FUMLsCgu193tU89Ir2ti3QPm4AA-GJX9SP5yAHRdhCw_5SnaX9BxWP2NDLejts_klQDFb1LZ8tWFKfh8wIllUrPeexQGj0ewPeBLyn64PK4DfSnpGXVxQnWypctvbH4ouWVHMt2vY0V6j5QWIjIe_KCR3229CwEfnC3ULRZVClYRHszfs_B5Jl4nmhO-5lgZ9LRbiMERk5pn7i8Y9DOjToirtCJJPef4l11fdGBk_fru1LKCs1i2h16wehQW1GbwZWSo3SKLkq9elmw6lyJLyrAX3mJgVjs4jv9YpAfk0eShKUIqE3i8TlIvLwZIOrradpSBDbqBD9YUzMadPqwfMU_2afYCbMtS24jNqdWZf6A102LOAbL4N8zINQfoNmsQScje2_NzCtybTveuhZDmHe6FVDVBgGtMjsXbAxMKvbItxrlwYdHVKDRkwD0ERWbiWoK3p7qQU0`;
    const a =
      fileToDelete.media_type == "image/jpeg" ||
      fileToDelete.media_type == "image/png" ||
      fileToDelete.media_type == "application/pdf" ||
      fileToDelete.media_type == "video/mp4"||fileToDelete.media_type == "undefined"||fileToDelete.media_type == "image"
    console.log(a);
    console.log(fileToDelete.id);
    if (a === true) {
      try {
        const response = await axios.post(
          fileApi,
          {
            action: " delete",
            username: "rahul1011",
            id: fileToDelete.id,
          },
          {
            headers: {
              Authorization: token,
              "Content-Type": "application/json",
            },
          }
        );

      } catch (error) {
        console.log(error);
      }
    }else{
      try {
        const response = await axios.post(
          folderApi,
          {
            action: " delete",
            username: "rahul1011",
            id: fileToDelete.toString(),
          },
          {
            headers: {
              Authorization: token,
              "Content-Type": "application/json",
            },
          }
        );
      } catch (error) {
        console.log(error);
      }
  
    }

    onDeleteFile(fileToDelete); // Call the parent function to delete the file
    setFileToDelete(null); // Reset the fileToDelete state to close the modal
    // location.reload();
  };

  // Function to cancel the deletion operation
  const handleDeleteCancel = () => {
    setFileToDelete(null); // Reset the fileToDelete state to close the modal
  };


  // console.log(files);
  return (
    <div className="p-4">
      {/* Section 1: List View Display */}
      {view === "grid" && (
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left p-2">Name</th>{" "}
              {/* Column header for file/folder names */}
              <th className="text-left p-2">Type</th>{" "}
              {/* Column header for file types */}
              <th className="text-left p-2">Upload Date</th>{" "}
              {/* Column header for upload dates */}
              <th className="text-left p-2">Actions</th>{" "}
              {/* Column header for action buttons */}
            </tr>
          </thead>

          <tbody>
            {/* Handle the case where no files are present */}
            {files.length === 0 ? (
              filesImagefn.length !== 0 ? (
                filesImagefn.map((file) => (
                  <tr>
                    <td
                      className="p-2"
                      className="flex items-center p-2 cursor-pointer gap-2 "
                      onClick={() => window.open(file.media, "_blank")}
                    >
                      <span>
                        {file.media_type == "image" ||
                        file.media_type == "image/jpeg" ||
                        file.media_type == "image/png" ? (
                          <FcPicture className="w-8 h-8" />
                        ) : file.media_type == "application/pdf" ? (
                          <FaFilePdf className="w-8 h-8" />
                        ) : (
                          <TbArrowsRandom className="w-8 h-8" />
                        )}
                      </span>

                      {file.media_name}
                    </td>
                    <td className="p-2">{file.media_type}</td>{" "}
                    {/* File/Folder Type */}
                    <td className="p-2">
                      {new Date().toLocaleDateString()}
                    </td>{" "}
                    {/* Upload Date */}
                    <td className="p-2">
                      {/* Delete button with confirmation modal trigger */}
                      <button
                        className="text-yellow-600 hover:text-red-800 mr-2"
                        onClick={() => setFileToDelete(file)}
                      >
                        <FiTrash />
                      </button>
                      {/* Edit button triggers the parent onEditFile function */}
                      <button
                        className="text-blue-600 hover:text-blue-800"
                        onClick={() => onEditFile(file.id)}
                      >
                        <FiEdit />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="p-2" colSpan="4">
                    <div className="flex flex-col items-center justify-center h-full p-4">
                      <img
                        src="/assets/images/png/filehostingmaincontain.png"
                        alt="No files"
                        className="w-1/2 h-60 mb-4"
                      />
                      <h2 className="text-xl font-semibold text-gray-700">
                        Nothing Here
                      </h2>
                      <p className="text-gray-500">
                        There are no files to show.
                      </p>
                    </div>
                  </td>
                </tr>
              )
            ) : (
              /* Map over the files array and display each file/folder */

              files.map((file) => (
                <tr key={file.id} className="border-b">
                  <td
                    className="flex items-center p-2 cursor-pointer"
                    onClick={
                      file.type === "folder"
                        ? () => onFolderClick(file)
                        : () => window.open(file.media, "_blank")
                    } // If it's a folder, allow navigation
                  >
                    <img
                      src={file.type === "folder" ? file.icon : file.media}
                      alt={file.name}
                      className="w-6 h-6 mr-2"
                      onClick={() => openFolderHandler(file.id)}
                    />{" "}
                    {/* File/Folder Icon */}
                    {file.name} {/* File/Folder Name */}
                  </td>
                  <td className="p-2">{file.type}</td> {/* File/Folder Type */}
                  <td className="p-2">
                    {new Date().toLocaleDateString()}
                  </td>{" "}
                  {/* Upload Date */}
                  <td className="p-2">
                    {/* Delete button with confirmation modal trigger */}
                    <button
                      className="text-red-600 hover:text-red-800 mr-2"
                      onClick={() => setFileToDelete(file.id)}
                    >
                      <FiTrash />
                    </button>
                    {/* Edit button triggers the parent onEditFile function */}
                    <button
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => onEditFile(file.id)}
                    >
                      <FiEdit />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      {/* Section 2: Grid View Display */}
      <div className="flex gap-4 shrink-0 flex-wrap">
        {view === "list" &&
          (files.length == 0 ? (
            filesImagefn.length !== 0 ? (
              filesImagefn.map((file) => (
                <div
                  className="flex w-36 flex-col items-start justify-start p-4 rounded cursor-pointer overflow-hidden "
                  onClick={() => window.open(file.media, "_blank")}
                >
                  {file.media_type == "image" ||
                  file.media_type == "image/jpeg" ||
                  file.media_type == "image/png" ? (
                    <img
                      src={file.media}
                      alt="No files"
                      className="w-32 h-32 mb-2 rounded-md"
                    />
                  ) : file.media_type == "application/pdf" ? (
                    <FaFilePdf className="w-32 h-32" />
                  ) : (
                    <TbArrowsRandom className="w-32 h-32" />
                  )}

                  <p className="text-gray-700 text-sm font-mono">
                    {file.media_name}
                  </p>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center p-4 rounded cursor-pointer">
                <img
                  src="/assets/images/png/filehostingmaincontain.png"
                  alt="No files"
                  className="w-1/2 h-60 mb-4"
                />
                <p className="text-gray-700 text-sm">no files here !</p>
              </div>
            )
          ) : (
            <div className="grid grid-cols-10 gap-4">
              {/* Map over the files array and display each file/folder in a grid format */}
              {files.map((file) => (
                <div
                  key={file.id}
                  className="flex flex-col items-center p-4 rounded cursor-pointer"
                  onClick={
                    file.type === "folder"
                      ? () => onFolderClick(file)
                      : () => window.open(file.media, "_blank")
                  } // If it's a folder, allow navigation
                >
                  <img
                    src={file.type === "folder" ? file.icon : file.media}
                    alt=""
                    className="w-12 h-12 mb-2"
                  />{" "}
                  {/* File/Folder Icon */}
                  {file.name} {/* File/Folder Name */}
                </div>
              ))}
            </div>
          ))}
      </div>

      {/* Section 3: Delete Confirmation Modal */}
      {fileToDelete !== null && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white p-4 rounded shadow-lg">
            <h3 className="text-lg mb-4">Confirmation</h3>
            <p className="mb-4">Are you sure you want to delete this file?</p>
            <div className="flex justify-end">
              {/* Cancel Button */}
              <button
                className="bg-gray-300 text-black px-4 py-2 rounded mr-2"
                onClick={handleDeleteCancel}
              >
                Cancel
              </button>
              {/* Confirm Delete Button */}
              <button
                className="bg-red-600 text-white px-4 py-2 rounded"
                onClick={handleDeleteConfirm}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainContent;
