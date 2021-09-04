const client = require("./client");
const bcrypt = require("bcrypt");

async function createUser({
  username,
  password,
  firstName,
  lastName,
  email,
  isAdmin,
}) {
  const SALT_COUNT = 10;
  const hashedPassword = await bcrypt.hash(password, SALT_COUNT);

  try {
    const {
      rows: [user],
    } = await client.query(
      `
            INSERT INTO users( username, password, "firstName", "lastName", email, "isAdmin" )
            VALUES ($1, $2, $3, $4, $5, $6)
            ON CONFLICT (username) DO NOTHING
            RETURNING *;
            `,
      [username, hashedPassword, firstName, lastName, email, isAdmin]
    );
    delete user.password;

    if (!user) {
      throw {
        name: "CreateUserError",
        message: "Unable to create this user.",
      };
    }

    return user;
  } catch (error) {
    throw error;
  }
}

async function getUser({ username, password }) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
        SELECT * FROM users
        WHERE username=$1;
        `,
      [username]
    );

    const passwordsMatch = await bcrypt.compare(password, user.password);

    if (passwordsMatch) {
      delete user.password;
      return user;
    } else {
      throw {
        name: "PasswordMatchError",
        message: "Password is incorrect.",
      };
    }
  } catch (error) {
    throw error;
  }
}

async function getAllUsers() {
  try {
    const { rows: users } = await client.query(`
        SELECT * FROM users
        `);
    delete users.password;

    if (!users.length > 0) {
      throw {
        name: "GetAllUsersError",
        message: "Error fetching all users.",
      };
    }

    return users;
  } catch (error) {
    throw error;
  }
}

async function getUserById(id) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
        SELECT * FROM users WHERE id = $1
        `,
      [id]
    );

    if (!user) {
      throw {
        name: "GetUserByIdError",
        message: "No user matching this id.",
      };
    }

    delete user.password;
    return user;
  } catch (error) {
    throw error;
  }
}

async function getUserByUsername(username) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
        SELECT * FROM users
        WHERE username = $1;
        `,
      [username]
    );

    if (!user) {
      throw {
        name: "GetUserByUsernameError",
        message: "No user matching this username.",
      };
    }

    return user;
  } catch (err) {
    throw error;
  }
}

module.exports = {
  createUser,
  getUser,
  getAllUsers,
  getUserById,
  getUserByUsername,
};
