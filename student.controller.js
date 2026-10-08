import {pool} from "../config/db.js";
export async function list(req,res){const [rows]=await pool.query("SELECT * FROM students WHERE user_id=? ORDER BY id DESC",[req.user.userId]);res.json({students:rows})}
export async function create(req,res){
 const {name,rollNo,course,semester,email,marks}=req.body;
 if(!name||!rollNo||!course||!semester||!email||marks===undefined)return res.status(400).json({message:"All student fields are required"});
 if(Number(marks)<0||Number(marks)>100)return res.status(400).json({message:"Marks must be between 0 and 100"});
 try{const [r]=await pool.query("INSERT INTO students(user_id,name,roll_no,course,semester,email,marks) VALUES(?,?,?,?,?,?,?)",[req.user.userId,name,rollNo,course,semester,email,marks]);res.status(201).json({message:"Student added successfully",id:r.insertId})}
 catch(e){if(e.code==="ER_DUP_ENTRY")return res.status(409).json({message:"Roll number already exists for your account"});res.status(500).json({message:"Database error"})}
}
export async function update(req,res){
 const {name,rollNo,course,semester,email,marks}=req.body;
 if(Number(marks)<0||Number(marks)>100)return res.status(400).json({message:"Marks must be between 0 and 100"});
 try{const [r]=await pool.query("UPDATE students SET name=?,roll_no=?,course=?,semester=?,email=?,marks=? WHERE id=? AND user_id=?",[name,rollNo,course,semester,email,marks,req.params.id,req.user.userId]);if(!r.affectedRows)return res.status(404).json({message:"Student not found"});res.json({message:"Student updated successfully"})}
 catch(e){if(e.code==="ER_DUP_ENTRY")return res.status(409).json({message:"Roll number already exists for your account"});res.status(500).json({message:"Database error"})}
}
export async function remove(req,res){const [r]=await pool.query("DELETE FROM students WHERE id=? AND user_id=?",[req.params.id,req.user.userId]);if(!r.affectedRows)return res.status(404).json({message:"Student not found"});res.json({message:"Student deleted successfully"})}
