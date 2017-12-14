/*
    Desc:   The logic js for the Electron app.
    Dev:    Kalin Bowden.
    Date: 11.29.2017.
*/

//
const electron = require('electron');
var app = require('electron').remote;
var dialog = app.dialog;
var fs =  require('fs');
const ipc = electron.ipcRenderer;
console.log('index.js has loaded succsefuly');



function saveFile()
{
    dialog.showSaveDialog((filename) => {
        if (filename === undefined)
        {
            alert('You must give a file a name.');
            return;
        }

        //
        fs.writeFile(filename, createJSONTask(), (err)=>{
            if(err)
            {
                console.log(err)
            }
            alert("The file has been saved!");
        })
    });
}

// Create JSON string
function createJSONTask()
{
    //
    var data = {}
    data.table = [];
    var JsonData;
    var tasks = document.getElementById('task');

    //
    for (var i = 0; i < task.childElementCount; i++)
    {
        console.log(i);
        console.log(task.children[i].children[0].children[0].innerHTML);
        
        data.table.push({'task': task.children[i].children[0].children[0].innerHTML});
    }

    //
    JsonData = JSON.stringify(data);
    console.log(JsonData.toString());

    return JsonData;
}

//
function openFile()
{
    dialog.showOpenDialog((filenames) => {
        if(filenames === undefined)
        {
            alert("No files were selected");
            return;
        }

        readFile(filenames[0]);
    })
}

// JSOn dash file
function readFile(filepath)
{
    fs.readFile(filepath, 'utf-8', (err,data) =>{
        if(err){
            alert('Oops... Looks like something went wrong');
            return;
        }

        //
        console.log('Results: ' + data);
        temp = JSON.parse(data);
        console.log(temp);    
        
        for (var i = 0; i < temp.table.length; i++)
        {
            console.log('try again: ' + temp.table[i].task);

            var li = document.createElement('li');
            li.classList.add('collection-item');
            li.classList.add('z-depth-5');
            li.classList.add('task');
            li.innerHTML = 

            '<div class="row">' +
                        '<div class="col s6">'+temp.table[i].task+'</div>' +
                        '<div class="col s1"></div>' +
                        '<div class="col s1"></div>' +
                        '<div class="col s4"></div>' +
                    '</div>'
                    
            document.getElementById('task').appendChild(li);
        }
    })
}

//----------------------------------------------------------------------
document.getElementById('add').addEventListener('click', _=>{
    ipc.send('addTask');
});

document.getElementById('clear').addEventListener('click', _=>{
    ipc.send('item:clear');
});

document.getElementById('close').addEventListener('click', _=>{
    ipc.send('app:close');
});

document.getElementById('account').addEventListener('click', _=>{
    ipc.send('app:account');
});

document.getElementById('download').addEventListener('click', _=>{
    ipc.send('task:download');
    openFile();
});

document.getElementById('upload').addEventListener('click', _=>{
    ipc.send('task:upload');
    saveFile();
});

document.getElementById('refresh').addEventListener('click', _=>{
    ipc.send('app:refresh');
});

document.getElementById('voice').addEventListener('click', _=>{
    ipc.send('app:voice');
});