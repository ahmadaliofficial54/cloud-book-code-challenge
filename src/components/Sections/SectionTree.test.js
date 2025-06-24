import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import sectionReducer from '../../store/sections/sectionSlice';
import SectionTree from './SectionTree';
import * as permissions from '../../utils/permissions';
import userEvent from '@testing-library/user-event';

const renderWithStore = (ui, { preloadedState, userRole = 'author' } = {}) => {
  const store = configureStore({
    reducer: { sections: sectionReducer },
    preloadedState: { sections: { sections: preloadedState || [] } },
  });
  return render(
    <Provider store={store}>
      <SectionTree onSelect={() => {}} selectedId={null} userRole={userRole} />
    </Provider>
  );
};

describe('SectionTree', () => {
  it('shows empty state for author', () => {
    renderWithStore(null, { preloadedState: [], userRole: 'author' });
    expect(screen.getByText(/no sections yet/i)).toBeInTheDocument();
  });

  it('shows empty state for collaborator', () => {
    renderWithStore(null, { preloadedState: [], userRole: 'collaborator' });
    expect(screen.getByText(/no sections available/i)).toBeInTheDocument();
  });

  it('renders a nested section tree', () => {
    const sections = [
      {
        id: '1',
        title: 'Root',
        children: [
          {
            id: '2',
            title: 'Child',
            children: [
              { id: '3', title: 'Grandchild', children: [] },
            ],
          },
        ],
      },
    ];
    renderWithStore(null, { preloadedState: sections, userRole: 'author' });
    expect(screen.getByText('Root')).toBeInTheDocument();
    expect(screen.getByText('Child')).toBeInTheDocument();
    expect(screen.getByText('Grandchild')).toBeInTheDocument();
  });

  it('shows add/edit/delete buttons for author', () => {
    const sections = [
      { id: '1', title: 'Root', children: [] },
    ];
    renderWithStore(null, { preloadedState: sections, userRole: 'author' });
    // Hover simulation is tricky, but buttons should be in the DOM
    expect(screen.getAllByTitle('Add Subsection')[0]).toBeInTheDocument();
    expect(screen.getAllByTitle('Edit Title')[0]).toBeInTheDocument();
    expect(screen.getAllByTitle('Delete')[0]).toBeInTheDocument();
  });

  it('shows only edit button for collaborator', () => {
    const sections = [
      { id: '1', title: 'Root', children: [] },
    ];
    renderWithStore(null, { preloadedState: sections, userRole: 'collaborator' });
    expect(screen.queryByTitle('Add Subsection')).not.toBeInTheDocument();
    expect(screen.getAllByTitle('Edit Title')[0]).toBeInTheDocument();
    expect(screen.queryByTitle('Delete')).not.toBeInTheDocument();
  });
});

describe('SectionTree user actions', () => {
  it('allows author to add a subsection', async () => {
    const user = userEvent.setup();
    const sections = [
      { id: '1', title: 'Root', children: [] },
    ];
    renderWithStore(null, { preloadedState: sections, userRole: 'author' });
    // Click add subsection button
    await user.click(screen.getByTitle('Add Subsection'));
    // Enter subsection title
    const input = screen.getByPlaceholderText('Subsection title');
    await user.type(input, 'Sub 1');
    // Click Add
    await user.click(screen.getByText('Add'));
    // Subsection should appear
    expect(await screen.findByText('Sub 1')).toBeInTheDocument();
  });

  it('allows author to edit a section title', async () => {
    const user = userEvent.setup();
    const sections = [
      { id: '1', title: 'Root', children: [] },
    ];
    renderWithStore(null, { preloadedState: sections, userRole: 'author' });
    // Click edit title button
    await user.click(screen.getByTitle('Edit Title'));
    // Change title
    const input = screen.getByPlaceholderText('Section title');
    await user.clear(input);
    await user.type(input, 'Root Edited');
    // Click Save
    await user.click(screen.getByText('Save'));
    // Updated title should appear
    expect(await screen.findByText('Root Edited')).toBeInTheDocument();
  });

  it('allows author to delete a section', async () => {
    const user = userEvent.setup();
    const sections = [
      { id: '1', title: 'Root', children: [] },
    ];
    renderWithStore(null, { preloadedState: sections, userRole: 'author' });
    // Click delete button
    await user.click(screen.getByTitle('Delete'));
    // Confirm delete
    await user.click(screen.getByText('Delete'));
    // Section should be removed
    expect(screen.queryByText('Root')).not.toBeInTheDocument();
  });
});

describe('SectionTree collaborator actions', () => {
  it('allows collaborator to edit a section title', async () => {
    const user = userEvent.setup();
    const sections = [
      { id: '1', title: 'Root', children: [] },
    ];
    renderWithStore(null, { preloadedState: sections, userRole: 'collaborator' });
    // Click edit title button
    await user.click(screen.getByTitle('Edit Title'));
    // Change title
    const input = screen.getByPlaceholderText('Section title');
    await user.clear(input);
    await user.type(input, 'Root Edited by Collaborator');
    // Click Save
    await user.click(screen.getByText('Save'));
    // Updated title should appear
    expect(await screen.findByText('Root Edited by Collaborator')).toBeInTheDocument();
  });
}); 