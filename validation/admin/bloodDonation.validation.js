import Joi from 'joi';

export const validateCreate = async (req, res, next) => {
  const schema = Joi.object({
  // Step 1: Personal Info
  firstName: Joi.string().required(),
  middleName: Joi.string().allow(''),
  lastName: Joi.string().required(),
  dateOfBirth: Joi.date().required(),
  age: Joi.number(),
  gender: Joi.string().valid('Male', 'Female', 'Other').required(),
  email: Joi.string().email().required(),
  mobileNumber: Joi.string().pattern(/^\d{10}$/).required(),
  phoneNumber: Joi.string().allow(''),
  proofType: Joi.string().allow(''),
  proofFile: Joi.string().allow(''),

  // Step 2: Contact Details
  addressLine1: Joi.string().required(),
  addressLine2: Joi.string().allow(''),
  district: Joi.string().required(),
  pinCode: Joi.string().pattern(/^\d{6}$/).required(),
  preferredContactMethod: Joi.string().required(),
  specialInstructions: Joi.object({
    dnd: Joi.boolean(),
    contactAtNight: Joi.boolean(),
    duringOfficialHours: Joi.boolean(),
    manualTimings: Joi.boolean(),
    other: Joi.string().allow('')
  }),

  // Step 3: Medical Info
  previousDonor: Joi.boolean(), 
  bloodGroup: Joi.string().required(),
  riskOfInfection: Joi.boolean(), 
  bloodCenterAssociation: Joi.string().required(),

  past6MonthsHistory: Joi.object({
    unexplainedWeightLoss: Joi.boolean(),
    repeatedDiarrhoea: Joi.boolean(),
    swollenGlands: Joi.boolean(),
    continuousLowGradeFever: Joi.boolean(),
    tattooing: Joi.boolean(),
    earPiercing: Joi.boolean(),
    dentalExtraction: Joi.boolean()
  }),

  chronicDiseases: Joi.object({
    heartDisease: Joi.boolean(),
    lungDisease: Joi.boolean(),
    kidneyDisease: Joi.boolean(),
    cancer: Joi.boolean(),
    epilepsy: Joi.boolean(),
    diabetes: Joi.boolean(),
    tuberculosis: Joi.boolean(),
    abnormalBleeding: Joi.boolean(),
    hepatitis: Joi.boolean(),
    allergies: Joi.boolean(),
    jaundice: Joi.boolean(),
    std: Joi.boolean(),
    malaria: Joi.boolean(),
    typhoid: Joi.boolean(),
    faintingSpells: Joi.boolean()
  }),

  pastSurgeriesOrTransfusions: Joi.object({
    majorSurgery: Joi.boolean(),
    minorSurgery: Joi.boolean(),
    bloodTransfusion: Joi.boolean()
  })
 });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).send({ message: error.message, isSuccess: false });
  }
  next();
};

