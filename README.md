# cloud-book-code-challenge

A collaborative eBook authoring platform with robust role-based permissions. Authors and collaborators can work together on books, with fine-grained control over who can create, edit, or delete sections.

---

## 🚀 Features
- **Role-Based Permissions:** Author and Collaborator roles with a clear permission matrix
- **Book & Section Management:** Create, edit, and delete books and sections
- **Conditional UI:** Interface adapts to user role and permissions
- **Comprehensive Testing:** Automated and manual tests for all permission logic
- **User Feedback:** Clear error messages and visual role indicators

---

## 🏗️ Tech Stack
- React 18
- Redux Toolkit
- React Router DOM
- Ant Design (UI)
- Axios (API calls)
- json-server & json-server-auth (mock backend)
- Jest & React Testing Library (tests)

---

## 📦 Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Start the mock backend
```bash
npm run server
# Runs json-server-auth at http://localhost:3001
```

### 3. Start the development server
```bash
npm start
# App runs at http://localhost:3000
```

### 4. Run tests
```bash
npm test -- src/utils/permissions.test.js --watchAll=false
```

### 5. Run JSON Server Backend
```bash
npx json-server db.json --port 3001
```

---

## 📝 Usage Guide

- **Sign Up:** Register as either Author or Collaborator
- **Login:** Role is displayed in the dashboard
- **Dashboard:**
  - Authors: Can create books, add/edit/delete sections, manage collaborators (future)
  - Collaborators: Can view books and edit section content only
- **Book Details:**
  - UI adapts to your role (buttons/actions hidden or disabled if unauthorized)
- **Role Test:** Use the "Show Role Test" button on the dashboard to verify permissions visually

---

## 📁 File Structure (Key Parts)
- `src/pages/` — Main app pages (dashboard, book-details, login, sign-up, etc.)
- `src/components/` — UI components (Sections, Books, Auth, Common, etc.)
- `src/utils/permissions.js` — Role/permission logic
- `src/utils/permissions.test.js` — Permission tests
- `src/store/` — Redux slices (books, sections, user)
- `src/service/` — API service modules

---

## 🔮 Future Improvements
- Real backend & authentication
- UI for managing collaborators
- Book-level permissions
- Audit trail for changes
- More granular roles

---

## 📄 Documentation
- See `ROLE_IMPLEMENTATION_TEST.md` for a full testing guide
- See `IMPLEMENTATION_SUMMARY.md` for a technical summary
