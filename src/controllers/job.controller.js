const httpStatus = require('http-status');

const pick = require('../utils/pick');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const { jobService } = require('../services');

const createJob = catchAsync(async (req, res) => {
  const companyLogo = req.file;
  if (companyLogo) {
    const jobPayload = {
      ...req.body,
      posterId: req.user.id,
      companyLogo: { fileType: companyLogo.mimetype, filePath: companyLogo.path.replace('public', '') },
    };
    const job = await jobService.createJob(jobPayload);
    res.status(httpStatus.CREATED).send(job);
    return;
  }
  const job = await jobService.createJob({ ...req.body, posterId: req.user.id });
  res.status(httpStatus.CREATED).send(job);
});

const getJobs = catchAsync(async (req, res) => {
  const filter = pick(req.query, []);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await jobService.queryJobs(filter, options);
  res.send(result);
});

const getJob = catchAsync(async (req, res) => {
  const job = await jobService.getJobById(req.params.jobId);
  if (!job) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Job not found');
  }
  res.send(job);
});

const updateJob = catchAsync(async (req, res) => {
  const companyLogo = req.file;
  if (companyLogo) {
    const jobPayload = {
      ...req.body,
      companyLogo: { fileType: companyLogo.mimetype, filePath: companyLogo.path.replace('public', '') },
    };
    const job = await jobService.updateJobById(req.params.jobId, jobPayload);
    res.send(job);
    return;
  }
  const job = await jobService.updateJobById(req.params.jobId, req.body);
  res.send(job);
});

const deleteJob = catchAsync(async (req, res) => {
  await jobService.deleteJobById(req.params.jobId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createJob,
  getJobs,
  getJob,
  updateJob,
  deleteJob,
};
