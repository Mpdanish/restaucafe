import axios from "axios";


// const api = axios.create({
//   baseURL: "https://kinsukicafe-api.vercel.app/api", 
//   headers: {
//     "Content-Type": "application/json",
//   },
//   withCredentials: true,
// })

const api = axios.create({
  baseURL: "http://localhost:3001/api", 
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
})



// Login function
async function login(body) {
  try {
    const response = await api.post("/login", body);
    console.log("Login successful:", response.data);
    return response.data;
  } catch (error) {
    console.error("Request failed:", {
      message: error.message,
      config: error.config,
      response: error.response ? error.response.data : null,
    });
    return error.response ? error.response.data : "Network error";
  }
}

// Add Income function
async function addIncome(body) {
  try {
    const response = await api.post("/addIncome", body);
    console.log("Income result:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error adding income:", error);
    return error.response ? error.response.data : "Network error";
  }
}



// Show Income function
async function showIncome() {
  try {
    const response = await api.get("/incomehistory");
    console.log("Income history:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching income history data", error);
    return "Network error";
  }
}

// Add Expense function
async function addExpense(body) {
  try {
    const response = await api.post("/addExpense", body);
    console.log("Expense result:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error adding expense:", error);
    return error.response ? error.response.data : "Network error";
  }
}

// Show Expense function
async function showExpense() {
  try {
    const response = await api.get("/getExpenses");
    return response.data;
  } catch (error) {
    console.error("Error fetching expenses:", error);
    return error.response ? error.response.data : "Network error";
  }
}



// Get Today's Income and Expense function
async function getTodayIncomeAndExpense() {
  try {
    const response = await api.get("/getTodayIncomeAndExpense");
    return response.data;
  } catch (error) {
    console.error("Error fetching today's income and expense:", error);
    return error.response ? error.response.data : "Network error";
  }
}


async function  getCatogory() {
  try {
    const response = await api.get('/getCategory')
    const data = response.data
    return data
  } catch (error) {
    console.log(error)
    return error.response.data
  }
}


async function addCategory(body) {
  try {
    const response = await api.post('/addCategory',body)
    const data = response.data
    return data
  } catch (error) {
    console.log(error)
    return error.response.data
  }
}


async function addItem(body) {
  try {
    const response = await api.post('/addItem',body)
    return response.data
  } catch (error) {
    console.log(error)
    return error.response.data
  }
}



async function getItems() {
  try {
    const response = await api.get('/getItems')
    return response.data
  } catch (error) {
    console.log(error)
    return error.response.data
  }
}



async function addOrder(body) {
  try {
    const response = await api.post("/addOrder",body)
    return response.data
  } catch (error) {
    console.log(error)
    return error.response.data
  }
}


async function getOrders() {
  try {
    const response = await api.get("/getOrders")
    return response.data
  } catch (error) {
    console.log(error)
    return error.response.data
  }
}


async function getHomeData() {
  try {
    const response = await api.get("/getHomeData")
    return response.data
  } catch (error) {
    console.log(error)
    return error.response.data
  }
}


async function getLatestIncome() {
  try {
    const response = await api.get("/getLatestIncome")
    return response.data
  } catch (error) {
    console.log(error)
    return error.response.data
  }
}

async function updatePaymentMethod(body) {
  try {
    const response = await api.put(`/updatepaymentmethod`,body)
    return response.data
  } catch (error) {
    console.log(error)
    return error.response.data
  }
}



async function updateItem(body) {
  try {
    const response = await api.post("/updateItem",body)
    return response.data
  } catch (error) {
    console.log(error)
    return error.response.data
  }
}


async function deleteExpense(id) {
    try {
      const response = await api.delete(`/deleteExpense?id=${id}`)
      return response.data
    } catch (error) {
    console.log(error)
    return error.response.data
    }
}

async function updateExpense(id,formdata) {
  try {
    const response = await api.put(`/updateExpense`,{id,formdata})
    return response.data
  } catch (error) {
  console.log(error)
  return error.response.data
  }
}

async function deleteOrder(id) {
  try {
    const response = await api.delete(`/deleteOrder?id=${id}`)
    return response.data
  } catch (error) {
    console.log(error)
  return error.response.data
  }
}

async function deleteItem(id,cat) {
  try {
    const response = await api.delete(`/deleteItem?id=${id}&&cat=${cat}`)
    return response.data
  } catch (error) {
    console.log(error)
  return error.response.data
  }
}



async function updateCategory(id , name) {
  try {
    const response = await api.put("/updateCategory",{
      id,name
    })
    return response.data
  } catch (error) {
    console.log(error)
    return error.response.data
  }
}

async function deleteCategory(id) {
  try {
    const response = await api.delete(`/deleteCategory?id=${id}`)
    return response.data
  } catch (error) {
    console.log(error)
  return error.response.data
  }
}


// Exporting functions
export default {
  login,
  addIncome,
  showIncome,
  addExpense,
  showExpense,
  getTodayIncomeAndExpense,
  getCatogory,
  addCategory,
  addItem,
  getItems,
  addOrder,
  getOrders,
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
};
