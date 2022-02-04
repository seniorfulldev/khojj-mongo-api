module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("users", {
    username: {
      type: Sequelize.STRING
    },
    email: {
      type: Sequelize.STRING
    },
    password: {
      type: Sequelize.STRING
    },
    plan_id: {
      type: Sequelize.INTEGER(11),
      defaultValue: 5
    }
  });

  return User;
};
