import * as assert from 'assert';
import * as vscode from 'vscode';
import * as path from 'path';
import MakefileDefinitionProvider from '../extension';

suite('Makefile Target Jump Extension Tests', () => {
    const fixturesPath = path.resolve(__dirname, '../../src/test/fixtures');
    let provider: MakefileDefinitionProvider;

    suiteSetup(async () => {
        // 拡張機能のアクティベート
        const ext = vscode.extensions.getExtension('naoyashiga.makefile-definition-jump');
        await ext?.activate();
        provider = new MakefileDefinitionProvider();
    });

    test('Extension should be active', async () => {
        const ext = vscode.extensions.getExtension('naoyashiga.makefile-definition-jump');
        assert.ok(ext);
        assert.strictEqual(ext?.isActive, true);
    });

    suite('Definition Provider', () => {
        test('Should find target after make command', async () => {
            const content = `
.PHONY: setup
setup:
    @echo "Setup"
make setup
`;
            const doc = await vscode.workspace.openTextDocument({
                content,
                language: 'makefile'
            });
            await vscode.window.showTextDocument(doc);

            const position = new vscode.Position(4, 7);
            const definition = await provider.provideDefinition(
                doc,
                position,
                new vscode.CancellationTokenSource().token
            );

            assert.notStrictEqual(definition, undefined);
            assert.strictEqual((definition as vscode.Location).range.start.line, 2);
        });

        test('Should not find definition when not after make command', async () => {
            const content = `
.PHONY: setup
setup:
    @echo "Setup"
echo setup
`;
            const doc = await vscode.workspace.openTextDocument({
                content,
                language: 'makefile'
            });
            await vscode.window.showTextDocument(doc);

            const position = new vscode.Position(4, 7);
            const definition = await provider.provideDefinition(
                doc,
                position,
                new vscode.CancellationTokenSource().token
            );

            assert.strictEqual(definition, undefined);
        });

        test('Should handle make command with arguments', async () => {
            const content = `
.PHONY: setup
setup:
    @echo "Setup"
make -j4 setup VERBOSE=1
`;
            const doc = await vscode.workspace.openTextDocument({
                content,
                language: 'makefile'
            });
            await vscode.window.showTextDocument(doc);

            const position = new vscode.Position(4, 11);
            const definition = await provider.provideDefinition(
                doc,
                position,
                new vscode.CancellationTokenSource().token
            );

            assert.notStrictEqual(definition, undefined);
            assert.strictEqual((definition as vscode.Location).range.start.line, 2);
        });

//         test('Should handle variable targets', async () => {
//             const content = `
// TARGET = setup
// .PHONY: $(TARGET)
// $(TARGET):
//     @echo "Variable target"
// make setup
// `;
//             const doc = await vscode.workspace.openTextDocument({
//                 content,
//                 language: 'makefile'
//             });
//             await vscode.window.showTextDocument(doc);

//             const position = new vscode.Position(5, 7);
//             const definition = await provider.provideDefinition(
//                 doc,
//                 position,
//                 new vscode.CancellationTokenSource().token
//             );

//             assert.notStrictEqual(definition, undefined);
//             assert.strictEqual((definition as vscode.Location).range.start.line, 3);
//         });

//         test('Should handle multiple targets in one line', async () => {
//             const content = `
// .PHONY: setup test
// setup test:
//     @echo "Multiple targets"
// make setup
// `;
//             const doc = await vscode.workspace.openTextDocument({
//                 content,
//                 language: 'makefile'
//             });
//             await vscode.window.showTextDocument(doc);

//             const position = new vscode.Position(4, 7);
//             const definition = await provider.provideDefinition(
//                 doc,
//                 position,
//                 new vscode.CancellationTokenSource().token
//             );

//             assert.notStrictEqual(definition, undefined);
//             assert.strictEqual((definition as vscode.Location).range.start.line, 2);
//         });

        test('Should handle empty file', async () => {
            const content = 'make setup';
            const doc = await vscode.workspace.openTextDocument({
                content,
                language: 'makefile'
            });
            await vscode.window.showTextDocument(doc);

            const position = new vscode.Position(0, 7);
            const definition = await provider.provideDefinition(
                doc,
                position,
                new vscode.CancellationTokenSource().token
            );

            assert.strictEqual(definition, undefined);
        });
    });
});