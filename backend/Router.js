import express from 'express'
import controller from './controller.js'
const router = express.Router()


router.get("/getCategory", controller.getCategory)
router.get("/getItems",controller.getItems)
router.get("/getOrders",controller.getOrders)
router.get("/getExpenses", controller.getExpense)
router.get("/getHomeData",controller.getHomeData)
router.get("/getLatestIncome",controller.getLatestIncome)
router.post('/login',controller.login)



router.post("/addCategory" ,controller.addCategory)
router.post("/addItem",controller.addItem)
router.post("/addOrder",controller.addOrder)
router.post("/addExpense",controller.addExpense)
router.post("/updateItem",controller.updateItem)




router.put("/updatepaymentmethod",controller.updatePaymentMethod)
router.put("/updateExpense",controller.updateExpense)
router.put("/updateCategory",controller.updateCategory)

router.delete('/deleteExpense',controller.deleteExpense)
router.delete('/deleteOrder',controller.deleteOrder)
router.delete("/deleteItem",controller.deleteItem)
router.delete("/deleteCategory",controller.deleteCategory)




export default router