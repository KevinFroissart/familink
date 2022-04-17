import puppeteer from 'puppeteer'
import config from './config.json'
import fs from 'fs/promises'


async function sleep(ms: number): Promise<void> {
	await new Promise(ok => setTimeout(() => ok(null), ms))
}


async function main() {

    // Ouverture du navigateur
    const browser = await puppeteer.launch({ headless: config.headless })
    try {
        // On se dirige sur la page de login
        const page = await browser.newPage()
		await page.goto('https://web.familinkframe.com/fr/#/login')

        try {
            // On récupère le champ de login et on le remplit
            const loginField = await page.$<HTMLInputElement>('#email')
			if (!loginField) throw new Error('no need to log in')

			await loginField.evaluate(
				(x, login) => (x.value = login),
				config.login
			)

            // On récupère le champ du mot de passe et on le remplit
            const passwordField = await page.$<HTMLInputElement>('#password')
			await passwordField?.evaluate(
				(x, password) => (x.value = password),
				config.password
			)

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

    } finally {
        await browser.close()
    }

}

main().catch(e => {
	console.error(e)
	process.exitCode = 1
})
