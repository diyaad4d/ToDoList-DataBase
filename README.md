# ToDoList-DataBase

An interactive web app to manage multiple to-do lists with their tasks.  
Built using **Node.js**, **Express**, **PostgreSQL**, and **EJS** templating.  

🏋️‍♂️ This project was built for **Back-End development training**.

---

##  Technologies Used

- **Node.js**  
- **Express.js**  
- **pg** (PostgreSQL client for Node.js)
- **database** (SQL code and Relationships)
- **EJS** (Embedded JavaScript templating)  
- **CSS / HTML / JavaScript**  

---

##  Features

- 🌐 Create multiple lists with customizable colors.  
- 📝 Add, edit, and delete tasks within each list.  
- ✅ Mark tasks as completed with checkboxes.  
- 📂 View all lists on the home page with a preview of tasks.  
- 🖥️ Responsive UI rendered dynamically with EJS.  
- 🗑️ Delete lists along with all their tasks (cascading delete).  
- 🎨 Each list’s color is applied dynamically throughout the interface.  

---
📊 **Database Schema & Relationships**

### `multiple_lists` – stores the main to-do lists:
- `id` (Primary Key)  
- `name` (name of the list)  
- `color` (color code for the list)  

### `list` – stores tasks associated with each list:
- `id` (Primary Key)  
- `title` (task name)  
- `list_id` (Foreign Key referencing `multiple_lists.id`)  

**Relationship:**  
- One list in `multiple_lists` can have many tasks in `list`.  
- **ON DELETE CASCADE** is applied: deleting a list automatically deletes all its tasks.


---  

## 🙋 Author

**d4d Diyaa Daifi**  
GitHub: [@diyaad4d](https://github.com/diyaad4d)
