import {
  getAllContacts,
  findContactById,
  addContact,
  updateContactById,
  deleteContactById,
} from '../services/contacts.js';
import createError from 'http-errors';
import { uploadToCloudinary } from '../helpers/uploadToCloudinary.js';

export const handleGetAllContacts = async (req, res) => {
  const userId = req.user._id;

  const page = parseInt(req.query.page) || 1;
  const perPage = parseInt(req.query.perPage) || 10;
  const sortBy = req.query.sortBy || 'name';
  const sortOrder = req.query.sortOrder || 'asc';
  const type = req.query.type;
  const isFavourite = req.query.isFavourite;

  const result = await getAllContacts(
    userId,
    page,
    perPage,
    sortBy,
    sortOrder,
    type,
    isFavourite
  );

  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: result,
  });
};

export const getContactById = async (req, res) => {
  const userId = req.user._id;
  const { contactId } = req.params;

  const contact = await findContactById(contactId, userId);

  if (!contact) {
    throw createError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

export const createContact = async (req, res) => {
  const userId = req.user._id;
  let photoUrl = '';

  if (req.file) {
    photoUrl = await uploadToCloudinary(req.file.buffer, req.file.originalname);
  }

  const contact = await addContact({ ...req.body, userId, photo: photoUrl });

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: contact,
  });
};

export const updateContact = async (req, res) => {
  const userId = req.user._id;
  const { contactId } = req.params;

  const updatedContact = await updateContactById(contactId, req.body, userId);

  if (!updatedContact) {
    throw createError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: updatedContact,
  });
};

export const deleteContact = async (req, res) => {
  const userId = req.user._id;
  const { contactId } = req.params;

  const contact = await deleteContactById(contactId, userId);

  if (!contact) {
    throw createError(404, 'Contact not found');
  }

  res.status(204).send();
};
