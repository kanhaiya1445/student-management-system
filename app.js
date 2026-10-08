const API=localStorage.getItem("sms-api-base")||"http://localhost:5000/api";
const $=id=>document.getElementById(id);
let students=[];

function token(){return localStorage.getItem("sms-token")}
function show(id,on=true){$(id).classList.toggle("hidden",!on)}
function toast(msg){const t=$("toast");t.textContent=msg;t.style.display="block";setTimeout(()=>t.style.display="none",2500)}
function authHeaders(){return {"Content-Type":"application/json","Authorization":`Bearer ${token()}`}}

async function api(path,options={}){
  const res=await fetch(API+path,options);
  const data=await res.json().catch(()=>({message:"Invalid server response"}));
  if(!res.ok) throw new Error(data.message||"Request failed");
  return data;
}

async function register(e){
 e.preventDefault();
 try{const data=await api("/auth/register",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:$("regName").value,email:$("regEmail").value,password:$("regPassword").value})});toast(data.message||"Registered");$("registerForm").reset();}
 catch(err){toast(err.message)}
}
async function login(e){
 e.preventDefault();
 try{const data=await api("/auth/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:$("loginEmail").value,password:$("loginPassword").value})});localStorage.setItem("sms-token",data.token);localStorage.setItem("sms-user",JSON.stringify(data.user));$("loginForm").reset();boot();}
 catch(err){toast(err.message)}
}
async function loadStudents(){
 try{const data=await api("/students",{headers:authHeaders()});students=data.students||[];render();}
 catch(err){toast(err.message);if(err.message.toLowerCase().includes("token"))logout()}
}
function grade(m){if(m>=90)return"A+";if(m>=80)return"A";if(m>=70)return"B";if(m>=60)return"C";if(m>=50)return"D";return"F"}
function render(){
 const search=$("search").value.toLowerCase().trim();
 const filtered=students.filter(s=>[s.name,s.roll_no,s.course].some(v=>String(v).toLowerCase().includes(search)));
 $("studentTable").innerHTML=filtered.length?filtered.map(s=>`<tr>
 <td>${escapeHtml(s.name)}</td><td>${escapeHtml(s.roll_no)}</td><td>${escapeHtml(s.course)}</td><td>${s.semester}</td><td>${s.marks}%</td><td><b>${grade(Number(s.marks))}</b></td>
 <td><button class="action edit" onclick="editStudent(${s.id})">Edit</button><button class="action delete" onclick="deleteStudent(${s.id})">Delete</button></td>
 </tr>`).join(""):`<tr><td colspan="7">No students found.</td></tr>`;
 const total=students.length, avg=total?students.reduce((a,s)=>a+Number(s.marks),0)/total:0;
 const courses=new Set(students.map(s=>s.course)).size;
 $("stats").innerHTML=`<div class="stat"><span>Total Students</span><strong>${total}</strong></div><div class="stat"><span>Average Marks</span><strong>${avg.toFixed(1)}%</strong></div><div class="stat"><span>Courses</span><strong>${courses}</strong></div><div class="stat"><span>Highest Marks</span><strong>${total?Math.max(...students.map(s=>Number(s.marks))):0}%</strong></div>`;
}
function escapeHtml(v){return String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}
async function saveStudent(e){
 e.preventDefault();
 const id=$("studentId").value;
 const payload={name:$("name").value.trim(),rollNo:$("rollNo").value.trim(),course:$("course").value,semester:Number($("semester").value),email:$("email").value.trim(),marks:Number($("marks").value)};
 try{
   if(id) await api(`/students/${id}`,{method:"PUT",headers:authHeaders(),body:JSON.stringify(payload)});
   else await api("/students",{method:"POST",headers:authHeaders(),body:JSON.stringify(payload)});
   resetForm();await loadStudents();toast(id?"Student updated":"Student added");
 }catch(err){$("studentMessage").textContent=err.message;$("studentMessage").className="message error"}
}
window.editStudent=function(id){
 const s=students.find(x=>x.id===id);if(!s)return;
 $("studentId").value=s.id;$("name").value=s.name;$("rollNo").value=s.roll_no;$("course").value=s.course;$("semester").value=s.semester;$("email").value=s.email;$("marks").value=s.marks;
 $("formTitle").textContent="Edit Student";$("saveBtn").textContent="Update Student";show("cancelEdit",true);window.scrollTo({top:0,behavior:"smooth"});
}
window.deleteStudent=async function(id){
 if(!confirm("Are you sure you want to delete this student?"))return;
 try{await api(`/students/${id}`,{method:"DELETE",headers:authHeaders()});await loadStudents();toast("Student deleted")}
 catch(err){toast(err.message)}
}
function resetForm(){$("studentForm").reset();$("studentId").value="";$("formTitle").textContent="Add Student";$("saveBtn").textContent="Add Student";show("cancelEdit",false);$("studentMessage").textContent=""}
function logout(){localStorage.removeItem("sms-token");localStorage.removeItem("sms-user");boot()}
async function boot(){const logged=!!token();show("authSection",!logged);show("dashboard",logged);show("logoutBtn",logged);if(logged)await loadStudents()}

$("registerForm").addEventListener("submit",register);$("loginForm").addEventListener("submit",login);$("studentForm").addEventListener("submit",saveStudent);$("cancelEdit").addEventListener("click",resetForm);$("logoutBtn").addEventListener("click",logout);$("search").addEventListener("input",render);boot();
