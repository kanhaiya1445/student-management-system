import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {pool} from "../config/db.js";
export async function register(req,res){
 const {name,email,password}=req.body;
 if(!name||!email||!password||password.length<6)return res.status(400).json({message:"Name, valid email and 6+ character password are required"});
 const [existing]=await pool.query("SELECT id FROM users WHERE email=?",[email]);
 if(existing.length)return res.status(409).json({message:"Email already registered"});
 const hash=await bcrypt.hash(password,10);
 const [r]=await pool.query("INSERT INTO users(name,email,password_hash) VALUES(?,?,?)",[name,email,hash]);
 res.status(201).json({message:"Account created successfully",user:{id:r.insertId,name,email}});
}
export async function login(req,res){
 const {email,password}=req.body;
 const [rows]=await pool.query("SELECT * FROM users WHERE email=?",[email]);
 if(!rows.length)return res.status(401).json({message:"Invalid email or password"});
 const user=rows[0],ok=await bcrypt.compare(password,user.password_hash);
 if(!ok)return res.status(401).json({message:"Invalid email or password"});
 const token=jwt.sign({userId:user.id,email:user.email},process.env.JWT_SECRET,{expiresIn:"2h"});
 res.json({message:"Login successful",token,user:{id:user.id,name:user.name,email:user.email}});
}