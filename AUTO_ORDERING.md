# Automatic Ordering Feature

This theme now supports automatic ordering of documentation content based purely on file system structure, eliminating the need for manual `weight` parameters in front matter.

## How It Works

When `autoOrdering = true` is set in your site configuration, the theme will:

1. **Sort sections and pages by file path** - Content is ordered alphabetically by directory structure
2. **Respect file system hierarchy** - The order follows the natural directory structure
3. **No hardcoded ordering** - No predefined section lists or manual weight management

## Configuration

Add this to your `hugo.toml` or `config.toml`:

```toml
[params]
  # Enable automatic ordering based purely on file system structure
  autoOrdering = true
```

## Benefits

- **No manual weight management** - Never worry about setting or updating weight values
- **Predictable ordering** - Content order follows your file system structure
- **Easy reorganization** - Simply rename or move directories to reorder content
- **Consistent across environments** - Ordering is the same regardless of build environment

## File System Ordering

The automatic ordering sorts content by:

1. **Directory path** - `content/docs/configuration/` comes before `content/docs/user-guides/`
2. **File name** - `authentication.md` comes before `users.md` within the same directory
3. **Nested structure** - Subsections are processed before individual pages

## Example Structure

```
content/docs/
├── getting-started/          # Appears first
│   ├── _index.md
│   └── installation.md
├── configuration/            # Appears second
│   ├── _index.md
│   ├── authentication/
│   │   ├── _index.md
│   │   └── oidc.md          # Sorted by filename
│   └── users.md
└── user-guides/             # Appears third
    ├── _index.md
    └── advanced.md
```

## Fallback to Weights

If `autoOrdering = false` or is not set, the theme falls back to the original weight-based ordering using Hugo's `.ByWeight` function.

## Migration

To migrate from weight-based to automatic ordering:

1. Set `autoOrdering = true` in your configuration
2. Remove all `weight` parameters from your content front matter
3. Reorganize your file system structure as needed
4. The theme will automatically sort everything by directory structure
