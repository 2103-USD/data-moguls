const ordersRouter = express.Router();

const {
  createOrder,
  getAllOrders,
  getOrderById,
  getCartByUser,
  updateOrder,
  cancelOrder,
} = require("../db");
const { requireUser, requireAdmin } = require("./utils");

ordersRouter.get("/", [requireUser, requireAdmin], async (req, res, next) => {
  try {
    const allorders = await getAllOrders();

    res.send(allorders);
  } catch ({ name, message }) {
    next({ name, message });
  }
});

ordersRouter.post("/", requireUser, async (req, res, next) => {
  try {
    const order = await createOrder({
      status: "created",
      userId: req.user.id,
    });
    if (order) {
      res.send(order);
    } else {
      next({ message: "Cannot create order at this time." });
      return;
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

ordersRouter.get("/:orderId", async (req, res, next) => {
  const { orderId } = req.params;
  try {
    const order = await getOrderById(orderId);

    res.send(order);
  } catch (error) {
    throw error;
  }
});

ordersRouter.get("/cart", requireUser, async (req, res, next) => {
  try {
    const cart = await getCartByUser(req.user.id);

    if (cart) {
      res.send(cart);
    } else {
      next({ message: "Cannot get card by selected user." });
      return;
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

ordersRouter.patch("/:orderId", requireUser, async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { userId, status } = req.body;

    const updatedOrder = await updateOrder({
      id: orderId,
      status: status,
      userId: userId,
    });

    res.send(updatedOrder);
  } catch (error) {
    next(error);
  }
});

ordersRouter.delete("/:orderId", requireUser, async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const deletedOrder = await cancelOrder(orderId);

    res.send(deletedOrder);
  } catch (error) {
    next(error);
  }
});

module.exports = ordersRouter;
