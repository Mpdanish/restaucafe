
import CategoryDb from "./model/CategoryDb.js"
import ExpenseDb from "./model/ExpenseDb.js"
import itemDb from "./model/ItemsDb.js"
import orderDb from "./model/OrderDb.js"




async function login(req, res) {
    try {
      const ogUsername = process.env.ADMIN_USERNAME
      const ogPassword = process.env.ADMIN_PASSWORD
      const { username, password } = req.body
  
      if (!username) {
        return res.status(400).json({
          error: true,
          message: "please enter username"
        })
      }
      if (!password) {
        return res.status(400).json({
          error: true,
          message: 'please enter password'
        })
      }
      if (username == ogUsername && password == ogPassword) {
        res.status(200).json({
          error: false,
          message: "admin authenticated successfully"
        })
      } else {
        res.status(400).json({
          error: true,
          message: "invalid credantials"
        })
      }
  
    } catch (error) {
      res.status(500).json({
        error: true,
        message: "internel server error"
      })
    }
  }

async function getCategory(req, res) {
    try {
        const data = await CategoryDb.find().sort({ _id: -1 })

        res.status(200).json({
            error: false,
            data: data
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            error: true,
            message: "Internel Server Error"
        })
    }
}



async function addCategory(req, res) {
    try {
        const category = req.body.categoryName
        const isCat = await CategoryDb.findOne({ name: category })
        if (isCat) {
            return res.status(400).json({
                error: true,
                message: "Category is Already Exist"
            })
        }
        await CategoryDb.create({
            name: category
        })
        res.status(200).json({
            error: false,
            message: "category added successfully"
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            error: true,
            message: "Internel Server Error"
        })
    }
}


async function addItem(req, res) {
    try {
        const data = req.body
        const isItem = await itemDb.findOne({ name: data.name })
        if (isItem) {
            return res.status(400).json({
                error: true,
                message: "The Item Is Already Exist"
            })
        }
        await itemDb.create({
            name: data.name,
            category: data.category,
            price: data.price
        })
        await CategoryDb.updateOne(
            { name: data.category },
            { $inc: { totalItems: 1 } }
        );
        res.status(200).json({
            error: false,
            message: "item Added Successfully"
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            error: true,
            message: "Internal Server Error"
        })
    }
}



async function getItems(req, res) {
    try {
        const data = await itemDb.find().sort({ _id: -1 })
        res.status(200).json({
            error: false,
            data: data
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            error: true,
            message: "Internel Server Error"
        })
    }
}

async function addOrder(req, res) {
    try {
        const data = req.body
        console.log(req.body)
        await orderDb.create({
            Date: data.date,
            totalAmount: data.totalAmount,
            orderDetails: data.orderDetails
        })
        res.status(200).json({
            error: false,
            message: "Order Added Successfully"
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            error: true,
            message: "Internel Server Error"
        })
    }
}



async function getOrders(req, res) {
    try {
        const data = await orderDb.find().sort({ _id: -1 })
        res.status(200).json({
            error: false,
            data: data
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            error: true,
            message: "Internel Server Error"
        })
    }
}



async function getExpense(req, res) {
    try {
        const data = await ExpenseDb.find().sort({ _id: -1 })
        res.status(200).json({
            error: false,
            data: data
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            error: true,
            message: "Internel Server Error"
        })
    }
}


