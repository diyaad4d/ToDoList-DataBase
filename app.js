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
let lists=[];

// async function getAllLists(){
//     const result=await db.query('SELECT * FROM multiple_lists ORDER BY id ASC');
//     return result.rows;
// }

async function getAllLists() {
    const listsResult = await db.query('SELECT * FROM multiple_lists ORDER BY id ASC');
    const lists = listsResult.rows;

    for (let list of lists) {
        const tasksResult = await db.query('SELECT * FROM list WHERE list_id=$1 ORDER BY id ASC', [list.id]);
        list.tasks = tasksResult.rows;
    }

    return lists;
}

async function addList(name,color){
    await db.query('INSERT INTO multiple_lists (name, color) VALUES ($1, $2)', [name, color]);
}

async function getItems(id) {
    const result = await db.query('SELECT * FROM list WHERE list_id = $1 ORDER BY id ASC', [id]);
    console.log(result.rows);
    return result.rows;
}

async function addItem(item,id){
    try{
        const result = await db.query(
            'INSERT INTO list (title,list_id) VALUES ($1,$2) RETURNING *',
            [item,id]
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


/******************************************************************************/

app.get("/", async (req, res) => {
     lists=await getAllLists();
     res.render("lists.ejs",
     { lists }
     );
});

app.get('/new',(req,res)=>{
    res.render('new.ejs');
});

app.post('/new',async (req,res)=>{
   const {name,color}=req.body;
   await addList(name,color);
   res.redirect('/');
});

app.get('/list/:id', async (req, res) => {
    const id = req.params.id;
    const items = await getItems(id);

    const listResult = await db.query('SELECT * FROM multiple_lists WHERE id = $1', [id]);
    const list = listResult.rows[0];

    res.render('index.ejs', {
        listTitle: list.name,
        listColor: list.color,
        id,
        listItems: items
    });
});

app.post("/list/:id/add", async (req, res) => {
    const item = req.body.newItem;
    const id=req.params.id;
    await addItem(item,id);
    res.redirect(`/list/${id}`);
});

app.post('/list/:id/edit', async (req, res) => {
    const id=req.body.updatedItemId;
    const newItem=req.body.updatedItemTitle;
    const listId=req.params.id;
    await editItem(newItem,id);
    res.redirect(`/list/${listId}`);
});

app.post('/list/:id/delete', async (req, res) => {
   const id=req.body.deleteItemId;
   const listId=req.params.id;
   await deleteItem(id);
   res.redirect(`/list/${listId}`);
});

app.get('/delete/:id', async (req, res) => {
    const listId = req.params.id;
    try {
        await db.query('DELETE FROM multiple_lists WHERE id=$1', [listId]);
        // Tasks will be deleted automatically because of ON DELETE CASCADE
        res.redirect('/');
    } catch (err) {
        console.error('Error deleting list:', err);
        res.redirect('/');
    }
});


app.listen(port, () => {
    console.log(`Server started on port ${port}`);
})