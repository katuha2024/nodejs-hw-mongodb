import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import { handleGetAllContacts } from './controllers/contactsController.js';
import { getContactById } from './controllers/contactsController.js';

export const setupServer = () => {
  const app = express();

  app.use(cors());
  app.use(pino());

  
  app.get('/contacts', handleGetAllContacts);
  app.get('/contacts/:contactId', getContactById);


  app.use((req, res) => {
    res.status(404).json({ message: 'Not found' });
  });

  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
