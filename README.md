# Makefile Target Jump

A Visual Studio Code extension that enables jumping to makefile target definitions when using `make` commands.

## Features

This extension allows you to:
- Jump to target definitions in Makefiles when your cursor is on a target name after the `make` command
- Works with basic makefile targets

Example:
```makefile
# You can jump from this line...
make setup

# ...to this target definition
setup:
    @echo "Running setup"
```

## Usage

1. Place your cursor on any target name after a `make` command
2. Use one of the following methods to jump to the definition:
   - Press F12
   - Right-click and select "Go to Definition"
   - Ctrl+Click (Cmd+Click on macOS) on the target name

## Current Limitations

The extension currently supports:
- Basic target definitions
- Targets with simple commands
- Jumping to definitions within the same file

Not yet supported:
- Variable-based targets (e.g., `$(TARGET):`)
- Multiple targets in one line (e.g., `target1 target2:`)
- Cross-file definition jumping

## Requirements

- Visual Studio Code version 1.96.0 or higher

## Extension Settings

This extension does not contribute any settings yet.

## Known Issues

Please report any issues on the GitHub repository.

## Release Notes

### 0.0.1

Initial release:
- Basic target definition jumping functionality
- Support for simple makefile targets

---

## Contributing

Feel free to open issues or submit pull requests on GitHub.

## License

This extension is licensed under the MIT License.