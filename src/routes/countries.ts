import express from 'express';

import * as countryApi from '../api/country';

const router = express.Router();

router.get('/', countryApi.list);
router.put('/:code', countryApi.update);
router.delete('/:code', countryApi.destroy);

export default router;
