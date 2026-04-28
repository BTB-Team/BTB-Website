const btn = document.getElementById("themeToggle");
const root = document.documentElement;

btn.addEventListener("click", ()=>{

   root.classList.toggle("dark");

   if(root.classList.contains("dark")){
      btn.innerHTML="Light";
   }else{
      btn.innerHTML="Dark";
   }

});

