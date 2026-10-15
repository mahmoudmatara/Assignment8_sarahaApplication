


export const create = async ({ model, data } = {}) => {
  return await model.create(data);
};

export const insertOne = async ({ model, data, options = {} } = {}) => {
  const [doc] = await model.insertMany([data], options);
  return doc;
};

export const insertMany = async ({ model, data = [], options = {} } = {}) => {
  return await model.insertMany(data, options);
};

export const find = async ({
  model,
  filter = {},
  select = "",
  populate = [],
  options = {},
} = {}) => {
  return await model.find(filter, select, options).populate(populate);
};

export const countDocument = async ({ model, filter = {} } = {}) => {
  return await model.countDocuments(filter);
};

export const paginate = async ({
  model,
  filter = {},
  options = {},
  select = "",
  page = 1,
  limit = 10,
} = {}) => {
  const skip = (page - 1) * limit;
  const total = await countDocument({ model, filter });
  const totalPages = Math.ceil(total / limit);

  const docs = await find({
    model,
    filter,
    select,
    options: { ...options, skip, limit },
  });

  return {
    docs,
    total,
    page,
    limit,
    totalPages,
  };
};

export const findOne = async ({
  model,
  filter = {},
  select = "",
  populate = [],
  options = {},
} = {}) => {
  return await model.findOne(filter, select, options).populate(populate);
};

export const findById = async ({
  model,
  id,
  select = "",
  populate = [],
  options = {},
} = {}) => {
  return await model.findById(id, select, options).populate(populate);
};

export const findByIdAndUpdate = async ({
  model,
  id,
  updateData = {},
  options = { new: true, runValidators: true },
} = {}) => {
  return await model.findByIdAndUpdate(id, updateData, options);
};

export const findByIdAndDelete = async ({ model, id, options = {} } = {}) => {
  return await model.findByIdAndDelete(id, options);
};

export const deleteOne = async ({ model, filter } = {}) => {
  return await model.deleteOne(filter);
};
