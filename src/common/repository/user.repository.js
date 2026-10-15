import * as base from "./base.repository.js";
import { UserModel } from "./../../DB/model/user.model.js";

export const create = async ({ data } = {}) => {
  return await base.create({ model: UserModel, data });
};

export const insertOne = async ({ data, options = {} } = {}) => {
  return await base.insertOne({ model: UserModel, data, options });
};

export const insertMany = async ({ data = [], options = {} } = {}) => {
  return await base.insertMany({ model: UserModel, data, options });
};

export const find = async ({
  filter = {},
  select = "",
  populate = [],
  options = {},
} = {}) => {
  return await base.find({
    model: UserModel,
    filter,
    select,
    populate,
    options,
  });
};

export const countDocument = async ({ filter = {} } = {}) => {
  return await base.countDocument({ model: UserModel, filter });
};

export const paginate = async ({
  filter = {},
  options = {},
  select = "",
  page = 1,
  limit = 10,
} = {}) => {
  return await base.paginate({
    model: UserModel,
    filter,
    options,
    select,
    page,
    limit,
  });
};

export const findOne = async ({
  filter = {},
  select = "",
  populate = [],
  options = {},
} = {}) => {
  return await base.findOne({
    model: UserModel,
    filter,
    select,
    populate,
    options,
  });
};

export const findById = async ({
  id,
  select = "",
  populate = [],
  options = {},
} = {}) => {
  return await base.findById({
    model: UserModel,
    id,
    select,
    populate,
    options,
  });
};

export const findByIdAndUpdate = async ({
  id,
  updateData = {},
  options = { new: true, runValidators: true },
} = {}) => {
  return await base.findByIdAndUpdate({
    model: UserModel,
    id,
    updateData,
    options,
  });
};

export const findByIdAndDelete = async ({ id, options = {} } = {}) => {
  return await base.findByIdAndDelete({
    model: UserModel,
    id,
    options,
  });
};

export const deleteOne = async ({ filter } = {}) => {
  return await base.deleteOne({ model: UserModel, filter });
};
