const puppeteer = require('puppeteer');
let express = require("express");
let cors = require('cors');
let app = express();


app.use(express.json());
app.use(cors())

async function main(postUrl) {
  try {
    const browser = await puppeteer.launch();
    const [page] = await browser.pages();

    await page.goto(postUrl, { waitUntil: 'networkidle0' });
    let data = await page.evaluate(() => {
    	document.getElementsByTagName('body')[0].innerHTML;
    	return document.getElementById('react-root').innerHTML;
    });

    await browser.close();

    return data;
  } catch (err) {
    console.error(err);

    return "error"
  }
};

app.get("/", async (req,res) => {
  main(req.query.url).then(data => {
    res.status(200).json({"message" : data});
  })
})

app.listen(3000,() => {
  console.log("Listning....")
})