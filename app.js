import express from 'express';
import bodyParser from 'body-parser';
import pg from 'pg';
import dotenv from 'dotenv';

const app=express();
const port=process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
dotenv.config();

const db=new pg.Client({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port:process.env.DB_PORT,
});
db.connect();

let items=[];

async function getItems() {
    const result=await db.query('select * from list order by id asc ');
    console.log(result.rows);
    return result.rows;
}

async function addItem(item){
    try{
        const result = await db.query(
            'INSERT INTO list (title) VALUES ($1) RETURNING *',
            [item]
        );
    }
    catch(err){
        console.error('Error inserting item:', err);
    }
}

async function editItem(newItem,id){
    try{
        await db.query('update list set title =$1 where id=$2 returning *',[newItem,id]);
    }
    catch(err){
        console.error('Error inserting item:', err);
    }
}

async function deleteItem(id){
    try{
        await db.query('delete from list where id=$1 returning *',[id]);
    }
    catch(err){
        console.error('Error inserting item:', err);
    }
}




app.get("/", async (req, res) => {
    items=await getItems();
    res.render("index.ejs", {
        listTitle: "Tasks",
        listItems: items,
    });
});

app.post("/add", async (req, res) => {
    const item = req.body.newItem;
    await addItem(item);
    res.redirect("/");
});

app.post('/edit', async (req, res) => {
    const id=req.body.updatedItemId;
    const newItem=req.body.updatedItemTitle;
    await editItem(newItem,id);
    res.redirect("/");
});

app.post('/delete', async (req, res) => {
   const id=req.body.deleteItemId;
   await deleteItem(id);
   res.redirect('/');
});




app.listen(port, () => {
    console.log(`Server started on port ${port}`);
})