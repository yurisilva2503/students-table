const html = document.documentElement;
const checkbox = html.querySelector('#switch_dark-mode');
const btnAddStudent = html.querySelector("#btn_add-student");
const btnEditStudent = html.querySelector('#btn_update-student');
const toastElement = html.querySelector('#toast-sleep');
const table = html.querySelector('#table');
const tbody = table.querySelector("tbody");

btnEditStudent.style.display = 'none';
let editingStudentId = null;
applyTheme();

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applyTheme);
checkbox.addEventListener('change', function() {
    const label = document.querySelector(".inputs_container label");
    if (this.checked) {
        label.innerHTML = "toggle_on";
        label.style.color = "white";
    } else {
        label.innerHTML = "toggle_off";
        label.style.color = "black";
    }
    html.classList.toggle('dark-mode');
});

function applyTheme() {
    const label = document.querySelector(".inputs_container label");
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        html.classList.add('dark-mode');
        checkbox.checked = true;
        label.innerHTML = "toggle_on";
        label.style.color = "white";
    } else {
        html.classList.remove('dark-mode');
        checkbox.checked = false;
        label.innerHTML = "toggle_off";
        label.style.color = "black";
    }
}

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

            const studentsData = JSON.parse(localStorage.getItem('studentsData')) || [];
            const existingStudent = studentsData.find(student => student.name === name);
            if (existingStudent) {
                showToast("Este aluno já existe ⚠️");
            } else {
                const id = generateUniqueId();
                const student = { id, name, n1, n2, average, result };

                studentsData.push(student);
                localStorage.setItem('studentsData', JSON.stringify(studentsData));

                renderStudent(student);

                html.querySelector("#name").value = "";
                html.querySelector("#n1").value = "";
                html.querySelector("#n2").value = "";
                showToast("Aluno(a) adicionado(a) ✅");
            }
        }
    }
}

function renderStudent(student) {
    tbody.innerHTML += `<tr id='aluno_${student.id}'> 
        <th scope='row' class='th_name-student'> ${student.name} </th> 
        <td class='td_nota-01'> ${student.n1} </td> 
        <td class='td_nota-02'> ${student.n2} </td> 
        <td class='td_media'> ${student.average} </td> 
        <td class='td_result'> ${student.result} </td>
        <td class='td_actions'> <span class='material-symbols-outlined -delete' onclick='deleteStudent("${student.id}")'>delete</span> <span class='material-symbols-outlined -edit' onclick='editStudent("${student.id}")'>edit</span></tr>`;
}

function calcAverage(...args){
    let average = 0;
    for(let i = 0; i < args.length; i++){
        average += args[i];
    }
    return average / args.length;
}

function showToast(message) {
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

function editStudent(id) {
    const studentsData = JSON.parse(localStorage.getItem('studentsData')) || [];
    const student = studentsData.find(student => student.id === id);

    if (student) {
        html.querySelector("#name").value = student.name;
        html.querySelector("#n1").value = student.n1;
        html.querySelector("#n2").value = student.n2;
        btnAddStudent.style.display = 'none';
        btnEditStudent.style.display = 'block';
        editingStudentId = id;
    }
}

function updateStudent() {
    const name = html.querySelector("#name").value;
    let n1 = html.querySelector("#n1").value;
    let n2 = html.querySelector("#n2").value;

    n1 = n1.replace(',', '.');
    n2 = n2.replace(',', '.');

    const nameNumberValidator = hasNumber(name);

    if (name === null || name === "") {
        showToast("Insira um nome ⚠️");
    } else if (nameNumberValidator) {
        showToast("Nome inválido ❌");
    } else if (n1 === "" || n2 === "") {
        showToast("Insira todas as notas ⚠️");
    } else if (n1 < 0 || n2 < 0 || n1 > 10 || n2 > 10) {
        showToast("Remova notas maiores que 10 ⚠️");
    } else {
        const studentsData = JSON.parse(localStorage.getItem('studentsData')) || [];
        const studentIndex = studentsData.findIndex(student => student.id === editingStudentId);

        if (studentIndex !== -1 && studentsData[studentIndex]) {
            n1 = Number(n1);
            n2 = Number(n2);

            if (isNaN(n1) || isNaN(n2)) {
                showToast("Insira uma nota válida ⚠️");
            } else {
                const average = calcAverage(n1, n2);
                let result = "";

                if (average >= 7 && average <= 10) {
                    result = "Aprovado";
                } else if (average < 7) {
                    result = "Reprovado";
                }

                studentsData[studentIndex].name = name;
                studentsData[studentIndex].n1 = n1;
                studentsData[studentIndex].n2 = n2;
                studentsData[studentIndex].average = average;
                studentsData[studentIndex].result = result;

                localStorage.setItem('studentsData', JSON.stringify(studentsData));

                const editedRow = html.querySelector(`#aluno_${editingStudentId}`);
                editedRow.innerHTML = `<th scope='row' class='th_name-student'> ${name} </th> 
                                       <td class='td_nota-01'> ${n1} </td> 
                                       <td class='td_nota-02'> ${n2} </td> 
                                       <td class='td_media'> ${average} </td> 
                                       <td class='td_result'> ${result} </td>
                                       <td class='td_actions'> <span style='cursor: pointer' class='material-symbols-outlined -delete' onclick='deleteStudent("${editingStudentId}")'>delete</span> <span style='cursor: pointer' class='material-symbols-outlined -edit' onclick='editStudent("${editingStudentId}")'>edit</span></tr>`;

                showToast("Aluno(a) atualizado(a) ✅");
                html.querySelector("#name").value = "";
                html.querySelector("#n1").value = "";
                html.querySelector("#n2").value = "";
                btnAddStudent.style.display = 'block';
                btnEditStudent.style.display = 'none';
                editingStudentId = null;
            }
        }
    }
}

