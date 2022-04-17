import puppeteer from 'puppeteer'
import config from './config.json'
import * as fs from 'fs'
import https from 'https'

async function sleep(ms: number): Promise<void> {
	await new Promise(ok => setTimeout(() => ok(null), ms))
}

const download = (url: string, destination: any) => new Promise((resolve, reject) => {
	const file = fs.createWriteStream(destination);

	https.get(url, response => {
		response.pipe(file);

		file.on('finish', () => {
			file.close()
			resolve(true)
		});
	}).on('error', error => {
		fs.unlink(destination, () => reject(error));
		reject(error.message);
	});
});

async function scrapImages() {
	// Ouverture du navigateur
    const browser = await puppeteer.launch({ headless: config.headless })
    try {
        // On se dirige sur la page de login
        const page = await browser.newPage()
		await page.goto('https://web.familinkframe.com/fr/#/login')
		await sleep(100)

        try {
            // On récupère le champ de login et de password et on les remplits
			await page.waitForSelector('#email');
			await page.type('#email', config.login, {delay: 25})
			await page.type('#password', config.password, {delay: 25})
			
            // On envoie le formulaire
            await page.evaluate(() =>
				document.querySelector<HTMLInputElement>('.connect-button')!.click()
			)

            // On attends la redirection
            while (true) {
				try {
					const url = await page.evaluate(() => location.href)
					if (url.match('https://web.familinkframe.com/fr/#/devices')) break
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
			await page.goto('https://web.familinkframe.com/fr/#/devices/16961/photos')
			await sleep(5000)
			const images = await page.evaluate(() => Array.from(document.images, e => e.src.replace('thumbnails', 'resized').replace('_360x285', '')));
			console.log(images[0])
			for (let i = 0; i < images.length; i++) {
				if(images[i].startsWith('https://media.familinkframe.com/')) {
					console.log(i, images[i])
					result = await download(images[i], `images/${images[i].split(/[\/]/).pop()?.replace(/.png|.jpg|.jpeg/gi,'')}.jpg`);
					if (result === true) {
						console.log('Success:', images[i], 'has been downloaded successfully.');
					} else {
						console.log('Error:', images[i], 'was not downloaded.');
						console.error(result);
					}
				}
			}
		}
    } finally {
        await browser.close()
    }
}

async function main() {

	scrapImages()

}

main().catch(e => {
	console.error(e)
	process.exitCode = 1
})
