import asyncHandler from "../src/utils/AsyncHandler.js";
import { apierrors } from "../src/utils/apierrors.js";
import { apiresponse } from "../src/utils/apiresponse.js";
import { Address } from "../src/models/adress.models.js";

const REQUIRED_FIELDS = ["phoneNumber", "addressLine1", "city", "state", "pincode", "country", "district"];

const addAddress = asyncHandler(async (req, res) => {
  const missingField = REQUIRED_FIELDS.find((field) => !req.body[field]?.toString().trim());
  if (missingField) {
    throw new apierrors(400, `${missingField} is required`);
  }

  // first address for a user is automatically the default
  const isFirstAddress = (await Address.countDocuments({ userId: req.user._id })) === 0;

  const address = await Address.create({
    ...req.body,
    userId: req.user._id,
    isDefault: isFirstAddress,
  });

  return res.status(201).json(
    new apiresponse(201, address, "Address added successfully")
  );
});

const getAddresses = asyncHandler(async (req, res) => {
  const addresses = await Address.find({ userId: req.user._id }).sort({ isDefault: -1, createdAt: -1 });
  return res.status(200).json(
    new apiresponse(200, addresses, "Addresses fetched successfully")
  );
});

const updateAddress = asyncHandler(async (req, res) => {
  const address = await Address.findOneAndUpdate(
    { _id: req.params.addressId, userId: req.user._id },
    { $set: req.body },
    { new: true, runValidators: true }
  );

  if (!address) {
    throw new apierrors(404, "Address not found");
  }

  return res.status(200).json(
    new apiresponse(200, address, "Address updated successfully")
  );
});

const deleteAddress = asyncHandler(async (req, res) => {
  const address = await Address.findOneAndDelete({ _id: req.params.addressId, userId: req.user._id });
  if (!address) {
    throw new apierrors(404, "Address not found");
  }

  return res.status(200).json(
    new apiresponse(200, {}, "Address deleted successfully")
  );
});

const setDefaultAddress = asyncHandler(async (req, res) => {
  const address = await Address.findOne({ _id: req.params.addressId, userId: req.user._id });
  if (!address) {
    throw new apierrors(404, "Address not found");
  }

  await Address.updateMany({ userId: req.user._id }, { $set: { isDefault: false } });
  address.isDefault = true;
  await address.save();

  return res.status(200).json(
    new apiresponse(200, address, "Default address updated")
  );
});

export { addAddress, getAddresses, updateAddress, deleteAddress, setDefaultAddress };