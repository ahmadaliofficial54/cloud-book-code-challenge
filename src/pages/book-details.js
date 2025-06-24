import React, { useState } from "react";
import Header from "../components/Header";
import SectionTree from "../components/Sections/SectionTree";
import { Button, Card, Modal, Input, Tag, message, List } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { resetSections, fetchSectionsAsync, createSectionAsync, updateSectionAsync } from "../store/sections/sectionSlice";
import { 
  canCreateSections, 
  canEditSections, 
  getUserRole, 
  isAuthor, 
  isCollaborator 
} from "../utils/permissions";
import { updateBookCollaboratorsAsync, fetchAllBookAsync } from "../store/books/bookSlice";

export default function BookDetails() {
  // Get book ID from route params
  const { id: bookId } = useParams();
  const books = useSelector((state) => state.book.books);
  const book = books.find((b) => b.id === bookId);

  const userState = useSelector((state) => state.user);
  const userRole = getUserRole(userState);
  const [selectedSection, setSelectedSection] = useState(null);
  const [isCreateSectionOpen, setIsCreateSectionOpen] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const sections = useSelector((state) => state.sections.sections);
  const [editContent, setEditContent] = useState("");
  const [isCollaboratorsModalOpen, setIsCollaboratorsModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");

  // Use the real collaborators array from Redux
  const collaborators = book?.collaborators || [];

  // Find the selected section object
  const selectedSectionObj = selectedSection
    ? findSectionById(sections, selectedSection.id)
    : null;

  // Sync editContent with selected section
  React.useEffect(() => {
    setEditContent(selectedSectionObj ? selectedSectionObj.content : "");
  }, [selectedSectionObj]);

  // Reset sections when bookId changes
  React.useEffect(() => {
    dispatch(resetSections());
    setSelectedSection(null);
  }, [bookId, dispatch]);

  React.useEffect(() => {
    if (!books || books.length === 0) {
      dispatch(fetchAllBookAsync());
    }
  }, [dispatch, books]);

  React.useEffect(() => {
    if (bookId) {
      dispatch(fetchSectionsAsync(bookId));
    }
  }, [dispatch, bookId]);

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

  const handleCreateSection = () => {
    if (!canCreateSections(userRole)) {
      message.error("Only authors can create new sections");
      return;
    }
    if (newSectionTitle.trim()) {
      dispatch(createSectionAsync({ bookId, section: { title: newSectionTitle.trim(), content: "", children: [] } }));
      setNewSectionTitle("");
      setIsCreateSectionOpen(false);
      message.success("Section created successfully!");
    }
  };

  const handleSaveContent = () => {
    if (!canEditSections(userRole)) {
      message.error("You don't have permission to edit sections");
      return;
    }
    if (selectedSectionObj && selectedSectionObj.id) {
      dispatch(updateSectionAsync({ sectionId: selectedSectionObj.id, section: { ...selectedSectionObj, content: editContent } }));
      message.success("Content saved successfully!");
    }
  };

  const handleCreateSectionClick = () => {
    if (!canCreateSections(userRole)) {
      message.error("Only authors can create new sections");
      return;
    }
    setIsCreateSectionOpen(true);
  };

  // Collaborator management
  const handleInvite = () => {
    const email = inviteEmail.trim().toLowerCase();
    if (!email) {
      message.error("Please enter an email address.");
      return;
    }
    if (collaborators.includes(email)) {
      message.warning("This user is already a collaborator.");
      return;
    }
    const updated = [...collaborators, email];
    dispatch(updateBookCollaboratorsAsync({ bookId, collaborators: updated }));
    setInviteEmail("");
    message.success("Collaborator added.");
  };

  const handleRemove = (email) => {
    const updated = collaborators.filter(c => c !== email);
    dispatch(updateBookCollaboratorsAsync({ bookId, collaborators: updated }));
    message.success("Collaborator removed.");
  };

  // Get role display info
  const getRoleDisplay = () => {
    if (isAuthor(userRole)) {
      return { text: "Author", color: "blue" };
    } else if (isCollaborator(userRole)) {
      return { text: "Collaborator", color: "green" };
    }
    return { text: "Unknown", color: "default" };
  };

  const roleDisplay = getRoleDisplay();

  if (!book) {
    return <div className="p-8 text-center text-red-500">Book not found.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Row */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <Button type="default" onClick={() => navigate(-1)}>
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{book.title}</h1>
              <div className="flex items-center gap-2 mt-1">
                <Tag color={roleDisplay.color} className="text-xs font-medium">
                  {roleDisplay.text}
                </Tag>
                <span className="text-sm text-gray-600">
                  {isAuthor(userRole) 
                    ? "You can create, edit, and delete sections" 
                    : "You can only edit section content"
                  }
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            {canCreateSections(userRole) && (
              <Button type="primary" onClick={handleCreateSectionClick}>
                + New Section
              </Button>
            )}
            {/* Only authors can manage collaborators */}
            {isAuthor(userRole) && (
              <Button onClick={() => setIsCollaboratorsModalOpen(true)}>
                Manage Collaborators
              </Button>
            )}
          </div>
        </div>
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
          {/* Section Tree Sidebar */}
          <div className="lg:col-span-2">
            <Card className="rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold mb-0">Sections</h2>
                {/* New Section button for mobile/small screens */}
                {canCreateSections(userRole) && (
                  <Button
                    type="link"
                    className="lg:hidden p-0"
                    onClick={handleCreateSectionClick}
                  >
                    + New
                  </Button>
                )}
              </div>
              <SectionTree 
                onSelect={setSelectedSection} 
                selectedId={selectedSection?.id}
                userRole={userRole}
              />
            </Card>
          </div>
          {/* Content Editor/Main Area */}
          <div className="lg:col-span-4">
            <Card className="rounded-lg shadow-sm min-h-[400px]">
              {selectedSectionObj ? (
                <>
                  <h2 className="text-xl font-bold mb-2 capitalize">{selectedSectionObj.title}</h2>
                  <Input.TextArea
                    value={editContent}
                    onChange={e => setEditContent(e.target.value)}
                    placeholder="Start writing your content here..."
                    className="min-h-[200px] mb-4"
                    autoSize={{ minRows: 8 }}
                    disabled={!canEditSections(userRole)}
                  />
                  {canEditSections(userRole) ? (
                    <Button type="primary" onClick={handleSaveContent}>
                      Save Content
                    </Button>
                  ) : (
                    <div className="text-sm text-gray-500 italic">
                      You don't have permission to edit this content
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-96">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Select a section
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Choose a section from the sidebar to start editing
                  </p>
                </div>
              )}
            </Card>
          </div>
        </div>
        {/* Create Section Modal */}
        <Modal
          title="Create New Section"
          open={isCreateSectionOpen}
          onCancel={() => { setIsCreateSectionOpen(false); setNewSectionTitle(""); }}
          footer={null}
        >
          <label className="block mb-2 font-medium">Section Title</label>
          <Input
            value={newSectionTitle}
            onChange={e => setNewSectionTitle(e.target.value)}
            placeholder="Enter section title"
            onPressEnter={handleCreateSection}
            autoFocus
          />
          <div className="flex justify-end gap-2 mt-4">
            <Button onClick={() => { setIsCreateSectionOpen(false); setNewSectionTitle(""); }}>
              Cancel
            </Button>
            <Button type="primary" onClick={handleCreateSection} disabled={!newSectionTitle.trim()}>
              Create Section
            </Button>
          </div>
        </Modal>
        {/* Collaborators Modal */}
        <Modal
          title="Manage Collaborators"
          open={isCollaboratorsModalOpen}
          onCancel={() => setIsCollaboratorsModalOpen(false)}
          footer={null}
        >
          <div className="mb-4">
            <strong>Current Collaborators:</strong>
            <List
              dataSource={collaborators}
              locale={{ emptyText: "No collaborators yet." }}
              renderItem={item => (
                <List.Item
                  actions={[
                    <Button danger size="small" onClick={() => handleRemove(item)} key="remove">Remove</Button>
                  ]}
                >
                  {item}
                </List.Item>
              )}
              style={{ marginTop: 8, marginBottom: 16 }}
            />
          </div>
          <div className="mb-2">
            <strong>Invite Collaborator by Email:</strong>
            <Input.Group compact>
              <Input
                style={{ width: '70%' }}
                placeholder="Enter collaborator's email"
                value={inviteEmail}
                onChange={e => setInviteEmail(e.target.value)}
                onPressEnter={handleInvite}
              />
              <Button type="primary" onClick={handleInvite}>
                Invite
              </Button>
            </Input.Group>
          </div>
        </Modal>
      </main>
    </div>
  );
} 