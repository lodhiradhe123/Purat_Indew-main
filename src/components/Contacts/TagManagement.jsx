import { useState, useEffect } from "react";

import { TextField, IconButton, Button } from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import DeleteIcon from "@mui/icons-material/Delete";

const TagManagement = ({ initialTags, onTagsChange }) => {
  const parseInitialTags = () => {
    if (!initialTags) return [];
    if (Array.isArray(initialTags)) return initialTags;
    try {
      return JSON.parse(initialTags);
    } catch {
      return initialTags.split(",").map((tag) => tag.trim());
    }
  };

  const [tags, setTags] = useState(parseInitialTags());
  const [newTag, setNewTag] = useState("");
  const [editingTagIndex, setEditingTagIndex] = useState(null);
  const [editedTagValue, setEditedTagValue] = useState("");
  const [tagChanges, setTagChanges] = useState([]);
  const [showInput, setShowInput] = useState(false);

  // Add new tag
  const handleAddTag = () => {
    const trimmedTag = newTag.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags((prev) => [...prev, trimmedTag]);
      setTagChanges((prev) => [
        ...prev,
        {
          action: "create",
          tag: trimmedTag,
        },
      ]);
      setNewTag("");
      setShowInput(false);
    }
  };

  // Delete tag
  const handleDeleteTag = (index) => {
    const tagToDelete = tags[index];
    setTags((prev) => prev.filter((_, i) => i !== index));
    setTagChanges((prev) => [
      ...prev,
      {
        action: "delete",
        tag: tagToDelete,
      },
    ]);
  };

  // Open edit mode
  const handleEditTag = (index) => {
    setEditingTagIndex(index);
    setEditedTagValue(tags[index]);
  };

  // Save edited tag
  const handleSaveTag = (index) => {
    const trimmedValue = editedTagValue.trim();
    if (trimmedValue && trimmedValue !== tags[index]) {
      const oldTag = tags[index];
      setTags((prev) =>
        prev.map((tag, i) => (i === index ? trimmedValue : tag))
      );
      setTagChanges((prev) => [
        ...prev,
        {
          action: "update",
          tag: trimmedValue,
          old_tag: oldTag,
        },
      ]);
    }
    setEditingTagIndex(null);
  };

  // Update parent component with tags
  useEffect(() => {
    onTagsChange({ tags, changes: tagChanges });
  }, [tags, tagChanges]);

  return (
    <div className="h-44 overflow-y-scroll border border-gray-300 p-2 scrollbar-hide rounded">
      <h4 className="font-medium flex items-center justify-between">
        Tags
        <IconButton onClick={() => setShowInput((prev) => !prev)}>
          <AddIcon />
        </IconButton>
      </h4>

      {showInput && (
        <div className="flex items-center w-full">
          <TextField
            fullWidth
            variant="outlined"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="Enter new tag"
            onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
            size="small"
            sx={{ mb: 1 }}
          />

          <IconButton onClick={() => setShowInput(false)}>
            <CloseIcon className="text-red-600" />
          </IconButton>

          <IconButton onClick={handleAddTag}>
            <CheckIcon className="text-green-600" />
          </IconButton>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {tags.length > 0 ? (
          tags.map((tag, index) => (
            <div key={index} className="flex items-center w-full">
              {editingTagIndex === index ? (
                <>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={editedTagValue}
                    onChange={(e) => setEditedTagValue(e.target.value)}
                    sx={{ mr: 1 }}
                  />
                  <IconButton onClick={() => handleSaveTag(index)}>
                    <CheckIcon className="text-green-600" />
                  </IconButton>

                  <IconButton onClick={() => setEditingTagIndex(null)}>
                    <CloseIcon className="text-red-600" />
                  </IconButton>
                </>
              ) : (
                <Button
                  variant="outlined"
                  size="small"
                  style={{
                    mr: 1,
                    flex: 1,
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  {tag}
                  <div className="flex">
                    <IconButton
                      size="small"
                      onClick={() => handleEditTag(index)}
                    >
                      <EditIcon className="text-blue-600" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteTag(index)}
                    >
                      <DeleteIcon className="text-red-600" />
                    </IconButton>
                  </div>
                </Button>
              )}
            </div>
          ))
        ) : (
          <p>No tags available</p>
        )}
      </div>
    </div>
  );
};

export default TagManagement;
