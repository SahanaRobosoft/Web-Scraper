import axios from "axios";
import { load } from "cheerio";

const url =
  "https://www.imdb.com/search/title/?groups=top_250&sort=user_rating";
type Movie = {
  title: string;
  year: string;
  director: string;
  stars: string;
  rating: string;
  metaScrore: string;
};

export const getMovies = async () => {
  const { data } = await axios.get(`${url}`);
  const $ = load(data);
  const allMovies: Movie[] = [];
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
    const stars = element.children("p").eq(2).children("a").text();

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
