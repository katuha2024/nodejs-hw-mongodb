import express from 'express';
import {
  handleGetAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { isValidId } from '../middlewares/isValidId.js';
import { createContactSchema, updateContactSchema } from '../schemas/contactSchemas.js';
import { authenticate } from '../middlewares/authenticate.js';
import { upload } from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.use(authenticate);


router.get('/', ctrlWrapper(handleGetAllContacts));


router.get('/:contactId', isValidId, ctrlWrapper(getContactById));


router.post( '/', upload.single('photo'),validateBody(createContactSchema),ctrlWrapper(createContact));


router.patch('/:contactId/photo',isValidId,upload.single('photo'),validateBody(updateContactSchema),ctrlWrapper(updateContact));

router.delete('/:contactId', isValidId, ctrlWrapper(deleteContact));

export default router;
