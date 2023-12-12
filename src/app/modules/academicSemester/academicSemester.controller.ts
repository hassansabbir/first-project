import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import { AcademicSemesterServices } from "./academicSemester.service";

const createAcademicSemester = catchAsync(async (req, res, next) => {
  try {
    const result = await AcademicSemesterServices.createAcademicSemesterIntoDb(
      req.body
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Academic Semester is created successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

export const academicSemesterControllers = {
  createAcademicSemester,
};
