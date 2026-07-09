import { Router } from "express";
import { addAddress, getAddresses, updateAddress, deleteAddress, setDefaultAddress } from "../controllers/Address.controllers.js";
import { VerifyJwt } from "../middleware/auth.middleware.js";

const router = Router();
router.use(VerifyJwt); // every address route requires login

router.route("/").get(getAddresses).post(addAddress);
router.route("/:addressId").patch(updateAddress).delete(deleteAddress);
router.route("/:addressId/default").patch(setDefaultAddress);

export default router;