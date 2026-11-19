const terminalBody = document.getElementById('terminal__body');


function createPrompt(){
    const prompt = document.createElement('div');
    prompt.id = 'terminal__prompt';
    prompt.innerHTML = `
        <span id="terminal__prompt--user">fobabs@ubuntu:</span>
        <span id="terminal__prompt--location">~</span>
        <span id="terminal__prompt--bling">$</span>
        <input type="text" id="terminal__input" autofocus>
        
    `;
    terminalBody.appendChild(prompt);

    const terminalInput = prompt.querySelector('#terminal__input'); //we use prompt.querySelector instead of document.getElementById so that search inside the prompt that we created instead of the whole document
    terminalInput.focus(); //<input type="text" id="terminal__input" autofocus> will only autofocus the first input, terminalInput.focus() solves this problem

    terminalInput.addEventListener('keydown', function(event) {
        if (event.key == 'Enter') {

            //Creates span with containing texcontent of the input value, the span then replaces the input so that the user can't type anything else
            const commandText = terminalInput.value;
            const command = document.createElement('span')
            command.textContent = commandText;
            terminalInput.replaceWith(command);


            //Creates a div (which will appear in a new line) and adds it to the dom. The div has textcontent of the input value
            const output = document.createElement('div');
            output.textContent = commandText;
            terminalBody.appendChild(output);

            //calls the function again
            createPrompt();

        }
    });
}

createPrompt();
