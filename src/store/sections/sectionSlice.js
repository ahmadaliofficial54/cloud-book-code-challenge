import { createSlice, nanoid } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import * as sectionService from "../../service/sectionService";

// Helper: Recursively add a subsection to the correct parent
function addSubsectionRecursive(sections, parentId, newSection) {
  return sections.map((section) => {
    if (section.id === parentId) {
      return {
        ...section,
        children: [...section.children, newSection],
      };
    }
    if (section.children.length > 0) {
      return {
        ...section,
        children: addSubsectionRecursive(section.children, parentId, newSection),
      };
    }
    return section;
  });
}

// Helper: Recursively edit a section title
function editSectionRecursive(sections, sectionId, newTitle) {
  return sections.map((section) => {
    if (section.id === sectionId) {
      return { ...section, title: newTitle };
    }
    if (section.children.length > 0) {
      return {
        ...section,
        children: editSectionRecursive(section.children, sectionId, newTitle),
      };
    }
    return section;
  });
}

// Helper: Recursively edit a section content
function editSectionContentRecursive(sections, sectionId, newContent) {
  return sections.map((section) => {
    if (section.id === sectionId) {
      return { ...section, content: newContent };
    }
    if (section.children.length > 0) {
      return {
        ...section,
        children: editSectionContentRecursive(section.children, sectionId, newContent),
      };
    }
    return section;
  });
}

// Helper: Recursively delete a section/subsection
function deleteSectionRecursive(sections, sectionId) {
  return sections
    .filter((section) => section.id !== sectionId)
    .map((section) => ({
      ...section,
      children: deleteSectionRecursive(section.children, sectionId),
    }));
}

// Load from localStorage if available
function loadInitialSections() {
  try {
    const data = localStorage.getItem('sections');
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {}
  return [];
}

const initialState = {
  sections: loadInitialSections(), // array of root sections
};

export const fetchSectionsAsync = createAsyncThunk(
  "sections/fetchSections",
  async (bookId) => {
    const response = await sectionService.fetchSections(bookId);
    return response.data;
  }
);

export const createSectionAsync = createAsyncThunk(
  "sections/createSection",
  async ({ bookId, section }) => {
    const response = await sectionService.createSection(bookId, section);
    return response.data;
  }
);

export const updateSectionAsync = createAsyncThunk(
  "sections/updateSection",
  async ({ sectionId, section }) => {
    const response = await sectionService.updateSection(sectionId, section);
    return response.data;
  }
);

export const deleteSectionAsync = createAsyncThunk(
  "sections/deleteSection",
  async (sectionId) => {
    await sectionService.deleteSection(sectionId);
    return sectionId;
  }
);

const sectionSlice = createSlice({
  name: "sections",
  initialState,
  reducers: {
    addRootSection: {
      reducer(state, action) {
        state.sections.push(action.payload);
      },
      prepare(title) {
        return {
          payload: {
            id: nanoid(),
            title,
            content: "",
            children: [],
          },
        };
      },
    },
    addSubsection: {
      reducer(state, action) {
        const { parentId, title } = action.payload;
        const newSection = {
          id: nanoid(),
          title,
          content: "",
          children: [],
        };
        state.sections = addSubsectionRecursive(state.sections, parentId, newSection);
      },
      prepare(parentId, title) {
        return { payload: { parentId, title } };
      },
    },
    editSectionTitle: (state, action) => {
      const { sectionId, newTitle } = action.payload;
      state.sections = editSectionRecursive(state.sections, sectionId, newTitle);
    },
    editSectionContent: (state, action) => {
      const { sectionId, newContent } = action.payload;
      state.sections = editSectionContentRecursive(state.sections, sectionId, newContent);
    },
    deleteSection: (state, action) => {
      const sectionId = action.payload;
      state.sections = deleteSectionRecursive(state.sections, sectionId);
    },
    // Optionally, add a reset action
    resetSections: (state) => {
      state.sections = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSectionsAsync.fulfilled, (state, action) => {
        state.sections = action.payload;
      })
      .addCase(createSectionAsync.fulfilled, (state, action) => {
        state.sections.push(action.payload);
      })
      .addCase(updateSectionAsync.fulfilled, (state, action) => {
        // Find and update the section in state.sections
        const updateSection = (sections) =>
          (sections || []).map((section) =>
            section.id === action.payload.id
              ? { ...section, ...action.payload, children: section.children || [] }
              : { ...section, children: updateSection(section.children) }
          );
        state.sections = updateSection(state.sections);
      })
      .addCase(deleteSectionAsync.fulfilled, (state, action) => {
        // Remove the section from state.sections
        const deleteSection = (sections, sectionId) =>
          sections
            .filter((section) => section.id !== sectionId)
            .map((section) => ({
              ...section,
              children: deleteSection(section.children, sectionId),
            }));
        state.sections = deleteSection(state.sections, action.payload);
      });
  },
});

export const {
  addRootSection,
  addSubsection,
  editSectionTitle,
  editSectionContent,
  deleteSection,
  resetSections,
} = sectionSlice.actions;

export default sectionSlice.reducer; 