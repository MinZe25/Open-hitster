const fs = require('fs');
const path = require('path');

const DATA_DIR = '.';
const OUTPUT_DIR = 'card';
const DEFAULT_LANGUAGE = 'en';

function generate() {
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json') && f !== 'package.json');

    files.forEach(file => {
        const sku = path.basename(file, '.json');
        const content = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));

        // Assume the file contains an array of cards
        if (Array.isArray(content)) {
            content.forEach(card => {
                const cardNumber = card.card_number;
                if (!cardNumber) return;

                const skuDir = path.join(OUTPUT_DIR, DEFAULT_LANGUAGE, sku);

                if (!fs.existsSync(skuDir)) {
                    fs.mkdirSync(skuDir, { recursive: true });
                }

                const outputPath = path.join(skuDir, cardNumber + '.json');
                fs.writeFileSync(outputPath, JSON.stringify(card, null, 2));
                console.log(`Generated: ${outputPath}`);
            });
        }
    });
}

generate();
