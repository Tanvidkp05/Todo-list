const express=require("express");
const bodyParser=require("body-parser");
const mongoose=require("mongoose");
const date=require(__dirname+"/date.js");

// console.log(date());

const app=express();

//var items = ['Exercise','Breakfast','Football'];

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB",{});

const itemsSchema={
    name: String
}

const Item=mongoose.model("Item", itemsSchema);

const item1=new Item({
    name: "welcome"
});
const item2=new Item({
    name: "+ to add"
});
const item3=new Item({
    name: "hit to delete"
});

const defaultItems=[item1, item2, item3];


app.get("/", function(req, res){

    let day=date.getDate();
    Item.find({})
  .then((foundItems) => {

    if(foundItems.length===0){

        Item.insertMany(defaultItems)
  .then(() => {
    console.log("Successfully saved");
  })
  .catch((err) => {
    console.error(err);
  });
  res.redirect("/");

    }

    res.render("list",{KindofDay:day, newListItem:foundItems});
  })
  .catch((err) => {
    console.error(err);
  });

})

app.post("/", function(req,res){
    const itemName = req.body.newItem;
    const item=new Item({
        name: itemName
    });
    item.save();
    res.redirect("/");
});

app.post("/delete",function(req,res){
    const checkedItemId = req.body.checkbox;
Item.findByIdAndDelete(checkedItemId)
  .then(() => {
    console.log("Deleted successfully");
    res.redirect("/");
  })
  .catch((err) => {
    console.error(err);
  });

});

app.listen(3008, function(){
    console.log("server started on 3008");
})