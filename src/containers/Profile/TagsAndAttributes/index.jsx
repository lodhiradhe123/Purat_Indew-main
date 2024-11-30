// src/containers/Profile/TagsAndAttributes/index.js
// src/containers/Profile/TagsAndAttributes/index.js
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt, faPlus } from '@fortawesome/free-solid-svg-icons';

const TagsAndAttributes = () => {
  const [contactAttributes, setContactAttributes] = useState([{ id: Date.now(), name: '' }]);
  const [tags, setTags] = useState([{ id: Date.now(), name: '' }]);

  const handleChange = (type, id, value) => {
    if (type === 'attribute') {
      setContactAttributes(contactAttributes.map(attr => attr.id === id ? { ...attr, name: value } : attr));
    } else {
      setTags(tags.map(tag => tag.id === id ? { ...tag, name: value } : tag));
    }
  };

  const handleAddField = (type) => {
    if (type === 'attribute') {
      setContactAttributes([...contactAttributes, { id: Date.now(), name: '' }]);
    } else {
      setTags([...tags, { id: Date.now(), name: '' }]);
    }
  };

  const handleDelete = (type, id) => {
    if (type === 'attribute') {
      setContactAttributes(contactAttributes.filter(attr => attr.id !== id));
    } else {
      setTags(tags.filter(tag => tag.id !== id));
    }
  };

  return (
    <div className="p-6 bg-blue rounded shadow-md">
      <div className="flex justify-between mb-4">
        <div className="w-1/2 mr-2">
          <h2 className="text-xl font-semibold mb-2">Contact Attributes</h2>
          <button
            onClick={() => handleAddField('attribute')}
            className="p-2 mb-2 bg-blue-400 w-36 text-white rounded flex items-center"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Add Attribute
          </button>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border p-2 text-left">Attribute name</th>
                <th className="border p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {contactAttributes.map((attr) => (
                <tr key={attr.id}>
                  <td className="border p-2">
                    <input
                      type="text"
                      value={attr.name}
                      onChange={(e) => handleChange('attribute', attr.id, e.target.value)}
                      className="p-2 w-full border rounded"
                    />
                  </td>
                  <td className="border p-2">
                    <FontAwesomeIcon
                      icon={faEdit}
                      className="mr-2 cursor-pointer"
                      onClick={() => handleAddField('attribute')}
                    />
                    <FontAwesomeIcon
                      icon={faTrashAlt}
                      className="cursor-pointer"
                      onClick={() => handleDelete('attribute', attr.id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="w-1/2 ml-2">
          <h2 className="text-xl font-semibold mb-2">Tags</h2>
          <button
            onClick={() => handleAddField('tag')}
            className="p-2 mb-2 bg-blue-400 w-32 text-white rounded flex items-center"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Add Tag
          </button>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border p-2 text-left">Tag name</th>
                <th className="border p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tags.map((tag) => (
                <tr key={tag.id}>
                  <td className="border p-2">
                    <input
                      type="text"
                      value={tag.name}
                      onChange={(e) => handleChange('tag', tag.id, e.target.value)}
                      className="p-2 w-full border rounded"
                    />
                  </td>
                  <td className="border p-2">
                    <FontAwesomeIcon
                      icon={faEdit}
                      className="mr-2 cursor-pointer"
                      onClick={() => handleAddField('tag')}
                    />
                    <FontAwesomeIcon
                      icon={faTrashAlt}
                      className="cursor-pointer"
                      onClick={() => handleDelete('tag', tag.id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TagsAndAttributes;
