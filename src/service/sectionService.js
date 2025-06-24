import axios from '../config/Axios';

export const fetchSections = (bookId) => axios.get(`/sections?bookId=${bookId}`);
export const createSection = (bookId, section) => axios.post(`/sections`, { ...section, bookId });
export const updateSection = (sectionId, section) => axios.put(`/sections/${sectionId}`, section);
export const deleteSection = (sectionId) => axios.delete(`/sections/${sectionId}`); 