import fetch from "node-fetch";
import cheerio from "cheerio";

const url =
  "https://www.imdb.com/search/title/?groups=top_250&sort=user_rating";
const getMovies = async () => {
  const response = await fetch(`${url}`);
  const body = await response.text();
  const $ = cheerio.load(body);
  const allMovies = [];
  const $post = $(".lister-item-content");

  $post.each((i, ele) => {
    const element = $(ele);
    const title = element.find(".lister-item-header a").text();
    const year = element
      .find(".lister-item-header span")
      .last()
      .text()
      .replace(/[()\ \s-]+/g, "");

    const director = element.find("p a").first().text();
    const stars = element
      .find("p a")
      .filter(() => element.find("p a").first().text())
      .text();

    const rating = element.find(".ratings-bar div strong").text();
    const metaScrore = element
      .find(".ratings-bar")
      .children()
      .last()
      .find("span")
      .text()
      .trim();

    const movie = {
      title: title,
      year: year,
      director: director,
      stars: stars,
      rating: rating,
      metaScrore: metaScrore,
    };
    allMovies.push(movie);
  });
  console.log(allMovies);
  return allMovies;
};

export default getMovies;
