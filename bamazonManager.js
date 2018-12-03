const mysql= require("mysql")
var inquirer = require("inquirer");


// create the connection information for the sql database
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazon"
  });
  
  connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");

  });
//** everything above is the basic set up */

function managerQuestions(){
        inquirer
          .prompt([
              {
                message: "Select The Options From the Menu",
                name: "menu",
                type: "rawlist",
                choices:[
                    "View Products",
                    "View Low Inventory",
                    "Add to Inventory",
                    "Add New Product"
                ]
              }
                ]).then(function(answer){
                    console.log(answer.menu);
                var menuChoice= answer.menu;
                        switch(menuChoice){
                                
                                case "View Products":
                                viewProducts();
                                connection.end()
                                break; 
                            
                                case "View Low Inventory":
                            
                            
                                break;
                            
                                case "Add to Inventory":
                                    addInventory();
                               
                                break;
                            
                                case "Add New Product":
                                addProduct();
                            
                            
                                break;
                        }
          
      
          })
}

// First function with switch cases
function viewProducts(){
    connection.query("SELECT * FROM products", function(err, result) {
        if (err) throw err;
    
        console.table(result);
    });
}

// Update the inventory if it gets low.
function addInventory(){
    inquirer
    .prompt([
    {
      type: "input",
      name: "item_id",
      message: "What is the ID of the item you would like to update?",
  
    },

    {
        type: "input",
        name: "amount",
        message: "How many units of this item would you like to add?",
    },

    ])
    .then(function(input) {
        var item= input.item_id;
        var quantity= input.amount;

        //**query shorthand */
        var querySel= "SELECT * FROM products WHERE ? "

        // console.log("you selected the ID NUMBER " + item + " , and you want to buy the amount of: " + quantity) Use this to check how many.
        connection.query(querySel,{item_id: item} , function(err, result) {
          if (err) throw err;

              if(result.length===0){

                console.log("Error. Please choose a new item")
                showInventory();

              } else{
                    var productsAva= result[0]
                    console.log("Ok! I'll add that to the stock for you!")
                    //update inventory.
                    var updateQueryStr = 'UPDATE products SET stock_quantity = ' + parseInt(productsAva.stock_quantity) + parseInt(quantity) +' WHERE item_id = ' + item;
                    console.log(updateQueryStr)
                    // connection.query(updateQueryStr, function(err, data){
                    //         if(err) throw err;

                    //         console.log("Your order has been placed! Stock should be updated now. Check by Viewing Inventory");
                    //         console.log("\n--------------------------------------------------\n")

                        connection.end();
                    // })               
                }
          })
    })
}

//Add a new product stock- make it so it's not hardcoded later. Refrence above function { } hardcoded fixed.
function addProduct(){
    
    connection.query("INSERT INTO products SET ?",
    {
        product_name:"Note Book",
        department_name:"Stationary",
        price: 10.00,
        stock_quantity: 1000
    },
    function(err,result){
        console.log("Item added to inventory!")
        connection.end();
    });
}



//**Start The first Menu of choices */
function start(){
managerQuestions();
}

start()