var express = require('express');
var router = express.Router();

var db = require('../../queries');


router.get('/api/cen4010db/customer', db.getCustomer);
router.get('/api/cen4010db/customer/:id', db.getSingleCustomer);
// router.post('/api/puppies', db.createPuppy);
// router.put('/api/puppies/:id', db.updatePuppy);
// router.delete('/api/puppies/:id', db.removePuppy);


module.exports = router;