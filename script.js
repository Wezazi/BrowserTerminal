const terminalBody = document.getElementById('terminal__body');

let currentUser = "guest"
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
                    "file.txt" : "Hello this is a normal text file",
                    "fruits.txt": "My favorite fruits are apples and oranges" 

                },
                Downloads: {

                }
            }
        },

        root: {},
    }
}


function traverseAbsolute(path, command = "cmd"){
    
    // Split the path into directory names
    let directories = path.split("/").filter(Boolean); //.filter(Boolean) removes empty strings from the results

    
    let directory = fileManager["/"]; 

    /*The value in directories have index based on how many nesting layers they are, e.g. index 0 is a folder directly after / while index 1 is one extra folder away*/
    for(let folder of directories){
        directory = directory[folder]
    }
    
    if (directory){
        if (command == "cmd"){
            currentDirectory = path;
            return(directory) //returns object
        }
        else{
            return(directory) //returns object
        }
    }
    else{
        return "no such file or directory";
    }

    
    
}
//console.log(traverseAbsolute("/home/guest"));


function traverseRelative(path, command = "cmd"){
    
    let directories = currentDirectory.split("/").filter(Boolean);

    let pathParts = path.split("/").filter(Boolean);

    for (let folder of pathParts){

        if (folder == ".."){
            directories.pop();
        }
        else if (folder == "."){
            continue;
        }
        else{
            directories.push(folder);
        }
    }

    let absolutePath = "/" + directories.join("/");
    if (command == "cmd"){
        return traverseAbsolute(absolutePath);
    }
    else{
        return traverseAbsolute(absolutePath, command);
    }

    
    
}
//console.log(JSON.stringify(traverseRelative("..")));
//console.log(traverseRelative("guest"));

//Prevents the content inside the terminalbody from overflowing, when the body is full, the oldest prompt + output gets overwritten by the second oldest pair
function preventOverflow() {
    while (terminalBody.scrollHeight > terminalBody.clientHeight) {
        const firstPrompt = terminalBody.firstElementChild;
        if (!firstPrompt) break;

        const output = firstPrompt.nextElementSibling;

        firstPrompt.remove();
        if (output) output.remove();
    }
}


function createPrompt(){
    const prompt = document.createElement('div');
    prompt.id = 'terminal__prompt';
    prompt.innerHTML = `
        <span id="terminal__prompt--user">${currentUser}@ubuntu:</span>
        <span id="terminal__prompt--location">${currentDirectory.startsWith(homeDirectory) ? currentDirectory.replace(homeDirectory, "~") : currentDirectory}</span> <!--If the currentDirectory is homeDirectory the console outputs ~-->
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

            const commandParts = commandText.trim().split(" ");
            let run;
            switch(commandParts[0].toLowerCase()){
                case "whoami":
                    output.textContent = currentUser;
                    break;

                case "pwd":
                    output.textContent = currentDirectory;
                    break;

                case "cd":
                    
                    if(commandParts[1]){
                        if (commandParts[1].startsWith("/")){
                            run = traverseAbsolute(commandParts[1]);
                        }
                        else{
                            run = traverseRelative(commandParts[1]);
                        }

                        if (typeof(run) == "string"){
                            output.textContent = run;
                        }
                        else{
                            output.textContent = "\u00A0";
                        }
                    }
                    else{
                        output.textContent = "\u00A0";
                    }

                    break;

                case "ls":
                    if(commandParts[1]){
                        if (commandParts[1].startsWith("/")){
                            run = traverseAbsolute(commandParts[1], "ls");
                        }
                        else{
                            run = traverseRelative(commandParts[1], "ls");
                        }

                        if (typeof(run) == "string"){
                            output.textContent = run;
                        }
                        else{
                            output.textContent = Object.keys(run).join("  ");
                            
                        }
                    }
                    else{
                        run = traverseAbsolute(currentDirectory, "ls");
                        output.textContent = Object.keys(run).join("  ");
                    }
                    break

                case "cat":
                    console.log("hello");


                default:
                    if (commandText){
                        output.textContent = "command not found";
                    }
                    else{
                        output.textContent = "\u00A0";
                    }
                  
                    break;
            };
            terminalBody.appendChild(output);
            

            createPrompt(); //Creating the new prompt will make a new terminal_prompt and append it to the body which will make it appear after the previous command output
            preventOverflow();
        }
    });
}

createPrompt();
