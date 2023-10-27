import express from "express";
import AuthMiddleware from "../middleware/authMiddleware.js";
import UserController from "../Controllers/userController.js";

const router = express.Router();
/**
 * @openapi
 * /api/users:
 *   get:
 *     summary: Get a list of users
 *     description: Retrieve a list of all users.
 *     tags:
 *       - Users
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
router.get("/", AuthMiddleware, async (req, res) => {
  try {
    const result = await UserController.getUsers();
    res.status(result.status).json(result.result);
  } catch (error) {
    console.error("Error in getUsers {GET}: " + error.message);
    res.status(error.status).send(error.message);
  }
});
/**
 * @openapi
 * /api/users/login:
 *   post:
 *     summary: User login
 *     description: Login a user with their credentials.
 *     tags:
 *       - Users
 *     requestBody:
 *       description: User credentials
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               correo:
 *                 type: string
 *               contrasena:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 token:
 *                   type: string
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
router.post("/login", async (req, res) => {
  try {
    const result = await UserController.login(
      req.body.correo,
      req.body.contrasena
    );
    res
      .status(result.status)
      .json({ userId: result.user.id, user: result.user, token: result.token });
  } catch (error) {
    console.log("Error in login {POST}: " + error.message);
    res.status(error.status).send(error.message);
  }
});
/**
 * @openapi
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     description: Create a new user with the provided data.
 *     tags:
 *       - Users
 *     requestBody:
 *       description: User data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 token:
 *                   type: string
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
router.post("/", async (req, res) => {
  try {
    const result = await UserController.createUser(req.body);
    res.status(result.status).json({
      userId: result.newUserId,
      user: result.newUserData,
      token: result.token,
    });
  } catch (error) {
    console.log("Error in createUser {POST}: " + error.message);
    res.status(error.status).send(error.message);
  }
});
/**
 * @openapi
 * /api/users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     description: Retrieve user information by ID.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
router.get("/:id", AuthMiddleware, async (req, res) => {
  try {
    const user = await UserController.findUserById(req.params.id);
    res.status(user.status).json({ id: user.id, userData: user.userData });
  } catch (error) {
    console.log("Error in FindUserById {GET}: " + error.message);
    res.status(error.status).send(error.message);
  }
});
/**
 * @openapi
 * /api/users/{userId}:
 *   delete:
 *     summary: Delete a user by ID
 *     description: Delete a user by their ID.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       204:
 *         description: User deleted
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
router.delete("/:userId", AuthMiddleware, async (req, res) => {
  try {
    const userDeleted = await UserController.deleteUserById(req.params.userId);

    res.status(userDeleted.status).json({ message: userDeleted.message });
  } catch (error) {
    console.log("Error in deleteUserById {DELETE}: " + error.message);
    res.status(error.status).send(error.message);
  }
});

/**
 * @openapi
 * /api/users/{userId}:
 *   put:
 *     summary: Update an existing user.
 *     description: Update the information of an existing user.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: userId
 *         description: ID of the user to update.
 *         required: true
 *         schema:
 *           type: string
 *       - in: header
 *         name: Authorization
 *         description: User's authentication token.
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             example:
 *               name: John
 *               last_name: Doe
 *               email: johndoe@example.com
 *               password: newpassword
 *     responses:
 *       200:
 *         description: User updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *             example:
 *               message: User updated successfully.
 *               data:
 *                 name: John
 *                 last_name: Doe
 *                 email: johndoe@example.com
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
//FALTA CODEAR UPDATE USER
router.put(":userId", AuthMiddleware, async (req, res) => {
  try {
    const userNewValues = {
      nombre: req.body.nombre,
      apellido: req.body.apellido,
      mail: req.body.mail,
      constrasena: req.body.contrasena,
    };
    const result = await UserController.updateUser(userId, userNewValues);

    res.status(result.status).json(result.data);
  } catch (error) {
    console.log("Error in updateUser {PUT}: " + error.message);
    res.status(error.status).send(error.message);
  }
});

export default router;
