const timerDpEl=document.getElementById("timer-dp");
const addNewTaskEl=document.getElementById("add-newtask");
const taskFormEl=document.getElementById("task-form");
const taskDescriptionEl=document.getElementById("task-description");
const todoListEl=document.getElementById("todo-list");
const timeDurationEl=document.getElementById("time-duration");
const dateTimeDueEl=document.getElementById("date-time-due");
const currentTasksDpEl=document.getElementById("current-tasks-dp");
const doneListEl=document.getElementById("done-list");
const editTaskel=document.getElementById("edit-task");
const timerNotificationEl=document.getElementById("timer-notification");


const eTaskNameEl=document.getElementById("edit-task-name");
const eTimeDurationEl=document.getElementById("edit-time-duration");
const eDateTimeDueEl=document.getElementById("edit-date-time");
const eTaskDescriptionEl=document.getElementById("edit-task-description");

document.getElementById("pause-timer").addEventListener("click", pauseTimer);
document.getElementById("play-timer").addEventListener("click", startTimer);
document.getElementById("add-newtask-btn").addEventListener("click", addNewTask);
document.getElementById("cancel-newtask-btn").addEventListener("click", closeNewTask);
document.getElementById("confirm-newtask-btn").addEventListener("click", confirmNewTask);

document.getElementById("cancel-edit-btn").addEventListener("click", closeNewTask);
document.getElementById("confirm-edit-btn").addEventListener("click", confirmEditTask);

const appState={
    activeTaskId:null,
    editingTaskId:null,
    currentTasks:JSON.parse(localStorage.getItem('myCurrentTasks'))||[],
    todoTasks:JSON.parse(localStorage.getItem("myTodoTasks"))||[],   
    doneTasks:JSON.parse(localStorage.getItem("myDoneTasks"))||[],
    timerInterval:null,
    totalSeconds:null
}

function addNewTask(){
    if(addNewTaskEl.value==""){

        return;
    }
document.getElementById("task-form").showModal();

};

function closeNewTask(){
document.getElementById("task-form").close();
document.getElementById("edit-task").close();
};

function confirmNewTask()
{
    const newTask={
        id:crypto.randomUUID(), 
        name:addNewTaskEl.value,
        description:taskDescriptionEl.value,
        timeDuration:timeDurationEl.value,
        dateTimeDue:dateTimeDueEl.value,
        timeElapsed:0

    }
    appState.todoTasks.push(newTask);
    console.log(appState.todoTasks);
    document.getElementById("task-form").close();
    syncStorage();
    renderUI();
}



function startTask(event){
    timerNotificationEl.textContent = "";
    const taskId = event.target.dataset.id;
    for(let i=0;i<appState.todoTasks.length;i++){
if(taskId===appState.todoTasks[i].id){
          const newTaskInfo=appState.todoTasks[i];
         
appState.currentTasks.push(newTaskInfo);


appState.todoTasks.splice(i, 1);
       
syncStorage();
renderUI();
    }
}
}

function doneTask(event){
    
    for(let i=0;i<appState.currentTasks.length;i++){
  const taskId = event.target.dataset.id;
    if(taskId===appState.currentTasks[i].id){
        const newCurrentTaskInfo=appState.currentTasks[i];

appState.doneTasks.push(newCurrentTaskInfo);
appState.currentTasks.splice(i,1);  
syncStorage();
renderUI();
    }
}
}

function editTask(event){
       document.getElementById("edit-task").showModal();
for(let i=0; i<appState.todoTasks.length; i++){
   const taskId = event.target.dataset.id;

if(taskId===appState.todoTasks[i].id){

eTaskDescriptionEl.value=appState.todoTasks[i].description;
eTaskNameEl.value=appState.todoTasks[i].name;
eDateTimeDueEl.value=appState.todoTasks[i].dateTimeDue;
eTimeDurationEl.value=appState.todoTasks[i].timeDuration;
appState.editingTaskId=taskId
}
}
};

function confirmEditTask(){
const taskId=appState.editingTaskId;
for(let i=0; i <appState.todoTasks.length;i++){
    if(taskId===appState.todoTasks[i].id){
        appState.todoTasks[i].name=eTaskNameEl.value;
         appState.todoTasks[i].description=eTaskDescriptionEl.value;
          appState.todoTasks[i].dateTimeDue=eDateTimeDueEl.value;
           appState.todoTasks[i].timeDuration=eTimeDurationEl.value;

    }
 

}

   syncStorage();
    closeNewTask();
        renderUI();
}

function deleteTask(event){
    const taskId = event.target.dataset.id;
    for(let i=0;i<appState.todoTasks.length;i++){
        if(taskId===appState.todoTasks[i].id){

         appState.todoTasks.splice(i,1);

        }
    }

      for(let i=0;i<appState.currentTasks.length;i++){
        if(taskId===appState.currentTasks[i].id){

         appState.currentTasks.splice(i,1);

        }
    }
    for (let i=0; i<appState.doneTasks.length;i++){
        if(taskId===appState.doneTasks[i].id){

            appState.doneTasks.splice(i,1);

        }
    }
      syncStorage();
     renderUI();

}

