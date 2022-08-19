const puppeteer = require('puppeteer');
let express = require("express");
let cors = require('cors');
let app = express();


app.use(express.json());
app.use(cors())

async function main(postUrl) {
  try {
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const [page] = await browser.pages();

    await page.goto(postUrl, { waitUntil: 'networkidle0' });
    let data = await page.evaluate(() => {
      let response = [];
      let allComments = document.querySelectorAll('._a9ym ._aacl._aaco');
      for (let i = 0; i < allComments.length ; ++i) {
        response.push({"text" : allComments[i].innerHTML});
      }
      return response
    })

    let response = data;

    // let response = {
    //   "status" : "ok",
    //   "data" : {
    //     "comments" : []
    //   }
    // };


    // for (let i = 0; i < data.length; ++i) {
    //   let obj = {};
    //   obj['id'] = data[i].node.owner.id;
    //   obj['commentId'] = data[i].node.id;
    //   obj['text'] = data[i].node.text;
    //   obj['profilePicUrl'] = data[i].node.owner.profile_pic_url;
    //   obj['username'] = data[i].node.owner.username;
    //   response.data.comments.push(obj);
    // }

    await browser.close();

    return response;
  } catch (err) {
    console.error(err);

    return {
      status : "error",
      data : {
        comments : []
      }
    }
  }
};

app.get("/", async (req,res) => {
  main(req.query.url).then(data => {
    res.status(200).json(data);
  })
})

app.listen(process.env.PORT || 3000,() => {
  console.log("Running.....")
})