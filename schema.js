// create schema format
export const schema = {
  components: {
    schemas: {},
  },
};

export const createSchema = (type, values) => {
  let schema = {
    type: type,
    values: values,
  };

  return schema;
};
