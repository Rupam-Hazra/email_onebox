import { Router } from 'express';
import { createEmail, searchEmails } from '../controllers/emailController';

const router = Router();


router.post('/', createEmail);


router.get('/search', searchEmails);

export default router;
