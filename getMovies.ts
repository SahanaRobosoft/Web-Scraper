import axios from "axios";
import { load } from "cheerio";
import { number } from "fp-ts";
import { pipe } from "fp-ts/lib/function";
import { lens } from "lens.ts";
import { get, set } from "spectacles-ts";

const url =
  "https://www.imdb.com/search/title/?groups=top_250&sort=user_rating";
type Movie = {
  title: string;
  year: string;
  runtime: string;
  director: string;
  genre: string;
  stars: string[];
  rating: string;
  metaScrore: string;
};

export const getMovies = async () => {
  const { data } = await axios.get(`${url}`);
  const $ = load(data);
  const allMovies: Movie[] = [];
  const $post = $(".lister-item-content");

  $post.each((index, ele) => {
    const id = index + 1;
    const element = $(ele);
    const title = element.find(".lister-item-header a").text();
    const year = element
      .find(".lister-item-header span")
      .last()
      .text()
      .replace(/[()\ \s-]+/g, "");

    const director = element.find("p a").first().text();
    const getstar = element.children("p").eq(2).children("a");
    const stars = getstar
      .map((i) => {
        return $(getstar[i]).text();
      })
      .toArray();
    const genre = element
      .find(".text-muted .genre")
      .text()
      .trim()
      .replace("\n", "");
    const runtime = element.find(".text-muted .runtime").text();
    const rating = element.find(".ratings-bar div strong").text();
    const metaScrore = element
      .find(".ratings-bar .ratings-metascore span")
      .text()
      .trim();

    const movie = {
      id: id,
      title: title,
      year: year,
      runtime: runtime,
      director: director,
      genre: genre,
      stars: stars,
      rating: rating,
      metaScrore: metaScrore,
    };
    allMovies.push(movie);
  });
  console.log(allMovies);

  return allMovies;
};
const getDirectors = async () => {
  const respomse = await getMovies();
  pipe(respomse, get("[]>.director"), console.log);
};
getDirectors();

const getRating = async () => {
  const response = await getMovies();
  pipe(response, get("[]>.rating"), console.log);
};
getRating();

const setRatings = async () => {
  const response = await getMovies();
  console.log(pipe(response.slice(0, 5), set("[number].rating", 1, "7.7")));
};
setRatings();

const setRuntime = async () => {
  const response = await getMovies();
  console.log(
    pipe(response.slice(0, 5), set("[number].runtime", 2, "300 min"))
  );
};

setRuntime();
const getRuntime = async () => {
  const response = await getMovies();
  console.log(pipe(response, get("[]>.runtime")));
};
getRuntime();
