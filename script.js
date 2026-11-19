const terminalBody = document.getElementById('terminal__body');

let currentUser = "root"
let homeDirectory;

if (currentUser == "root"){
    homeDirectory = "/root"

}
else{
    homeDirectory = `/home/${currentUser}`;
}

let currentDirectory = homeDirectory;

const fileManager = {
    "/":{
        home: {
            guest: {
                Desktop: {

                },
                Documents: {

                },
                Downloads: {

                }
            }
        },

        root: {},
    }
}


function createPrompt(){
    const prompt = document.createElement('div');
    prompt.id = 'terminal__prompt';
    prompt.innerHTML = `
        <span id="terminal__prompt--user">${currentUser}@ubuntu:</span>
        <span id="terminal__prompt--location">${currentDirectory == homeDirectory ? "~" : currentDirectory}</span> <!--If the currentDirectory is homeDirectory the console outputs ~-->
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

            
            //Creates a div and creates an if statement to decide what its texcontent should be before adding it to the dom
            const output = document.createElement('div');
            
            switch(commandText.toLowerCase()){
                case "whoami":
                    output.textContent = currentUser;
                    break;

                


                default:
                    output.textContent = commandText;
                    break;
            };
            terminalBody.appendChild(output);

            createPrompt(); //Creating the new prompt will make a new terminal_prompt and append it to the body which will make it appear after the previous command output

        }
    });
}

createPrompt();
