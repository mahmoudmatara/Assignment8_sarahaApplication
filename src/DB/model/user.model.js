import mongoose from "mongoose";
import { GenderEnum, RoleEnum } from "../../common/enum/index.js";
import { calculateAge } from "./../../common/utils/age.js";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      minLength: 2,
      maxLength: 25,
      required: true,
    },
    lastName: {
      type: String,
      minLength: 2,
      maxLength: 25,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    // age: {
    //   type: Number,
    //   min: 18,
    //   max: 60,
    // },
    DOB: Date,
    image: String,
    confirmEmail: Date,
    coverImage: [String],
    changeCredentialsTime: Date,
    gender: {
      type: Number,
      enum: Object.values(GenderEnum),
      default: GenderEnum.MALE,
    },
    role: {
      type: Number,
      enum: Object.values(RoleEnum),
      default: RoleEnum.USER,
    },
    twoStepVerification: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    id: false,
    strict: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema
  .virtual("userName")
  .set(function (value) {
    const [firstName, lastName] = value?.split(" ") || [];
    this.set({ firstName, lastName });
  })
  .get(function () {
    return `${this.firstName} ${this.lastName}`;
  });
userSchema.virtual("age").get(function () {
  return calculateAge(this.DOB);
});
export const UserModel = mongoose.model("user", userSchema);
