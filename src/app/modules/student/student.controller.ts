import { StudentServices } from "./student.service";
import httpStatus from "http-status";
import sendResponse from "../../utils/sendResponse";
import catchAsync from "../../utils/catchAsync";

const getAllStudents = catchAsync(async (req, res) => {
  const result = await StudentServices.getAllStudentsFromDb();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Students are retrieved successfully",
    data: result,
  });
});

const getSingleStudent = catchAsync(async (req, res) => {
  const { studentId } = req.params;
  const result = await StudentServices.getSingleStudentsFromDb(studentId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Students is retrieved successfully",
    data: result,
  });
});

const deleteStudent = catchAsync(async (req, res) => {
  const { studentId } = req.params;
  const result = await StudentServices.deleteStudentsFromDb(studentId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Students is deleted successfully",
    data: result,
  });
});

export const StudentControllers = {
  getAllStudents,
  getSingleStudent,
  deleteStudent,
};
