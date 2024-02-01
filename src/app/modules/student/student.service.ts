import mongoose from "mongoose";
import { Student } from "./student.model";
import AppError from "../../errors/AppError";
import { User } from "../user/user.model";
import httpStatus from "http-status";
import { TStudent } from "./student.interface";
import QueryBuilder from "../../builder/QueryBuilder";
import { studentSearchableFields } from "./student.constant";

const getAllStudentsFromDb = async (query: Record<string, unknown>) => {
  // const queryObj = { ...query };
  //searchTerm
  // let searchTerm = "";
  // if (query?.searchTerm) {
  //   searchTerm = query?.searchTerm as string;
  // }
  // const searchQuery = Student.find({
  //   $or: ["email", "name.firstName", "presentAddress"].map((field) => ({
  //     [field]: { $regex: searchTerm, $options: "i" },
  //   })),
  // });
  //filtering
  // const excludeFields = ["searchTerm", "sort", "limit", "page", "fields"];
  // excludeFields.forEach((el) => delete queryObj[el]);
  // console.log({ query }, { queryObj });
  // const filterQuery = searchQuery
  //   .find(queryObj)
  //   .populate("admissionSemester")
  //   .populate({
  //     path: "academicDepartment",
  //     populate: "academicFaculty",
  //   });
  // let sort = "createdAt";
  // if (query.sort) {
  //   sort = query.sort as string;
  // }
  // const sortQuery = filterQuery.sort(sort);
  // let page = 1;
  // let limit = 1;
  // let skip = 0;
  // if (query.limit) {
  //   limit = Number(query.limit);
  // }
  // if (query.page) {
  //   page = Number(query.page);
  //   skip = (page - 1) * limit;
  // }
  // const paginateQuery = sortQuery.skip(skip);
  // const limitQuery = paginateQuery.limit(limit);
  // let fields = "-__v";
  // if (query.fields) {
  //   fields = (query.fields as string).split(",").join(" ");
  // }
  // const fieldQuery = await limitQuery.select(fields);
  // return fieldQuery;

  const studentQuery = new QueryBuilder(
    Student.find().populate("admissionSemester").populate({
      path: "academicDepartment",
      populate: "academicFaculty",
    }),
    query
  )
    .search(studentSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await studentQuery.modelQuery;
  return result;
};
const getSingleStudentsFromDb = async (id: string) => {
  const result = await Student.findById(id)
    .populate("admissionSemester")
    .populate({
      path: "academicDepartment",
      populate: "academicFaculty",
    });
  return result;
};

const updateStudentIntoDb = async (id: string, payload: Partial<TStudent>) => {
  const { name, guardian, localGuardian, ...remainingStudentData } = payload;

  const modifiedUpdatedData: Record<string, unknown> = {
    ...remainingStudentData,
  };

  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedUpdatedData[`name.${key}`] = value;
    }
  }

  if (guardian && Object.keys(guardian).length) {
    for (const [key, value] of Object.entries(guardian)) {
      modifiedUpdatedData[`guardian.${key}`] = value;
    }
  }

  if (localGuardian && Object.keys(localGuardian).length) {
    for (const [key, value] of Object.entries(localGuardian)) {
      modifiedUpdatedData[`localGuardian.${key}`] = value;
    }
  }

  const result = await Student.findByIdAndUpdate(id, modifiedUpdatedData, {
    new: true,
    runValidators: true,
  });
  return result;
};

const deleteStudentsFromDb = async (id: string) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const deletedStudent = await Student.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true, session }
    );

    if (!deletedStudent) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Failed to delete student! Please try again."
      );
    }

    //get user _id from deletedStudent
    const userId = deletedStudent.user;

    const deleteUser = await User.findByIdAndUpdate(
      userId,
      { isDeleted: true },
      { new: true, session }
    );

    if (!deleteUser) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Failed to delete student! Please try again."
      );
    }

    await session.commitTransaction();
    await session.endSession();

    return deletedStudent;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(error);
  }
};

export const StudentServices = {
  getAllStudentsFromDb,
  getSingleStudentsFromDb,
  updateStudentIntoDb,
  deleteStudentsFromDb,
};
