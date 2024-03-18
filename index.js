const html = document.querySelector('html');
const checkbox = html.querySelector('#switch_dark-mode');
checkbox.addEventListener('change', function(){
    html.classList.toggle('dark-mode');
})

const inputs_container = html.querySelector('.inputs_container');
const inputs = inputs_container.querySelectorAll('input');
inputs.forEach(input => {
    input.addEventListener("keyup", function(event){
        if(event.key === "Enter"){
            addStudent();
        }
    });
});

function addStudent(){
    let counter = 0;
    let name = html.querySelector("#nome").value;
    let n1 = html.querySelector("#nota_01").value;
    let n2 = html.querySelector("#nota_02").value;

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

            let table = html.querySelector('#table');
            let tbody = table.querySelector("tbody");

            if(average >= 7 && average <= 10){
                result = "Aprovado";
            } else if(average < 7){
                result = "Reprovado";
            }

            tbody.innerHTML += `<tr id='aluno_${counter}'> 
            <th scope='row' class='th_nome'> ${name} </th> 
            <td class='td_nota-01'> ${n1} </td> 
            <td class='td_nota-02'> ${n2} </td> 
            <td class='td_media'> ${average} </td> 
            <td class='td_result'> ${result} </td> </tr>`;
            counter += 1;

            html.querySelector("#nome").value = "";
            html.querySelector("#nota_01").value = "";
            html.querySelector("#nota_02").value = "";
            showToast("Aluno(a) adicionado(a) ✅");
        }
    }
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