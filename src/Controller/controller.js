const { user,departmento ,distrito,establishmento} = require("../models")
const { Op } = require('sequelize');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require("uuid");
const uniqueIdentifier = uuidv4();
const privateConfig = require("../config/private-config.json");


function generateRandomToken(length) {
  const characters = privateConfig.development.adminPortal.character;
  let token = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    token += characters.charAt(randomIndex);
  }
  return token;
}

// Create a new user
const createUser = async (req, res) => {
  try {
    const user_email = req.body.email;
    const userDetail=req.body;
    userDetail.form_assigned_to = userDetail.form_assigned_to.join(",");
    // Check if a user with the same email already exists
    const uniqueIdentifier = generateRandomToken(10);
    const existingUser = await user.findOne({ where: { email: user_email } });

    if (!existingUser) {
      userDetail.token = uniqueIdentifier;
      const newUser = await user.create(userDetail);

      res.status(201).json(newUser);
    } else {
      await existingUser.update(userDetail);
      res.status(200).json(existingUser);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creating or updating user' });
  }
};

const subscribeUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const subscribedUser = await user.findByPk(userId);
    if (subscribedUser) {
      subscribedUser.subscription = 1;
      await subscribedUser.save();
      res.status(200).json({ message: 'User subscribed successfully' });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error subscribing user' });
  }
};


const unsubscribeUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const selectedForms = req.body.forms; 

    const unsubscribedUser = await user.findByPk(userId);

    if (unsubscribedUser) {
      const assignedFormsArray = unsubscribedUser.form_assigned_to.split(",");

      // Remove the selected forms from the array
      const updatedFormsArray = assignedFormsArray.filter(
        (form) => !selectedForms.includes(form)
      );

      console.log(updatedFormsArray);

      // Join the updated array back into a comma-separated string
      const updatedFormAssignedTo = updatedFormsArray.join(",");
      console.log(updatedFormAssignedTo);

      // Update the 'form_assigned_to' column in the user table with the updated string
      unsubscribedUser.form_assigned_to = updatedFormAssignedTo;

      await unsubscribedUser.save();
      res.status(200).json({ message: "User unsubscribed successfully" });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error unsubscribing user" });
  }
};



const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const deletedUser = await user.destroy({
      where: { id: userId },
    });
    
    if (deletedUser) {
      res.status(200).json({ message: 'User deleted successfully' });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error deleting user' });
  }
};


const listUser = async (req, res) => {
  try {
    const query = req.query;
    let users;

    if (Object.keys(query).length > 0) {
      const filterObject = JSON.parse(query.filter);
      const firstname = filterObject.firstname;

      if (firstname) {
        const searchConditions = {
          firstname: {
            [Op.like]: `%${firstname}%`,
          },
        };

        users = await user.findAll({
          where: searchConditions,
        });
      } else {
        users = await user.findAll();
      }
    } else {
      // List all users
      users = await user.findAll();
    }

    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching users' });
  }
};


// Edit a user by ID
const editUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const userDetail = req.body;

    if (Array.isArray(userDetail.form_assigned_to)) {
      userDetail.form_assigned_to = userDetail.form_assigned_to.join(",");
    }

    const existingUser = await user.findOne({ where: { id: userId } });

    if (!existingUser) {
      return res.status(404).json({ error: "User does not exist" });
    }

    await existingUser.update(userDetail);

    return res.status(200).json(existingUser);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error updating user" });
  }
};



const getUser = async (req, res) => {
  try {
    const user_id = req.params.id;

    // Check if a user with the same email already exists
    const existingUser = await user.findOne({ where: { id: user_id } });

    if (existingUser) {
      res.status(200).json(existingUser);
    } else {
      res.status(500).json({ error: 'Patient does not exist' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error retriving user' });
  }
};

const listDepartment = async (req, res) => {
  try {
    const query = req.query;
    let department;

    if (Object.keys(query).length > 0) {
      const filterObject = JSON.parse(query.filter);
      const nomdpto = filterObject.nomdpto;

      if (nomdpto) {
        const searchConditions = {
          nomdpto: {
            [Op.like]: `%${nomdpto}%`,
          },
        };

        department = await departmento.findAll({
          where: searchConditions,
        });
      } else {
        department = await departmento.findAll();
      }
    } else {
      department = await departmento.findAll();
    }

    res.status(200).json(department);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error retriving department' });
  }
};

const listDistrict = async (req, res) => {
  try {
    const query = req.query;
    let district;

    if (Object.keys(query).length > 0) {
      const filterObject = JSON.parse(query.filter);
      const nomdist = filterObject.nomdist;

      if (nomdist) {
        const searchConditions = {
          nomdist: {
            [Op.like]: `%${nomdist}%`,
          },
        };

        district = await distrito.findAll({
          where: searchConditions,
        });
      } else {
        district = await distrito.findAll();
      }
    } else {
      district = await distrito.findAll();
    }

    res.status(200).json(district);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error retriving district' });
  }
};

const listEstablishment = async (req, res) => {
  try {
   const query = req.query;
    let establishment;

    if (Object.keys(query).length > 0) {
      const filterObject = JSON.parse(query.filter);
      const nomserv = filterObject.nomserv;

      if (nomserv) {
        const searchConditions = {
          nomserv: {
            [Op.like]: `%${nomserv}%`,
          },
        };

        establishment = await establishmento.findAll({
          where: searchConditions,
        });
      } else {
        establishment = await establishmento.findAll();
      }
    } else {
      establishment = await establishmento.findAll();
    }

    res.status(200).json(establishment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error retriving establishment' });
  }
};

const authenticate = async (req, res) => {
  try {
    const { username, password } = req.body;
  if (username === privateConfig.development.adminPortal.email && password === privateConfig.development.adminPortal.password) {
    const token = jwt.sign({ username }, privateConfig.development.adminPortal.secretKey, { expiresIn: "1h" });

    // Return the token as a JSON response
    res.json({ token });
  } else {
    // If authentication fails, return an error response
    res.status(401).json({ error: "Authentication failed" });
  }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error authenticating' });
  }
};

module.exports = {
  createUser,
  listUser,
  editUser,
  getUser,
  listDepartment,
  listDistrict,
  listEstablishment,
  authenticate,
  subscribeUser,
  unsubscribeUser,
  deleteUser
};
