let Parser = require('rss-parser');
let parser = new Parser();

var RSS = require('rss');

exports.handler = async (event) => {

    
    const sub = event.queryStringParameters.sub;
    let feed = await parser.parseURL(`https://www.reddit.com/r/${sub}.rss`);
    var newFeed = new RSS(feed);

    let i = []
    let re = /https?:\/\/(?!(www.reddit))[^\"]*/g;
    feed.items.forEach(item => {
        let url = item.content.match(re);
        if (url == null) return;
        item.url = url[0];
        newFeed.item(item);
    });

    const response = {
        statusCode: 200,
        headers: {
            "Content-Type": "text/xml"
        },
        body: newFeed.xml(),
    };
    return response;
};
