import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    const provider = new MakefileDefinitionProvider();
    const selector = { language: 'makefile', scheme: 'file' };
    
    context.subscriptions.push(
        vscode.languages.registerDefinitionProvider(selector, provider)
    );
}

class MakefileDefinitionProvider implements vscode.DefinitionProvider {
    async provideDefinition(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken
    ): Promise<vscode.Definition | undefined> {
		// get the range of the word at the current position
        const wordRange = document.getWordRangeAtPosition(position);
        if (!wordRange) {
            return undefined;
        }

        const word = document.getText(wordRange);
		// get the line of the current position
		const line = document.lineAt(position.line);
		// get the text before the word
		const linePrefix = line.text.substring(0, wordRange.start.character);

		// Check if end of the line prefix is a make command
		const isMakeCommand = linePrefix.match(/^\s*make\s+/);

		if (!isMakeCommand) {
			return undefined;
		}
        
		// Search all lines in the document
        for (let i = 0; i < document.lineCount; i++) {
            const line = document.lineAt(i);
			// Check if the line starts with the word followed by a colon
            const targetMatch = line.text.match(`^${word}\\s*:`);
            
            if (targetMatch) {
                return new vscode.Location(
                    document.uri,
                    new vscode.Position(i, 0)
                );
            }
        }
        
        return undefined;
    }
}