async function addExpense(req, res) {
    try {
        const data = req.body
        await ExpenseDb.create({
            date: data.date,
            expenseDetail: data.expenseDetail,
            totalExpense: data.totalExpense
        })
        res.status(200).json({
            error: false,
            message: "expense addedd successfully"
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            error: true,
            message: "Internel Server Error"
        })
    }
} async function getHomeData(req, res) {
    try {
        const now = new Date();
        const offset = 5.5 * 60 * 60 * 1000;
        const istDate = new Date(now.getTime() + offset);

        const startOfToday = new Date(istDate.getFullYear(), istDate.getMonth(), istDate.getDate());
        const endOfToday = new Date(istDate.getFullYear(), istDate.getMonth(), istDate.getDate() + 1);

        const startOfYesterday = new Date(istDate.getFullYear(), istDate.getMonth(), istDate.getDate() - 1);
        const endOfYesterday = new Date(istDate.getFullYear(), istDate.getMonth(), istDate.getDate());

        // Fetch today's orders
        const ordersToday = await orderDb.find({
            Date: {
                $gte: startOfToday,
                $lt: endOfToday,
            },
        });

        // Calculate total revenue and total orders today
        const totalRevenue = ordersToday.reduce((acc, order) => acc + order.totalAmount, 0);
        const totalOrdersToday = ordersToday.length;

        // Fetch today's expenses
        const expensesToday = await ExpenseDb.find({
            date: {
                $gte: startOfToday,
                $lt: endOfToday,
            },
        });
        const totalExpenses = expensesToday.reduce((acc, expense) => acc + expense.totalExpense, 0);

        // Fetch yesterday's orders
        const ordersYesterday = await orderDb.find({
            Date: {
                $gte: startOfYesterday,
                $lt: endOfYesterday,
            },
        });
        const yesterdayRevenue = ordersYesterday.reduce((acc, order) => acc + order.totalAmount, 0);


        // Get top 10 sold items
        const topSoldItems = await orderDb.aggregate([
            { $unwind: "$orderDetails" }, // Flatten the order details array
            {
                $group: {
                    _id: "$orderDetails.item", // Group by item name
                    totalQuantity: { $sum: "$orderDetails.quantity" }, // Sum the quantities sold
                },
            },
            { $sort: { totalQuantity: -1 } }, // Sort by total quantity sold in descending order
            { $limit: 10 }, // Limit to top 10 items
        ]);


        // Send response with all the data
        res.status(200).json({
            error: false,
            data: {
                todayIncome: totalRevenue,
                todayExpense: totalExpenses,
                todayCustomerCount: totalOrdersToday,
                yesterdayIncome: yesterdayRevenue,
                topSoldItems: topSoldItems, // Include top sold items in the response
            }
        });

    } catch (error) {
        console.error("Error fetching today's revenue and expenses:", error);
        res.status(500).json({ error: true, message: "Could not fetch revenue and expense data" });
    }
}



async function getLatestIncome(req, res) {
    try {
        const result = await orderDb.find().sort({ _id: -1 }).limit(5)
        res.status(200).json({
            error: false,
            data: result
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            error: true,
            message: "Internel Server Error"
        })
    }
}

async function updatePaymentMethod(req, res) {
    try {
        const { referenceNumber, paymentMethod } = req.body
        console.log(req.body,'body printing')
        // console.log(re,'payment method');
        

        const order = await orderDb.findOne({referenceNumber});
        console.log('Current Order:', order);

        // Update the payment method
        const updatedOrder = await orderDb.findOneAndUpdate(
             {referenceNumber} ,  // Filter to find the order by referenceNumber
            { $set: { paymentMethod } },  // Update operation
            { new: true }  // Option to return the updated document
        );

        if (!updatedOrder) {
            
            throw new Error('Order not found');
        }

        console.log('Updated Order:', updatedOrder);

        res.json({ error: false, updatedOrder });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: true, message: 'Server error' });
    }
}


async function updateItem(req, res) {
    try {
        const { id, price, name, category } = req.body; // Assuming the item ID is sent in the request body

        // Validate input
        if (!id || !price || !name || !category) {
            return res.status(400).json({ error: true, message :"missing fiedl"});
        }

        // Find the item by ID and update it
        const updatedItem = await itemDb.updateOne(
            {_id:id},
            {$set:{name:name , price:price , category:category}},
        );

        // If no item is found, return an error
        if (!updatedItem) {
            return res.status(404).json({ error: true , message : "item not updated"});
        }

        // Respond with the updated item
        res.status(200).json({error:false,  message: 'Item updated successfully', item: updatedItem });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: true, message:"internel server error" });
    }
}



