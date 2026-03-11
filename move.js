const fs = require('fs');
const path = require('path');

const dirs = {
    'used-[brand]-cars': 'brand/[brand]',
    'used-cars-under-[price]': 'budget/[price]',
    'used-cars-in-[city]': 'location/[city]',
    'used-[body]-cars': 'body/[body]',
    'used-[fuel]-cars': 'fuel/[fuel]',
    'used-[transmission]-cars': 'transmission/[transmission]',
    '[year]-used-cars': 'year/[year]'
};

const base = path.join(process.cwd(), 'src', 'app', '(site)');
const seoBase = path.join(base, '(seo)');

// Ensure (seo) base exists
if (!fs.existsSync(seoBase)) {
    fs.mkdirSync(seoBase, { recursive: true });
}

for (const [oldDir, newPath] of Object.entries(dirs)) {
    const sourcePath = path.join(base, oldDir);
    const targetPath = path.join(seoBase, newPath);

    if (fs.existsSync(sourcePath)) {
        // Create full target directory path
        fs.mkdirSync(targetPath, { recursive: true });

        // Move page.tsx
        const sourceFile = path.join(sourcePath, 'page.tsx');
        if (fs.existsSync(sourceFile)) {
            fs.renameSync(sourceFile, path.join(targetPath, 'page.tsx'));
            console.log(`Moved ${oldDir}/page.tsx to (seo)/${newPath}/page.tsx`);
        }

        // Clean up old dir
        fs.rmSync(sourcePath, { recursive: true, force: true });
        console.log(`Removed empty directory ${oldDir}`);
    } else {
        console.log(`Skipped ${oldDir} - not found`);
    }
}
