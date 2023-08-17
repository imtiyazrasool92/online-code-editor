const express = require('express');
const fs = require('fs');
const { exec } = require('child_process');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
const port = 1000;

app.use(bodyParser.json());

function c_cpp(input, language, filename, res) {
  fs.writeFile('./temp/input.txt', input, (err) => {
    if (err) {
      res.status(500).send({ output: 'Error writing input file.' });
      return;
    }
  });

  const commands = {
    c: 'gcc -o output',
    cpp: 'g++ -o output',
  };

  const compileCommand = commands[language] + ' ' + filename;

  exec(compileCommand, (error, stdout, stderr) => {
    if (error) {
      res.status(500).send({ output: 'Compilation error.' });
      return;
    }

    exec('./output < ./temp/input.txt', (runError, runOutput, runStderr) => {
      if (runError) {
        res.status(500).send({ output: 'Runtime error.' });
      } else if (runOutput) {
        res.send({ output: runOutput });
      } else if (runStderr) {
        res.status(500).send({ output: 'Unknown error.' });
      }
    });
  });
}

function java(input, language, filename, res){
  fs.writeFile('./temp/input.txt', input, (err) => {
    if (err) {
      res.status(500).send({ output: 'Error writing input file.' });
      return;
    }
  });

  const compileCommand = "javac ./temp/Main.java"
  exec(compileCommand,(error,stdout,stderr)=>{
    if (error) {
      console.log(error.message)
      res.status(500).send({ output: 'Compilation error.' });
      return;
    }

    exec('cd temp && java Main < input.txt', (runError, runOutput, runStderr) => {
      if (runError) {
        console.log(runError)
        res.status(500).send({ output: 'Runtime error.' });
      } else if (runOutput) {
        res.send({ output: runOutput });
      } else if (runStderr) {
        res.status(500).send({ output: 'Unknown error.' });
      }
    });
  })
}

function jp(input,language,filename,res){
  fs.writeFile('./temp/input.txt', input, (err) => {
    if (err) {
      res.status(500).send({ output: 'Error writing input file.' });
      return;
    }
  });


  const compileCommand = (language == 'python' ? "python3 " : "node ") + filename
  exec(compileCommand, (runError, runOutput, runStderr) => {
    if (runError) {
      console.log(runError)
      res.status(500).send({ output: 'Runtime error.' });
    } else if (runOutput) {
      res.send({ output: runOutput });
    } else if (runStderr) {
      res.status(500).send({ output: 'Unknown error.' });
    }
  });
}

app.post('/compile', (req, res) => {
  const { code, input, language } = req.body;
  const filePath = path.join(__dirname, 'temp');

  const extName = {
    c: ['c', 'app'],
    cpp: ['cpp', 'app'],
    java: ['java', 'Main'],
    javascript: ['js', 'app'],
    python: ['py', 'app'],
  };

  const filename = path.join(filePath, `${extName[language][1]}.${extName[language][0]}`);

  fs.writeFile(filename, code, (err) => {
    if (err) {
      console.log('Error while creating files');
      res.status(500).send({ output: 'Error while creating files.' });
      return;
    }

    if (language === 'c' || language === 'cpp') {
      c_cpp(input, language, filename, res);
    }else if(language == 'java'){
      java(input,language,filename,res)
    }else if(language == 'javascript' || language == 'python')
      jp(input,language,filename,res)
    else {
      res.send({ouptut : "Something went wrong"})
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
