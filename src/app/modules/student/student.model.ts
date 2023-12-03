import { Schema, model } from "mongoose";
import validator from "validator";
import {
  TGuardian,
  TLocalGuardian,
  TStudent,
  StudentModel,
  TUserName,
} from "./student.interface";
import bcrypt from "bcrypt";
import config from "../../config";

const userNameSchema = new Schema<TUserName>({
  firstName: {
    type: String,
    maxlength: [20, "Name must be in 20 characters"],
    trim: true,
    required: [true, "First name is required. Please enter a first name"],
    validate: {
      validator: function (value: string) {
        const firstNameStr = value.charAt(0).toUpperCase() + value.slice(1);
        return firstNameStr === value;
      },
      message: "{VALUE} is not in capitalized format ",
    },
  },
  middleName: { type: String },
  lastName: {
    type: String,
    trim: true,
    required: [true, "Last name is required. Please enter a last name"],
    validate: {
      validator: (value: string) => validator.isAlpha(value),
      message: "{VALUE} is not valid",
    },
  },
});

const guardianSchema = new Schema<TGuardian>({
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

const localGuardianSchema = new Schema<TLocalGuardian>({
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

const studentSchema = new Schema<TStudent, StudentModel>({
  id: { type: String, required: true, unique: true },
  name: {
    type: userNameSchema,
    required: [true, "name is required. Please enter name"],
  },
  password: {
    type: String,
    required: [true, "password is required."],
    unique: true,
    maxlength: [20, "Password cannot be more than 20 characters"],
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
    validate: {
      validator: (value: string) => validator.isEmail(value),
      message: "{VALUE} is not a valid email address",
    },
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

//pre save middleware/ will work on create() save()

studentSchema.pre("save", async function (next) {
  // console.log(this, "pre hook: we will save the data");
  //hashing password and save in database
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this;
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds)
  );
  next();
});

//post save middleware
studentSchema.post("save", function (doc, next) {
  doc.password = "";
  next();
});

//creating a custom static method

studentSchema.statics.isUserExist = async function (id: string) {
  const existingUser = await Student.findOne({ id });
  return existingUser;
};

//creating a custom instance method
// studentSchema.methods.isUserExist = async function (id: string) {
//   const existingUser = await Student.findOne({ id });
//   return existingUser;
// };

export const Student = model<TStudent, StudentModel>("Student", studentSchema);
