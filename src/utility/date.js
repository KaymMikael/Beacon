const { isMatch } = require("date-fns");

function isValidBirthday(date) {
  return isMatch(date, "yyyy-MM-dd");
}

module.exports = { isValidBirthday };
