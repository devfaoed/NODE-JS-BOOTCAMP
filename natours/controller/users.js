// users controller
// get all users
export const getAllUsers = async (req, res) => {
    try {
      res.status(200).json({
        status: 'success',
        message: 'no user registered yet!!',
      });
    } catch (err) {
      res.status(500).json(err.message);
    }
  };
  
  //register a new user
  export const registerNewUser = async (req, res) => {
    try {
      res.status(200).json({
        status: 'success',
        message: 'no user registered yet!!',
      });
    } catch (err) {
      res.status(500).json(err.message);
    }
  };
  
  //a single user
  export const singleUser = async (req, res) => {
    try {
      res.status(200).json({
        status: 'success',
        message: 'no user registered yet!!',
      });
    } catch (err) {
      res.status(500).json(err.message);
    }
  };
  
  // update user account
  export const updateUser = async (req, res) => {
    try {
      res.status(200).json({
        status: 'success',
        message: 'no user registered yet!!',
      });
    } catch (err) {
      res.status(500).json(err.message);
    }
  };
  
  // delete user
  export const deleteUser = async (req, res) => {
    try {
      res.status(200).json({
        status: 'success',
        message: 'no user registered yet!!',
      });
    } catch (err) {
      res.status(500).json(err.message);
    }
  };


  
  