const express = require('express');
const router = express.Router();
const consumerController = require('../controllers/consumerController');

router.post('/', consumerController.addConsumer);
router.get('/', consumerController.getConsumers);
router.get('/:consumerNumber', consumerController.getConsumer);
router.delete('/:consumerNumber', consumerController.deleteConsumer);
router.put('/add-reading/:consumerNumber', consumerController.addReading);
router.put('/:consumerNumber', consumerController.updateConsumer);
router.get('/:consumerNumber', consumerController.getConsumerByNumber);
router.put('/citizen/update-reading/:consumerNumber', consumerController.addCitizenReading);
router.get('/details/:consumerNumber', consumerController.getConsumerDetailsByNumber);

module.exports = router;
