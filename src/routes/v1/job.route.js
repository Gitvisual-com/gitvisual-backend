const express = require('express');

const auth = require('../../middlewares/auth');
const upload = require('../../middlewares/storage');
const validate = require('../../middlewares/validate');
const jsonify = require('../../middlewares/jsonify');

const jobValidation = require('../../validations/job.validation');
const jobController = require('../../controllers/job.controller');

const router = express.Router();

router
  .route('/')
  .post(
    auth('manageJobs'),
    upload.single('companyLogo'),
    jsonify(['tags']),
    validate(jobValidation.createJob),
    jobController.createJob
  )
  .get(auth('getJobs'), validate(jobValidation.getJobs), jobController.getJobs);

router
  .route('/:jobId')
  .get(auth('getJobs'), validate(jobValidation.getJob), jobController.getJob)
  .patch(
    auth('manageJobs'),
    upload.single('companyLogo'),
    jsonify(['tags']),
    validate(jobValidation.updateJob),
    jobController.updateJob
  )
  .delete(auth('manageJobs'), validate(jobValidation.deleteJob), jobController.deleteJob);

module.exports = router;
