import Contact from '../models/contactModel.js';

export const getAllContacts = async () => {
  return await Contact.find();
};

export const findContactById = async (contactId) => {
  return await Contact.findById(contactId);
};

export const addContact = async (contactData) => {
  return await Contact.create(contactData);
};
export const updateContactById = async (contactId, updateData) => {
  return await Contact.findByIdAndUpdate(contactId, updateData, {
    new: true,
    runValidators: true,
  });
};
export const deleteContactById = async (contactId) => {
  return await Contact.findByIdAndDelete(contactId);
};

