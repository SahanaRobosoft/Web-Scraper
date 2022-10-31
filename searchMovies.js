import cheerio from "cheerio";
import fetch from "node-fetch";
const url = "https://www.imdb.com/find?&s=tt&ttype=ft&ref_=fn_ft&q=";

const searchMovies = async (query) => {
  const response = await fetch(`${url}${query}`);
  const body = await response.text();
  const movies = [];
  const $ = cheerio.load(body);
  $(".findResult").each((i, ele) => {
    const $post = $(ele);
    const $title = $post.find("td.result_text a");
    const $image = $post.find("td a img");
    const ID = $title.attr("href").match(/title\/(.*)\//)[1];
    const movie = {
      id: ID,
      title: $title.text(),
      image: $image.attr("src"),
    };
    movies.push(movie);
  });
  console.log(movies);
  return movies;
};
export default searchMovies;

searchMovies("star wars");
