import Sequelize from "sequelize-browser";
//import sqlJsAsSqlite3 from "sql.js-as-sqlite3";
//import initSqlJs from "sql.js";
//import isPostalCode from "validator/lib/isPostalCode";
//import isUppercase from "validator/lib/isUppercase";
//Sequelize.Validator.isPostalCode = isPostalCode;
//Sequelize.Validator.isUppercase = isUppercase;
/*sqlJsAsSqlite3.configure({
  // `sql.js` package default export.
  initSqlJs,
  // Base URL for `sql.js` to get the `*.wasm` files like `sql-wasm-debug.wasm`.
  // The version of the `*.wasm` files must match the version of the `sql.js` package.
  // Must end with a "/".
  wasmFileBaseUrl: "https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.2/",
});*/
const SQ_CLOUD =
  "sqlitecloud://chkb4aa6iz.sqlite.cloud:8860?apikey=cNUM10Z3hD1L81XWAvPWQTx1EPQsJ9axJ2UDfQ1mCzI";
const sequelize = new Sequelize("sqlite://" + SQ_CLOUD);

const User = sequelize.define("user", {
  username: Sequelize.DataTypes.STRING,
  firstName: Sequelize.DataTypes.STRING,
  lastName: Sequelize.DataTypes.STRING,
  email: Sequelize.DataTypes.STRING,
  password: Sequelize.DataTypes.STRING,
  validate: {
    isPostalCode: (value) => (value) => true,
    isUppercase: (value) => (value) => true,
  },
});
console.log(Sequelize.models.user);
export async function getUser() {
  let user = Sequelize.models.user;
  let _user = user.get({ plain: true });
  //delete user.createdAt;
  //delete user.updatedAt;
  console.log(_user);
}
export async function example() {
  //await sequelize.sync();
  await sequelize.sync();
  let _user = null;
  await sequelize.transaction(async (t) => {
    const user = await User.create(
      {
        firstName: "Abraham",
        lastName: "Lincoln",
      },
      { transaction: t }
    );
  });
  // Create and fetch a record.
  /*let user = await User.create({
    username: "jane",
    birthday: Date.UTC(1980, 6, 1),
  });*/

  _user = user.get({ plain: true });
  //delete user.createdAt;
  //delete user.updatedAt;

  console.log(_user);

  // Clear the database.
  await User.truncate();
}
