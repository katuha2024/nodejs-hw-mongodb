import express from 'express';
import {
  handleGetAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
  updateContactPhoto,
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

router.post('/', validateBody(createContactSchema), ctrlWrapper(createContact));

router.patch('/:contactId', isValidId, validateBody(updateContactSchema), ctrlWrapper(updateContact));


router.patch(
  '/:contactId/photo',
  isValidId,
  upload.single('photo'), 
  ctrlWrapper(updateContactPhoto)
);

router.delete('/:contactId', isValidId, ctrlWrapper(deleteContact));

export default router;
