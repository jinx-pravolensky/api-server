const express = require('express');
const router = express.Router();
const {
    getAllAccounts,
    createAccount,
    deleteAccount,
    updateAccount,
    getUserById,
    searchJuri,
    searchAdmin
} = require('../controllers/adminController');

router.get('/users/:adminId', getAllAccounts);
router.post('/create-account', createAccount);
router.delete('/delete-account/:id', deleteAccount);
router.put('/update-account/:id', updateAccount);

router.get('/user/:id', getUserById);
router.get('/search-juri/:customId', searchJuri);
router.get('/search-admin/:customId', searchAdmin);

module.exports = router;