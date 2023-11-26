import { Schema, model } from "mongoose";
import {
  Guardian,
  LocalGuardian,
  Student,
  UserName,
} from "./student/student.interface";

const userNameSchema = new Schema<UserName>({
  firstName: {
    type: String,
    maxlength: [20, "Name must be in 20 characters"],
    trim: true,
    required: [true, "First name is required. Please enter a first name"],
  },
  middleName: { type: String },
  lastName: {
    type: String,
    trim: true,
    required: [true, "Last name is required. Please enter a last name"],
  },
});

const guardianSchema = new Schema<Guardian>({
  fatherName: {
    type: String,
    required: [true, "fathers name is required. Please enter fathers name"],
  },
  fatherOccupation: {
    type: String,
    required: [
      true,
      "fatherOccupation is required. Please enter fatherOccupation",
    ],
  },
  fatherContactNo: {
    type: String,
    required: [
      true,
      "fatherContactNo is required. Please enter fatherContactNo",
    ],
  },
  motherName: {
    type: String,
    required: [true, "motherName is required. Please enter motherName"],
  },
  motherOccupation: {
    type: String,
    required: [
      true,
      "motherOccupation is required. Please enter motherOccupation",
    ],
  },
  motherContactNo: {
    type: String,
    required: [
      true,
      "motherOccupation is required. Please enter motherOccupation",
    ],
  },
});

const localGuardianSchema = new Schema<LocalGuardian>({
  name: {
    type: String,
    required: [true, "name is required. Please enter name"],
  },
  occupation: {
    type: String,
    required: [true, "occupation is required. Please enter occupation"],
  },
  contactNo: {
    type: String,
    required: [true, "contactNo is required. Please enter contactNo"],
  },
  address: {
    type: String,
    required: [true, "address is required. Please enter address"],
  },
});

const studentSchema = new Schema<Student>({
  id: { type: String, required: true, unique: true },
  name: {
    type: userNameSchema,
    required: [true, "name is required. Please enter name"],
  },
  gender: {
    type: String,
    enum: {
      values: ["male", "female", "other"],
      message:
        "{VALUE} is not valid. The gender can only be one of the following: 'male', 'female', 'other'",
    },
    required: [true, "is required. Please enter"],
  },
  dateOfBirth: { type: String },
  email: {
    type: String,
    required: [true, "email is required. Please enter email"],
    unique: true,
  },
  contactNo: {
    type: String,
    required: [true, "contactNo is required. Please enter contactNo"],
  },
  emergencyContactNo: {
    type: String,
    required: [
      true,
      "emergencyContactNo is required. Please enter emergencyContactNo",
    ],
  },
  bloodGroup: {
    type: String,
    enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
  },
  presentAddress: {
    type: String,
    required: [true, "presentAddress is required. Please enter presentAddress"],
  },
  permanentAddress: {
    type: String,
    required: [
      true,
      "permanentAddress is required. Please enter permanentAddress",
    ],
  },
  guardian: {
    type: guardianSchema,
    required: [true, "guardian is required. Please enter guardian"],
  },
  localGuardian: {
    type: localGuardianSchema,
    required: [true, "localGuardian is required. Please enter localGuardian"],
  },
  profileImg: { type: String },
  isActive: {
    type: String,
    enum: ["active", "blocked"],
    default: "active",
  },
});

export const StudentModel = model<Student>("Student", studentSchema);
