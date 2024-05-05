const convertToSnakeCase = (roleTitle) => {
  return roleTitle.toLowerCase().replace(/\s+/g, "-");
};
const passwordResetStore = {};

module.exports = { convertToSnakeCase, passwordResetStore };
