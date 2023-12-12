import express from "express";
import { academicSemesterControllers } from "./academicSemester.controller";
import validateRequest from "../../middlewares/validateRequest";
import { AcademicSemesterValidation } from "./academicSemester.validation";

const router = express.Router();

// router.get("/", StudentControllers.getAllStudents);
// router.get("/:studentId", StudentControllers.getSingleStudent);
// router.delete("/:studentId", StudentControllers.deleteStudent);

router.post(
  "/create-academic-semester",
  validateRequest(
    AcademicSemesterValidation.createAcademicSemesterValidationSchema
  ),
  academicSemesterControllers.createAcademicSemester
);

export const AcademicSemesterRoutes = router;
