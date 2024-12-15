import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    // 定義プロバイダーの登録
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
        // カーソル位置の単語を取得
        const wordRange = document.getWordRangeAtPosition(position);
        if (!wordRange) {
            return undefined;
        }
		console.log({wordRange});
        
        const word = document.getText(wordRange);
        
        // ドキュメント内のすべての行を検索
        for (let i = 0; i < document.lineCount; i++) {
            const line = document.lineAt(i);
            // ターゲット定義の正規表現パターン
            const targetMatch = line.text.match(`^${word}\\s*:`);
            
            if (targetMatch) {
				console.log({line});
                return new vscode.Location(
                    document.uri,
                    new vscode.Position(i, 0)
                );
            }
        }
        
        return undefined;
    }
}