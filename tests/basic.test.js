const timeout = 15000

// série de tests sur la page d'accueil
describe("Tests basiques", () => {
    let page

    // vérification du chargement de la page d'accueil
    test('home', async () => {
        // charger la page d'accueil
        await page.goto('http://polr.campus-grenoble.fr')
        // attendre que l'élément <body> soit chargé
        await page.waitForSelector('body')
        // récupérer le contenu de l'élément <body>
        const html = await page.$eval('body', e => e.innerHTML)
        // vérifier que dans cet élément Body on trouve "Polr du campus"
        expect(html).toContain("Polr du campus")
    }, timeout)

    // parcours client avec about
    test('home and about', async () => {
        await page.goto('http://polr.campus-grenoble.fr')
        await page.waitForSelector('#navbar li a')
        // click sur le lien "About" de la navigation
        await page.evaluate( () => {
            Array
                .from( document.querySelectorAll( '#navbar li a' ) )
                .filter( el => el.textContent === 'About' )[0].click();
        });
        // on attent que l'élément ".about-contents" soit chargé
        await page.waitForSelector('.about-contents')
        // on récupère le code HTML
        const html = await page.$eval('.about-contents', e => e.innerHTML)
        // on vérifie qu'il contient la bonne chaîne de caractères
        expect(html).toContain("powered by Polr 2")
    }, timeout)


        // parcours client avec shorter url
        test('home et shorter', async () => {
        let url = "https://www.lemonde.fr/culture/article/2018/10/26/direction-de-l-opera-de-paris-le-fait-du-prince_5374720_3246.html"
        await page.goto('http://polr.campus-grenoble.fr')
        await page.waitForSelector('input[id="shorten"]')
        // text saisie dans un element selectionné.
        await page.type('input[type="url"]', url)
        // exerce une action sur un element ici un click sur le bouton shorten
        await page.$eval( '#shorten', el => el.click() );
        // je m'attend a avoir un selector ici le champ de recherche
        await page.waitForSelector('#short_url')
        await page.waitForSelector('body')
        // Vérifier si dans le contenu du body on trouve "Shortened URL"
        const html = await page.$eval('body', e =>e.innerHTML)
        expect(html).toContain("Shortened URL")
        // recuperer la valeur de short url et l'afficher
        const val = await page.$eval('#short_url', el => el.value)
        await page.goto(val)
        await page.screenshot({path: './tests/img/baseurl.png'});
        // Vérifier si dans le contenu du body (vue renvoyée par l'url) si elle contient "carl"
        const linkHtml = await page.$eval('body', e =>e.innerHTML)
        expect(linkHtml).toContain("Paris")

     }, timeout)

      // parcours client avec link option
      test('link option', async () => {
        let UrlOption = "https://www.lemonde.fr/culture/article/2018/10/25/dorothea-lange-au-dela-des-icones_5374204_3246.html"
        let shortLink ="adhju89"
        await page.goto('http://polr.campus-grenoble.fr')
        await page.waitForSelector('#show-link-options')
        // text saisie dans un element selectionné.
        await page.type('input[type="url"]',UrlOption)
        // exerce une action sur un element ici un click sur le bouton link options
        await page.$eval( '#show-link-options', el => el.click() );
        // je m'attend a avoir un selector (le champ de recherche)
        await page.waitForSelector('#check-link-availability')
        // div option
        await page.waitForSelector('#options')
        // Vérifier si dans le contenu de la div on trouve "polr.campus-grenoble.fr/"
        const html = await page.$eval('#options', e =>e.innerHTML)
        expect(html).toContain("polr.campus-grenoble.fr/")
        await page.type('input[name="custom-ending"]', shortLink)
        await page.$eval( '#check-link-availability', el => el.click() );
        await page.waitFor(1000)
        const Optionlink = await page.$eval('body', e =>e.innerHTML)
        expect(Optionlink).toContain("Available")
        // bouton shorten, au clic on bascule sur la page polr du campus
        await page.waitForSelector('#shorten')
        await page.$eval( '#shorten', el => el.click() );
        const resultlink = await page.$eval('body', e =>e.innerHTML)
        expect(resultlink).toContain("Shortened URL")
        await page.screenshot({path: './tests/img/baseurl1.png'});
       

     }, timeout)

    // cette fonction est lancée avant chaque test de cette
    // série de tests
    beforeAll(async () => {
        // ouvrir un onglet dans le navigateur
        page = await global.__BROWSER__.newPage()
    }, timeout)

    
})
