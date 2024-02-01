import { StudentServices } from "./student.service";
import httpStatus from "http-status";
import sendResponse from "../../utils/sendResponse";
import catchAsync from "../../utils/catchAsync";

const getAllStudents = catchAsync(async (req, res) => {
  const result = await StudentServices.getAllStudentsFromDb(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Students are retrieved successfully",
    data: result,
  });
});

const getSingleStudent = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await StudentServices.getSingleStudentsFromDb(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Students is retrieved successfully",
    data: result,
  });
});

const updateStudent = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { student } = req.body;
  const result = await StudentServices.updateStudentIntoDb(id, student);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Students is updated successfully",
    data: result,
  });
});

const deleteStudent = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await StudentServices.deleteStudentsFromDb(id);
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
  updateStudent,
  deleteStudent,
};