// In your deleteExpense function
async function deleteExpense(req, res) {
    const { id } = req.query; // Extract the ID from query parameters

    try {
        // Validate the ID
        if (!id) {
            return res.status(400).json({ error: true, message: 'Invalid ID' });
        }

        // Delete the expense
        const deletedExpense = await ExpenseDb.findByIdAndDelete(id);

        if (!deletedExpense) {
            return res.status(404).json({ error: true, message: 'Expense not found' });
        }

        res.status(200).json({
            error: false,
            message: 'Expense deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting expense:', error);
        res.status(500).json({
            error: true,
            message: 'Internal server error'
        });
    }
}


async function deleteOrder(req, res) {
    const { id } = req.query; 

    try {
        // Validate the ID
        if (!id) {
            return res.status(400).json({ error: true, message: 'Invalid ID' });
        }

        const deletedOrder = await orderDb.findByIdAndDelete(id);

        if (!deletedOrder) {
            return res.status(404).json({ error: true, message: 'Order not found' });
        }

        res.status(200).json({
            error: false,
            message: 'Order deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting Order:', error);
        res.status(500).json({
            error: true,
            message: 'Internal server error'
        });
    }
}
async function deleteItem(req, res) {
    const { id ,cat } = req.query; 
    try {
        // Validate the ID
        if (!id) {
            return res.status(400).json({ error: true, message: 'Invalid ID' });
        }

        const deletedOrder = await itemDb.findByIdAndDelete(id);
        await CategoryDb.updateOne(
            { name: cat }, 
            { $inc: { totalItems: -1 } }
        );

        if (!deletedOrder) {
            return res.status(404).json({ error: true, message: 'Item not found' });
        }

        res.status(200).json({
            error: false,
            message: 'Item deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting Item:', error);
        res.status(500).json({
            error: true,
            message: 'Internal server error'
        });
    }
}



async function updateExpense(req, res) {
    try {
        const { id, formdata } = req.body; // Ensure it's formData, not formdata
        console.log('formData:', req.body);
        
        // Validate the ID and formData
        if (!id) {
            return res.status(400).json({ error: true, message: 'Invalid ID' });
        }
        
        // Update the expense in the database
        const updatedExpense = await ExpenseDb.findByIdAndUpdate(
            id,
            { $set: formdata }, // Correctly set the formData
            { new: true } // Return the updated document
        );

        if (!updatedExpense) {
            return res.status(404).json({ error: true, message: 'Expense not found' });
        }

        res.status(200).json({
            error: false,
            message: 'Expense updated successfully',
            data: updatedExpense
        });
    } catch (error) {
        console.error('Error updating expense:', error);
        res.status(500).json({
            error: true,
            message: 'Internal server error'
        });
    }
}




async function updateCategory(req,res) {
    try {
        const { id, name } = req.body; // Ensure it's formData, not formdata\
        
        // Validate the ID and formData
        if (!id) {
            return res.status(400).json({ error: true, message: 'Invalid ID' });
        }
        
        // Update the expense in the database
        const updatedCat = await CategoryDb.findByIdAndUpdate(
            id,
            { $set: name }, // Correctly set the formData
            { new: true } // Return the updated document
        );

        if (!updatedCat) {
            return res.status(404).json({ error: true, message: 'Category not found' });
        }

        res.status(200).json({
            error: false,
            message: 'Category updated successfully',
            data: updatedCat
        });
    } catch (error) {
        console.error('Error updating Category:', error);
        res.status(500).json({
            error: true,
            message: 'Internal server error'
        });
    }
}



async function deleteCategory(req, res) {
    const { id  } = req.query; 
    try {
        // Validate the ID
        if (!id) {
            return res.status(400).json({ error: true, message: 'Invalid ID' });
        }

        const deletedOrder = await CategoryDb.findByIdAndDelete(id);

        if (!deletedOrder) {
            return res.status(404).json({ error: true, message: 'Category not found' });
        }

        res.status(200).json({
            error: false,
            message: 'Category deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting Category:', error);
        res.status(500).json({
            error: true,
            message: 'Internal server error'
        });
    }
}

export default {
    login,
    getCategory,
    addCategory,
    addItem,
    getItems,
    addOrder,
    getOrders,
    getExpense,
    addExpense,
    getHomeData,
    getLatestIncome,
    updatePaymentMethod,
    updateItem,
    deleteExpense,
    updateExpense,
    deleteOrder,
    deleteItem,
    updateCategory,
    deleteCategory
}