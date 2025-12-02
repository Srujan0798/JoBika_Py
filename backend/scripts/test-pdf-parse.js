const fs = require('fs');
const pdfParse = require('pdf-parse');
const path = require('path');

async function testPdfParse() {
    console.log('🚀 Testing pdf-parse...');
    try {
        // Create a dummy PDF buffer (since we might not have a real PDF)
        // Actually, pdf-parse might fail on invalid PDF data.
        // Let's try to parse a simple string buffer, it should fail but NOT crash with DOMMatrix error.
        // Or better, check if we have the dummy.pdf I created earlier.

        const dummyPath = path.join(__dirname, '../dummy.pdf');
        if (!fs.existsSync(dummyPath)) {
            console.log('⚠️ dummy.pdf not found, creating one...');
            fs.writeFileSync(dummyPath, '%PDF-1.4\n%...\n%%EOF'); // Minimal fake PDF
        }

        const dataBuffer = fs.readFileSync(dummyPath);

        console.log('📄 Parsing PDF...');
        const data = await pdfParse(dataBuffer);

        console.log('✅ PDF Parsed Successfully!');
        console.log('Text content:', data.text);

    } catch (error) {
        console.error('❌ Parsing Error:', error.message);
        if (error.message.includes('DOMMatrix')) {
            console.error('🚨 CRITICAL: DOMMatrix error still present!');
            process.exit(1);
        }
        // If it's a "Invalid PDF" error, that's fine, it means the library loaded and tried to parse.
        if (error.message.includes('Invalid PDF structure') || error.name === 'InvalidPDFException') {
            console.log('✅ Library loaded and attempted parse (Invalid PDF is expected for dummy file)');
        }
    }
}

testPdfParse();
