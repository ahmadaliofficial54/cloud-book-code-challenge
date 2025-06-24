import { 
  ROLES, 
  PERMISSIONS, 
  hasPermission, 
  canCreateSections, 
  canEditSections, 
  canDeleteSections, 
  canManageCollaborators,
  isAuthor,
  isCollaborator
} from './permissions';

describe('Permissions Utility', () => {
  describe('Role Constants', () => {
    test('should have correct role constants', () => {
      expect(ROLES.AUTHOR).toBe('author');
      expect(ROLES.COLLABORATOR).toBe('collaborator');
    });

    test('should have correct permission constants', () => {
      expect(PERMISSIONS.CREATE_SECTIONS).toBe('create_sections');
      expect(PERMISSIONS.EDIT_SECTIONS).toBe('edit_sections');
      expect(PERMISSIONS.DELETE_SECTIONS).toBe('delete_sections');
      expect(PERMISSIONS.MANAGE_COLLABORATORS).toBe('manage_collaborators');
      expect(PERMISSIONS.VIEW_BOOK).toBe('view_book');
    });
  });

  describe('Role Checks', () => {
    test('should correctly identify author role', () => {
      expect(isAuthor('author')).toBe(true);
      expect(isAuthor('collaborator')).toBe(false);
      expect(isAuthor(null)).toBe(false);
      expect(isAuthor(undefined)).toBe(false);
    });

    test('should correctly identify collaborator role', () => {
      expect(isCollaborator('collaborator')).toBe(true);
      expect(isCollaborator('author')).toBe(false);
      expect(isCollaborator(null)).toBe(false);
      expect(isCollaborator(undefined)).toBe(false);
    });
  });

  describe('Permission Checks', () => {
    test('should handle null/undefined inputs gracefully', () => {
      expect(hasPermission(null, PERMISSIONS.CREATE_SECTIONS)).toBe(false);
      expect(hasPermission(undefined, PERMISSIONS.CREATE_SECTIONS)).toBe(false);
      expect(hasPermission('author', null)).toBe(false);
      expect(hasPermission('author', undefined)).toBe(false);
    });

    test('should correctly check author permissions', () => {
      expect(canCreateSections('author')).toBe(true);
      expect(canEditSections('author')).toBe(true);
      expect(canDeleteSections('author')).toBe(true);
      expect(canManageCollaborators('author')).toBe(true);
    });

    test('should correctly check collaborator permissions', () => {
      expect(canCreateSections('collaborator')).toBe(false);
      expect(canEditSections('collaborator')).toBe(true);
      expect(canDeleteSections('collaborator')).toBe(false);
      expect(canManageCollaborators('collaborator')).toBe(false);
    });

    test('should handle unknown roles', () => {
      expect(canCreateSections('unknown')).toBe(false);
      expect(canEditSections('unknown')).toBe(false);
      expect(canDeleteSections('unknown')).toBe(false);
      expect(canManageCollaborators('unknown')).toBe(false);
    });
  });

  describe('hasPermission function', () => {
    test('should work with author role', () => {
      expect(hasPermission('author', PERMISSIONS.CREATE_SECTIONS)).toBe(true);
      expect(hasPermission('author', PERMISSIONS.EDIT_SECTIONS)).toBe(true);
      expect(hasPermission('author', PERMISSIONS.DELETE_SECTIONS)).toBe(true);
      expect(hasPermission('author', PERMISSIONS.MANAGE_COLLABORATORS)).toBe(true);
      expect(hasPermission('author', PERMISSIONS.VIEW_BOOK)).toBe(true);
    });

    test('should work with collaborator role', () => {
      expect(hasPermission('collaborator', PERMISSIONS.CREATE_SECTIONS)).toBe(false);
      expect(hasPermission('collaborator', PERMISSIONS.EDIT_SECTIONS)).toBe(true);
      expect(hasPermission('collaborator', PERMISSIONS.DELETE_SECTIONS)).toBe(false);
      expect(hasPermission('collaborator', PERMISSIONS.MANAGE_COLLABORATORS)).toBe(false);
      expect(hasPermission('collaborator', PERMISSIONS.VIEW_BOOK)).toBe(true);
    });
  });
}); 