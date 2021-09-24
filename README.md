# CLI-TOOL-LinusConfig2.0
Updated version of CLI-TOOL-CONFIG


## --- IF INSTALLED GLOBALLY --- 
When you've installed it globally you will be able to type ```LinusConfig``` and ```LinusConfig-extra```.

### LinusConfig
When you type **LinusConfig** in your terminal a menu will show up. You will be able to choose between different templates. <br/> By default there will be two templates available ***Express*** and ***HTML-CSS-JS*** <br/>
The ***Express*** template will generate some files to get you started with your *express-app*. <br/>
The ***HTML-CSS-JS*** template will generate three different files. One **HTML**, **CSS** and **JavaScript**.

### LinusConfig-extra
When you type ```LinusConfig-extra``` in your terminal a menu will show up with three different options.
  - Add new template
  - Edit existing template
  - Delete a template
 
## Add new template <br/>
This option will make it possible for you to create your own template. You will be asked for a name for the new template *(if you don't pick a name, a name will be generated for you)*.
After you've chosen a name, you will be asked to add files to your new template. The file(s) have to be in the same folder you run the command in *(If you use the path you don't need the files to be in the same folder you run the command in)*.
When you're done adding files. The new template will now appear in the template menu when you type ```LinusConfig```.

## Edit existing template <br/>
If you choose this option you have to pick one of the templates that you have available. <br/>

![linusconfig-edittemplate_updated](https://user-images.githubusercontent.com/64322505/134691031-5f85d908-d63c-4553-97d1-94cb4fcd75d5.png)



After you've picked a template.
You'll get the following options:

![linusconfig_editTemplateOptions](https://user-images.githubusercontent.com/64322505/134691862-5efd9d93-5ced-4ac7-b18a-c1f62afae774.png)



`Add file`\
This option will make it possible to add file(s) to the selected template. *(The file(s) needs to be in the same folder you run the command in. If you use the path you don't need the files to be in the same folder you run the command in)* <br/> If you add a file to a template where a file with that name already exists, you'll get the following menu <br/>

![linusconfig-sameFilename](https://user-images.githubusercontent.com/64322505/134518998-1e7cbead-74bf-44e5-9603-30fb4ef1ac50.png)

  - Change name, this option will change the name of the uploaded file and not affect any other file in that template.
  - Overwrite, this option will overwrite the already existing file with the new uploaded file.
  - Skip, this option will skip uploading the new file and not affect the old file in that template.



`Delete file`\
This option will show a list of available files in the selected template.
After you've picked a file, you'll be asked if you want to delete it or not.

`Change template name`\
This option will make it possible to pick a new name for the selected template.
*You will **NOT** be able pick the same name as an already existing template* <br/>
*(It will not affect the files inside the template)*

## Delete a template
This option will show you a list of templates available. After you've selected a template it will remove the template and **ALL** files inside.


