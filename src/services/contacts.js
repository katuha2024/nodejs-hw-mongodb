import Contact from '../models/contactModel.js';

export const getAllContacts = async () => {
  const contacts = await Contact.find();
  return contacts;
};

export const findContactById = async (contactId) => {
  return await Contact.findById(contactId);
};
