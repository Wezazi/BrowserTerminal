const terminalBody = document.getElementById('terminal__body');


const prompt = document.createElement('div');
prompt.id = 'terminal__prompt';
prompt.innerHTML = `
    <span id="terminal__prompt--user">fobabs@ubuntu:</span>
    <span id="terminal__prompt--location">~</span>
    <span id="terminal__prompt--bling">$</span>
    <input type="text" id="terminal__input" autofocus>
    
`;
terminalBody.appendChild(prompt);
//The reason we add the terminal prompt through js instead of writing the html above to index.html is because everytime we write a command and get a output, we want the terminal prompt to appear after the output.



//Now that the input with id terminal__input has been added to the dom. we can get it by ID:
const terminalInput = document.getElementById('terminal__input');

//Triggers when user presses a key inside the terminal input
terminalInput.addEventListener('keydown', function(event) {

    //If the pressed key is enter, a new div element is gonna get created with the textcontent of the input value and added to the terminal div. the value is then removed from the input
    if (event.key == 'Enter') {
        const command = terminalInput.value;
        const output = document.createElement('div');
        output.textContent = command;

        terminalBody.appendChild(output);
        terminalInput.value = '';
    }
});