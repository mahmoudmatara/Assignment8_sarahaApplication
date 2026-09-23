import mongoose from "mongoose";
import { GenderEnum, RoleEnum } from "../../common/enum/index.js";

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
    age: {
      type: Number,
      min: 18,
      max: 60,
    },
    DOB: Date,
    image: String,
    confirmEmail: Date,
    coverImage: [String],
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
  },
  {
    timestamps: true,
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

export const UserModel = mongoose.model("user", userSchema);
