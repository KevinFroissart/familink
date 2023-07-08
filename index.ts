import puppeteer from 'puppeteer'
import config from './config.json'
import * as fs from 'fs'
import https from 'https'

async function sleep(ms: number): Promise<void> {
	await new Promise(ok => setTimeout(() => ok(null), ms))
}

const download = (url: string, destination: any) => new Promise((resolve, reject) => {
	const file = fs.createWriteStream(destination, { flags: 'a+' });

	try {
		https.get(url, response => {
			response.pipe(file);

			file.on('finish', () => {
				file.close()
				resolve(true)
			});
		})
	} catch (e) {
		console.log(e)
	}
});

async function scrapImages() {
	// Ouverture du navigateur
    const browser = await puppeteer.launch({ headless: config.headless })
    try {
        // On se dirige sur la page de login
        const page = await browser.newPage()
		await page.goto('https://app.familinkframe.com/fr/login')
		await sleep(100)
		console.log('Page loaded')

        try {
            // On récupère le champ de login et de password et on les remplit
			await page.waitForSelector('familink-input[controlname="email"] input');
			await page.type('familink-input[controlname="email"] input', config.login, { delay: 25 });
			await page.type('familink-input[controlname="password"] input', config.password, { delay: 25 });
			
            // On envoie le formulaire
			await Promise.all([
				page.waitForNavigation(), // Attendre la redirection après soumission du formulaire
				page.click('.submit-button-container button[type="submit"]'),
			]);

            // On attends la redirection
            while (true) {
				try {
					const url = await page.evaluate(() => location.href)
					if (url.match('https://app.familinkframe.com/fr/devices')) break
				} catch (e) {
					console.log(e)
				}
				await sleep(100)
			}
        } catch (e) {
            console.log('Login Error', e)
        }

		{
			let result;
			await page.goto('https://app.familinkframe.com/fr/devices/16961/pictures')
			await sleep(5000)
			const images = await page.evaluate(() => Array.from(document.images, e => e.src.replace('thumbnails', 'resized').replace('_360x285', '')));
			console.log(images[0])
			for (let i = 0; i < images.length; i++) {
				if(images[i].startsWith('https://media.familinkframe.com/')) {
					console.log(i, images[i])
					try {
						result = await download(images[i], `images/${images[i].split(/[\/]/).pop()?.replace(/.png|.jpg|.jpeg/gi,'')}.jpg`);
						if (result === true) {
							console.log('Success:', images[i], 'has been downloaded successfully.');
						} else {
							console.log('Error:', images[i], 'was not downloaded.');
							console.error(result);
						}
					} catch (e) {
						console.log(e)
					}
				}
			}
		}
    } finally {
        await browser.close()
    }
}

async function main() {

	await scrapImages()

}

main().catch(e => {
	console.error(e)
	process.exitCode = 1
})
