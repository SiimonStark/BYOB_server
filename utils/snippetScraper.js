const Nightmare = require('nightmare');
const nightmare = Nightmare({ show: true });
const jquery = require('jquery');
const fs = require('fs');

nightmare
.goto('https://css-tricks.com/snippets/javascript/')
.evaluate(() => {
  let titles = [];
  let dates = [];
  let writers = [];
  let categories = [];
  let snippets;

  $('.snippet-title').each(function() {
    let item = {};
    item["link"] = $(this).attr('href');
    item["title"] = $(this).text()
      .replace(/\n/, '')
      .trim();
    titles.push(item);
  })
  
  $('time').each(function() {
    let item = {};
    item["stamp"] = $(this).text()
      .replace(/\n/, '')
      .trim();
    dates.push(item);
  })

  $('.snippet-category > a').each(function() {
    let item = {};
    item["name"] = $(this).text()
      .replace(/\n/, '')
      .trim();
    categories.push(item);
  })
    
  $('.snippet-author-link').each(function() {
    let item = {};
    item["name"] = $(this).text()
      .replace(/\n/, '')
      .trim();
    writers.push(item);
  })

  snippets = titles.reduce((acc, article, ind) => {
    let obj = {};
    obj['title'] = article.title;
    obj['link'] = article.link;
    obj['updated'] = dates[ind].stamp;
    let author = writers[ind].name.split(' ');
    obj['author'] = {first_name: author[0], last_name: author[1]};
    obj['topic'] = categories[ind].name;

    acc.push(obj);
    return acc;
  }, [])
  
  return snippets;
  })
.end()
.then((anchors) => {
  fs.writeFileSync('./utils/snippetData.json', JSON.stringify(anchors));
  console.log('Done: ', anchors)
})
.catch(error => {
  console.error(`Search failed: ${error}`)
});