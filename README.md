# CLI-TOOL-LinusConfig2.0
Updated version of CLI-TOOL-CONFIG


##--- IF INSTALLED GLOBALLY -- 
When you've installed it globally you will be able to type ```LinusConfig``` and ```LinusConfig-create```.

######LinusConfig
When you type **LinusConfig** in your terminal a menu will show up. You will be able to choose between different templates. By default there will be two templates *Express* and *Static-website*.
The *Express* template will generate some files to get you started with your *express-app*. 
The *Static-website* template will generate three different files. One **HTML**, **CSS** and **JavaScript**.

######LinusConfig-create
When you type ```LinusConfig-create``` in your terminal a menu will show up with three different alternatives.
  - Add new template
  - Edit existing template
  - Delete a template
 
*Add new template* will make it possible for you to create your own template. You will be asked for a name for the new template *(if you don't pick a name, a name will be generated for you)*.
After you've chosen a name, you will be asked to add files to your new template. The file(s) needs to be in the same folder you run the command in *(using the path of the file does **NOT** work at the moment.)*.
When you're done adding files. The new template will now appear in the template menu when you type ```LinusConfig```.

*Edit existing template*
If you choose this option you have to pick one of the templates that you have available.
![Image of menu](https://gyazo.com/be66c4d4c9f026edf1ed6de16eb6b16f)

After you've picked a template.
You'll get the following options:
![Image of menu](https://gyazo.com/6ccaeeb27ee4f0222ac3ce8e265f9d89)

*Add file*
You'll be able to add file(s) to the selected template. *(The file(s) needs to be in the same folder you run the command in. Since using the path does **NOT** work for now.)*

*Delete file*
You'll get a list of available files in the selected template.
After you've picked a file, you'll be asked if you want to delete it or not.

*Change template name*
You'll be able to pick a new name for the selected template.
*You'll **NOT** be able pick the same name as an existing template*

