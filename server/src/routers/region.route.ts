import { Router } from "express";
import {
  createMultiRegionsHandler,
  createRegionHandler,
  deleteMultilRegionsHandler,
  deleteRegionHandler,
  getRegionHandler,
  getRegionsHandler,
  updateRegionHandler,
} from "../controllers/region.controller";
import { checkBlockedUser } from "../middleware/checkBlockedUser";
import { deserializeUser } from "../middleware/deserializeUser";
import { requiredUser } from "../middleware/requiredUser";
import { validate } from "../middleware/validate";
import {
  createRegionSchema,
  deleteMultiRegionsSchema,
  getRegionSchema,
  updateRegionSchema,
} from "../schemas/region.schema";
import { uploadExcel } from "../upload/excelUpload";

const router = Router();

router.route("")
  .get(
    getRegionsHandler,
  )
  .post(
    deserializeUser,
    requiredUser,
    checkBlockedUser,
    validate(createRegionSchema),
    createRegionHandler,
  );

router.route("/multi")
  .delete(
    deserializeUser,
    requiredUser,
    checkBlockedUser,
    validate(deleteMultiRegionsSchema),
    deleteMultilRegionsHandler,
  );

// Upload Routes
router.post(
  "/excel-upload",
  deserializeUser,
  requiredUser,
  checkBlockedUser,
  uploadExcel,
  createMultiRegionsHandler,
);

router.route("/detail/:regionId")
  .get(
    validate(getRegionSchema),
    getRegionHandler,
  )
  .patch(
    deserializeUser,
    requiredUser,
    checkBlockedUser,
    validate(updateRegionSchema),
    updateRegionHandler,
  )
  .delete(
    deserializeUser,
    requiredUser,
    checkBlockedUser,
    validate(getRegionSchema),
    deleteRegionHandler,
  );

export default router;
