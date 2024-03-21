const html = document.documentElement;
const checkbox = document.querySelector('#switch_dark-mode');

function applyTheme() {
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    html.classList.add('dark-mode');
    checkbox.checked = true;
  } else {
    html.classList.remove('dark-mode');
    checkbox.checked = false;
  }
}

applyTheme();
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applyTheme);
checkbox.addEventListener('change', function() {
  html.classList.toggle('dark-mode');
});

const inputs = html.querySelectorAll('.inputs_container input');
inputs.forEach(input => {
    input.addEventListener("keyup", function(event){
        if(event.key === "Enter"){
            addStudent();
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const studentsData = JSON.parse(localStorage.getItem('studentsData')) || [];
    studentsData.forEach(student => renderStudent(student));
});

function addStudent(){
    let name = html.querySelector("#name").value;
    let n1 = html.querySelector("#n1").value;
    let n2 = html.querySelector("#n2").value;

    n1 = n1.replace(',', '.');
    n2 = n2.replace(',', '.');

    let name_number_validator = hasNumber(name);

    if(name === null || name === ""){
        showToast("Insira um nome ⚠️");
    } else if (name_number_validator == true) {
        showToast("Nome inválido ❌");
    } else if (n1 == "" || n2 == "") {
        showToast("Insira todas as notas ⚠️");
    } else if (n1 < 0 || n2 < 0 || n1 > 10 || n2 > 10) {
        showToast("Remova notas maiores que 10 ⚠️");
    } else {
        n1 = Number(n1);
        n2 = Number(n2);

        if(isNaN(n1) == true || isNaN(n2) == true){
            showToast("Insira uma nota válida ⚠️");
        } else {
            let average = calcAverage(n1,n2);
            let result = "";

            if(average >= 7 && average <= 10){
                result = "Aprovado";
            } else if(average < 7){
                result = "Reprovado";
            }
            const id = generateUniqueId();
            const student = { id, name, n1, n2, average, result };
            renderStudent(student);

            const studentsData = JSON.parse(localStorage.getItem('studentsData')) || [];
            studentsData.push(student);
            localStorage.setItem('studentsData', JSON.stringify(studentsData));

            html.querySelector("#name").value = "";
            html.querySelector("#n1").value = "";
            html.querySelector("#n2").value = "";
            showToast("Aluno(a) adicionado(a) ✅");
        }
    }
}

function renderStudent(student) {
    let table = html.querySelector('#table');
    let tbody = table.querySelector("tbody");

    tbody.innerHTML += `<tr id='aluno_${student.id}'> 
        <th scope='row' class='th_name-student'> ${student.name} </th> 
        <td class='td_nota-01'> ${student.n1} </td> 
        <td class='td_nota-02'> ${student.n2} </td> 
        <td class='td_media'> ${student.average} </td> 
        <td class='td_result'> ${student.result} </td>
        <td class='td_actions'> <span style='cursor: pointer' class='material-symbols-outlined' onclick='deleteStudent("${student.id}")'>delete</span></tr>`;
}

function calcAverage(...args){
    let average = 0;
    for(let i = 0; i < args.length; i++){
        average += args[i];
    }
    return average / args.length;
}

function showToast(message) {
    const toastElement = html.querySelector('#toast-sleep');
    toastElement.innerHTML = message;
    toastElement.id = "toast-called"
    setTimeout(function () {
        toastElement.id = "toast-back";
        setTimeout(function () {
            toastElement.id = "toast-sleep";
        }, 300);
    }, 1000);
};

function hasNumber(str) {
    return /\d/.test(str);
}

function generateUniqueId() {
    const array = new Uint32Array(8);
    crypto.getRandomValues(array);
    let str = '';
    for (let i = 0; i < array.length; i++) {
        str += (i < 2 || i > 5 ? '' : '-') + array[i].toString(16).slice(-4);
    }
    return str;
}

function deleteStudent(id){
    let studentRow = html.querySelector("#aluno_"+id);
    studentRow.remove();

    const studentsData = JSON.parse(localStorage.getItem('studentsData')) || [];
    const updatedStudentsData = studentsData.filter(student => student.id !== id);
    localStorage.setItem('studentsData', JSON.stringify(updatedStudentsData));

    showToast("Aluno(a) removido(a) ✅");
}