//Time Logic
function convertToSeconds(minutes){
return parseInt(minutes*60);
};
function startTimer(event){
   const taskId = event.target.dataset.id || appState.activeTaskId;


if (appState.timerInterval) {
        clearInterval(appState.timerInterval);
        appState.timerInterval = null;
        //clears existing Intervals
    
    };

for(let i=0;i<appState.currentTasks.length;i++){

    if (taskId===appState.currentTasks[i].id){
        const currentTask= appState.currentTasks[i];
        appState.activeTaskId = currentTask.id;
        appState.totalSeconds = convertToSeconds(currentTask.timeDuration); 
        if(!currentTask.timeDuration){
        return;
      }
    

let timer=convertToSeconds(currentTask.timeDuration)-currentTask.timeElapsed;
 


appState.timerInterval=setInterval(() =>{
 if(timer<=0){
         timerNotificationEl.textContent="Time's Up!🏁"
timerDpEl.textContent=formatTime(timer);
pauseTimer();
        return;
      } ;

currentTask.timeElapsed++;
timer--;
const progress = timer / appState.totalSeconds;
const offset = 339 * (1 - progress);
document.getElementById("timer-progress").style.strokeDashoffset = offset;
timerDpEl.textContent=formatTime(timer);
if(currentTask.timeElapsed%10===0){
    syncStorage();}
}, 1000);
}

}

};
function pauseTimer(){
    clearInterval(appState.timerInterval);
   syncStorage();
}

function formatTime(seconds){
let hour=Math.floor(seconds/3600);    
let minutes=Math.floor(seconds/60)%60;
let remainingSeconds=seconds%60;
return `${hour.toString().padStart(2,"0")}:${minutes.toString().padStart(2,"0")}:${remainingSeconds.toString().padStart(2,"0")}`
}

function renderUI(){

    todoListEl.textContent="";

    for(let i=0; i<appState.todoTasks.length;i++){
    const newTask=appState.todoTasks[i].name;
    const li=document.createElement("li");
    const buttonStart=document.createElement("button");
    const buttonDel=document.createElement("button");
    const buttonEdit=document.createElement("button");
    
    buttonStart.addEventListener("click", startTask)
    buttonDel.addEventListener("click", deleteTask)
    buttonEdit.addEventListener("click", editTask)

    buttonStart.classList.add("btn-start");
    buttonDel.classList.add("btn-del");
    buttonEdit.classList.add("btn-edit");

    buttonStart.textContent="+"; 
    buttonDel.textContent="-"; 
    buttonEdit.textContent="edit";

    buttonStart.dataset.id=appState.todoTasks[i].id;
    buttonDel.dataset.id=appState.todoTasks[i].id;
    buttonEdit.dataset.id=appState.todoTasks[i].id;

    li.textContent=newTask;
    todoListEl.appendChild(li); 
    li.appendChild(buttonStart); 
    li.appendChild(buttonDel); 
    li.appendChild(buttonEdit);

    }
currentTasksDpEl.textContent="";
for(let i=0;i<appState.currentTasks.length;i++){
    const li=document.createElement("li");

    const buttonStart=document.createElement("button");
    const buttonDone=document.createElement("button");
    const buttonDel=document.createElement("button");
    
    buttonStart.addEventListener("click", startTimer);
    buttonDone.addEventListener("click", doneTask);
    buttonDel.addEventListener("click", deleteTask);

    buttonStart.classList.add("btn-start");
    buttonDone.classList.add("btn-done");
    buttonDel.classList.add("btn-del");

    buttonStart.dataset.id=appState.currentTasks[i].id;
    buttonDone.dataset.id=appState.currentTasks[i].id;
    buttonDel.dataset.id=appState.currentTasks[i].id;

    buttonStart.textContent="Start";
    buttonDone.textContent="Done"; 
    buttonDel.textContent="-"; 

    const taskName=document.createElement("span")  
    const newCurrentTask=appState.currentTasks[i].name;
    taskName.textContent = newCurrentTask;

    li.appendChild(taskName);
    li.appendChild(buttonStart);
    li.appendChild(buttonDone);
    li.appendChild(buttonDel);
 
    currentTasksDpEl.appendChild(li);
    
}

doneListEl.textContent="";
for(let i=0;i<appState.doneTasks.length;i++){
const newDoneTask=appState.doneTasks[i].name
const buttonDel=document.createElement("button");
const li=document.createElement("li");

buttonDel.addEventListener("click", deleteTask);
buttonDel.dataset.id=appState.doneTasks[i].id;
buttonDel.textContent="Delete";

li.textContent=newDoneTask
li.appendChild(buttonDel)
doneListEl.appendChild(li);
}

    addNewTaskEl.value="";
    taskDescriptionEl.value="";
    timeDurationEl.value="";
    dateTimeDueEl.value="";
}

function syncStorage(){
localStorage.setItem('myTodoTasks',JSON.stringify(appState.todoTasks));
localStorage.setItem('myCurrentTasks',JSON.stringify(appState.currentTasks));
localStorage.setItem('myDoneTasks',JSON.stringify(appState.doneTasks));


}

renderUI();
window.addEventListener("beforeunload", syncStorage);


