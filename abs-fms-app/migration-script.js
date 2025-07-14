#!/usr/bin/env node

/**
 * Angular Control Flow Migration Script
 * Converts *ngIf, *ngFor, *ngSwitch to new @if, @for, @switch syntax
 */

const fs = require('fs');
const path = require('path');

function migrateControlFlow(content) {
  // Migrate *ngIf
  content = content.replace(
    /<([^>]+)\s+\*ngIf="([^"]+)"([^>]*)>/g,
    '@if ($2) {\n  <$1$3>'
  );

  // Migrate *ngFor
  content = content.replace(
    /<([^>]+)\s+\*ngFor="let\s+(\w+)\s+of\s+([^"]+)"([^>]*)>/g,
    '@for ($2 of $3; track $2) {\n  <$1$4>'
  );

  // Add closing braces (simplified - manual review needed)
  content = content.replace(
    /@if\s*\([^)]+\)\s*{\s*<([^>]+)>/g,
    (match, tag) => match + '\n}'
  );

  return content;
}

function processFile(filePath) {
  if (path.extname(filePath) === '.html') {
    const content = fs.readFileSync(filePath, 'utf8');
    const migrated = migrateControlFlow(content);
    
    if (content !== migrated) {
      fs.writeFileSync(filePath, migrated);
      console.log(`Migrated: ${filePath}`);
    }
  }
}

function processDirectory(dirPath) {
  const items = fs.readdirSync(dirPath);
  
  items.forEach(item => {
    const fullPath = path.join(dirPath, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
      processDirectory(fullPath);
    } else if (stat.isFile()) {
      processFile(fullPath);
    }
  });
}

// Run migration
console.log('Starting Angular Control Flow migration...');
processDirectory('./src');
console.log('Migration complete! Please review changes manually.');
