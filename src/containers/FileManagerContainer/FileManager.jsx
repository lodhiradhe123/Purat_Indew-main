import React, { useEffect, useState } from "react";

import Header from "../../components/FileManager/Header";
import MainContent from "../../components/FileManager/MainContent";
import FolderCreationModal from "../../components/FileManager/FolderCreationModal";
import FileUploadModal from "../../components/FileManager/FileUploadModal";
import Footer from "../../components/Footer/Footer";
import DashboardNavbar from "../../components/Navbar/DashboardNavbar.jsx";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import axios, { Axios } from "axios";
import { toast } from "react-toastify";
import { fileHosting } from "../../services/api.js";

const FileManager = () => {
  const [files, setFiles] = useState([]);
  const [filesImage, setFilesImage] = useState([]); //handleFolderClick function output images inside the folder
  const [currentPath, setCurrentPath] = useState([]);
  const [view, setView] = useState("list");
  const [isFolderModalOpen, setFolderModalOpen] = useState(false);
  const [folderToEdit, setFolderToEdit] = useState(null);
  const [isFileUploadModalOpen, setFileUploadModalOpen] = useState(false);
  const [openFolderId, setOpenFolderId] = useState();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    // Implement search logic here
  };

  const handleNewFolder = () => {
    setFolderToEdit(null); // Ensure no folder is being edited
    setFolderModalOpen(true);
  };

  const handleRefresh = () => {
    // Implement refresh logic here
  };

  const handleToggleView = (viewType) => {
    setView(viewType);
  };

  const handleCreateFolder = (folderName, folderId = null) => {
    if (folderId) {
      // Editing an existing folder
      const updatedContents = getCurrentFolderContents().map((file) =>
        file.id === folderId ? { ...file, name: folderName } : file
      );
      updateCurrentFolderContents(updatedContents);
    } else {
      // Creating a new folder
      const newFolder = {
        id: Date.now(),
        name: folderName,
        type: "folder",
        icon: "/assets/images/png/blue-folder-13669.png",
        contents: [],
      };
      updateCurrentFolderContents([...getCurrentFolderContents(), newFolder]);
    }
    setFolderModalOpen(false);
  };

  const handleUploadFile = async (file) => {
    console.log(file);

    const formData = new FormData();
    formData.append("action", "create")
    formData.append("username", "rahul1011")
    formData.append("folder", openFolderId)
    formData.append("media", file.file)
    formData.append("media_type", file.type)
    formData.append("media_name", file.name)
    try {
      const response = await axios.post(
        "https://service2.nuke.co.in/api/file-managers",
        
        formData,
        {
          headers: {
            Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiMDIxMzQ0M2I4NjBiNTRlZWRlMjhjY2VlMGZmZWVkYWRiZWMzNmRjN2E5OThlZWIyZDExYTlkNDZmZWE0NTFlNzVlN2ZlYjZmZDYxNzg1OGEiLCJpYXQiOjE3MzE0ODc5MTAuODU4MjQ0LCJuYmYiOjE3MzE0ODc5MTAuODU4MjUxLCJleHAiOjE3NjMwMjM5MTAuODQ5OTM1LCJzdWIiOiI2OSIsInNjb3BlcyI6W119.g78aoi0_Kr-7MDl0Bu6eNVmUh2MJsOPwCn5NrEwvSuINeUH9rKCjIPDk7GP-du6ivym-WfjCg2RJmCu_YuIPzkRcRZJTvHe9da6zIeE8DZKqFzxZ1HCHe4P68NlWmRkiVfe8Rwvaxz8sgl4QK9VfAnS9cH8qNjth0r87lH7DtR9b1QvY_QpcgllR0HyMDjBaH7KUJzL10oTiOhMpYIJzUj_qqKhNs9P13FUMLsCgu193tU89Ir2ti3QPm4AA-GJX9SP5yAHRdhCw_5SnaX9BxWP2NDLejts_klQDFb1LZ8tWFKfh8wIllUrPeexQGj0ewPeBLyn64PK4DfSnpGXVxQnWypctvbH4ouWVHMt2vY0V6j5QWIjIe_KCR3229CwEfnC3ULRZVClYRHszfs_B5Jl4nmhO-5lgZ9LRbiMERk5pn7i8Y9DOjToirtCJJPef4l11fdGBk_fru1LKCs1i2h16wehQW1GbwZWSo3SKLkq9elmw6lyJLyrAX3mJgVjs4jv9YpAfk0eShKUIqE3i8TlIvLwZIOrradpSBDbqBD9YUzMadPqwfMU_2afYCbMtS24jNqdWZf6A102LOAbL4N8zINQfoNmsQScje2_NzCtybTveuhZDmHe6FVDVBgGtMjsXbAxMKvbItxrlwYdHVKDRkwD0ERWbiWoK3p7qQU0`,
          },
        }
      );
      console.log(response);
    } catch (error) {
      console.log(error.message);
    }

    // const newFile = {
    //   id: Date.now(),
    //   name: file.name,
    //   type: file.type,
    //   icon: "/assets/images/png/file.png",
    // };
    // updateCurrentFolderContents([...getCurrentFolderContents(), newFile]);
    setFileUploadModalOpen(false);
  };

  const handleDeleteFile = (id) => {
    const updatedContents = getCurrentFolderContents().filter(
      (file) => file.id !== id
    );
    updateCurrentFolderContents(updatedContents);
  };

  const handleEditFile = (id) => {
    const fileToEdit = getCurrentFolderContents().find(
      (file) => file.id === id
    );
    if (fileToEdit.type === "folder") {
      setFolderToEdit(fileToEdit);
      setFolderModalOpen(true);
    } else {
      setFileUploadModalOpen(true);
    }
  };

  const handleFolderClick = async (folder) => {
    // console.log(folder);
    setOpenFolderId(folder.id);
    console.log(folder.id);
    if (folder.type !== "folder") return;

    try {
      const response = await axios.post(
        "https://service2.nuke.co.in/api/file-folders",
        {
          action: "readSpecific",
          username: "rahul1011",
          id: folder.id.toString(),
        },
        {
          headers: {
            Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiMDIxMzQ0M2I4NjBiNTRlZWRlMjhjY2VlMGZmZWVkYWRiZWMzNmRjN2E5OThlZWIyZDExYTlkNDZmZWE0NTFlNzVlN2ZlYjZmZDYxNzg1OGEiLCJpYXQiOjE3MzE0ODc5MTAuODU4MjQ0LCJuYmYiOjE3MzE0ODc5MTAuODU4MjUxLCJleHAiOjE3NjMwMjM5MTAuODQ5OTM1LCJzdWIiOiI2OSIsInNjb3BlcyI6W119.g78aoi0_Kr-7MDl0Bu6eNVmUh2MJsOPwCn5NrEwvSuINeUH9rKCjIPDk7GP-du6ivym-WfjCg2RJmCu_YuIPzkRcRZJTvHe9da6zIeE8DZKqFzxZ1HCHe4P68NlWmRkiVfe8Rwvaxz8sgl4QK9VfAnS9cH8qNjth0r87lH7DtR9b1QvY_QpcgllR0HyMDjBaH7KUJzL10oTiOhMpYIJzUj_qqKhNs9P13FUMLsCgu193tU89Ir2ti3QPm4AA-GJX9SP5yAHRdhCw_5SnaX9BxWP2NDLejts_klQDFb1LZ8tWFKfh8wIllUrPeexQGj0ewPeBLyn64PK4DfSnpGXVxQnWypctvbH4ouWVHMt2vY0V6j5QWIjIe_KCR3229CwEfnC3ULRZVClYRHszfs_B5Jl4nmhO-5lgZ9LRbiMERk5pn7i8Y9DOjToirtCJJPef4l11fdGBk_fru1LKCs1i2h16wehQW1GbwZWSo3SKLkq9elmw6lyJLyrAX3mJgVjs4jv9YpAfk0eShKUIqE3i8TlIvLwZIOrradpSBDbqBD9YUzMadPqwfMU_2afYCbMtS24jNqdWZf6A102LOAbL4N8zINQfoNmsQScje2_NzCtybTveuhZDmHe6FVDVBgGtMjsXbAxMKvbItxrlwYdHVKDRkwD0ERWbiWoK3p7qQU0`,
            "Content-Type": "application/json",
          },
        }
      );
      const images = response.data.data.map((image) => {
        return image.images;
      });
      setFilesImage(...images);
      // console.log(filesImage);
      setCurrentPath((prevpath) => [...prevpath, folder.name]);
      // updateCurrentFolderContents([...getCurrentFolderContents(), currentPath]);
    } catch (error) {
      console.log("Found an error");
    }
  };

  // console.log(filesImage[0].images[0].media);
  // console.log(filesImage);

  const handleBreadcrumbClick = (index) => {
    setCurrentPath(currentPath.slice(0, index));
  };

  const getCurrentFolderContents = () => {
    if (!Array.isArray(files)) return [];
    return currentPath.reduce((acc, folderName) => {
      if (!Array.isArray(acc)) return [];
      const folder = acc.find(
        (item) => item.type === "folder" && item.name === folderName
      );
      return folder ? folder.contents : [];
    }, files);
  };

  const updateCurrentFolderContents = (newContents) => {
    const updatedFiles = [...files];
    let folder = updatedFiles;
    currentPath.forEach((folderName) => {
      const foundFolder = folder.find(
        (item) => item.type === "folder" && item.name === folderName
      );
      if (foundFolder) {
        folder = foundFolder.contents;
      }
    });
    // Create a new array to ensure immutability
    folder.length = 0;
    folder.push(...newContents);
    // console.log(updatedFiles);
    setFiles(updatedFiles);
  };

  useEffect(() => {
    const fetchFiles = async () => {
      // const payload = {
      //   action: "read",
      //   username: "rahul1011",
      // };
      // const response = await fileHosting(payload)
      try {
        const response = await axios.post(
          "https://service2.nuke.co.in/api/file-folders",
          {
            action: "read",
            username: "rahul1011",
          },
          {
            headers: {
              Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiMDIxMzQ0M2I4NjBiNTRlZWRlMjhjY2VlMGZmZWVkYWRiZWMzNmRjN2E5OThlZWIyZDExYTlkNDZmZWE0NTFlNzVlN2ZlYjZmZDYxNzg1OGEiLCJpYXQiOjE3MzE0ODc5MTAuODU4MjQ0LCJuYmYiOjE3MzE0ODc5MTAuODU4MjUxLCJleHAiOjE3NjMwMjM5MTAuODQ5OTM1LCJzdWIiOiI2OSIsInNjb3BlcyI6W119.g78aoi0_Kr-7MDl0Bu6eNVmUh2MJsOPwCn5NrEwvSuINeUH9rKCjIPDk7GP-du6ivym-WfjCg2RJmCu_YuIPzkRcRZJTvHe9da6zIeE8DZKqFzxZ1HCHe4P68NlWmRkiVfe8Rwvaxz8sgl4QK9VfAnS9cH8qNjth0r87lH7DtR9b1QvY_QpcgllR0HyMDjBaH7KUJzL10oTiOhMpYIJzUj_qqKhNs9P13FUMLsCgu193tU89Ir2ti3QPm4AA-GJX9SP5yAHRdhCw_5SnaX9BxWP2NDLejts_klQDFb1LZ8tWFKfh8wIllUrPeexQGj0ewPeBLyn64PK4DfSnpGXVxQnWypctvbH4ouWVHMt2vY0V6j5QWIjIe_KCR3229CwEfnC3ULRZVClYRHszfs_B5Jl4nmhO-5lgZ9LRbiMERk5pn7i8Y9DOjToirtCJJPef4l11fdGBk_fru1LKCs1i2h16wehQW1GbwZWSo3SKLkq9elmw6lyJLyrAX3mJgVjs4jv9YpAfk0eShKUIqE3i8TlIvLwZIOrradpSBDbqBD9YUzMadPqwfMU_2afYCbMtS24jNqdWZf6A102LOAbL4N8zINQfoNmsQScje2_NzCtybTveuhZDmHe6FVDVBgGtMjsXbAxMKvbItxrlwYdHVKDRkwD0ERWbiWoK3p7qQU0`,
              "Content-Type": "application/json",
            },
          }
        );
        // console.log(response.data.data);
        const transformedFiles = response.data.data.map((item) => ({
          id: item.id,
          icon: "/assets/images/png/blue-folder-13669.png",
          // name: item.folder || item.media.split("/").pop(), // Use folder name or file name
          type: item.folder === " " ? "Image" : "folder",
          contents: [],
          createdAt: item.created_at,
          name: item.folder_name, // URL for media
        }));

        setFiles(transformedFiles);
        // console.log(files);
        toast.success("Files successfully loaded!");
      } catch (error) {
        console.log("Unable to get data from an api", error);
        toast.error("Failed to load Files");
      }
    };
    fetchFiles();
  }, [currentPath]);

  return (
    <div className="mb-0">
      <DashboardNavbar />
      <div className="flex mt-2">
        <div className="flex-1">
          {/* header */}
          <div className="bg-white p-6 shadow-md mb-5 rounded-xl">
            <button
              onClick={() => navigate("/dashboard")}
              className="bg-white text-indigo-600 py-2 px-4 rounded-full hover:bg-indigo-100 transition duration-300 flex items-center"
              aria-label="Go back"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
              Back
            </button>
            {/* Centered Title */}
            <h1 className="text-2xl md:text-3xl font-bold text-indigo-800 text-center">
              File Hosting
            </h1>
          </div>
          {/* header */}
          <div className="bg-white p-6 shadow-md mb-5 rounded-xl">
            <Header
              onSearch={handleSearch}
              onNewFolder={handleNewFolder}
              onRefresh={handleRefresh}
              onToggleView={handleToggleView}
              onUploadFile={() => setFileUploadModalOpen(true)}
              currentPath={currentPath}
              onBreadcrumbClick={handleBreadcrumbClick}
            />
            <MainContent
              view={view}
              files={getCurrentFolderContents()}
              filesImagefn={filesImage}
              onFolderClick={handleFolderClick}
              onDeleteFile={handleDeleteFile}
              onEditFile={handleEditFile}
            />
          </div>
          <Footer />
        </div>
        {isFolderModalOpen && (
          <FolderCreationModal
            isOpen={isFolderModalOpen}
            onClose={() => setFolderModalOpen(false)}
            onCreate={handleCreateFolder}
            folderToEdit={folderToEdit}
          />
        )}
        {isFileUploadModalOpen && (
          <FileUploadModal
            isOpen={isFileUploadModalOpen}
            onClose={() => setFileUploadModalOpen(false)}
            onUpload={handleUploadFile}
          />
        )}
      </div>
    </div>
  );
};

export default FileManager;
