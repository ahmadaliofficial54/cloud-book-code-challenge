// Role-based permissions utility
export const ROLES = {
  AUTHOR: 'author',
  COLLABORATOR: 'collaborator'
};

export const PERMISSIONS = {
  CREATE_SECTIONS: 'create_sections',
  EDIT_SECTIONS: 'edit_sections',
  DELETE_SECTIONS: 'delete_sections',
  MANAGE_COLLABORATORS: 'manage_collaborators',
  VIEW_BOOK: 'view_book'
};

// Permission matrix - defines what each role can do
const ROLE_PERMISSIONS = {
  [ROLES.AUTHOR]: [
    PERMISSIONS.CREATE_SECTIONS,
    PERMISSIONS.EDIT_SECTIONS,
    PERMISSIONS.DELETE_SECTIONS,
    PERMISSIONS.MANAGE_COLLABORATORS,
    PERMISSIONS.VIEW_BOOK
  ],
  [ROLES.COLLABORATOR]: [
    PERMISSIONS.EDIT_SECTIONS,
    PERMISSIONS.VIEW_BOOK
  ]
};

/**
 * Check if a user has a specific permission
 * @param {string} userRole - The user's role
 * @param {string} permission - The permission to check
 * @returns {boolean} - Whether the user has the permission
 */
export const hasPermission = (userRole, permission) => {
  if (!userRole || !permission) return false;
  return ROLE_PERMISSIONS[userRole]?.includes(permission) || false;
};

/**
 * Check if user can create sections (only authors)
 * @param {string} userRole - The user's role
 * @returns {boolean} - Whether the user can create sections
 */
export const canCreateSections = (userRole) => {
  return hasPermission(userRole, PERMISSIONS.CREATE_SECTIONS);
};

/**
 * Check if user can edit sections (authors and collaborators)
 * @param {string} userRole - The user's role
 * @returns {boolean} - Whether the user can edit sections
 */
export const canEditSections = (userRole) => {
  return hasPermission(userRole, PERMISSIONS.EDIT_SECTIONS);
};

/**
 * Check if user can delete sections (only authors)
 * @param {string} userRole - The user's role
 * @returns {boolean} - Whether the user can delete sections
 */
export const canDeleteSections = (userRole) => {
  return hasPermission(userRole, PERMISSIONS.DELETE_SECTIONS);
};

/**
 * Check if user can manage collaborators (only authors)
 * @param {string} userRole - The user's role
 * @returns {boolean} - Whether the user can manage collaborators
 */
export const canManageCollaborators = (userRole) => {
  return hasPermission(userRole, PERMISSIONS.MANAGE_COLLABORATORS);
};

/**
 * Get user role from Redux state or localStorage
 * @param {Object} userState - Redux user state
 * @returns {string|null} - User role or null
 */
export const getUserRole = (userState) => {
  return userState?.role || localStorage.getItem('role') || null;
};

/**
 * Check if user is an author
 * @param {string} userRole - The user's role
 * @returns {boolean} - Whether the user is an author
 */
export const isAuthor = (userRole) => {
  return userRole === ROLES.AUTHOR;
};

/**
 * Check if user is a collaborator
 * @param {string} userRole - The user's role
 * @returns {boolean} - Whether the user is a collaborator
 */
export const isCollaborator = (userRole) => {
  return userRole === ROLES.COLLABORATOR;
}; 