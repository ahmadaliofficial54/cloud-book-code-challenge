import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateSectionAsync, deleteSectionAsync, createSectionAsync } from "../../store/sections/sectionSlice";
import { Input, Button, Modal, message } from "antd";
import { ArrowDownOutlined, ArrowRightOutlined, DeleteOutlined } from '@ant-design/icons';
import { 
  canCreateSections, 
  canEditSections, 
  canDeleteSections 
} from "../../utils/permissions";
import { buildSectionTree } from '../../utils/common-util';

function findSectionById(sections, id) {
  for (const section of sections) {
    if (section.id === id) return section;
    if (section.children && section.children.length > 0) {
      const found = findSectionById(section.children, id);
      if (found) return found;
    }
  }
  return null;
}

function SectionNode({ section, onSelect, selectedId, level = 0, userRole }) {
  const dispatch = useDispatch();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [subTitle, setSubTitle] = useState("");
  const [editTitle, setEditTitle] = useState(section.title);
  const [collapsed, setCollapsed] = useState(false);
  const [hovered, setHovered] = useState(false);

  const handleAddSub = () => {
    if (!canCreateSections(userRole)) {
      message.error("Only authors can create new sections");
      return;
    }
    
    if (subTitle.trim()) {
      dispatch(createSectionAsync({ bookId: section.bookId, section: { title: subTitle.trim(), content: "", parentId: section.id } }));
      setSubTitle("");
      setShowAddModal(false);
      message.success("Subsection created successfully!");
    }
  };

  const handleEdit = () => {
    if (!canEditSections(userRole)) {
      message.error("You don't have permission to edit sections");
      return;
    }
    if (editTitle.trim() && editTitle !== section.title) {
      dispatch(updateSectionAsync({ sectionId: section.id, section: { ...section, title: editTitle.trim() } }));
      message.success("Section title updated successfully!");
    }
    setShowEditModal(false);
  };

  const handleDelete = () => {
    if (!canDeleteSections(userRole)) {
      message.error("Only authors can delete sections");
      return;
    }
    
    dispatch(deleteSectionAsync(section.id));
    setShowDeleteModal(false);
    message.success("Section deleted successfully!");
  };

  const handleAddClick = () => {
    if (!canCreateSections(userRole)) {
      message.error("Only authors can create new sections");
      return;
    }
    setShowAddModal(true);
  };

  const handleEditClick = () => {
    if (!canEditSections(userRole)) {
      message.error("You don't have permission to edit sections");
      return;
    }
    setShowEditModal(true);
  };

  const handleDeleteClick = () => {
    if (!canDeleteSections(userRole)) {
      message.error("Only authors can delete sections");
      return;
    }
    setShowDeleteModal(true);
  };

  const hasChildren = section.children && section.children.length > 0;

  return (
    <li
    className={`group relative py-1 rounded transition-colors pl-${level * 4} 
      ${selectedId === section.id ? "bg-blue-50 border-l-4 border-blue-600 font-semibold text-blue-700" : "hover:bg-gray-100"}
      capitalize
    `}
    onMouseEnter={() => setHovered(true)}
    onMouseLeave={() => setHovered(false)}
  >
  
      <div className="flex items-center gap-2">
        {/* Chevron icon for expandable sections */}
        {hasChildren ? (
          <Button
            type="text"
            size="small"
            className="p-0"
            onClick={() => setCollapsed((c) => !c)}
            aria-label={collapsed ? "Expand" : "Collapse"}
            style={{ width: 20 }}
            title={collapsed ? "Expand" : "Collapse"}
          >
            {collapsed ? <ArrowRightOutlined /> : <ArrowDownOutlined />}
          </Button>
        ) : (
          <span style={{ width:10 }}></span>
        )}
        <span
          className={`cursor-pointer transition-colors  ${selectedId === section.id ? "font-bold text-blue-700" : "group-hover:text-blue-700"}`}
          onClick={() => onSelect(section)}
          title="Select section"
        >
          {section.title}
        </span>
        {/* Action buttons only visible on hover or selected */}
        <span className={`flex gap-0.5 ml-1 ${hovered || selectedId === section.id ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
          {canCreateSections(userRole) && (
            <Button
              size="small"
              type="link"
              onClick={handleAddClick}
              title="Add Subsection"
            >
              ＋
            </Button>
          )}
          {canEditSections(userRole) && (
            <Button
              size="small"
              type="link"
              onClick={handleEditClick}
              title="Edit Title"
            >
              ✎
            </Button>
          )}
          {canDeleteSections(userRole) && (
            <Button
              size="small"
              type="link"
              danger
              onClick={handleDeleteClick}
              title="Delete"
            >
              <DeleteOutlined />
            </Button>
          )}
        </span>
      </div>
      {/* Add Subsection Modal */}
      <Modal
        title="Add Subsection"
        open={showAddModal}
        onCancel={() => setShowAddModal(false)}
        footer={null}
      >
        <Input
          value={subTitle}
          onChange={e => setSubTitle(e.target.value)}
          placeholder="Subsection title"
          autoFocus
          onPressEnter={handleAddSub}
        />
        <div className="flex justify-end gap-2 mt-4">
          <Button onClick={() => setShowAddModal(false)}>
            Cancel
          </Button>
          <Button type="primary" onClick={handleAddSub} disabled={!subTitle.trim()}>
            Add
          </Button>
        </div>
      </Modal>
      {/* Edit Title Modal */}
      <Modal
        title="Edit Section Title"
        open={showEditModal}
        onCancel={() => setShowEditModal(false)}
        footer={null}
      >
        <Input
          value={editTitle}
          onChange={e => setEditTitle(e.target.value)}
          placeholder="Section title"
          autoFocus
          onPressEnter={handleEdit}
        />
        <div className="flex justify-end gap-2 mt-4">
          <Button onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button type="primary" onClick={handleEdit} disabled={!editTitle.trim() || editTitle === section.title}>
            Save
          </Button>
        </div>
      </Modal>
      {/* Delete Confirmation Modal */}
      <Modal
        title="Delete Section"
        open={showDeleteModal}
        onCancel={() => setShowDeleteModal(false)}
        footer={null}
      >
        <div className="mb-4">Are you sure you want to delete this section and all its subsections?</div>
        <div className="flex justify-end gap-2">
          <Button onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button type="primary" danger onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </Modal>
      {hasChildren && !collapsed && (
        <ul style={{ marginLeft: 20 }}>
          {section.children.map((child) => (
            <SectionNode 
              key={child.id} 
              section={child} 
              onSelect={onSelect} 
              selectedId={selectedId} 
              level={level + 1}
              userRole={userRole}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

function renderTree(sections, onSelect, selectedId, level = 0, userRole) {
  return (
    <ul style={{ marginLeft: 0 }}>
      {sections.map((section) => (
        <SectionNode 
          key={section.id} 
          section={section} 
          onSelect={onSelect} 
          selectedId={selectedId} 
          level={level}
          userRole={userRole}
        />
      ))}
    </ul>
  );
}

const SectionTree = ({ onSelect, selectedId, userRole }) => {
  const flatSections = useSelector((state) => state.sections.sections);
  const sections = buildSectionTree(flatSections);
  return (
    <>
      {sections.length === 0 ? (
        <div className="text-gray-400 italic mt-8">
          {canCreateSections(userRole) 
            ? "No sections yet. Start by adding a root section." 
            : "No sections available."
          }
        </div>
      ) : (
        <div>{renderTree(sections, onSelect, selectedId, 0, userRole)}</div>
      )}
    </>
  );
};

export default SectionTree; 