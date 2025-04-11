// generate-pwa-icons.js
import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateIcons() {
    const sizes = [192, 512];
    const source = path.join(__dirname, "public", "vite.svg");

    for (const size of sizes) {
        // Create a white background of the correct size
        const background = await sharp({
            create: {
                width: size,
                height: size,
                channels: 4,
                background: { r: 255, g: 255, b: 255, alpha: 1 },
            },
        })
            .png()
            .toBuffer();

        // First resize the SVG
        const resizedIcon = await sharp(source).resize(size, size).toBuffer();

        // Then composite it on the background
        await sharp(background)
            .composite([{ input: resizedIcon }])
            .toFile(path.join(__dirname, "public", `pwa-${size}x${size}.png`));

        console.log(`Generated ${size}x${size} icon`);
    }

    // Create Apple touch icon (180x180)
    const appleBackground = await sharp({
        create: {
            width: 180,
            height: 180,
            channels: 4,
            background: { r: 255, g: 255, b: 255, alpha: 1 },
        },
    })
        .png()
        .toBuffer();

    const resizedAppleIcon = await sharp(source).resize(180, 180).toBuffer();

    await sharp(appleBackground)
        .composite([{ input: resizedAppleIcon }])
        .toFile(path.join(__dirname, "public", "apple-touch-icon.png"));

    console.log("Generated apple-touch-icon.png");
}

generateIcons().catch(console.error);
