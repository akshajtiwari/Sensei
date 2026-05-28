import * as vscode from 'vscode';
import { checkOllamaHealth } from './ollama/healthCheck';
import { setupPanel } from './ui/setupPanel';
import { StatusBarManager } from './ui/statusBar';
import { registerSetIntent, registerResetSession } from './commands/setIntent';
import { exec } from 'child_process';
import { ChildProcess } from 'child_process';
import { error } from 'console';
import { resolve } from 'path';
export async function activate(context: vscode.ExtensionContext) {
  console.log('Sensei is active.');




  // 1. Check if ollama exits
  const ollamaRunning = await checkOllamaHealth();

  function checkversion():Promise<boolean>{
    return new Promise((resolve)=>{
      exec('ollama --version',(error)=>{
      resolve(!error);
    });
    });
  };
  function ollama():Promise<boolean>{
    return new Promise((resolve)=>{
      exec('ollama',(error)=>{
        resolve(!error);
      });
    });
  };


  if (!ollamaRunning) { //Prompt if ollama is not installed
    const checkver= await checkversion();
    if(!checkver){
      try{
        const download_action=await vscode.window.showWarningMessage(
          'Sensei needs Ollama to work. Please install below',
          'Download Ollama'
        );
        if (download_action=='Download Ollama')
        {
          vscode.env.openExternal(vscode.Uri.parse('https://ollama.com'))
        }
          vscode.window.showInformationMessage(
          'After installing Ollama, reload VS Code to activate Sensei.'
        );
      }
      catch(error: unknown){
        console.error("unexpected error occurred", error);
      }
    }
    else //ollama is not running
      {
      const run_ollama=await vscode.window.showWarningMessage("Ollama is not running",'Start Ollama');
      if(run_ollama=='Start Ollama'){
        const start_ollama=await ollama();
        if(!start_ollama){
          vscode.window.showWarningMessage("ollama could not start please start manually")
        }
      }
      }
  }
  // 2. Check if ollama is running 
  // 2. Check if a model is already configured
  const config = vscode.workspace.getConfiguration('sensei');
  const selectedModel = config.get<string>('model');

  if (!selectedModel) {
    // First time — show setup panel
    setupPanel(context);
    return;
  }

  // 3. Ollama running + model set — initialize core
  StatusBarManager.init(context);
  registerSetIntent(context);
  registerResetSession(context);

  vscode.window.showInformationMessage(`Sensei is watching. Model: ${selectedModel}`);
}

export function deactivate() {}
