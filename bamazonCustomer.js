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

  function userQuestions(){
    inquirer
    .prompt([
    {
      type: "input",
      name: "item_id",
      message: "What is the ID of the item you would like to buy?",
  
    },

    {
        type: "input",
        name: "amount",
        message: "How many units of this item would you like to buy?",
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

                  if(quantity<= productsAva.stock_quantity){
                    console.log("There's enough of those in stock!")
                    //update inventory.
                    var updateQueryStr = 'UPDATE products SET stock_quantity = ' + (productsAva.stock_quantity- quantity) +' WHERE item_id = ' + item;
                    // console.log("updateQueryStr=" + updateQueryStr) check if working correctly. it is. 
                    connection.query(updateQueryStr, function(err, data){
                            if(err) throw err;

                            console.log("Your order has been placed! Your total is $"+ productsAva.price * quantity);
                            console.log("\n--------------------------------------------------\n")

                      connection.end();
                    })
                  
                  } else{
                    console.log("sorry! There is not enough stock of that product.")
                    showInventory();
                  }
                
              }
          
      
            })

        })

  }

///**LATERRRR */
function showInventory(){
      connection.query("SELECT * FROM products",function(err, result) {
      if (err) throw err;
  
      // Log all results of the SELECT statement
      
      console.table(result);
      userQuestions();
    });
  }

function start(){
showInventory();
}
//run the application.
start() 
