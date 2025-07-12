import Contact from '../models/contactModel.js';

export const getAllContacts = async (
  page = 1,
  perPage = 10,
  sortBy = 'name',
  sortOrder = 'asc',
  type,
  isFavourite
) => {
  const skip = (page - 1) * perPage;

  const sortOptions = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

  const filter = {};
  if (type) {
    filter.contactType = type;
  }
  if (isFavourite !== undefined) {
    
    filter.isFavourite = isFavourite === 'true';
  }

  const [contacts, totalItems] = await Promise.all([
    Contact.find(filter).sort(sortOptions).skip(skip).limit(perPage),
    Contact.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(totalItems / perPage);

  return {
    data: contacts,
    page,
    perPage,
    totalItems,
    totalPages,
    hasPreviousPage: page > 1,
    hasNextPage: page < totalPages,
  };
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

